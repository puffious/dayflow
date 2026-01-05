import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Calendar, Plus, CheckCircle, XCircle, Clock, Loader } from "lucide-react";
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
import { useAuth } from "@/context/AuthContext";
import { leaveAPI } from "@/lib/apiClient";

interface LeaveBalance {
  SICK: { total: number; used: number; remaining: number };
  CASUAL: { total: number; used: number; remaining: number };
  VACATION: { total: number; used: number; remaining: number };
  OTHERS: { total: number; used: number; remaining: number };
}

interface LeaveRequest {
  id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: string;
  reason?: string;
  created_at?: string;
}

const statusConfig = {
  PENDING: { label: "Pending", icon: Clock, class: "bg-chart-4 text-background" },
  APPROVED: { label: "Approved", icon: CheckCircle, class: "bg-chart-2 text-background" },
  REJECTED: { label: "Rejected", icon: XCircle, class: "bg-destructive text-destructive-foreground" },
};

const leaveTypeLabels: Record<string, string> = {
  SICK: "Sick Leave",
  CASUAL: "Casual Leave",
  VACATION: "Vacation",
  OTHERS: "Other Leave",
};

const EmployeeLeave = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>({
    SICK: { total: 5, used: 0, remaining: 5 },
    CASUAL: { total: 10, used: 0, remaining: 10 },
    VACATION: { total: 15, used: 0, remaining: 15 },
    OTHERS: { total: 5, used: 0, remaining: 5 },
  });
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    leave_type: "CASUAL",
    start_date: "",
    end_date: "",
    reason: "",
  });

  useEffect(() => {
    if (user?.id) {
      fetchLeaveData();
    }
  }, [user?.id]);

  const fetchLeaveData = async () => {
    try {
      setLoading(true);
      const [balanceRes, requestsRes] = await Promise.all([
        leaveAPI.getBalance(user?.id!),
        leaveAPI.getMyLeaves(user?.id!),
      ]);

      setLeaveBalance(balanceRes.data || leaveBalance);
      setLeaveRequests(requestsRes.data || []);
    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.start_date || !formData.end_date || !formData.reason.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await leaveAPI.request({
        employee_id: user?.id,
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
      });

      toast({
        title: "Leave Request Submitted",
        description: "Your leave request has been sent for approval.",
      });

      setIsDialogOpen(false);
      setFormData({
        leave_type: "CASUAL",
        start_date: "",
        end_date: "",
        reason: "",
      });

      fetchLeaveData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to submit leave request",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="employee">
        <div className="flex items-center justify-center h-96">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const balanceArray = [
    { type: "Sick Leave", key: "SICK", ...leaveBalance.SICK },
    { type: "Casual Leave", key: "CASUAL", ...leaveBalance.CASUAL },
    { type: "Vacation", key: "VACATION", ...leaveBalance.VACATION },
  ];

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
                  <Select value={formData.leave_type} onValueChange={(value) => setFormData({...formData, leave_type: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SICK">Sick Leave</SelectItem>
                      <SelectItem value="CASUAL">Casual Leave</SelectItem>
                      <SelectItem value="VACATION">Vacation</SelectItem>
                      <SelectItem value="OTHERS">Other Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Reason</Label>
                  <Textarea
                    placeholder="Briefly describe the reason for leave..."
                    value={formData.reason}
                    onChange={(e) => setFormData({...formData, reason: e.target.value})}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Leave Balance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {balanceArray.map((item, index) => (
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
                {leaveRequests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                      No leave requests yet
                    </td>
                  </tr>
                ) : (
                  leaveRequests.map((request) => {
                    const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.PENDING;
                    return (
                      <tr key={request.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                        <td className="p-4 font-medium">{leaveTypeLabels[request.leave_type] || request.leave_type}</td>
                        <td className="p-4">{request.start_date}</td>
                        <td className="p-4">{request.end_date}</td>
                        <td className="p-4">{request.days_requested}</td>
                        <td className="p-4 text-muted-foreground max-w-[200px] truncate">{request.reason || "N/A"}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${status.class}`}>
                            <status.icon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeLeave;
