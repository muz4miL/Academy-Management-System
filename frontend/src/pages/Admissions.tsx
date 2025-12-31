import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeaderBanner } from "@/components/dashboard/HeaderBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  AlertCircle,
  Save,
  UserPlus,
  Sparkles,
  Eye,
  CheckCircle2,
  Loader2,
  DollarSign,
  Pencil,
  Lock,
  Calculator,
  Package
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentApi, classApi, sessionApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

// Type for subject with fee
interface SubjectWithFee {
  name: string;
  fee: number;
}

const Admissions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch Active Classes and Sessions
  const { data: classesData } = useQuery({
    queryKey: ["classes", { status: "active" }],
    queryFn: () => classApi.getAll({ status: "active" }),
  });

  const { data: sessionsData } = useQuery({
    queryKey: ["sessions"],
    queryFn: () => sessionApi.getAll(), // Fetch ALL sessions (active, upcoming, completed)
  });

  const classes = classesData?.data || [];
  const sessions = sessionsData?.data || [];

  // Form state
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [group, setGroup] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [parentCell, setParentCell] = useState("");
  const [studentCell, setStudentCell] = useState("");
  const [address, setAddress] = useState("");
  const [admissionDate, setAdmissionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [totalFee, setTotalFee] = useState("");
  const [paidAmount, setPaidAmount] = useState("");

  // TASK 4: Custom Fee Toggle (Lump Sum mode)
  const [isCustomFeeMode, setIsCustomFeeMode] = useState(false);

  // Modal states
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [savedStudent, setSavedStudent] = useState<any>(null);

  // Quick Add form state
  const [quickName, setQuickName] = useState("");
  const [quickClassId, setQuickClassId] = useState("");
  const [quickSessionId, setQuickSessionId] = useState("");
  const [quickParentCell, setQuickParentCell] = useState("");
  const [quickTotalFee, setQuickTotalFee] = useState("");
  const [quickPaidAmount, setQuickPaidAmount] = useState("");

  // TASK 1: Auto-select active or upcoming session for Quick Add
  useEffect(() => {
    if (sessions.length > 0 && !quickSessionId) {
      // Prefer active, then upcoming, then any session
      const activeSession = sessions.find((s: any) => s.status === 'active');
      const upcomingSession = sessions.find((s: any) => s.status === 'upcoming');
      const defaultSession = activeSession || upcomingSession || sessions[0];

      if (defaultSession) {
        setQuickSessionId(defaultSession._id);
      }
    }
  }, [sessions]);

  // TASK 2: Dynamic fee sync for Quick Add when class changes
  useEffect(() => {
    if (quickClassId) {
      const selectedClass = getQuickSelectedClass();
      if (selectedClass) {
        // Calculate total from subjects or use baseFee
        const subjectTotal = (selectedClass.subjects || []).reduce((sum: number, s: any) => {
          if (typeof s === 'object' && s.fee) return sum + s.fee;
          return sum;
        }, 0);
        setQuickTotalFee(String(subjectTotal || selectedClass.baseFee || 0));
      }
    }
  }, [quickClassId, classes]);

  // Get selected class
  const getSelectedClass = () => classes.find((c: any) => c._id === selectedClassId);
  const getQuickSelectedClass = () => classes.find((c: any) => c._id === quickClassId);

  // TASK 3: Get subjects with fees from selected class
  const getClassSubjectsWithFees = (): SubjectWithFee[] => {
    const selectedClass = getSelectedClass();
    if (!selectedClass || !selectedClass.subjects) return [];

    return selectedClass.subjects.map((s: any) => {
      if (typeof s === 'string') {
        return { name: s, fee: selectedClass.baseFee || 0 };
      }
      return { name: s.name, fee: s.fee || 0 };
    });
  };

  const classSubjects = getClassSubjectsWithFees();

  // Calculate total fee based on selected subjects
  const calculateSubjectBasedFee = () => {
    return classSubjects
      .filter(s => selectedSubjects.includes(s.name))
      .reduce((sum, s) => sum + (s.fee || 0), 0);
  };

  // Auto-update fee when subjects change (unless in custom mode)
  useEffect(() => {
    if (!isCustomFeeMode && selectedClassId && selectedSubjects.length > 0) {
      const calculatedFee = calculateSubjectBasedFee();
      setTotalFee(String(calculatedFee));
    }
  }, [selectedSubjects, selectedClassId, isCustomFeeMode]);

  // Reset subjects when class changes
  useEffect(() => {
    if (selectedClassId) {
      setSelectedSubjects([]);
      setIsCustomFeeMode(false);
      // Auto-select all subjects if no individual selection
      const selectedClass = getSelectedClass();
      if (selectedClass?.subjects?.length > 0) {
        const subjectNames = selectedClass.subjects.map((s: any) =>
          typeof s === 'string' ? s : s.name
        );
        setSelectedSubjects(subjectNames);
      }
    }
  }, [selectedClassId]);

  // Subject toggle handler
  const handleSubjectToggle = (subjectName: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectName)
        ? prev.filter((id) => id !== subjectName)
        : [...prev, subjectName]
    );
  };

  // Get fee for a subject
  const getSubjectFee = (subjectName: string): number => {
    const subject = classSubjects.find(s => s.name === subjectName);
    return subject?.fee || 0;
  };

  // Subtle confetti celebration
  const triggerConfetti = () => {
    const count = 100;
    const defaults = {
      origin: { y: 0.5 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        colors: ['#0ea5e9', '#38bdf8', '#cbd5e1', '#e2e8f0'],
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  // React Query Mutation
  const createStudentMutation = useMutation({
    mutationFn: studentApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      setSavedStudent(data.data);
      triggerConfetti();
      setSuccessModalOpen(true);
    },
    onError: (error: any) => {
      toast.error("Admission Failed", {
        description: error.message || "Failed to save student admission",
        duration: 4000,
      });
    },
  });

  const handleSaveAdmission = () => {
    const selectedClass = getSelectedClass();

    // Validation
    if (!studentName || !fatherName || !selectedClassId || !group || !parentCell) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields",
        duration: 3000,
      });
      return;
    }

    if (!totalFee || parseFloat(totalFee) <= 0) {
      toast.error("Invalid Fee", {
        description: "Please enter a valid total fee amount",
        duration: 3000,
      });
      return;
    }

    // Prepare student data
    const studentData = {
      studentName,
      fatherName,
      class: selectedClass?.className || "",
      group,
      subjects: selectedSubjects,
      parentCell,
      studentCell: studentCell || undefined,
      address: address || undefined,
      admissionDate: new Date(admissionDate),
      totalFee: Number(totalFee),
      paidAmount: Number(paidAmount) || 0,
      classRef: selectedClassId,
      sessionRef: selectedSessionId || undefined,
    };

    console.log('📤 Sending Student Data to Backend:', studentData);
    createStudentMutation.mutate(studentData);
  };

  // Quick Add submission
  const handleQuickAdd = () => {
    if (!quickName || !quickClassId || !quickParentCell) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields for quick add",
        duration: 3000,
      });
      return;
    }

    const selectedClass = getQuickSelectedClass();

    const quickData = {
      studentName: quickName,
      fatherName: "To be updated",
      class: selectedClass?.className || "TBD",
      group: "Pre-Medical",
      subjects: [],
      parentCell: quickParentCell,
      studentCell: undefined,
      address: undefined,
      admissionDate: new Date(),
      totalFee: Number(quickTotalFee) || 0,
      paidAmount: Number(quickPaidAmount) || 0,
      classRef: quickClassId,
      sessionRef: quickSessionId || undefined,
    };

    createStudentMutation.mutate(quickData);
    setQuickAddOpen(false);

    // Reset quick form
    setQuickName("");
    setQuickClassId("");
    setQuickSessionId("");
    setQuickParentCell("");
    setQuickTotalFee("");
    setQuickPaidAmount("");
  };

  const handleCancel = () => {
    setStudentName("");
    setFatherName("");
    setSelectedClassId("");
    setSelectedSessionId("");
    setGroup("");
    setSelectedSubjects([]);
    setParentCell("");
    setStudentCell("");
    setAddress("");
    setAdmissionDate(new Date().toISOString().split("T")[0]);
    setTotalFee("");
    setPaidAmount("");
    setIsCustomFeeMode(false);
  };

  // Get balance
  const balance = totalFee && paidAmount
    ? (parseFloat(totalFee) - parseFloat(paidAmount)).toString()
    : totalFee || "0";

  // Calculated fee display
  const calculatedFee = calculateSubjectBasedFee();

  return (
    <DashboardLayout title="Admissions">
      <HeaderBanner
        title="New Admission"
        subtitle="Register a new student to the academy"
      >
        <Button
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          onClick={() => setQuickAddOpen(true)}
          style={{ borderRadius: "0.75rem" }}
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Quick Add
        </Button>
      </HeaderBanner>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Student Information */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-6 card-shadow">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Student Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  placeholder="Enter father's name"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                />
              </div>

              {/* Session Dropdown - Show All Sessions */}
              <div className="space-y-2">
                <Label htmlFor="session">Academic Session</Label>
                <Select value={selectedSessionId} onValueChange={setSelectedSessionId}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {sessions.length === 0 ? (
                      <SelectItem value="none" disabled>No sessions available</SelectItem>
                    ) : (
                      sessions.map((session: any) => (
                        <SelectItem key={session._id} value={session._id}>
                          {session.sessionName}
                          {session.status === 'active' && (
                            <span className="ml-2 text-green-600 text-xs">(Active)</span>
                          )}
                          {session.status === 'upcoming' && (
                            <span className="ml-2 text-sky-600 text-xs">(Upcoming)</span>
                          )}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Group *</Label>
                <Select
                  value={group}
                  onValueChange={(value) => {
                    setGroup(value);
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Pre-Medical">Pre-Medical</SelectItem>
                    <SelectItem value="Pre-Engineering">Pre-Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Class Dropdown */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={selectedClassId}
                  onValueChange={setSelectedClassId}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {classes.length === 0 ? (
                      <SelectItem value="none" disabled>No active classes</SelectItem>
                    ) : (
                      classes.map((cls: any) => (
                        <SelectItem key={cls._id} value={cls._id}>
                          {cls.className} - {cls.section}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* TASK 3: Subjects with Individual Fees from Database */}
              {selectedClassId && classSubjects.length > 0 && (
                <div className="sm:col-span-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Select Subjects</Label>
                    {selectedSubjects.length > 0 && !isCustomFeeMode && (
                      <span className="text-sm font-semibold text-green-600 flex items-center gap-1">
                        <Calculator className="h-3.5 w-3.5" />
                        Total: {calculatedFee.toLocaleString()} PKR
                      </span>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {classSubjects.map((subject) => {
                      const isSelected = selectedSubjects.includes(subject.name);

                      return (
                        <div
                          key={subject.name}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                            ? "border-sky-500 bg-sky-50"
                            : "border-border hover:border-sky-300"
                            }`}
                          onClick={() => handleSubjectToggle(subject.name)}
                        >
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => handleSubjectToggle(subject.name)}
                            />
                            <span className={`font-medium ${isSelected ? 'text-sky-700' : 'text-foreground'}`}>
                              {subject.name}
                            </span>
                          </div>
                          <span className={`text-sm font-semibold ${isSelected ? 'text-green-600' : 'text-muted-foreground'
                            }`}>
                            {subject.fee.toLocaleString()} PKR
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Fee is calculated based on selected subjects. Select all subjects the student will study.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="parentCell">Parent Cell No. *</Label>
                <Input
                  id="parentCell"
                  placeholder="03XX-XXXXXXX"
                  value={parentCell}
                  onChange={(e) => setParentCell(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCell">Student Cell No.</Label>
                <Input
                  id="studentCell"
                  placeholder="03XX-XXXXXXX"
                  value={studentCell}
                  onChange={(e) => setStudentCell(e.target.value)}
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address"
                  className="resize-none"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Office Use Section */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 card-shadow">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Office Use Only
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={admissionDate}
                  onChange={(e) => setAdmissionDate(e.target.value)}
                />
              </div>

              {/* TASK 3 & 4: Custom Fee Toggle with Amber Warning */}
              <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-secondary/50">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Custom Fee (Lump Sum)</p>
                    <p className="text-xs text-muted-foreground">Override calculated fee</p>
                  </div>
                </div>
                <Switch
                  checked={isCustomFeeMode}
                  onCheckedChange={setIsCustomFeeMode}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="totalFee">Total Fee (PKR) *</Label>
                  {isCustomFeeMode ? (
                    <span className="text-xs text-amber-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="h-3 w-3" />
                      Manual Override Active
                    </span>
                  ) : selectedSubjects.length > 0 ? (
                    <span className="text-xs text-sky-600 flex items-center gap-1">
                      <Calculator className="h-3 w-3" />
                      Auto-calculated
                    </span>
                  ) : null}
                </div>
                <div className="relative">
                  <Input
                    id="totalFee"
                    type="number"
                    placeholder="0"
                    value={totalFee}
                    onChange={(e) => setTotalFee(e.target.value)}
                    readOnly={!isCustomFeeMode && selectedSubjects.length > 0}
                    className={`${isCustomFeeMode
                      ? 'border-amber-400 bg-amber-50 ring-2 ring-amber-200'
                      : !isCustomFeeMode && selectedSubjects.length > 0
                        ? 'border-sky-300 bg-sky-50 cursor-not-allowed'
                        : ''
                      }`}
                  />
                  {!isCustomFeeMode && selectedSubjects.length > 0 && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Lock className="h-4 w-4 text-sky-500" />
                    </div>
                  )}
                  {isCustomFeeMode && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <Pencil className="h-4 w-4 text-amber-500" />
                    </div>
                  )}
                </div>
                {/* Fee Breakdown */}
                {selectedSubjects.length > 0 && (
                  <div className="mt-2 p-2 rounded bg-slate-50 border border-slate-100">
                    <p className="text-xs font-medium text-muted-foreground mb-1">Fee Breakdown:</p>
                    <div className="space-y-0.5">
                      {classSubjects
                        .filter(s => selectedSubjects.includes(s.name))
                        .map(s => (
                          <div key={s.name} className="flex justify-between text-xs">
                            <span className="text-slate-600">{s.name}</span>
                            <span className="font-medium text-slate-700">{s.fee.toLocaleString()} PKR</span>
                          </div>
                        ))
                      }
                      <div className="flex justify-between text-xs font-bold pt-1 border-t border-slate-200 mt-1">
                        <span className="text-foreground">Total</span>
                        <span className="text-green-600">{calculatedFee.toLocaleString()} PKR</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="paidAmount">Fee Received (PKR)</Label>
                <Input
                  id="paidAmount"
                  type="number"
                  placeholder="0"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Balance (PKR)</Label>
                <Input
                  id="balance"
                  type="number"
                  placeholder="0"
                  value={balance}
                  disabled
                  className="bg-secondary"
                />
              </div>
            </div>
          </div>

          {/* Note */}
          <div className="rounded-xl border border-warning bg-warning-light p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-warning" />
              <div>
                <p className="font-medium text-warning">Important Note</p>
                <p className="mt-1 text-sm text-warning/80">
                  Fee is not refundable in any case.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleCancel}
              disabled={createStudentMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={handleSaveAdmission}
              disabled={createStudentMutation.isPending}
              style={{ borderRadius: "0.75rem" }}
            >
              {createStudentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Admission
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Add Modal */}
      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100">
              <UserPlus className="h-6 w-6 text-sky-600" />
            </div>
            <DialogTitle className="text-center text-lg font-semibold">
              Speed Enrollment
            </DialogTitle>
            <DialogDescription className="text-center text-sm">
              Quick add with minimal info
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-3">
            <div className="space-y-1.5">
              <Label htmlFor="quick-name" className="text-sm">Student Name *</Label>
              <Input
                id="quick-name"
                placeholder="Enter full name"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="h-9"
              />
            </div>

            {/* TASK 1: Session with auto-select (active or upcoming) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Session</Label>
                {sessions.find((s: any) => s._id === quickSessionId) && (() => {
                  const selected = sessions.find((s: any) => s._id === quickSessionId);
                  if (selected?.status === 'active') {
                    return (
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                      </span>
                    );
                  } else if (selected?.status === 'upcoming') {
                    return (
                      <span className="text-xs text-sky-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Upcoming
                      </span>
                    );
                  }
                  return null;
                })()}
              </div>
              <Select value={quickSessionId} onValueChange={setQuickSessionId}>
                <SelectTrigger className="h-9 bg-background">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.length === 0 ? (
                    <SelectItem value="none" disabled>No sessions available</SelectItem>
                  ) : (
                    sessions.map((session: any) => (
                      <SelectItem key={session._id} value={session._id}>
                        {session.sessionName}
                        {session.status === 'active' && (
                          <span className="ml-2 text-green-600 text-xs">(Current)</span>
                        )}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* TASK 2: Class with fee sync */}
            <div className="space-y-1.5">
              <Label htmlFor="quick-class" className="text-sm">Class *</Label>
              <Select value={quickClassId} onValueChange={setQuickClassId}>
                <SelectTrigger className="h-9 bg-background">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls: any) => (
                    <SelectItem key={cls._id} value={cls._id}>
                      {cls.className} - {cls.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="quick-parent" className="text-sm">Parent Cell *</Label>
              <Input
                id="quick-parent"
                placeholder="03XX-XXXXXXX"
                value={quickParentCell}
                onChange={(e) => setQuickParentCell(e.target.value)}
                className="h-9"
              />
            </div>

            {/* Fee fields with sync indicator */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Total Fee</Label>
                  {quickClassId && (
                    <span className="text-xs text-sky-600">
                      Auto-filled
                    </span>
                  )}
                </div>
                <Input
                  type="number"
                  placeholder="0"
                  value={quickTotalFee}
                  onChange={(e) => setQuickTotalFee(e.target.value)}
                  className="h-9 bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Paid Amount</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={quickPaidAmount}
                  onChange={(e) => setQuickPaidAmount(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setQuickAddOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuickAdd}
              disabled={createStudentMutation.isPending}
              className="flex-1 bg-sky-600 hover:bg-sky-700"
              style={{ borderRadius: "0.75rem" }}
            >
              {createStudentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Enroll Student"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              Admission Successful!
            </DialogTitle>
            <DialogDescription className="text-center">
              {savedStudent?.studentName} has been enrolled successfully.
            </DialogDescription>
          </DialogHeader>

          {savedStudent && (
            <div className="my-4 rounded-lg bg-secondary p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Student ID</p>
                  <p className="font-mono font-semibold text-sky-600">{savedStudent.studentId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Class</p>
                  <p className="font-semibold">{savedStudent.class}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Fee</p>
                  <p className="font-semibold">{savedStudent.totalFee?.toLocaleString()} PKR</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fee Status</p>
                  <p className={`font-semibold capitalize ${savedStudent.feeStatus === 'paid' ? 'text-green-600' :
                    savedStudent.feeStatus === 'partial' ? 'text-yellow-600' : 'text-amber-600'
                    }`}>
                    {savedStudent.feeStatus}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setSuccessModalOpen(false);
                navigate("/students");
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Students
            </Button>
            <Button
              onClick={() => {
                setSuccessModalOpen(false);
                handleCancel();
              }}
              className="bg-sky-600 hover:bg-sky-700"
              style={{ borderRadius: "0.75rem" }}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              New Admission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Admissions;
