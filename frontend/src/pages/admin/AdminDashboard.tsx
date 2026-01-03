import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Users, 
  Clock, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  { 
    label: "Total Employees", 
    value: "48", 
    change: "+3 this month",
    icon: Users,
    color: "bg-chart-3"
  },
  { 
    label: "Present Today", 
    value: "42", 
    change: "87.5%",
    icon: Clock,
    color: "bg-chart-2"
  },
  { 
    label: "Pending Leave", 
    value: "5", 
    change: "Needs review",
    icon: Calendar,
    color: "bg-chart-1"
  },
  { 
    label: "On Leave Today", 
    value: "4", 
    change: "2 planned",
    icon: AlertCircle,
    color: "bg-chart-4"
  },
];

const pendingLeaveRequests = [
  { 
    employee: "Sarah Johnson", 
    type: "Sick Leave", 
    dates: "Jan 6-7, 2026",
    days: 2,
    initials: "SJ"
  },
  { 
    employee: "Michael Chen", 
    type: "Personal Leave", 
    dates: "Jan 10, 2026",
    days: 1,
    initials: "MC"
  },
  { 
    employee: "Emily Davis", 
    type: "Paid Leave", 
    dates: "Jan 15-18, 2026",
    days: 4,
    initials: "ED"
  },
];

const recentEmployees = [
  { name: "Alex Thompson", role: "Software Engineer", department: "Engineering", date: "Jan 2, 2026", initials: "AT" },
  { name: "Lisa Wang", role: "Product Designer", department: "Design", date: "Dec 28, 2025", initials: "LW" },
  { name: "James Miller", role: "Marketing Manager", department: "Marketing", date: "Dec 20, 2025", initials: "JM" },
];

const AdminDashboard = () => {
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
              <h2 className="text-lg font-bold">Pending Leave Requests</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/leave">
                  View All <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {pendingLeaveRequests.map((request, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border-2 border-border">
                  <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {request.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{request.employee}</p>
                    <p className="text-sm text-muted-foreground">
                      {request.type} · {request.dates} · {request.days} day{request.days > 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" className="w-9 h-9 p-0">
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="w-9 h-9 p-0">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
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
              {recentEmployees.map((employee, index) => (
                <div key={index} className="flex items-center gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-10 h-10 bg-secondary flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {employee.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{employee.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {employee.role} · {employee.department}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground flex-shrink-0">
                    {employee.date}
                  </div>
                </div>
              ))}
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
              <div className="text-2xl font-bold">42</div>
              <div className="text-sm text-muted-foreground">Present</div>
            </div>
            <div className="p-4 bg-secondary text-center">
              <div className="text-2xl font-bold">4</div>
              <div className="text-sm text-muted-foreground">On Leave</div>
            </div>
            <div className="p-4 bg-secondary text-center">
              <div className="text-2xl font-bold">2</div>
              <div className="text-sm text-muted-foreground">Absent</div>
            </div>
            <div className="p-4 bg-secondary text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-sm text-muted-foreground">Half-Day</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
