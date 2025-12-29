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
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save, UserPlus } from "lucide-react";

const premedSubjects = [
  { id: "biology", label: "Biology" },
  { id: "chemistry", label: "Chemistry" },
  { id: "physics", label: "Physics" },
  { id: "english", label: "English" },
];

const preengSubjects = [
  { id: "mathematics", label: "Mathematics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "physics", label: "Physics" },
  { id: "english", label: "English" },
];

const mockSessions = [
  { id: "1", title: "MDCAT Preparation Session" },
  { id: "2", title: "ECAT Engineering Prep" },
  { id: "3", title: "9th Grade Regular Session" },
];

const Admissions = () => {
  const [group, setGroup] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>("no-session");

  const availableSubjects = group === "pre-medical" ? premedSubjects : group === "pre-engineering" ? preengSubjects : [];

  const handleSubjectToggle = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId]
    );
  };

  return (
    <DashboardLayout title="Admissions">
      <HeaderBanner
        title="New Admission"
        subtitle="Register a new student to the academy"
      >
        <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
          <UserPlus className="mr-2 h-4 w-4" />
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
                <Label htmlFor="name">Student Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input id="fatherName" placeholder="Enter father's name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="session">Assign to Session</Label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select session" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="no-session">No Session</SelectItem>
                    {mockSessions.map((session) => (
                      <SelectItem key={session.id} value={session.id}>
                        {session.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Select value={group} onValueChange={(value) => {
                  setGroup(value);
                  setSelectedSubjects([]);
                }}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="pre-medical">Pre-Medical</SelectItem>
                    <SelectItem value="pre-engineering">Pre-Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Class</Label>
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="8th">8th Grade</SelectItem>
                    <SelectItem value="9th">9th Grade</SelectItem>
                    <SelectItem value="10th">10th Grade</SelectItem>
                    <SelectItem value="1st-year">1st Year (11th)</SelectItem>
                    <SelectItem value="2nd-year">2nd Year (12th)</SelectItem>
                    <SelectItem value="mdcat">MDCAT Prep</SelectItem>
                    <SelectItem value="ecat">ECAT/ETEA Prep</SelectItem>
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
                  {group === "pre-medical" && (
                    <p className="text-xs text-muted-foreground">
                      Pre-Medical group includes Biology instead of Mathematics
                    </p>
                  )}
                  {group === "pre-engineering" && (
                    <p className="text-xs text-muted-foreground">
                      Pre-Engineering group includes Mathematics instead of Biology
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="college">College/School Name</Label>
                <Input id="college" placeholder="Enter institution name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="parentCell">Parent Cell No.</Label>
                <Input id="parentCell" placeholder="03XX-XXXXXXX" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentCell">Student Cell No.</Label>
                <Input id="studentCell" placeholder="03XX-XXXXXXX" />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete address"
                  className="resize-none"
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
                <Input id="admissionDate" type="date" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admittedClass">Admitted Class</Label>
                <Input id="admittedClass" placeholder="e.g., 11th" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admittedSubject">Admitted Subject(s)</Label>
                <Input id="admittedSubject" placeholder="e.g., Physics, Chemistry" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feeReceived">Fee Received (PKR)</Label>
                <Input id="feeReceived" type="number" placeholder="0" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="balance">Balance (PKR)</Label>
                <Input id="balance" type="number" placeholder="0" />
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
            <Button variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Save Admission
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Admissions;
