import DashboardLayout from "@/components/layout/DashboardLayout";
import { 
  Clock, 
  Calendar, 
  CreditCard, 
  CheckCircle,
  AlertCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const quickStats = [
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
];

const recentActivity = [
  { 
    type: "check-in", 
    description: "Checked in at 9:00 AM", 
    date: "Today",
    status: "success"
  },
  { 
    type: "leave", 
    description: "Leave request approved", 
    date: "Yesterday",
    status: "success"
  },
  { 
    type: "payroll", 
    description: "December salary credited", 
    date: "Dec 31, 2025",
    status: "success"
  },
  { 
    type: "check-out", 
    description: "Checked out at 6:30 PM", 
    date: "Dec 30, 2025",
    status: "success"
  },
];

const EmployeeDashboard = () => {
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Good Morning, John!</h1>
            <p className="text-muted-foreground">Here's your work summary for today.</p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" className="shadow-sm">
              <Clock className="mr-2 h-5 w-5" />
              Check In · {currentTime}
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
              <Button variant="ghost" size="sm">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="w-8 h-8 bg-secondary flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="border-2 border-border bg-background p-6">
          <h2 className="text-lg font-bold mb-4">Upcoming</h2>
          <div className="flex items-center gap-4 p-4 bg-secondary">
            <div className="text-center px-4 border-r border-border">
              <div className="text-2xl font-bold">15</div>
              <div className="text-xs text-muted-foreground">JAN</div>
            </div>
            <div>
              <p className="font-medium">Approved Leave</p>
              <p className="text-sm text-muted-foreground">Personal Leave - Full Day</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
