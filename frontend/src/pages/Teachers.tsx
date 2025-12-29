import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeaderBanner } from "@/components/dashboard/HeaderBanner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Mail, Phone, Trash2, UserPlus } from "lucide-react";

const teachersData = [
  {
    id: "TCH-001",
    name: "Dr. Muhammad Aslam",
    subject: "Biology",
    phone: "0321-1111111",
    email: "aslam@academy.com",
    students: 45,
    monthlyEarnings: 126000,
    status: "active" as const,
  },
  {
    id: "TCH-002",
    name: "Prof. Fatima Hassan",
    subject: "Chemistry",
    phone: "0333-2222222",
    email: "fatima@academy.com",
    students: 68,
    monthlyEarnings: 156000,
    status: "active" as const,
  },
  {
    id: "TCH-003",
    name: "Mr. Ahmed Khan",
    subject: "Physics",
    phone: "0345-3333333",
    email: "ahmed@academy.com",
    students: 52,
    monthlyEarnings: 118000,
    status: "active" as const,
  },
  {
    id: "TCH-004",
    name: "Mrs. Sara Malik",
    subject: "Mathematics",
    phone: "0312-4444444",
    email: "sara@academy.com",
    students: 38,
    monthlyEarnings: 98000,
    status: "active" as const,
  },
  {
    id: "TCH-005",
    name: "Mr. Usman Ali",
    subject: "English",
    phone: "0300-5555555",
    email: "usman@academy.com",
    students: 72,
    monthlyEarnings: 84000,
    status: "active" as const,
  },
];

const Teachers = () => {
  return (
    <DashboardLayout title="Teachers">
      <HeaderBanner
        title="Teacher Management"
        subtitle={`Total Teachers: ${teachersData.length} | All Active`}
      >
        <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Teacher
        </Button>
      </HeaderBanner>

      {/* Teacher Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Biology", "Chemistry", "Physics", "Mathematics"].map((subject) => {
          const teacher = teachersData.find((t) => t.subject === subject);
          return (
            <div
              key={subject}
              className="rounded-xl border border-border bg-card p-4 card-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{subject}</p>
                  <p className="text-lg font-semibold text-foreground">
                    {teacher?.name.split(" ").slice(-1)}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
                  <span className="text-lg font-bold text-primary">
                    {teacher?.students}
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Earnings:{" "}
                <span className="font-medium text-success">
                  PKR {teacher?.monthlyEarnings.toLocaleString()}
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Teachers Table */}
      <div className="mt-6 rounded-xl border border-border bg-card card-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Teacher</TableHead>
              <TableHead className="font-semibold">Subject</TableHead>
              <TableHead className="font-semibold">Contact</TableHead>
              <TableHead className="font-semibold text-center">Students</TableHead>
              <TableHead className="font-semibold text-right">Monthly (70%)</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teachersData.map((teacher) => (
              <TableRow key={teacher.id} className="hover:bg-secondary/50">
                <TableCell className="font-medium text-muted-foreground">
                  {teacher.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success text-success-foreground font-medium">
                      {teacher.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{teacher.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {teacher.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-primary-light px-3 py-1 text-sm font-medium text-primary">
                    {teacher.subject}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {teacher.phone}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-medium text-foreground">
                    {teacher.students}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium text-success">
                    PKR {teacher.monthlyEarnings.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={teacher.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Mail className="h-4 w-4 text-muted-foreground" />
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

export default Teachers;
