import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Users, 
  Clock, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  Loader
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { leaveAPI, employeeAPI } from "@/lib/apiClient";

interface LeaveRequest {
  id: string;
  employee_id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days_requested: number;
  status: string;
  employees?: {
    first_name: string;
    last_name: string;
  };
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  position: string;
  department: string;
  created_at?: string;
}

interface DailyAttendance {
  present: number;
  absent: number;
  late: number;
  total: number;
}

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<LeaveRequest[]>([]);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [dailyAttendance, setDailyAttendance] = useState<DailyAttendance>({
    present: 0,
    absent: 0,
    late: 0,
    total: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch employees
        const employeesRes = await employeeAPI.getAll();
        const totalEmployees = employeesRes.data?.length || 0;

        setRecentEmployees((employeesRes.data || []).slice(0, 3));

        // Fetch pending leaves
        const leavesRes = await leaveAPI.getPending();
        setPendingLeaves((leavesRes.data || []).slice(0, 5));

        // Fetch today's attendance
        const today = new Date().toISOString().split("T")[0];
        // Note: This endpoint needs to be created in backend
        // For now, we'll use mock data
        const attendanceRes = await fetch(
          `/api/attendance/daily/${today}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        ).then((r) => r.json());

        setDailyAttendance(
          attendanceRes.summary || {
            present: 0,
            absent: 0,
            late: 0,
            total: totalEmployees,
          }
        );

        // Build stats
        const newStats = [
          {
            label: "Total Employees",
            value: totalEmployees.toString(),
            change: "+3 this month",
            icon: Users,
            color: "bg-chart-3",
          },
          {
            label: "Present Today",
            value: attendanceRes.summary?.present || "0",
            change: `${Math.round((attendanceRes.summary?.present / totalEmployees) * 100)}%`,
            icon: Clock,
            color: "bg-chart-2",
          },
          {
            label: "Pending Leave",
            value: (leavesRes.data?.length || 0).toString(),
            change: "Needs review",
            icon: Calendar,
            color: "bg-chart-1",
          },
          {
            label: "On Leave Today",
            value: (attendanceRes.summary?.absent || 0).toString(),
            change: "2 planned",
            icon: AlertCircle,
            color: "bg-chart-4",
          },
        ];

        setStats(newStats);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Keep mock data if fetch fails
        setStats([
          {
            label: "Total Employees",
            value: "48",
            change: "+3 this month",
            icon: Users,
            color: "bg-chart-3",
          },
          {
            label: "Present Today",
            value: "42",
            change: "87.5%",
            icon: Clock,
            color: "bg-chart-2",
          },
          {
            label: "Pending Leave",
            value: "5",
            change: "Needs review",
            icon: Calendar,
            color: "bg-chart-1",
          },
          {
            label: "On Leave Today",
            value: "4",
            change: "2 planned",
            icon: AlertCircle,
            color: "bg-chart-4",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleApproveLeave = async (leaveId: string) => {
    try {
      await leaveAPI.updateStatus(leaveId, "APPROVED");
      setPendingLeaves(pendingLeaves.filter((l) => l.id !== leaveId));
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejectLeave = async (leaveId: string) => {
    try {
      await leaveAPI.updateStatus(leaveId, "REJECTED");
      setPendingLeaves(pendingLeaves.filter((l) => l.id !== leaveId));
    } catch (error) {
      console.error("Error rejecting leave:", error);
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
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Overview of your organization's HR operations.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link to="/admin/employees">
                View All Employees
              </Link>
            </Button>
            <Button asChild>
              <Link to="/admin/employees">
                Add Employee
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="border-2 border-border bg-background p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    {stat.label === "Total Employees" && <TrendingUp className="h-3 w-3" />}
                    {stat.change}
                  </p>
                </div>
                <div className={`w-12 h-12 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-background" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Leave Requests */}
          <div className="border-2 border-border bg-background p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Pending Leave Requests ({pendingLeaves.length})</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/leave">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {pendingLeaves.length === 0 ? (
                <p className="text-muted-foreground text-sm">No pending leave requests</p>
              ) : (
                pendingLeaves.map((request) => {
                  const initials = `${request.employees?.first_name?.[0] || ""}${request.employees?.last_name?.[0] || ""}`.toUpperCase();
                  const employeeName = `${request.employees?.first_name} ${request.employees?.last_name}`;
                  return (
                    <div key={request.id} className="flex items-center gap-4 p-4 border-2 border-border">
                      <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{employeeName}</p>
                        <p className="text-sm text-muted-foreground">
                          {request.leave_type} · {request.start_date} to {request.end_date} · {request.days_requested} days
                        </p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-9 h-9 p-0"
                          onClick={() => handleRejectLeave(request.id)}
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="w-9 h-9 p-0"
                          onClick={() => handleApproveLeave(request.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Employees */}
          <div className="border-2 border-border bg-background p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Recent Employees</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/employees">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {recentEmployees.map((employee) => {
                const initials = `${employee.first_name?.[0] || ""}${employee.last_name?.[0] || ""}`.toUpperCase();
                return (
                  <div key={employee.id} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-10 h-10 bg-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{employee.first_name} {employee.last_name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {employee.position} · {employee.department}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground flex-shrink-0">
                      {new Date().toLocaleDateString()}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Attendance Overview */}
        <div className="border-2 border-border bg-background p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Today's Attendance Overview</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/attendance">
                View Details <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-secondary text-center">
              <div className="text-2xl font-bold">{dailyAttendance.present || 0}</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </div>
            <div className="p-4 bg-secondary text-center">
              <div className="text-2xl font-bold">{dailyAttendance.absent || 0}</div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </div>
            <div className="p-4 bg-secondary text-center">
              <div className="text-2xl font-bold">{dailyAttendance.late || 0}</div>
              <div className="text-sm text-muted-foreground">Late</div>
            </div>
            <div className="p-4 bg-secondary text-center">
              <div className="text-2xl font-bold">{dailyAttendance.total || 0}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
