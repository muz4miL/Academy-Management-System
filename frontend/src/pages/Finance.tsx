import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HeaderBanner } from "@/components/dashboard/HeaderBanner";
import { KPICard } from "@/components/dashboard/KPICard";
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
  DollarSign,
  TrendingUp,
  AlertCircle,
  GraduationCap,
  Wallet,
  Users,
  Loader2,
  Plus,
  Trash2,
  TrendingDown,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// API Base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const Finance = () => {
  const queryClient = useQueryClient();

  // Expense form state
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");

  // Fetch real-time finance stats
  const { data: financeData, isLoading: statsLoading } = useQuery({
    queryKey: ['finance', 'stats'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/finance/stats/overview`);
      if (!response.ok) throw new Error('Failed to fetch finance stats');
      const result = await response.json();
      return result.data;
    },
    refetchInterval: 30000,
  });

  // Fetch expenses
  const { data: expensesData, isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/api/expenses?limit=10`);
      if (!response.ok) throw new Error('Failed to fetch expenses');
      const result = await response.json();
      return result.data;
    },
  });

  // Create expense mutation
  const createExpenseMutation = useMutation({
    mutationFn: async (expenseData: any) => {
      const response = await fetch(`${API_BASE_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData),
      });
      if (!response.ok) throw new Error('Failed to create expense');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      toast.success('Expense added successfully');
      // Reset form
      setExpenseTitle("");
      setExpenseCategory("");
      setExpenseAmount("");
    },
    onError: () => {
      toast.error('Failed to add expense');
    },
  });

  // Delete expense mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: async (expenseId: string) => {
      const response = await fetch(`${API_BASE_URL}/api/expenses/${expenseId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete expense');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['finance'] });
      toast.success('Expense deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete expense');
    },
  });

  const handleAddExpense = () => {
    if (!expenseTitle || !expenseCategory || !expenseAmount) {
      toast.error('Please fill all expense fields');
      return;
    }

    createExpenseMutation.mutate({
      title: expenseTitle,
      category: expenseCategory,
      amount: parseFloat(expenseAmount),
    });
  };

  if (statsLoading) {
    return (
      <DashboardLayout title="Finance">
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const {
    totalIncome = 0,
    totalExpected = 0,
    totalPending = 0,
    pendingStudentsCount = 0,
    totalTeacherLiabilities = 0,
    teacherPayroll = [],
    academyShare = 0,
    totalExpenses = 0,
    netProfit = 0,
    collectionRate = 0,
  } = financeData || {};

  const expenses = expensesData || [];

  // TASK 4: Triple-Split Financial Chart Data
  const chartData = [
    { name: 'Net Profit', value: Math.max(0, netProfit), color: '#3b82f6' }, // Blue
    { name: 'Teacher Payouts', value: totalTeacherLiabilities, color: '#10b981' }, // Green
    { name: 'Expenses', value: totalExpenses, color: '#ef4444' }, // Red
  ];

  const COLORS = ['#3b82f6', '#10b981', '#ef4444'];

  return (
    <DashboardLayout title="Finance">
      <HeaderBanner
        title="Finance Management"
        subtitle="Real-time financial analytics and expense tracking"
      />

      {/* KPI Cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Total Collected"
          value={`PKR ${(totalIncome / 1000).toFixed(0)}K`}
          subtitle={`${collectionRate}% collection rate`}
          icon={TrendingUp}
          variant="success"
          trend={{ value: collectionRate, isPositive: collectionRate > 70 }}
        />
        <KPICard
          title="Teacher Liabilities"
          value={`PKR ${(totalTeacherLiabilities / 1000).toFixed(0)}K`}
          subtitle={`${teacherPayroll.length} active teachers`}
          icon={GraduationCap}
          variant="warning"
        />
        <KPICard
          title="Total Expenses"
          value={`PKR ${(totalExpenses / 1000).toFixed(0)}K`}
          subtitle="Operational costs"
          icon={TrendingDown}
          variant="danger"
        />
        <KPICard
          title="Net Profit"
          value={`PKR ${(netProfit / 1000).toFixed(0)}K`}
          subtitle="After all costs"
          icon={Wallet}
          variant={netProfit > 0 ? "primary" : "danger"}
        />
      </div>

      {/* Charts & Revenue Breakdown */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* TASK 4: Triple-Split Pie Chart */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Financial Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `PKR ${value.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Breakdown */}
        <div className="rounded-xl border border-border bg-card p-6 card-shadow">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Revenue Breakdown
          </h3>

          <div className="mb-6 text-center">
            <p className="text-sm text-muted-foreground">Total Revenue Collected</p>
            <p className="text-3xl font-bold text-foreground">
              PKR {totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-success/20 bg-success-light p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-success" />
                  <span className="text-sm font-medium text-success">Teacher Payouts</span>
                </div>
                <p className="text-lg font-bold text-success">
                  PKR {totalTeacherLiabilities.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-destructive/20 bg-red-50 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-destructive" />
                  <span className="text-sm font-medium text-destructive">Expenses</span>
                </div>
                <p className="text-lg font-bold text-destructive">
                  PKR {totalExpenses.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-primary/20 bg-primary-light p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium text-primary">Net Profit</span>
                </div>
                <p className="text-lg font-bold text-primary">
                  PKR {netProfit.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Payroll Table */}
      <div className="mt-6 rounded-xl border border-border bg-card card-shadow overflow-hidden">
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Teacher Payroll</h3>
            <p className="text-sm text-muted-foreground">Earnings based on collected fees</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{teacherPayroll.length} Teachers</span>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary hover:bg-secondary">
              <TableHead className="font-semibold">Teacher Name</TableHead>
              <TableHead className="font-semibold">Subject</TableHead>
              <TableHead className="font-semibold">Model</TableHead>
              <TableHead className="font-semibold text-right">Revenue</TableHead>
              <TableHead className="font-semibold text-right">Earned</TableHead>
              <TableHead className="font-semibold text-center">Classes</TableHead>
              <TableHead className="font-semibold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {teacherPayroll.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                  No active teachers found
                </TableCell>
              </TableRow>
            ) : (
              teacherPayroll.map((teacher: any) => (
                <TableRow key={teacher.teacherId} className="hover:bg-secondary/50">
                  <TableCell className="font-medium">{teacher.name}</TableCell>
                  <TableCell className="capitalize">{teacher.subject}</TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-medium capitalize">
                      {teacher.compensationType}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    PKR {teacher.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-green-600">
                      PKR {teacher.earnedAmount.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                      {teacher.classesCount}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => toast.success(`Payment voucher generated for ${teacher.name}`)}
                    >
                      <Wallet className="mr-2 h-3 w-3" />
                      Pay Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* TASK 3: Daily Expenses Section */}
      <div className="mt-6 rounded-xl border border-red-200 bg-red-50/50 p-6 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              Daily Expenses
            </h3>
            <p className="text-sm text-muted-foreground">Track operational costs</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">PKR {totalExpenses.toLocaleString()}</p>
          </div>
        </div>

        {/* Add Expense Form */}
        <div className="grid gap-4 sm:grid-cols-4 mb-6 p-4 rounded-lg border border-red-200 bg-white">
          <div className="space-y-2">
            <Label htmlFor="expense-title">Expense Title</Label>
            <Input
              id="expense-title"
              placeholder="e.g., Electricity Bill"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-category">Category</Label>
            <Select value={expenseCategory} onValueChange={setExpenseCategory}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Utilities">Utilities</SelectItem>
                <SelectItem value="Rent">Rent</SelectItem>
                <SelectItem value="Salaries">Salaries</SelectItem>
                <SelectItem value="Stationery">Stationery</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Misc">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="expense-amount">Amount (PKR)</Label>
            <Input
              id="expense-amount"
              type="number"
              placeholder="0"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleAddExpense}
              disabled={createExpenseMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {createExpenseMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
              ) : (
                <><Plus className="mr-2 h-4 w-4" /> Add Expense</>
              )}
            </Button>
          </div>
        </div>

        {/* Recent Expenses List */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground mb-3">Recent Expenses</h4>
          {expensesLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No expenses recorded yet
            </div>
          ) : (
            expenses.map((expense: any) => (
              <div
                key={expense._id}
                className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-white hover:bg-red-50/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-foreground">{expense.title}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                      {expense.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-red-600">
                    PKR {expense.amount.toLocaleString()}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-100"
                    onClick={() => deleteExpenseMutation.mutate(expense._id)}
                    disabled={deleteExpenseMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Finance;
