import DashboardLayout from "@/components/layout/DashboardLayout";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const attendanceData = [
  { date: "Jan 3, 2026", day: "Friday", checkIn: "9:00 AM", checkOut: "6:30 PM", status: "present", hours: "9h 30m" },
  { date: "Jan 2, 2026", day: "Thursday", checkIn: "9:15 AM", checkOut: "6:00 PM", status: "present", hours: "8h 45m" },
  { date: "Jan 1, 2026", day: "Wednesday", checkIn: "-", checkOut: "-", status: "holiday", hours: "-" },
  { date: "Dec 31, 2025", day: "Tuesday", checkIn: "8:45 AM", checkOut: "5:30 PM", status: "present", hours: "8h 45m" },
  { date: "Dec 30, 2025", day: "Monday", checkIn: "9:00 AM", checkOut: "6:30 PM", status: "present", hours: "9h 30m" },
  { date: "Dec 27, 2025", day: "Friday", checkIn: "-", checkOut: "-", status: "leave", hours: "-" },
  { date: "Dec 26, 2025", day: "Thursday", checkIn: "9:30 AM", checkOut: "1:00 PM", status: "half-day", hours: "3h 30m" },
];

const statusConfig = {
  present: { label: "Present", icon: CheckCircle, class: "bg-chart-2 text-background" },
  absent: { label: "Absent", icon: XCircle, class: "bg-destructive text-destructive-foreground" },
  leave: { label: "Leave", icon: AlertCircle, class: "bg-chart-4 text-background" },
  "half-day": { label: "Half-Day", icon: Clock, class: "bg-chart-1 text-background" },
  holiday: { label: "Holiday", icon: CheckCircle, class: "bg-muted text-muted-foreground" },
};

const EmployeeAttendance = () => {
  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Attendance</h1>
            <p className="text-muted-foreground">Track your daily attendance and work hours.</p>
          </div>
          <Button size="lg" className="shadow-sm">
            <Clock className="mr-2 h-5 w-5" />
            Check In
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-border bg-background p-4">
            <div className="text-sm text-muted-foreground">Present Days</div>
            <div className="text-2xl font-bold">22</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-sm text-muted-foreground">On Leave</div>
            <div className="text-2xl font-bold">1</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-sm text-muted-foreground">Half Days</div>
            <div className="text-2xl font-bold">1</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-sm text-muted-foreground">Avg. Hours</div>
            <div className="text-2xl font-bold">8h 45m</div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="border-2 border-border bg-background">
          <div className="p-4 border-b-2 border-border">
            <h2 className="font-bold">January 2026</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-secondary">
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Day</th>
                  <th className="text-left p-4 font-medium">Check In</th>
                  <th className="text-left p-4 font-medium">Check Out</th>
                  <th className="text-left p-4 font-medium">Hours</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((row, index) => {
                  const status = statusConfig[row.status as keyof typeof statusConfig];
                  return (
                    <tr key={index} className="border-b border-border last:border-0">
                      <td className="p-4 font-medium">{row.date}</td>
                      <td className="p-4 text-muted-foreground">{row.day}</td>
                      <td className="p-4">{row.checkIn}</td>
                      <td className="p-4">{row.checkOut}</td>
                      <td className="p-4">{row.hours}</td>
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

export default EmployeeAttendance;
