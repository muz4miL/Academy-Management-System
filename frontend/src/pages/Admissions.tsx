import { useState } from "react";
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
import {
  AlertCircle,
  Save,
  UserPlus,
  Sparkles,
  Eye,
  Printer,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

const premedSubjects = [
  { id: "Biology", label: "Biology" },
  { id: "Chemistry", label: "Chemistry" },
  { id: "Physics", label: "Physics" },
  { id: "English", label: "English" },
];

const preengSubjects = [
  { id: "Mathematics", label: "Mathematics" },
  { id: "Chemistry", label: "Chemistry" },
  { id: "Physics", label: "Physics" },
  { id: "English", label: "English" },
];

const Admissions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Form state
  const [studentName, setStudentName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [classValue, setClassValue] = useState("");
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

  // Modal states
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [savedStudent, setSavedStudent] = useState<any>(null);

  // Quick Add form state
  const [quickName, setQuickName] = useState("");
  const [quickClass, setQuickClass] = useState("");
  const [quickParentCell, setQuickParentCell] = useState("");
  const [quickTotalFee, setQuickTotalFee] = useState("");
  const [quickPaidAmount, setQuickPaidAmount] = useState("");

  const availableSubjects =
    group === "Pre-Medical"
      ? premedSubjects
      : group === "Pre-Engineering"
        ? preengSubjects
        : [];

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  // Subtle confetti celebration - only sky blue and silver
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
        colors: ['#0ea5e9', '#38bdf8', '#cbd5e1', '#e2e8f0'], // Sky blue + silver
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  // React Query Mutation
  const createStudentMutation = useMutation({
    mutationFn: studentApi.create,
    onSuccess: (data) => {
      // Invalidate students query to refetch
      queryClient.invalidateQueries({ queryKey: ["students"] });

      // Save student data for modal
      setSavedStudent(data.data);

      // Trigger subtle confetti
      triggerConfetti();

      // Show success modal instead of toast
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
    // Validation
    if (!studentName || !fatherName || !classValue || !group || !parentCell) {
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

    // Prepare student data with explicit type casting
    const studentData = {
      studentName,
      fatherName,
      class: classValue,
      group,
      subjects: selectedSubjects, // Already an array
      parentCell,
      studentCell: studentCell || undefined, // Optional field
      address: address || undefined, // Optional field
      admissionDate: new Date(admissionDate),
      totalFee: Number(totalFee), // Explicit Number casting
      paidAmount: Number(paidAmount) || 0, // Default to 0
    };

    console.log('📤 Sending Student Data to Backend:', studentData);

    // Submit data
    createStudentMutation.mutate(studentData);
  };

  // Quick Add submission
  const handleQuickAdd = () => {
    if (!quickName || !quickClass || !quickParentCell) {
      toast.error("Missing Information", {
        description: "Please fill in all required fields for quick add",
        duration: 3000,
      });
      return;
    }

    const quickData = {
      studentName: quickName,
      fatherName: "To be updated",
      class: quickClass,
      group: "Pre-Medical", // Default
      subjects: [],
      parentCell: quickParentCell,
      studentCell: undefined,
      address: undefined,
      admissionDate: new Date(),
      totalFee: Number(quickTotalFee) || 0,
      paidAmount: Number(quickPaidAmount) || 0,
    };

    createStudentMutation.mutate(quickData);
    setQuickAddOpen(false);

    // Reset quick form
    setQuickName("");
    setQuickClass("");
    setQuickParentCell("");
    setQuickTotalFee("");
    setQuickPaidAmount("");
  };

  const handleCancel = () => {
    // Reset form
    setStudentName("");
    setFatherName("");
    setClassValue("");
    setGroup("");
    setSelectedSubjects([]);
    setParentCell("");
    setStudentCell("");
    setAddress("");
    setAdmissionDate(new Date().toISOString().split("T")[0]);
    setTotalFee("");
    setPaidAmount("");
  };

  return (
    <DashboardLayout title="Admissions">
      <HeaderBanner
        title="New Admission"
        subtitle="Register a new student to the academy"
      >
        <Button
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          onClick={() => setQuickAddOpen(true)}
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

              <div className="space-y-2">
                <Label htmlFor="group">Group *</Label>
                <Select
                  value={group}
                  onValueChange={(value) => {
                    setGroup(value);
                    setSelectedSubjects([]);
                  }}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="Pre-Medical">Pre-Medical</SelectItem>
                    <SelectItem value="Pre-Engineering">
                      Pre-Engineering
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class *</Label>
                <Select value={classValue} onValueChange={setClassValue}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="9th">9th Grade</SelectItem>
                    <SelectItem value="10th">10th Grade</SelectItem>
                    <SelectItem value="11th">11th Grade</SelectItem>
                    <SelectItem value="12th">12th Grade</SelectItem>
                    <SelectItem value="MDCAT">MDCAT Prep</SelectItem>
                    <SelectItem value="ECAT">ECAT/ETEA Prep</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Subjects */}
              {group && (
                <div className="sm:col-span-2 space-y-3">
                  <Label>Subjects</Label>
                  <div className="flex flex-wrap gap-4 rounded-lg border border-border bg-secondary p-4">
                    {availableSubjects.map((subject) => (
                      <div key={subject.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={subject.id}
                          checked={selectedSubjects.includes(subject.id)}
                          onCheckedChange={() => handleSubjectToggle(subject.id)}
                        />
                        <label
                          htmlFor={subject.id}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                        >
                          {subject.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {group === "Pre-Medical" && (
                    <p className="text-xs text-muted-foreground">
                      Pre-Medical group includes Biology instead of Mathematics
                    </p>
                  )}
                  {group === "Pre-Engineering" && (
                    <p className="text-xs text-muted-foreground">
                      Pre-Engineering group includes Mathematics instead of Biology
                    </p>
                  )}
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

              <div className="space-y-2">
                <Label htmlFor="totalFee">Total Fee (PKR) *</Label>
                <Input
                  id="totalFee"
                  type="number"
                  placeholder="0"
                  value={totalFee}
                  onChange={(e) => setTotalFee(e.target.value)}
                />
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
                  value={
                    totalFee && paidAmount
                      ? (parseFloat(totalFee) - parseFloat(paidAmount)).toString()
                      : "0"
                  }
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

      {/* Quick Add Modal - Surgical Strike UI */}
      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            {/* Compact Icon in Sky Blue Circle */}
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
            <div className="space-y-1.5">
              <Label htmlFor="quick-class" className="text-sm">Class *</Label>
              <Select value={quickClass} onValueChange={setQuickClass}>
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9th">9th Grade</SelectItem>
                  <SelectItem value="10th">10th Grade</SelectItem>
                  <SelectItem value="11th">11th Grade</SelectItem>
                  <SelectItem value="12th">12th Grade</SelectItem>
                  <SelectItem value="MDCAT">MDCAT Prep</SelectItem>
                  <SelectItem value="ECAT">ECAT Prep</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="quick-parent-cell" className="text-sm">Parent Cell No. *</Label>
              <Input
                id="quick-parent-cell"
                placeholder="03XX-XXXXXXX"
                value={quickParentCell}
                onChange={(e) => setQuickParentCell(e.target.value)}
                className="h-9"
              />
            </div>
            {/* Financial Fields - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label htmlFor="quick-total-fee" className="text-sm">Monthly Fee</Label>
                <Input
                  id="quick-total-fee"
                  type="number"
                  placeholder="0"
                  value={quickTotalFee}
                  onChange={(e) => setQuickTotalFee(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="quick-paid-amount" className="text-sm">Advance Payment</Label>
                <Input
                  id="quick-paid-amount"
                  type="number"
                  placeholder="0"
                  value={quickPaidAmount}
                  onChange={(e) => setQuickPaidAmount(e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setQuickAddOpen(false)}
              disabled={createStudentMutation.isPending}
              className="h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleQuickAdd}
              disabled={createStudentMutation.isPending}
              className="h-9"
            >
              {createStudentMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Quick Add
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal - Digital Receipt Style */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-[340px] p-0 gap-0">
          {/* Compact Header with Check Icon */}
          <div className="bg-gradient-to-br from-sky-50 to-white px-6 pt-6 pb-4 text-center border-b border-sky-100">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md ring-4 ring-sky-50">
              <CheckCircle2 className="h-7 w-7 text-sky-600" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Admission Successful</h3>
            <p className="mt-1 text-xs text-muted-foreground">Student enrolled successfully</p>
          </div>

          {/* Student ID Badge - Blue Pill */}
          <div className="px-6 py-4 bg-white">
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-sky-600 text-white font-mono text-base font-bold tracking-wide shadow-md">
                {savedStudent?.studentId}
              </span>
            </div>
          </div>

          {/* Compact Details */}
          <div className="px-6 pb-4 space-y-2 bg-white">
            <div className="flex justify-between items-center text-sm py-1.5">
              <span className="text-muted-foreground">Student</span>
              <span className="font-semibold">{savedStudent?.studentName}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-1.5">
              <span className="text-muted-foreground">Father</span>
              <span className={savedStudent?.fatherName === "To be updated" ? "italic text-slate-400 text-xs" : "font-semibold"}>
                {savedStudent?.fatherName}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm py-1.5">
              <span className="text-muted-foreground">Class</span>
              <span className="font-semibold">{savedStudent?.class}</span>
            </div>
            <div className="flex justify-between items-center text-sm py-1.5">
              <span className="text-muted-foreground">Fee Status</span>
              <span className={`
                px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                ${savedStudent?.feeStatus === 'paid' ? 'bg-green-100 text-green-700' : ''}
                ${savedStudent?.feeStatus === 'partial' ? 'bg-yellow-100 text-yellow-700' : ''}
                ${savedStudent?.feeStatus === 'pending' ? 'bg-amber-50 text-amber-600' : ''}
              `}>
                {savedStudent?.feeStatus}
              </span>
            </div>
          </div>

          {/* Compact Footer */}
          <div className="flex gap-2 px-6 py-4 bg-slate-50 border-t border-slate-100">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 h-9"
              onClick={() => window.print()}
            >
              <Printer className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-xs">Print</span>
            </Button>
            <Button
              size="sm"
              className="flex-1 h-9 bg-sky-600 hover:bg-sky-700"
              onClick={() => {
                setSuccessModalOpen(false);
                navigate("/students");
              }}
            >
              <Eye className="mr-1.5 h-3.5 w-3.5" />
              <span className="text-xs">Dashboard</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Admissions;
