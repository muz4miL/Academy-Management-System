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
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Bell,
  Shield,
  Database,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Save,
  UserPlus,
} from "lucide-react";
import { AddTeacherModal } from "@/components/dashboard/AddTeacherModal";

const Configuration = () => {
  // --- Fee Settings State (Sync Logic Ready) ---
  const [globalCompMode, setGlobalCompMode] = useState<"percentage" | "fixed">("percentage");
  const [defaultTeacherShare, setDefaultTeacherShare] = useState("70");
  const [defaultAcademyShare, setDefaultAcademyShare] = useState("30");
  const [defaultFixedSalary, setDefaultFixedSalary] = useState("");

  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);

  return (
    <DashboardLayout title="Configuration">
      <HeaderBanner
        title="System Configuration"
        subtitle="Manage academy settings and preferences"
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-light">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              General Settings
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Academy Name</Label>
              <Input defaultValue="Academy Management System" />
            </div>
            <div className="space-y-2">
              <Label>Contact Email</Label>
              <Input type="email" defaultValue="admin@academy.com" />
            </div>
            <div className="space-y-2">
              <Label>Contact Phone</Label>
              <Input defaultValue="+92 321 1234567" />
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <Select defaultValue="pkr">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="pkr">PKR - Pakistani Rupee</SelectItem>
                  <SelectItem value="usd">USD - US Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Fee Settings (Refined & Synced) */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow flex flex-col">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light">
              <Database className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Fee Settings
            </h3>
          </div>

          <div className="space-y-6 flex-grow">
            {/* Updated: Mode Selection via Select */}
            <div className="space-y-2">
              <Label>Default Compensation Mode</Label>
              <Select
                value={globalCompMode}
                onValueChange={(value: "percentage" | "fixed") => setGlobalCompMode(value)}
              >
                <SelectTrigger className="bg-background w-full">
                  <SelectValue placeholder="Select default model" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="percentage">Percentage Split</SelectItem>
                  <SelectItem value="fixed">Fixed Salary</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                This model will be applied as default when adding new teachers.
              </p>
            </div>

            {/* Conditional Inputs: Percentage Mode */}
            {globalCompMode === "percentage" && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label>Teacher Share (%)</Label>
                  <Input
                    type="number"
                    value={defaultTeacherShare}
                    onChange={(e) => setDefaultTeacherShare(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Academy Share (%)</Label>
                  <Input
                    type="number"
                    value={defaultAcademyShare}
                    onChange={(e) => setDefaultAcademyShare(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Conditional Inputs: Fixed Salary Mode */}
            {globalCompMode === "fixed" && (
              <div className="space-y-2 animate-fade-in">
                <Label>Default Base Salary (PKR)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 50000"
                  value={defaultFixedSalary}
                  onChange={(e) => setDefaultFixedSalary(e.target.value)}
                />
              </div>
            )}

            {/* Common Fee Settings (Kept at bottom) */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="space-y-2">
                <Label>Default Late Fee (PKR)</Label>
                <Input type="number" defaultValue="500" />
              </div>
              <div className="space-y-2">
                <Label>Fee Due Day</Label>
                <Select defaultValue="10">
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="5">5th of Month</SelectItem>
                    <SelectItem value="10">10th of Month</SelectItem>
                    <SelectItem value="15">15th of Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-light">
              <Bell className="h-5 w-5 text-warning" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Notifications
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Send email for fee reminders
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Send SMS for attendance
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Fee Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Auto-send fee reminders
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">
                  Send weekly summary
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Clock className="h-5 w-5 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Session Management
              </h3>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => setIsTeacherModalOpen(true)}
                className="header-gradient text-white hover:opacity-90"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Teacher
              </Button>
              <Button size="sm" variant="outline" className="text-primary border-primary">
                <Plus className="mr-2 h-4 w-4" />
                Add Session
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent transition-colors">
              <div>
                <p className="font-medium text-foreground">Morning Session</p>
                <p className="text-xs text-muted-foreground">08:00 AM - 02:00 PM</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent transition-colors">
              <div>
                <p className="font-medium text-foreground">Evening Session</p>
                <p className="text-xs text-muted-foreground">03:00 PM - 09:00 PM</p>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button size="lg" className="header-gradient text-white hover:opacity-90">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </div>

      <AddTeacherModal
        open={isTeacherModalOpen}
        onOpenChange={setIsTeacherModalOpen}
        // Sync Props (Passing state to Modal)
        defaultMode={globalCompMode}
        defaultTeacherShare={defaultTeacherShare}
        defaultAcademyShare={defaultAcademyShare}
        defaultFixedSalary={defaultFixedSalary}
      />
    </DashboardLayout>
  );
};

export default Configuration;