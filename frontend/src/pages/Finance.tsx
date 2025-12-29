import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeaderBanner } from "@/components/dashboard/HeaderBanner";
import { KPICard } from "@/components/dashboard/KPICard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  Receipt,
  Download,
  Printer,
  GraduationCap,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const monthlyData = [
  { month: "Jan", collected: 520000, pending: 80000 },
  { month: "Feb", collected: 480000, pending: 120000 },
  { month: "Mar", collected: 600000, pending: 60000 },
  { month: "Apr", collected: 550000, pending: 90000 },
  { month: "May", collected: 580000, pending: 70000 },
  { month: "Jun", collected: 620000, pending: 50000 },
];

const feeRecords = [
  { id: "FEE-001", student: "Ahmed Ali", class: "11th", totalFee: 40000, paid: 40000, balance: 0, status: "paid" as const },
  { id: "FEE-002", student: "Sara Khan", class: "12th", totalFee: 40000, paid: 25000, balance: 15000, status: "partial" as const },
  { id: "FEE-003", student: "Hassan Raza", class: "MDCAT", totalFee: 60000, paid: 0, balance: 60000, status: "pending" as const },
  { id: "FEE-004", student: "Fatima Noor", class: "10th", totalFee: 30000, paid: 30000, balance: 0, status: "paid" as const },
  { id: "FEE-005", student: "Usman Shah", class: "11th", totalFee: 35000, paid: 20000, balance: 15000, status: "partial" as const },
];

const Finance = () => {
  const totalIncome = 600000;
  const totalExpense = 380000;
  const netBalance = totalIncome - totalExpense;
  const teacherShare = totalIncome * 0.7;
  const academyShare = totalIncome * 0.3;

  return (
    <DashboardLayout title="Finance">
      <HeaderBanner
        title="Finance Management"
        subtitle="Track income, expenses, and financial reports"
      />

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Income"
          value={`PKR ${(totalIncome / 1000).toFixed(0)}K`}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Total Expense"
          value={`PKR ${(totalExpense / 1000).toFixed(0)}K`}
          icon={DollarSign}
          variant="warning"
        />
        <KPICard
          title="Net Balance"
          value={`PKR ${(netBalance / 1000).toFixed(0)}K`}
          icon={DollarSign}
          variant="primary"
        />
        <KPICard
          title="Pending Fees"
          value="PKR 180K"
          subtitle="32 students"
          icon={AlertCircle}
          variant="warning"
        />
      </div>

      {/* Revenue Split & Chart */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Fee Collection Chart */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Monthly Fee Collection
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`PKR ${value.toLocaleString()}`, ""]}
              />
              <Bar dataKey="collected" name="Collected" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Teacher vs Academy Split */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Revenue Breakdown (70/30 Split)
            </h3>
          </div>

          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground">Total Revenue This Month</p>
            <p className="text-3xl font-bold text-foreground">
              PKR {totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg border border-success/20 bg-success-light p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-6 w-6 text-success" />
                  <div>
                    <p className="text-sm font-medium text-success">Teacher Payouts</p>
                    <p className="text-sm text-success/70">70% of total revenue</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-success">
                  PKR {teacherShare.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary-light p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-primary">Academy Share</p>
                    <p className="text-sm text-primary/70">30% of total revenue</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-primary">
                  PKR {academyShare.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-[70%] bg-success" />
            </div>
            <span className="text-xs text-muted-foreground">70%</span>
            <div className="h-3 flex-[0.43] overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-full bg-primary" />
            </div>
            <span className="text-xs text-muted-foreground">30%</span>
          </div>
        </div>
      </div>

      {/* Fee Records Table */}
      <div className="mt-6 rounded-xl border border-border bg-card card-shadow overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="text-lg font-semibold text-foreground">Fee Records</h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button size="sm">
              <Receipt className="mr-2 h-4 w-4" />
              Generate Receipt
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-semibold">Receipt ID</TableHead>
              <TableHead className="font-semibold">Student</TableHead>
              <TableHead className="font-semibold">Class</TableHead>
              <TableHead className="font-semibold text-right">Total Fee</TableHead>
              <TableHead className="font-semibold text-right">Paid</TableHead>
              <TableHead className="font-semibold text-right">Balance</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {feeRecords.map((record) => (
              <TableRow key={record.id} className="hover:bg-secondary/50">
                <TableCell className="font-medium">{record.id}</TableCell>
                <TableCell>{record.student}</TableCell>
                <TableCell>{record.class}</TableCell>
                <TableCell className="text-right">
                  PKR {record.totalFee.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-success">
                  PKR {record.paid.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-destructive">
                  PKR {record.balance.toLocaleString()}
                </TableCell>
                <TableCell>
                  <StatusBadge status={record.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Printer className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Receipt className="h-4 w-4 text-muted-foreground" />
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

export default Finance;
