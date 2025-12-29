import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeaderBanner } from "@/components/dashboard/HeaderBanner";
import { KPICard } from "@/components/dashboard/KPICard";
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
import {
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Percent,
  Users,
  FileText,
  Save,
} from "lucide-react";

const attendanceData = [
  { id: "STU-001", name: "Ahmed Ali", class: "XI-A", status: "present" },
  { id: "STU-002", name: "Sara Khan", class: "XII-A", status: "present" },
  { id: "STU-003", name: "Hassan Raza", class: "MDCAT", status: "absent" },
  { id: "STU-004", name: "Fatima Noor", class: "X-A", status: "leave" },
  { id: "STU-005", name: "Usman Shah", class: "XI-B", status: "present" },
  { id: "STU-006", name: "Ayesha Ahmed", class: "XII-B", status: "present" },
  { id: "STU-007", name: "Ali Hassan", class: "XI-A", status: "absent" },
];

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [classFilter, setClassFilter] = useState("all");
  const [attendance, setAttendance] = useState<
    Record<string, "present" | "absent" | "leave">
  >(
    attendanceData.reduce(
      (acc, student) => ({
        ...acc,
        [student.id]: student.status as "present" | "absent" | "leave",
      }),
      {}
    )
  );

  const present = Object.values(attendance).filter((s) => s === "present").length;
  const absent = Object.values(attendance).filter((s) => s === "absent").length;
  const onLeave = Object.values(attendance).filter((s) => s === "leave").length;
  const total = Object.values(attendance).length;
  const attendanceRate = ((present / total) * 100).toFixed(1);

  const markAttendance = (
    studentId: string,
    status: "present" | "absent" | "leave"
  ) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };

  return (
    <DashboardLayout title="Attendance">
      <HeaderBanner
        title="Attendance Management"
        subtitle={`Mark and track student attendance - Date: ${selectedDate}`}
      />

      {/* Tabs */}
      <div className="mt-6 flex gap-4 border-b border-border">
        {["Mark Attendance", "Short Leave", "Reports"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-3 text-sm font-medium transition-colors ${
              i === 0
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Attendance Rate"
          value={`${attendanceRate}%`}
          icon={Percent}
          variant="primary"
        />
        <KPICard
          title="Present"
          value={present}
          icon={CheckCircle}
          variant="success"
        />
        <KPICard title="Absent" value={absent} icon={XCircle} variant="warning" />
        <KPICard title="On Leave" value={onLeave} icon={Clock} variant="default" />
      </div>

      {/* Filters */}
      <div className="mt-6 rounded-xl border border-border bg-card p-4 card-shadow">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-[180px] bg-background"
            />
          </div>

          <Select value={classFilter} onValueChange={setClassFilter}>
            <SelectTrigger className="w-[150px] bg-background">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">All Classes</SelectItem>
              <SelectItem value="X-A">X-A</SelectItem>
              <SelectItem value="XI-A">XI-A</SelectItem>
              <SelectItem value="XI-B">XI-B</SelectItem>
              <SelectItem value="XII-A">XII-A</SelectItem>
              <SelectItem value="XII-B">XII-B</SelectItem>
              <SelectItem value="MDCAT">MDCAT</SelectItem>
            </SelectContent>
          </Select>

          <div className="ml-auto flex gap-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Print Report
            </Button>
            <Button>
              <Save className="mr-2 h-4 w-4" />
              Save Attendance ({present})
            </Button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="mt-6 rounded-xl border border-border bg-card card-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-semibold">Roll No</TableHead>
              <TableHead className="font-semibold">Student Name</TableHead>
              <TableHead className="font-semibold">Class</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendanceData
              .filter((s) => classFilter === "all" || s.class === classFilter)
              .map((student) => (
                <TableRow key={student.id} className="hover:bg-secondary/50">
                  <TableCell className="font-medium text-muted-foreground">
                    {student.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-medium">
                        {student.name.charAt(0)}
                      </div>
                      <span className="font-medium text-foreground">
                        {student.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        attendance[student.id] === "present"
                          ? "bg-success-light text-success"
                          : attendance[student.id] === "absent"
                          ? "bg-pending-light text-pending"
                          : "bg-warning-light text-warning"
                      }`}
                    >
                      {attendance[student.id] === "present"
                        ? "Present"
                        : attendance[student.id] === "absent"
                        ? "Absent"
                        : "Leave"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant={
                          attendance[student.id] === "present"
                            ? "default"
                            : "ghost"
                        }
                        size="icon"
                        className={`h-8 w-8 ${
                          attendance[student.id] === "present"
                            ? "bg-success hover:bg-success/90"
                            : ""
                        }`}
                        onClick={() => markAttendance(student.id, "present")}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          attendance[student.id] === "absent"
                            ? "default"
                            : "ghost"
                        }
                        size="icon"
                        className={`h-8 w-8 ${
                          attendance[student.id] === "absent"
                            ? "bg-destructive hover:bg-destructive/90"
                            : ""
                        }`}
                        onClick={() => markAttendance(student.id, "absent")}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          attendance[student.id] === "leave"
                            ? "default"
                            : "ghost"
                        }
                        size="icon"
                        className={`h-8 w-8 ${
                          attendance[student.id] === "leave"
                            ? "bg-warning hover:bg-warning/90"
                            : ""
                        }`}
                        onClick={() => markAttendance(student.id, "leave")}
                      >
                        <Clock className="h-4 w-4" />
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

export default Attendance;
