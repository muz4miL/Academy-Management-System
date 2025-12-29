import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeaderBanner } from "@/components/dashboard/HeaderBanner";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2, UserPlus, Search, Download } from "lucide-react";

const studentsData = [
  {
    id: "STU-001",
    name: "Ahmed Ali",
    fatherName: "Mohammad Ali",
    class: "11th",
    group: "Pre-Medical",
    subjects: ["Biology", "Chemistry", "Physics"],
    phone: "0321-1234567",
    status: "active" as const,
    feeStatus: "paid" as const,
    totalFee: 40000,
    paid: 40000,
  },
  {
    id: "STU-002",
    name: "Sara Khan",
    fatherName: "Imran Khan",
    class: "12th",
    group: "Pre-Engineering",
    subjects: ["Math", "Chemistry", "Physics"],
    phone: "0333-2345678",
    status: "active" as const,
    feeStatus: "partial" as const,
    totalFee: 40000,
    paid: 25000,
  },
  {
    id: "STU-003",
    name: "Hassan Raza",
    fatherName: "Raza Ahmed",
    class: "MDCAT",
    group: "Pre-Medical",
    subjects: ["Biology", "Chemistry", "Physics", "English"],
    phone: "0345-3456789",
    status: "active" as const,
    feeStatus: "pending" as const,
    totalFee: 60000,
    paid: 0,
  },
  {
    id: "STU-004",
    name: "Fatima Noor",
    fatherName: "Noor Muhammad",
    class: "10th",
    group: "Pre-Medical",
    subjects: ["Biology", "Chemistry"],
    phone: "0312-4567890",
    status: "active" as const,
    feeStatus: "paid" as const,
    totalFee: 30000,
    paid: 30000,
  },
  {
    id: "STU-005",
    name: "Usman Shah",
    fatherName: "Shah Nawaz",
    class: "11th",
    group: "Pre-Engineering",
    subjects: ["Math", "Physics"],
    phone: "0300-5678901",
    status: "active" as const,
    feeStatus: "partial" as const,
    totalFee: 35000,
    paid: 20000,
  },
];

const Students = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");

  const filteredStudents = studentsData.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesClass =
      classFilter === "all" || student.class === classFilter;
    const matchesGroup =
      groupFilter === "all" || student.group === groupFilter;
    return matchesSearch && matchesClass && matchesGroup;
  });

  return (
    <DashboardLayout title="Students">
      <HeaderBanner
        title="Student Management"
        subtitle={`Total Students: ${studentsData.length} | Active: ${studentsData.filter((s) => s.status === "active").length}`}
      >
        <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </HeaderBanner>

      {/* Filters */}
      <div className="mt-6 rounded-xl border border-border bg-card p-4 card-shadow">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder="Filter by Class" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="9th">9th Grade</SelectItem>
              <SelectItem value="10th">10th Grade</SelectItem>
              <SelectItem value="11th">11th Grade</SelectItem>
              <SelectItem value="12th">12th Grade</SelectItem>
              <SelectItem value="MDCAT">MDCAT</SelectItem>
              <SelectItem value="ECAT">ECAT</SelectItem>
            </SelectContent>
          </Select>

          <Select value={groupFilter} onValueChange={setGroupFilter}>
            <SelectTrigger className="w-[170px] bg-background">
              <SelectValue placeholder="Filter by Group" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Groups</SelectItem>
              <SelectItem value="Pre-Medical">Pre-Medical</SelectItem>
              <SelectItem value="Pre-Engineering">Pre-Engineering</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Students Table */}
      <div className="mt-6 rounded-xl border border-border bg-card card-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Student</TableHead>
              <TableHead className="font-semibold">Class</TableHead>
              <TableHead className="font-semibold">Group</TableHead>
              <TableHead className="font-semibold">Subjects</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Fee Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} className="hover:bg-secondary/50">
                <TableCell className="font-medium text-muted-foreground">
                  {student.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                      {student.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.fatherName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{student.class}</TableCell>
                <TableCell>
                  <span className="text-sm">{student.group}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {student.subjects.slice(0, 2).map((subject) => (
                      <span
                        key={subject}
                        className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground"
                      >
                        {subject}
                      </span>
                    ))}
                    {student.subjects.length > 2 && (
                      <span className="rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                        +{student.subjects.length - 2}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={student.feeStatus} />
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

export default Students;
