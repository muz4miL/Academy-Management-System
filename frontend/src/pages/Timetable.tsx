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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Clock, Trash2, Edit } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface TimetableEntry {
  id: string;
  day: string;
  teacherName: string;
  subject: string;
  startTime: string;
  endTime: string;
  className: string;
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const mockTeachers = [
  { id: "1", name: "Dr. Ahmed Khan" },
  { id: "2", name: "Prof. Sara Ali" },
  { id: "3", name: "Mr. Hassan Raza" },
  { id: "4", name: "Ms. Fatima Zahra" },
];

const subjects = ["Physics", "Chemistry", "Biology", "Mathematics", "English"];
const classes = ["9th", "10th", "11th", "12th", "MDCAT", "ECAT"];

const Timetable = () => {
  const [entries, setEntries] = useState<TimetableEntry[]>([
    {
      id: "1",
      day: "Monday",
      teacherName: "Dr. Ahmed Khan",
      subject: "Physics",
      startTime: "09:00",
      endTime: "10:30",
      className: "11th",
    },
    {
      id: "2",
      day: "Monday",
      teacherName: "Prof. Sara Ali",
      subject: "Chemistry",
      startTime: "10:30",
      endTime: "12:00",
      className: "11th",
    },
    {
      id: "3",
      day: "Tuesday",
      teacherName: "Mr. Hassan Raza",
      subject: "Mathematics",
      startTime: "09:00",
      endTime: "10:30",
      className: "10th",
    },
    {
      id: "4",
      day: "Wednesday",
      teacherName: "Ms. Fatima Zahra",
      subject: "Biology",
      startTime: "14:00",
      endTime: "15:30",
      className: "12th",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);
  const [formData, setFormData] = useState({
    day: "",
    teacherId: "",
    subject: "",
    startTime: "",
    endTime: "",
    className: "",
  });
  const [filterDay, setFilterDay] = useState<string>("all");

  const handleSubmit = () => {
    if (!formData.day || !formData.teacherId || !formData.subject || !formData.startTime || !formData.endTime || !formData.className) {
      toast({
        title: "Error",
        description: "Please fill all fields",
        variant: "destructive",
      });
      return;
    }

    const teacher = mockTeachers.find((t) => t.id === formData.teacherId);
    
    if (editingEntry) {
      setEntries((prev) =>
        prev.map((entry) =>
          entry.id === editingEntry.id
            ? {
                ...entry,
                day: formData.day,
                teacherName: teacher?.name || "",
                subject: formData.subject,
                startTime: formData.startTime,
                endTime: formData.endTime,
                className: formData.className,
              }
            : entry
        )
      );
      toast({ title: "Success", description: "Timetable entry updated" });
    } else {
      const newEntry: TimetableEntry = {
        id: Date.now().toString(),
        day: formData.day,
        teacherName: teacher?.name || "",
        subject: formData.subject,
        startTime: formData.startTime,
        endTime: formData.endTime,
        className: formData.className,
      };
      setEntries((prev) => [...prev, newEntry]);
      toast({ title: "Success", description: "Timetable entry added" });
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      day: "",
      teacherId: "",
      subject: "",
      startTime: "",
      endTime: "",
      className: "",
    });
    setEditingEntry(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (entry: TimetableEntry) => {
    const teacher = mockTeachers.find((t) => t.name === entry.teacherName);
    setEditingEntry(entry);
    setFormData({
      day: entry.day,
      teacherId: teacher?.id || "",
      subject: entry.subject,
      startTime: entry.startTime,
      endTime: entry.endTime,
      className: entry.className,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
    toast({ title: "Deleted", description: "Timetable entry removed" });
  };

  const filteredEntries = filterDay === "all" ? entries : entries.filter((e) => e.day === filterDay);

  const calculateDuration = (start: string, end: string) => {
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  return (
    <DashboardLayout title="Timetable">
      <HeaderBanner
        title="Academy Timetable"
        subtitle="Manage teacher schedules and class periods"
      >
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Period
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Period" : "Add New Period"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={formData.day} onValueChange={(val) => setFormData({ ...formData, day: val })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>{day}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Teacher</Label>
                <Select value={formData.teacherId} onValueChange={(val) => setFormData({ ...formData, teacherId: val })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select teacher" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {mockTeachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={formData.subject} onValueChange={(val) => setFormData({ ...formData, subject: val })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {subjects.map((subj) => (
                      <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={formData.className} onValueChange={(val) => setFormData({ ...formData, className: val })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {classes.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Time</Label>
                  <Input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" onClick={resetForm} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  {editingEntry ? "Update" : "Add Period"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </HeaderBanner>

      {/* Filter */}
      <div className="mt-6 flex items-center gap-4">
        <Label>Filter by Day:</Label>
        <Select value={filterDay} onValueChange={setFilterDay}>
          <SelectTrigger className="w-48 bg-card">
            <SelectValue placeholder="All Days" />
          </SelectTrigger>
          <SelectContent className="bg-popover">
            <SelectItem value="all">All Days</SelectItem>
            {days.map((day) => (
              <SelectItem key={day} value={day}>{day}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Timetable Display */}
      <div className="mt-6 rounded-xl border border-border bg-card card-shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Day</TableHead>
              <TableHead>Teacher</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No timetable entries found
                </TableCell>
              </TableRow>
            ) : (
              filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.day}</TableCell>
                  <TableCell>{entry.teacherName}</TableCell>
                  <TableCell>{entry.subject}</TableCell>
                  <TableCell>{entry.className}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {entry.startTime} - {entry.endTime}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-primary-light px-2 py-1 text-xs font-medium text-primary">
                      {calculateDuration(entry.startTime, entry.endTime)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(entry)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Weekly Overview */}
      <div className="mt-8">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Weekly Overview</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {days.map((day) => {
            const dayEntries = entries.filter((e) => e.day === day);
            return (
              <div key={day} className="rounded-xl border border-border bg-card p-4 card-shadow">
                <h4 className="mb-3 font-semibold text-foreground">{day}</h4>
                {dayEntries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No periods scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-lg bg-primary-light p-2 text-sm"
                      >
                        <div className="font-medium text-primary">{entry.subject}</div>
                        <div className="text-muted-foreground">
                          {entry.teacherName} • {entry.className}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {entry.startTime} - {entry.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Timetable;
