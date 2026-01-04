import { Button } from "@/components/ui/button";
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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    Loader2,
    Wallet,
    Info,
    CheckCircle2,
    TrendingUp,
    GraduationCap,
    DollarSign,
    Award,
    BookOpen,
    HelpCircle
} from "lucide-react";

interface Teacher {
    teacherId: string;
    name: string;
    subject: string;
    compensationType: string;
    revenue: number;
    earnedAmount: number;
    classesCount: number;
}

interface TeacherPayrollTableProps {
    teachers: Teacher[];
    filter: string;
    onFilterChange: (value: string) => void;
    onPay: (teacher: Teacher) => void;
    isPaying: boolean;
}

export const TeacherPayrollTable = ({
    teachers,
    filter,
    onFilterChange,
    onPay,
    isPaying,
}: TeacherPayrollTableProps) => {

    const filteredTeachers = teachers.filter(
        (teacher) => filter === "all" || teacher.teacherId === filter
    );

    const totalPending = filteredTeachers.reduce(
        (sum, t) => sum + (t.earnedAmount > 0 ? t.earnedAmount : 0),
        0
    );
    const totalPaid = filteredTeachers.filter(t => t.earnedAmount === 0).length;

    return (
        <div className="mt-6 rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-emerald-50/30 overflow-hidden card-shadow">
            {/* Header Section */}
            <div className="flex items-center justify-between border-b-2 border-green-200 bg-white p-5">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2 mb-1">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                        Teacher Payroll
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                    <p className="text-xs">Teacher earnings are calculated based on student fees collected from their classes</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </h3>
                    <p className="text-sm text-muted-foreground">Earnings based on collected fees</p>
                </div>

                {/* Summary Stats */}
                <div className="flex items-center gap-4">
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg px-4 py-2">
                        <p className="text-xs text-muted-foreground mb-0.5">Pending Payments</p>
                        <p className="text-lg font-bold text-yellow-600">PKR {totalPending.toLocaleString()}</p>
                    </div>
                    <div className="bg-green-50 border-2 border-green-200 rounded-lg px-4 py-2">
                        <p className="text-xs text-muted-foreground mb-0.5">Paid This Month</p>
                        <p className="text-lg font-bold text-green-600">{totalPaid} {totalPaid === 1 ? 'Teacher' : 'Teachers'}</p>
                    </div>

                    {/* Filter Dropdown */}
                    <div className="flex items-center gap-3 pl-3 border-l-2 border-gray-200">
                        <Select value={filter} onValueChange={onFilterChange}>
                            <SelectTrigger className="w-[200px] h-10 border-2 font-medium">
                                <SelectValue placeholder="Filter by Teacher" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    <span className="font-semibold">All Teachers</span>
                                </SelectItem>
                                {teachers.map((teacher) => (
                                    <SelectItem key={teacher.teacherId} value={teacher.teacherId}>
                                        {teacher.name} - {teacher.subject}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border-2 border-gray-200">
                            <Users className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-bold text-foreground">
                                {filteredTeachers.length} {filteredTeachers.length === 1 ? 'Teacher' : 'Teachers'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-green-50 hover:bg-green-50 border-b-2 border-green-200">
                            <TableHead className="font-bold text-foreground">
                                <div className="flex items-center gap-2">
                                    <GraduationCap className="h-4 w-4 text-green-600" />
                                    Teacher Name
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-foreground">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-4 w-4 text-green-600" />
                                    Subject
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-foreground">
                                <div className="flex items-center gap-2">
                                    <Award className="h-4 w-4 text-green-600" />
                                    Model
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-foreground text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <TrendingUp className="h-4 w-4 text-green-600" />
                                    Revenue
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                                <p className="text-xs">Total fees collected from students in this teacher's classes</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-foreground text-right">
                                <div className="flex items-center justify-end gap-1">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    Earned
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-xs">
                                                <p className="text-xs">Teacher's share based on their compensation model (after deducting already paid amounts)</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </TableHead>
                            <TableHead className="font-bold text-foreground text-center">Classes</TableHead>
                            <TableHead className="font-bold text-foreground text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTeachers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
                                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                    <p className="font-semibold">No teachers found</p>
                                    <p className="text-sm">Try adjusting your filter</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTeachers.map((teacher) => (
                                <TableRow
                                    key={teacher.teacherId}
                                    className={`hover:bg-green-50/50 transition-colors ${teacher.earnedAmount > 0 ? 'border-l-4 border-l-yellow-400' : 'border-l-4 border-l-green-400'
                                        }`}
                                >
                                    <TableCell className="font-semibold text-base">
                                        {teacher.name}
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium capitalize">
                                            {teacher.subject}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-sm font-medium capitalize">
                                            {teacher.compensationType}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className="text-base font-semibold text-muted-foreground">
                                            PKR {teacher.revenue.toLocaleString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <span className={`text-lg font-bold ${teacher.earnedAmount > 0 ? 'text-yellow-600' : 'text-green-600'
                                            }`}>
                                            PKR {teacher.earnedAmount.toLocaleString()}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-sm font-bold">
                                            {teacher.classesCount}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {teacher.earnedAmount <= 0 ? (
                                            <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 text-sm">
                                                <CheckCircle2 className="h-4 w-4 mr-1.5" />
                                                ✓ PAID
                                            </Badge>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="bg-green-600 hover:bg-green-700 font-semibold px-4 h-9"
                                                onClick={() => onPay(teacher)}
                                                disabled={isPaying}
                                            >
                                                {isPaying ? (
                                                    <>
                                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Wallet className="mr-2 h-4 w-4" />
                                                        Pay Now
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
