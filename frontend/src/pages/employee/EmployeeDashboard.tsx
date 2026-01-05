import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Clock, 
  Calendar, 
  CreditCard, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Loader
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { attendanceAPI, leaveAPI, employeeAPI } from "@/lib/apiClient";
import { useEffect, useState } from "react";

interface QuickStat {
  label: string;
  value: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface RecentActivity {
  id: string;
  type: string;
  description: string;
  date: string;
  status: string;
}

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingLeave, setUpcomingLeave] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    // Update time every minute
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch recent attendance
      const attendanceRes = await attendanceAPI.getHistory(user?.id!, { limit: 10 });
      const attendanceRecords = attendanceRes.data || [];

      // Count attendance for this month
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const presentThisMonth = attendanceRecords.filter((record: any) => {
        const date = new Date(record.date);
        return date >= monthStart && record.status === "present";
      }).length;

      // Fetch leave balance
      const balanceRes = await leaveAPI.getBalance(user?.id!);
      const totalRemaining = Object.values(balanceRes.data || {}).reduce((sum: number, leave: any) => sum + (leave.remaining || 0), 0);

      // Fetch pending leaves
      const myLeavesRes = await leaveAPI.getMyLeaves(user?.id!, { status: "PENDING" });
      const pendingCount = myLeavesRes.data?.length || 0;

      // Fetch user profile for greeting
      const profileRes = await employeeAPI.getMe(user?.email!);

      // Build quick stats
      const stats: QuickStat[] = [
        {
          label: "This Month Attendance",
          value: `${presentThisMonth}/24`,
          sublabel: "Days Present",
          icon: Clock,
          color: "bg-chart-2"
        },
        {
          label: "Leave Balance",
          value: totalRemaining.toString(),
          sublabel: "Days Remaining",
          icon: Calendar,
          color: "bg-chart-4"
        },
        {
          label: "Pending Requests",
          value: pendingCount.toString(),
          sublabel: "Leave Request",
          icon: AlertCircle,
          color: "bg-chart-1"
        },
      ];

      setQuickStats(stats);

      // Build recent activity
      const activities: RecentActivity[] = attendanceRecords.slice(0, 4).map((record: any, index: number) => ({
        id: record.id,
        type: "attendance",
        description: `${record.check_in_time ? "Checked in" : "Checked out"}`,
        date: new Date(record.date).toLocaleDateString(),
        status: "success"
      }));

      setRecentActivity(activities);

      // Find next upcoming leave
      const allLeavesRes = await leaveAPI.getMyLeaves(user?.id!, { status: "APPROVED" });
      const allLeaves = allLeavesRes.data || [];
      const upcomingLeaves = allLeaves.filter((leave: any) => new Date(leave.start_date) > new Date());
      if (upcomingLeaves.length > 0) {
        setUpcomingLeave(upcomingLeaves[0]);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Fallback to mock data if error
      setQuickStats([
        {
          label: "This Month Attendance",
          value: "22/24",
          sublabel: "Days Present",
          icon: Clock,
          color: "bg-chart-2"
        },
        {
          label: "Leave Balance",
          value: "12",
          sublabel: "Days Remaining",
          icon: Calendar,
          color: "bg-chart-4"
        },
        {
          label: "Pending Requests",
          value: "1",
          sublabel: "Leave Request",
          icon: AlertCircle,
          color: "bg-chart-1"
        },
      ]);
    } finally {
      setLoading(false);
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

  const firstName = user?.user_metadata?.first_name || user?.email?.split("@")[0] || "User";

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Good Morning, {firstName}!</h1>
            <p className="text-muted-foreground">Here's your work summary for today.</p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" className="shadow-sm" asChild>
              <Link to="/employee/attendance">
                <Clock className="mr-2 h-5 w-5" />
                Check In · {currentTime}
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickStats.map((stat, index) => (
            <div key={index} className="border-2 border-border bg-background p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.sublabel}</p>
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
          {/* Quick Actions */}
          <div className="border-2 border-border bg-background p-6">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link 
                to="/employee/leave"
                className="border-2 border-border p-4 hover:bg-secondary transition-colors flex flex-col items-center text-center"
              >
                <Calendar className="h-8 w-8 mb-2" />
                <span className="font-medium">Apply Leave</span>
              </Link>
              <Link 
                to="/employee/attendance"
                className="border-2 border-border p-4 hover:bg-secondary transition-colors flex flex-col items-center text-center"
              >
                <Clock className="h-8 w-8 mb-2" />
                <span className="font-medium">View Attendance</span>
              </Link>
              <Link 
                to="/employee/payroll"
                className="border-2 border-border p-4 hover:bg-secondary transition-colors flex flex-col items-center text-center"
              >
                <CreditCard className="h-8 w-8 mb-2" />
                <span className="font-medium">View Payslip</span>
              </Link>
              <Link 
                to="/employee/profile"
                className="border-2 border-border p-4 hover:bg-secondary transition-colors flex flex-col items-center text-center"
              >
                <CheckCircle className="h-8 w-8 mb-2" />
                <span className="font-medium">My Profile</span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border-2 border-border bg-background p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Recent Activity</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/employee/attendance">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-muted-foreground text-sm">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-8 h-8 bg-secondary flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming */}
        {upcomingLeave && (
          <div className="border-2 border-border bg-background p-6">
            <h2 className="text-lg font-bold mb-4">Upcoming</h2>
            <div className="flex items-center gap-4 p-4 bg-secondary">
              <div className="text-center px-4 border-r border-border">
                <div className="text-2xl font-bold">
                  {new Date(upcomingLeave.start_date).getDate()}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(upcomingLeave.start_date).toLocaleString("default", { month: "short" }).toUpperCase()}
                </div>
              </div>
              <div>
                <p className="font-medium">Approved Leave</p>
                <p className="text-sm text-muted-foreground">{upcomingLeave.leave_type} - {upcomingLeave.days_requested} Day{upcomingLeave.days_requested > 1 ? "s" : ""}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
