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
import { Eye, Edit, Trash2, UserPlus, Search, Download, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "@/lib/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
// Import CRUD Modals
import { ViewEditStudentModal } from "@/components/dashboard/ViewEditStudentModal";
import { DeleteStudentDialog } from "@/components/dashboard/DeleteStudentDialog";

// Helper function to get initials from name
const getInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const Students = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");

  // Modal states - Mirroring Teachers pattern
  const [isViewEditModalOpen, setIsViewEditModalOpen] = useState(false);
  const [viewEditMode, setViewEditMode] = useState<"view" | "edit">("view");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);

  // Fetch students with React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["students", { class: classFilter, group: groupFilter, search: searchTerm }],
    queryFn: () =>
      studentApi.getAll({
        class: classFilter !== "all" ? classFilter : undefined,
        group: groupFilter !== "all" ? groupFilter : undefined,
        search: searchTerm || undefined,
      }),
  });

  const students = data?.data || [];

  // Delete mutation
  const deleteStudentMutation = useMutation({
    mutationFn: studentApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student Deleted", {
        description: "Student record has been removed successfully",
        duration: 3000,
      });
      setIsDeleteDialogOpen(false);
      setSelectedStudent(null);
    },
    onError: (error: any) => {
      toast.error("Delete Failed", {
        description: error.message || "Failed to delete student",
        duration: 4000,
      });
    },
  });

  // Handlers - Mirroring Teachers pattern
  const handleView = (student: any) => {
    setSelectedStudent(student);
    setViewEditMode("view");
    setIsViewEditModalOpen(true);
  };

  const handleEdit = (student: any) => {
    setSelectedStudent(student);
    setViewEditMode("edit");
    setIsViewEditModalOpen(true);
  };

  const handleDelete = (student: any) => {
    setSelectedStudent(student);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStudent?._id) {
      deleteStudentMutation.mutate(selectedStudent._id);
    }
  };

  return (
    <DashboardLayout title="Students">
      <HeaderBanner
        title="Student Management"
        subtitle={`Total Students: ${students.length} | Active: ${students.filter((s: any) => s.status === "active").length}`}
      >
        <Button
          className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          onClick={() => navigate("/admissions")}
        >
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
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading students...</span>
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center p-12">
            <p className="text-destructive font-semibold">
              Error loading students
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {(error as any)?.message || "Failed to fetch students"}
            </p>
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <p className="text-muted-foreground font-semibold">
              No students found
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Add your first student to get started
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate("/admissions")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add First Student
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary hover:bg-secondary">
                <TableHead className="font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Student</TableHead>
                <TableHead className="font-semibold">Class</TableHead>
                <TableHead className="font-semibold">Group</TableHead>
                <TableHead className="font-semibold">Subjects</TableHead>
                <TableHead className="font-semibold text-center">Status</TableHead>
                <TableHead className="font-semibold text-center">Fee Status</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student: any) => {
                const initials = getInitials(student.studentName || "NA");

                return (
                  <TableRow key={student._id} className="hover:bg-secondary/50">
                    <TableCell className="font-medium font-mono text-xs text-muted-foreground">
                      {student.studentId}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {/* Sky Blue Avatar with Perfect Centering */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-sm shadow-md">
                          <span className="flex items-center justify-center">{initials}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">
                            {student.studentName}
                          </p>
                          {/* Draft Data Styling - Visual Cue for Incomplete Entries */}
                          {student.fatherName === "To be updated" ? (
                            <p className="text-[11px] italic text-slate-400">
                              {student.fatherName}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              {student.fatherName}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{student.class}</TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{student.group}</span>
                    </TableCell>
                    <TableCell>
                      {/* Enterprise Subject Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {student.subjects?.length > 0 ? (
                          <>
                            {student.subjects.slice(0, 2).map((subject: string) => (
                              <span
                                key={subject}
                                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 border border-slate-200 text-slate-700"
                              >
                                {subject}
                              </span>
                            ))}
                            {student.subjects.length > 2 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-100 border border-sky-200 text-sky-700">
                                +{student.subjects.length - 2}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No subjects</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {/* Status Badge with Refined Glow */}
                      <div
                        className="inline-flex items-center justify-center"
                        style={{
                          filter: student.status === 'active'
                            ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))'
                            : 'drop-shadow(0 0 8px rgba(148, 163, 184, 0.2))'
                        }}
                      >
                        <StatusBadge status={student.status} />
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {/* Fee Status Badge - Locked to Backend */}
                      <div
                        className="inline-flex items-center justify-center"
                        style={{
                          filter:
                            student.feeStatus === 'paid'
                              ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.3))'
                              : student.feeStatus === 'partial'
                                ? 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.3))'
                                : 'drop-shadow(0 0 8px rgba(217, 119, 6, 0.3))' // Amber glow
                        }}
                      >
                        <StatusBadge status={student.feeStatus} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-sky-50 hover:text-sky-600"
                          onClick={() => handleView(student)}
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => handleEdit(student)}
                          title="Edit Student"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(student)}
                          disabled={deleteStudentMutation.isPending}
                          title="Delete Student"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* CRUD Modals - Mirroring Teachers Pattern */}
      <ViewEditStudentModal
        open={isViewEditModalOpen}
        onOpenChange={setIsViewEditModalOpen}
        student={selectedStudent}
        mode={viewEditMode}
      />

      <DeleteStudentDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        studentName={selectedStudent?.studentName || ""}
        studentId={selectedStudent?.studentId || ""}
        isDeleting={deleteStudentMutation.isPending}
      />
    </DashboardLayout>
  );
};

export default Students;
