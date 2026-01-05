import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Filter, CheckCircle, XCircle, Clock, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { attendanceAPI } from "@/lib/apiClient";

interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  total_hours?: number;
  status: string;
  employees?: {
    first_name: string;
    last_name: string;
    department: string;
  };
}

const statusConfig = {
  present: { label: "Present", icon: CheckCircle, class: "bg-chart-2 text-background" },
  absent: { label: "Absent", icon: XCircle, class: "bg-destructive text-destructive-foreground" },
  leave: { label: "On Leave", icon: AlertCircle, class: "bg-chart-4 text-background" },
  "half-day": { label: "Half-Day", icon: Clock, class: "bg-chart-1 text-background" },
};

const AdminAttendance = () => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [filteredData, setFilteredData] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState({ present: 0, absent: 0, late: 0, total: 0 });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDailyAttendance();
  }, [selectedDate]);

  useEffect(() => {
    const filtered = attendanceData.filter((record) => {
      const employeeName =
        `${record.employees?.first_name} ${record.employees?.last_name}`.toLowerCase();
      return (
        employeeName.includes(searchTerm.toLowerCase()) ||
        record.employees?.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredData(filtered);
  }, [searchTerm, attendanceData]);

  const fetchDailyAttendance = async () => {
    try {
      setLoading(true);
      const res = await attendanceAPI.getDaily(selectedDate);
      setAttendanceData(res.data?.records || []);
      setSummary(res.data?.summary || { present: 0, absent: 0, late: 0, total: 0 });
      setFilteredData(res.data?.records || []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return "-";
    try {
      return new Date(timeString).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "-";
    }
  };

  const formatHours = (hours?: number) => {
    if (!hours) return "-";
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getStatusFromRecord = (record: AttendanceRecord) => {
    if (!record.check_in_time) return "absent";
    if (!record.check_out_time) return "present";
    if (record.total_hours && record.total_hours < 8) return "half-day";
    return "present";
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

  const displayDate = new Date(selectedDate);
  const formattedDate = displayDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

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
            <div className="text-2xl font-bold">{summary.present}</div>
            <div className="text-sm text-muted-foreground">Present Today</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">{summary.absent}</div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">{summary.late}</div>
            <div className="text-sm text-muted-foreground">Late</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-2xl font-bold">
              {summary.total > 0 ? Math.round((summary.present / summary.total) * 100) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">Attendance Rate</div>
          </div>
        </div>

        {/* Date and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
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

        {/* Attendance Table */}
        <div className="border-2 border-border bg-background">
          <div className="p-4 border-b-2 border-border">
            <h2 className="font-bold">{formattedDate}</h2>
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
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-muted-foreground">
                      No attendance records found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((record) => {
                    const status = getStatusFromRecord(record);
                    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.present;
                    const initials = `${record.employees?.first_name?.[0] || ""}${record.employees?.last_name?.[0] || ""}`.toUpperCase();

                    return (
                      <tr key={record.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                              {initials}
                            </div>
                            <span className="font-medium">
                              {record.employees?.first_name} {record.employees?.last_name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-muted-foreground">{record.employees?.department || "N/A"}</td>
                        <td className="p-4">{formatTime(record.check_in_time)}</td>
                        <td className="p-4">{formatTime(record.check_out_time)}</td>
                        <td className="p-4">{formatHours(record.total_hours)}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium ${config.class}`}>
                            <config.icon className="h-3 w-3" />
                            {config.label}
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

export default AdminAttendance;
