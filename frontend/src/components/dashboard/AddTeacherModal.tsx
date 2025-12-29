import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
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
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group";
import { User, DollarSign, Calendar } from "lucide-react";

interface AddTeacherModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    // Props passed from Configuration Page (Defaults)
    defaultMode?: "percentage" | "fixed";
    defaultTeacherShare?: string;
    defaultAcademyShare?: string;
    defaultFixedSalary?: string;
}

type CompensationType = "percentage" | "fixed" | "hybrid";

export const AddTeacherModal = ({
    open,
    onOpenChange,
    defaultMode = "percentage",
    defaultTeacherShare = "70",
    defaultAcademyShare = "30",
    defaultFixedSalary = "",
}: AddTeacherModalProps) => {

    // Local State to handle inputs independent of global props until saved
    const [compType, setCompType] = useState<CompensationType>(defaultMode);

    const [teacherShare, setTeacherShare] = useState(defaultTeacherShare);
    const [academyShare, setAcademyShare] = useState(defaultAcademyShare);
    const [fixedSalary, setFixedSalary] = useState(defaultFixedSalary);

    const [baseSalary, setBaseSalary] = useState("");
    const [bonusPercent, setBonusPercent] = useState("");

    // Sync Logic: Reset local state to global defaults when the modal opens
    useEffect(() => {
        if (open) {
            setCompType(defaultMode);
            setTeacherShare(defaultTeacherShare);
            setAcademyShare(defaultAcademyShare);
            setFixedSalary(defaultFixedSalary);
            // Reset hybrid fields
            setBaseSalary("");
            setBonusPercent("");
        }
    }, [open, defaultMode, defaultTeacherShare, defaultAcademyShare, defaultFixedSalary]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-card border-border text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg">
                            <User className="h-5 w-5 text-primary" />
                        </div>
                        Add New Teacher
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground">
                        Enter the teacher details. Compensation defaults are pre-filled from settings.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-6">
                    {/* Personal Details Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" placeholder="e.g. Dr. Sarah Ali" className="bg-background" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="+92 300 1234567" className="bg-background" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject Specialization</Label>
                            <Select>
                                <SelectTrigger className="bg-background">
                                    <SelectValue placeholder="Select Subject" />
                                </SelectTrigger>
                                <SelectContent className="bg-popover">
                                    <SelectItem value="biology">Biology</SelectItem>
                                    <SelectItem value="chemistry">Chemistry</SelectItem>
                                    <SelectItem value="physics">Physics</SelectItem>
                                    <SelectItem value="math">Mathematics</SelectItem>
                                    <SelectItem value="english">English</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Joining Date</Label>
                            <Input id="date" type="date" className="bg-background" />
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border my-2" />

                    {/* Compensation Section */}
                    <div className="space-y-4 bg-secondary/30 p-4 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-primary" />
                            <Label className="text-base font-medium">Compensation Package</Label>
                        </div>

                        <RadioGroup
                            value={compType}
                            onValueChange={(value) => setCompType(value as CompensationType)}
                            className="grid grid-cols-1 md:grid-cols-3 gap-3"
                        >
                            {/* Percentage Option */}
                            <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors bg-card">
                                <RadioGroupItem value="percentage" id="r1" className="text-primary" />
                                <Label htmlFor="r1" className="font-normal cursor-pointer w-full">
                                    Percentage
                                </Label>
                            </div>

                            {/* Fixed Salary Option */}
                            <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors bg-card">
                                <RadioGroupItem value="fixed" id="r2" className="text-primary" />
                                <Label htmlFor="r2" className="font-normal cursor-pointer w-full">
                                    Fixed Salary
                                </Label>
                            </div>

                            {/* Hybrid Option */}
                            <div className="flex items-center space-x-2 border border-border rounded-lg p-3 cursor-pointer hover:border-primary/50 transition-colors bg-card">
                                <RadioGroupItem value="hybrid" id="r3" className="text-primary" />
                                <Label htmlFor="r3" className="font-normal cursor-pointer w-full">
                                    Hybrid
                                </Label>
                            </div>
                        </RadioGroup>

                        {/* Dynamic Fields based on Selection */}
                        <div className="grid gap-4 mt-4 animate-fade-in">
                            {compType === "percentage" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Teacher Share (%)</Label>
                                        <Input
                                            type="number"
                                            value={teacherShare}
                                            onChange={(e) => setTeacherShare(e.target.value)}
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Academy Share (%)</Label>
                                        <Input
                                            type="number"
                                            value={academyShare}
                                            onChange={(e) => setAcademyShare(e.target.value)}
                                            className="bg-background"
                                        />
                                    </div>
                                </div>
                            )}

                            {compType === "fixed" && (
                                <div className="space-y-2">
                                    <Label className="text-sm text-muted-foreground">Monthly Salary (PKR)</Label>
                                    <Input
                                        type="number"
                                        placeholder="e.g. 50000"
                                        value={fixedSalary}
                                        onChange={(e) => setFixedSalary(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                            )}

                            {compType === "hybrid" && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Base Salary (PKR)</Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 25000"
                                            value={baseSalary}
                                            onChange={(e) => setBaseSalary(e.target.value)}
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm text-muted-foreground">Bonus (%)</Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 10"
                                            value={bonusPercent}
                                            onChange={(e) => setBonusPercent(e.target.value)}
                                            className="bg-background"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button className="header-gradient text-white hover:opacity-90">
                        Add Teacher
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};