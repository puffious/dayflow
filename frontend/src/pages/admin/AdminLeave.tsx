import DashboardLayout from "@/components/layout/DashboardLayout";
import { CheckCircle, XCircle, Clock, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const leaveRequests = [
  { 
    id: 1,
    employee: "Sarah Johnson",
    initials: "SJ",
    type: "Sick Leave", 
    startDate: "Jan 6, 2026", 
    endDate: "Jan 7, 2026", 
    days: 2,
    status: "pending",
    reason: "Not feeling well, need to rest",
    appliedOn: "Jan 5, 2026"
  },
  { 
    id: 2,
    employee: "Michael Chen",
    initials: "MC",
    type: "Personal Leave", 
    startDate: "Jan 10, 2026", 
    endDate: "Jan 10, 2026", 
    days: 1,
    status: "pending",
    reason: "Personal appointment",
    appliedOn: "Jan 4, 2026"
  },
  { 
    id: 3,
    employee: "Emily Davis",
    initials: "ED",
    type: "Paid Leave", 
    startDate: "Jan 15, 2026", 
    endDate: "Jan 18, 2026", 
    days: 4,
    status: "pending",
    reason: "Family vacation",
    appliedOn: "Jan 3, 2026"
  },
  { 
    id: 4,
    employee: "John Doe",
    initials: "JD",
    type: "Paid Leave", 
    startDate: "Jan 15, 2026", 
    endDate: "Jan 15, 2026", 
    days: 1,
    status: "approved",
    reason: "Personal work",
    appliedOn: "Jan 2, 2026"
  },
  { 
    id: 5,
    employee: "Alex Thompson",
    initials: "AT",
    type: "Sick Leave", 
    startDate: "Dec 28, 2025", 
    endDate: "Dec 28, 2025", 
    days: 1,
    status: "approved",
    reason: "Doctor's appointment",
    appliedOn: "Dec 27, 2025"
  },
];

const statusConfig = {
  pending: { label: "Pending", icon: Clock, class: "bg-chart-4 text-background" },
  approved: { label: "Approved", icon: CheckCircle, class: "bg-chart-2 text-background" },
  rejected: { label: "Rejected", icon: XCircle, class: "bg-destructive text-destructive-foreground" },
};

const AdminLeave = () => {
  const { toast } = useToast();

  const handleApprove = (id: number) => {
    toast({
      title: "Leave Approved",
      description: "The leave request has been approved successfully."
    });
  };

  const handleReject = (id: number) => {
    toast({
      title: "Leave Rejected",
      description: "The leave request has been rejected."
    });
  };

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
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">28</div>
            <div className="text-sm text-muted-foreground">Approved (This Month)</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Rejected (This Month)</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-muted-foreground">On Leave Today</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search by employee name..." className="pl-10" />
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
                {leaveRequests.map((request) => {
                  const status = statusConfig[request.status as keyof typeof statusConfig];
                  return (
                    <tr key={request.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {request.initials}
                          </div>
                          <div>
                            <div className="font-medium">{request.employee}</div>
                            <div className="text-xs text-muted-foreground">Applied: {request.appliedOn}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{request.type}</td>
                      <td className="p-4">
                        <div>{request.startDate}</div>
                        {request.startDate !== request.endDate && (
                          <div className="text-sm text-muted-foreground">to {request.endDate}</div>
                        )}
                      </td>
                      <td className="p-4">{request.days}</td>
                      <td className="p-4 max-w-[200px]">
                        <p className="truncate text-muted-foreground">{request.reason}</p>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${status.class}`}>
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4">
                        {request.status === "pending" ? (
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
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminLeave;
