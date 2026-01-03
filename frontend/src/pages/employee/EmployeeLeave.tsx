import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const leaveBalance = [
  { type: "Paid Leave", total: 18, used: 6, remaining: 12 },
  { type: "Sick Leave", total: 10, used: 2, remaining: 8 },
  { type: "Personal Leave", total: 5, used: 1, remaining: 4 },
];

const leaveRequests = [
  { 
    id: 1,
    type: "Paid Leave", 
    startDate: "Jan 15, 2026", 
    endDate: "Jan 15, 2026", 
    days: 1,
    status: "pending",
    reason: "Personal work"
  },
  { 
    id: 2,
    type: "Sick Leave", 
    startDate: "Dec 27, 2025", 
    endDate: "Dec 27, 2025", 
    days: 1,
    status: "approved",
    reason: "Feeling unwell"
  },
  { 
    id: 3,
    type: "Paid Leave", 
    startDate: "Dec 20, 2025", 
    endDate: "Dec 24, 2025", 
    days: 5,
    status: "approved",
    reason: "Family vacation"
  },
  { 
    id: 4,
    type: "Personal Leave", 
    startDate: "Nov 15, 2025", 
    endDate: "Nov 15, 2025", 
    days: 1,
    status: "rejected",
    reason: "Appointment"
  },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, class: "bg-chart-4 text-background" },
  approved: { label: "Approved", icon: CheckCircle, class: "bg-chart-2 text-background" },
  rejected: { label: "Rejected", icon: XCircle, class: "bg-destructive text-destructive-foreground" },
};

const EmployeeLeave = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDialogOpen(false);
    toast({
      title: "Leave Request Submitted",
      description: "Your leave request has been sent for approval."
    });
  };

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">Apply for leave and track your requests.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Apply Leave
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Apply for Leave</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Leave Type</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input type="date" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea placeholder="Briefly describe the reason for leave..." required />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Request
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {leaveBalance.map((item, index) => (
            <div key={index} className="border-2 border-border bg-background p-6">
              <h3 className="font-bold mb-4">{item.type}</h3>
              <div className="flex items-end gap-4">
                <div>
                  <div className="text-3xl font-bold">{item.remaining}</div>
                  <div className="text-sm text-muted-foreground">Remaining</div>
                </div>
                <div className="flex-1 h-3 bg-secondary border border-border">
                  <div 
                    className="h-full bg-primary"
                    style={{ width: `${(item.remaining / item.total) * 100}%` }}
                  />
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{item.used}/{item.total}</div>
                  <div className="text-xs text-muted-foreground">Used</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Requests */}
        <div className="border-2 border-border bg-background">
          <div className="p-4 border-b-2 border-border">
            <h2 className="font-bold">Leave Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-secondary">
                  <th className="text-left p-4 font-medium">Type</th>
                  <th className="text-left p-4 font-medium">From</th>
                  <th className="text-left p-4 font-medium">To</th>
                  <th className="text-left p-4 font-medium">Days</th>
                  <th className="text-left p-4 font-medium">Reason</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaveRequests.map((request) => {
                  const status = statusConfig[request.status as keyof typeof statusConfig];
                  return (
                    <tr key={request.id} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium">{request.type}</td>
                      <td className="p-4">{request.startDate}</td>
                      <td className="p-4">{request.endDate}</td>
                      <td className="p-4">{request.days}</td>
                      <td className="p-4 text-muted-foreground">{request.reason}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${status.class}`}>
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeLeave;
