import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeaderBanner } from "@/components/dashboard/HeaderBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Eye, Calendar, Clock, Users, GraduationCap, ChevronDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StatusBadge } from "@/components/common/StatusBadge";

interface Session {
  id: string;
  title: string;
  description: string;
  duration: string;
  teachers: string[];
  classes: string[];
  students: string[];
  createdAt: string;
  status: "active" | "upcoming" | "completed";
}

const mockTeachers = [
  { id: "1", name: "Dr. Ahmed Khan" },
  { id: "2", name: "Prof. Sara Ali" },
  { id: "3", name: "Mr. Hassan Raza" },
  { id: "4", name: "Ms. Fatima Zahra" },
  { id: "5", name: "Dr. Usman Malik" },
];

const availableClasses = ["9", "10", "11", "12"];

const mockStudentsByClass: Record<string, { id: string; name: string }[]> = {
  "9": [
    { id: "s1", name: "Ali Hassan" },
    { id: "s2", name: "Sara Khan" },
    { id: "s3", name: "Ahmed Ali" },
  ],
  "10": [
    { id: "s4", name: "Fatima Zahra" },
    { id: "s5", name: "Usman Raza" },
    { id: "s6", name: "Maria Akbar" },
  ],
  "11": [
    { id: "s7", name: "Bilal Ahmed" },
    { id: "s8", name: "Ayesha Noor" },
    { id: "s9", name: "Zain Abbas" },
  ],
  "12": [
    { id: "s10", name: "Hira Malik" },
    { id: "s11", name: "Omar Farooq" },
    { id: "s12", name: "Sana Iqbal" },
  ],
};

