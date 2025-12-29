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
  Palette,
  Mail,
  Save,
} from "lucide-react";

const Configuration = () => {
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

        {/* Fee Settings */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-light">
              <Database className="h-5 w-5 text-success" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Fee Settings
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Teacher Revenue Share (%)</Label>
              <Input type="number" defaultValue="70" />
            </div>
            <div className="space-y-2">
              <Label>Academy Revenue Share (%)</Label>
              <Input type="number" defaultValue="30" />
            </div>
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

        {/* Academic Settings */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
              <Shield className="h-5 w-5 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Academic Settings
            </h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Academic Year</Label>
              <Select defaultValue="2024-25">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Session</Label>
              <Select defaultValue="morning">
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="morning">Morning (8 AM - 2 PM)</SelectItem>
                  <SelectItem value="evening">Evening (3 PM - 9 PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">MDCAT/ETEA Classes</p>
                <p className="text-sm text-muted-foreground">
                  Enable test prep programs
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Biometric Attendance</p>
                <p className="text-sm text-muted-foreground">
                  Enable fingerprint attendance
                </p>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 flex justify-end">
        <Button size="lg">
          <Save className="mr-2 h-4 w-4" />
          Save Configuration
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Configuration;
