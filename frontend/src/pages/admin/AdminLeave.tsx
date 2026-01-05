import DashboardLayout from "@/components/layout/DashboardLayout";
import { CheckCircle, XCircle, Clock, Filter, Search, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { leaveAPI } from "@/lib/apiClient";

interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: string;
  reason?: string;
  created_at?: string;
  employees?: {
    first_name: string;
    last_name: string;
  };
}

const statusConfig = {
  PENDING: { label: "Pending", icon: Clock, class: "bg-chart-4 text-background" },
  APPROVED: { label: "Approved", icon: CheckCircle, class: "bg-chart-2 text-background" },
  REJECTED: { label: "Rejected", icon: XCircle, class: "bg-destructive text-destructive-foreground" },
};

const AdminLeave = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<LeaveRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    onLeaveToday: 0,
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  useEffect(() => {
    const filtered = leaveRequests.filter((req) => {
      const employeeName =
        `${req.employees?.first_name} ${req.employees?.last_name}`.toLowerCase();
      return employeeName.includes(searchTerm.toLowerCase());
    });
    setFilteredRequests(filtered);
  }, [searchTerm, leaveRequests]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const res = await leaveAPI.getReport();
      const allLeaves = res.data || [];
      setLeaveRequests(allLeaves);
      setFilteredRequests(allLeaves);

      // Calculate stats
      setStats({
        pending: allLeaves.filter((l: LeaveRequest) => l.status === "PENDING").length,
        approved: allLeaves.filter((l: LeaveRequest) => l.status === "APPROVED").length,
        rejected: allLeaves.filter((l: LeaveRequest) => l.status === "REJECTED").length,
        onLeaveToday: 0, // Would need to check if leave dates include today
      });
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await leaveAPI.updateStatus(id, "APPROVED");
      toast({
        title: "Leave Approved",
        description: "The leave request has been approved successfully.",
      });
      fetchLeaveRequests();
    } catch (error) {
      console.error("Error approving leave:", error);
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await leaveAPI.updateStatus(id, "REJECTED");
      toast({
        title: "Leave Rejected",
        description: "The leave request has been rejected.",
      });
      fetchLeaveRequests();
    } catch (error) {
      console.error("Error rejecting leave:", error);
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="flex items-center justify-center h-96">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Leave Requests</h1>
          <p className="text-muted-foreground">Review and manage employee leave requests.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">{stats.rejected}</div>
            <div className="text-sm text-muted-foreground">Rejected</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">{stats.onLeaveToday}</div>
            <div className="text-sm text-muted-foreground">On Leave Today</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee name..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Leave Requests Table */}
        <div className="border-2 border-border bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-secondary">
                  <th className="text-left p-4 font-medium">Employee</th>
                  <th className="text-left p-4 font-medium">Leave Type</th>
                  <th className="text-left p-4 font-medium">Duration</th>
                  <th className="text-left p-4 font-medium">Days</th>
                  <th className="text-left p-4 font-medium">Reason</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-muted-foreground">
                      No leave requests found
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((request) => {
                    const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.PENDING;
                    const initials = `${request.employees?.first_name?.[0] || ""}${request.employees?.last_name?.[0] || ""}`.toUpperCase();
                    const appliedDate = request.created_at
                      ? new Date(request.created_at).toLocaleDateString()
                      : "N/A";

                    return (
                      <tr key={request.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-medium">
                                {request.employees?.first_name} {request.employees?.last_name}
                              </div>
                              <div className="text-xs text-muted-foreground">Applied: {appliedDate}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{request.leave_type}</td>
                        <td className="p-4">
                          <div>{request.start_date}</div>
                          {request.start_date !== request.end_date && (
                            <div className="text-sm text-muted-foreground">to {request.end_date}</div>
                          )}
                        </td>
                        <td className="p-4">{request.days_requested}</td>
                        <td className="p-4 max-w-[200px]">
                          <p className="truncate text-muted-foreground">{request.reason || "N/A"}</p>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${status.class}`}>
                            <status.icon className="h-3 w-3" />
                            {status.label}
                          </span>
                        </td>
                        <td className="p-4">
                          {request.status === "PENDING" ? (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleReject(request.id)}
                                className="w-8 h-8 p-0"
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleApprove(request.id)}
                                className="w-8 h-8 p-0"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">-</span>
                          )}
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

export default AdminLeave;
