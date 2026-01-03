import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Filter, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const attendanceData = [
  { 
    id: 1,
    name: "John Doe",
    initials: "JD",
    department: "Engineering",
    checkIn: "9:00 AM",
    checkOut: "6:30 PM",
    hours: "9h 30m",
    status: "present"
  },
  { 
    id: 2,
    name: "Sarah Johnson",
    initials: "SJ",
    department: "Design",
    checkIn: "8:45 AM",
    checkOut: "5:45 PM",
    hours: "9h 00m",
    status: "present"
  },
  { 
    id: 3,
    name: "Michael Chen",
    initials: "MC",
    department: "Engineering",
    checkIn: "9:15 AM",
    checkOut: "-",
    hours: "-",
    status: "present"
  },
  { 
    id: 4,
    name: "Emily Davis",
    initials: "ED",
    department: "Marketing",
    checkIn: "-",
    checkOut: "-",
    hours: "-",
    status: "leave"
  },
  { 
    id: 5,
    name: "Alex Thompson",
    initials: "AT",
    department: "Engineering",
    checkIn: "-",
    checkOut: "-",
    hours: "-",
    status: "absent"
  },
  { 
    id: 6,
    name: "Lisa Wang",
    initials: "LW",
    department: "Design",
    checkIn: "9:30 AM",
    checkOut: "1:00 PM",
    hours: "3h 30m",
    status: "half-day"
  },
];

const statusConfig = {
  present: { label: "Present", icon: CheckCircle, class: "bg-chart-2 text-background" },
  absent: { label: "Absent", icon: XCircle, class: "bg-destructive text-destructive-foreground" },
  leave: { label: "On Leave", icon: AlertCircle, class: "bg-chart-4 text-background" },
  "half-day": { label: "Half-Day", icon: Clock, class: "bg-chart-1 text-background" },
};

const AdminAttendance = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Monitor and manage employee attendance.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">42</div>
            <div className="text-sm text-muted-foreground">Present Today</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">4</div>
            <div className="text-sm text-muted-foreground">On Leave</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">2</div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">87.5%</div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </div>
        </div>

        {/* Date and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input type="date" defaultValue="2026-01-03" className="w-auto" />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Attendance Table */}
        <div className="border-2 border-border bg-background">
          <div className="p-4 border-b-2 border-border">
            <h2 className="font-bold">January 3, 2026 - Friday</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-secondary">
                  <th className="text-left p-4 font-medium">Employee</th>
                  <th className="text-left p-4 font-medium">Department</th>
                  <th className="text-left p-4 font-medium">Check In</th>
                  <th className="text-left p-4 font-medium">Check Out</th>
                  <th className="text-left p-4 font-medium">Hours</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((row) => {
                  const status = statusConfig[row.status as keyof typeof statusConfig];
                  return (
                    <tr key={row.id} className="border-b border-border last:border-0">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {row.initials}
                          </div>
                          <span className="font-medium">{row.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{row.department}</td>
                      <td className="p-4">{row.checkIn}</td>
                      <td className="p-4">{row.checkOut}</td>
                      <td className="p-4">{row.hours}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${status.class}`}>
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
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

export default AdminAttendance;
