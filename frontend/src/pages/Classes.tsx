import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeaderBanner } from "@/components/dashboard/HeaderBanner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Users, Clock } from "lucide-react";

const classesData = [
  {
    id: "CLS-001",
    name: "9th Grade - Pre-Medical",
    teacher: "Dr. Muhammad Aslam",
    students: 28,
    schedule: "Mon, Wed, Fri - 9:00 AM",
    subjects: ["Biology", "Chemistry", "Physics"],
  },
  {
    id: "CLS-002",
    name: "9th Grade - Pre-Engineering",
    teacher: "Mr. Ahmed Khan",
    students: 24,
    schedule: "Mon, Wed, Fri - 11:00 AM",
    subjects: ["Mathematics", "Chemistry", "Physics"],
  },
  {
    id: "CLS-003",
    name: "10th Grade - Pre-Medical",
    teacher: "Prof. Fatima Hassan",
    students: 32,
    schedule: "Tue, Thu, Sat - 9:00 AM",
    subjects: ["Biology", "Chemistry", "Physics"],
  },
  {
    id: "CLS-004",
    name: "11th Grade (1st Year) - FSc Pre-Med",
    teacher: "Dr. Muhammad Aslam",
    students: 45,
    schedule: "Daily - 8:00 AM",
    subjects: ["Biology", "Chemistry", "Physics", "English"],
  },
  {
    id: "CLS-005",
    name: "12th Grade (2nd Year) - FSc Pre-Eng",
    teacher: "Mrs. Sara Malik",
    students: 38,
    schedule: "Daily - 10:00 AM",
    subjects: ["Mathematics", "Chemistry", "Physics", "English"],
  },
  {
    id: "CLS-006",
    name: "MDCAT Preparation",
    teacher: "Multiple Teachers",
    students: 56,
    schedule: "Daily - 4:00 PM",
    subjects: ["Biology", "Chemistry", "Physics", "English", "Logical Reasoning"],
  },
  {
    id: "CLS-007",
    name: "ECAT/ETEA Preparation",
    teacher: "Multiple Teachers",
    students: 42,
    schedule: "Daily - 6:00 PM",
    subjects: ["Mathematics", "Chemistry", "Physics", "English"],
  },
];

const Classes = () => {
  return (
    <DashboardLayout title="Classes">
      <HeaderBanner
        title="Class Management"
        subtitle={`Total Classes: ${classesData.length} | Active Sessions: ${classesData.length}`}
      >
        <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Class
        </Button>
      </HeaderBanner>

      {/* Summary Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Matriculation", count: 3, students: 84 },
          { label: "Intermediate", count: 2, students: 83 },
          { label: "MDCAT Prep", count: 1, students: 56 },
          { label: "ECAT/ETEA", count: 1, students: 42 },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border bg-card p-4 card-shadow"
          >
            <p className="text-sm text-muted-foreground">{item.label}</p>
            <div className="mt-2 flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">{item.count}</p>
                <p className="text-xs text-muted-foreground">classes</p>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">{item.students}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Classes Table */}
      <div className="mt-6 rounded-xl border border-border bg-card card-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-semibold">Class ID</TableHead>
              <TableHead className="font-semibold">Class Name</TableHead>
              <TableHead className="font-semibold">Teacher</TableHead>
              <TableHead className="font-semibold">Schedule</TableHead>
              <TableHead className="font-semibold">Subjects</TableHead>
              <TableHead className="font-semibold text-center">Students</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {classesData.map((cls) => (
              <TableRow key={cls.id} className="hover:bg-secondary/50">
                <TableCell className="font-medium text-muted-foreground">
                  {cls.id}
                </TableCell>
                <TableCell>
                  <span className="font-medium text-foreground">{cls.name}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success text-success-foreground text-xs font-medium">
                      {cls.teacher.charAt(0)}
                    </div>
                    <span className="text-sm">{cls.teacher}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {cls.schedule}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.slice(0, 3).map((subject) => (
                      <span
                        key={subject}
                        className="rounded bg-primary-light px-2 py-0.5 text-xs text-primary"
                      >
                        {subject}
                      </span>
                    ))}
                    {cls.subjects.length > 3 && (
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        +{cls.subjects.length - 3}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-light text-sm font-medium text-primary">
                    {cls.students}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
};

export default Classes;