const Sessions = () => {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: "1",
      title: "MDCAT Preparation Session",
      description: "Intensive MDCAT preparation covering Biology, Chemistry, Physics and English",
      duration: "3 months",
      teachers: ["Dr. Ahmed Khan", "Prof. Sara Ali"],
      classes: ["11", "12"],
      students: ["Bilal Ahmed", "Ayesha Noor", "Hira Malik"],
      createdAt: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      title: "ECAT Engineering Prep",
      description: "Engineering entrance test preparation for FSc students",
      duration: "2 months",
      teachers: ["Mr. Hassan Raza"],
      classes: ["12"],
      students: ["Omar Farooq", "Sana Iqbal"],
      createdAt: "2024-02-01",
      status: "upcoming",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    selectedTeachers: [] as string[],
    selectedClasses: [] as string[],
    selectedStudents: [] as string[],
  });

  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [classDropdownOpen, setClassDropdownOpen] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);

  const handleTeacherToggle = (teacherName: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedTeachers: prev.selectedTeachers.includes(teacherName)
        ? prev.selectedTeachers.filter((t) => t !== teacherName)
        : [...prev.selectedTeachers, teacherName],
    }));
  };

  const handleClassToggle = (cls: string) => {
    setFormData((prev) => {
      const newClasses = prev.selectedClasses.includes(cls)
        ? prev.selectedClasses.filter((c) => c !== cls)
        : [...prev.selectedClasses, cls];
      
      // Remove students from deselected classes
      const validStudents = prev.selectedStudents.filter((studentName) => {
        for (const c of newClasses) {
          if (mockStudentsByClass[c]?.some((s) => s.name === studentName)) {
            return true;
          }
        }
        return false;
      });

      return {
        ...prev,
        selectedClasses: newClasses,
        selectedStudents: validStudents,
      };
    });
  };

  const handleStudentToggle = (studentName: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedStudents: prev.selectedStudents.includes(studentName)
        ? prev.selectedStudents.filter((s) => s !== studentName)
        : [...prev.selectedStudents, studentName],
    }));
  };

  const getAvailableStudents = () => {
    const students: { id: string; name: string; className: string }[] = [];
    formData.selectedClasses.forEach((cls) => {
      mockStudentsByClass[cls]?.forEach((student) => {
        students.push({ ...student, className: cls });
      });
    });
    return students;
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.duration || formData.selectedTeachers.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in title, duration, and select at least one teacher",
        variant: "destructive",
      });
      return;
    }

    if (editingSession) {
      setSessions((prev) =>
        prev.map((session) =>
          session.id === editingSession.id
            ? {
                ...session,
                title: formData.title,
                description: formData.description,
                duration: formData.duration,
                teachers: formData.selectedTeachers,
                classes: formData.selectedClasses,
                students: formData.selectedStudents,
              }
            : session
        )
      );
      toast({ title: "Success", description: "Session updated successfully" });
    } else {
      const newSession: Session = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        teachers: formData.selectedTeachers,
        classes: formData.selectedClasses,
        students: formData.selectedStudents,
        createdAt: new Date().toISOString().split("T")[0],
        status: "upcoming",
      };
      setSessions((prev) => [...prev, newSession]);
      toast({ title: "Success", description: "Session created successfully" });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      duration: "",
      selectedTeachers: [],
      selectedClasses: [],
      selectedStudents: [],
    });
    setEditingSession(null);
    setIsDialogOpen(false);
  };

  const handleView = (session: Session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description,
      duration: session.duration,
      selectedTeachers: session.teachers,
      selectedClasses: session.classes,
      selectedStudents: session.students,
    });
    setIsDialogOpen(true);
  };

  const getStatusVariant = (status: Session["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "upcoming":
        return "warning";
      case "completed":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <DashboardLayout title="Sessions">
      <HeaderBanner
        title="Academy Sessions"
        subtitle="Manage and organize academic sessions"
      >
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Plus className="mr-2 h-4 w-4" />
              Create Session
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card sm:max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSession ? "Edit Session" : "Create New Session"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Session Title</Label>
                <Input
                  placeholder="e.g., MDCAT Preparation 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the session objectives and details"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label>Duration</Label>
                <Input
                  placeholder="e.g., 3 months, 6 weeks"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>

              {/* Teacher Multi-Select */}
              <div className="space-y-2">
                <Label>Assign Teachers</Label>
                <Popover open={teacherDropdownOpen} onOpenChange={setTeacherDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-background">
                      {formData.selectedTeachers.length > 0
                        ? `${formData.selectedTeachers.length} teacher(s) selected`
                        : "Select teachers"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-2 bg-popover" align="start">
                    <div className="space-y-2">
                      {mockTeachers.map((teacher) => (
                        <div key={teacher.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                          <Checkbox
                            id={`teacher-${teacher.id}`}
                            checked={formData.selectedTeachers.includes(teacher.name)}
                            onCheckedChange={() => handleTeacherToggle(teacher.name)}
                          />
                          <label htmlFor={`teacher-${teacher.id}`} className="text-sm cursor-pointer flex-1">
                            {teacher.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                {formData.selectedTeachers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.selectedTeachers.map((t) => (
                      <span key={t} className="bg-primary-light text-primary px-2 py-1 rounded text-xs">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Class Multi-Select */}
              <div className="space-y-2">
                <Label>Select Classes</Label>
                <Popover open={classDropdownOpen} onOpenChange={setClassDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-background">
                      {formData.selectedClasses.length > 0
                        ? `Class ${formData.selectedClasses.join(", ")}`
                        : "Select classes"}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-2 bg-popover" align="start">
                    <div className="space-y-2">
                      {availableClasses.map((cls) => (
                        <div key={cls} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                          <Checkbox
                            id={`class-${cls}`}
                            checked={formData.selectedClasses.includes(cls)}
                            onCheckedChange={() => handleClassToggle(cls)}
                          />
                          <label htmlFor={`class-${cls}`} className="text-sm cursor-pointer flex-1">
                            Class {cls}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Student Multi-Select (appears after class selection) */}
              {formData.selectedClasses.length > 0 && (
                <div className="space-y-2">
                  <Label>Enroll Students</Label>
                  <Popover open={studentDropdownOpen} onOpenChange={setStudentDropdownOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-between bg-background">
                        {formData.selectedStudents.length > 0
                          ? `${formData.selectedStudents.length} student(s) enrolled`
                          : "Select students"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-2 bg-popover max-h-60 overflow-y-auto" align="start">
                      <div className="space-y-2">
                        {getAvailableStudents().map((student) => (
                          <div key={student.id} className="flex items-center space-x-2 p-2 rounded hover:bg-muted">
                            <Checkbox
                              id={`student-${student.id}`}
                              checked={formData.selectedStudents.includes(student.name)}
                              onCheckedChange={() => handleStudentToggle(student.name)}
                            />
                            <label htmlFor={`student-${student.id}`} className="text-sm cursor-pointer flex-1">
                              {student.name}
                              <span className="text-muted-foreground ml-2">(Class {student.className})</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  {formData.selectedStudents.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.selectedStudents.map((s) => (
                        <span key={s} className="bg-success-light text-success px-2 py-1 rounded text-xs">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  {editingSession ? "Update Session" : "Create Session"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </HeaderBanner>

      {/* Sessions List */}
      <div className="mt-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Current Sessions</h3>
        {sessions.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">No sessions created yet</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Session
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <Card key={session.id} className="card-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{session.title}</CardTitle>
                    <StatusBadge status={getStatusVariant(session.status)}>
                      {session.status}
                    </StatusBadge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {session.description}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Duration: {session.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>{session.teachers.length} Teacher(s)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{session.students.length} Student(s) enrolled</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {session.classes.map((cls) => (
                      <span key={cls} className="bg-muted px-2 py-0.5 rounded text-xs">
                        Class {cls}
                      </span>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-3"
                    onClick={() => handleView(session)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View / Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Sessions;
