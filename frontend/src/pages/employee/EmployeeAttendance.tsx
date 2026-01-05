import DashboardLayout from "@/components/layout/DashboardLayout";
import { Clock, CheckCircle, XCircle, AlertCircle, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { attendanceAPI } from "@/lib/apiClient";
import { useToast } from "@/hooks/use-toast";

interface AttendanceRecord {
  id: string;
  date: string;
  check_in_time: string;
  check_out_time?: string;
  total_hours?: number;
  status: string;
}

const statusConfig = {
  present: { label: "Present", icon: CheckCircle, class: "bg-chart-2 text-background" },
  absent: { label: "Absent", icon: XCircle, class: "bg-destructive text-destructive-foreground" },
  leave: { label: "Leave", icon: AlertCircle, class: "bg-chart-4 text-background" },
  "half-day": { label: "Half-Day", icon: Clock, class: "bg-chart-1 text-background" },
  holiday: { label: "Holiday", icon: CheckCircle, class: "bg-muted text-muted-foreground" },
};

const EmployeeAttendance = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState({
    presentDays: 0,
    onLeave: 0,
    halfDays: 0,
    avgHours: 0,
  });
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchAttendanceHistory();
    }
  }, [user?.id]);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const res = await attendanceAPI.getHistory(user?.id!);
      const records = res.data || [];
      setAttendanceData(records);

      // Check if user checked in today
      const today = new Date().toISOString().split("T")[0];
      const todayRec = records.find((r: AttendanceRecord) => r.date === today);
      if (todayRec) {
        setCheckedInToday(true);
        setTodayRecord(todayRec);
      }

      // Calculate summary
      let present = 0;
      let leave = 0;
      let halfDay = 0;
      let totalHours = 0;
      let hourCount = 0;

      records.forEach((rec: AttendanceRecord) => {
        if (rec.status === "present") {
          present++;
          if (rec.total_hours) {
            totalHours += rec.total_hours;
            hourCount++;
          }
        } else if (rec.status === "leave") {
          leave++;
        } else if (rec.status === "half-day") {
          halfDay++;
        }
      });

      setSummary({
        presentDays: present,
        onLeave: leave,
        halfDays: halfDay,
        avgHours: hourCount > 0 ? totalHours / hourCount : 0,
      });
    } catch (error) {
      console.error("Error fetching attendance history:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      await attendanceAPI.checkIn({ employee_id: user?.id });
      toast({
        title: "Success",
        description: "Checked in successfully",
      });
      setCheckedInToday(true);
      fetchAttendanceHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to check in",
        variant: "destructive",
      });
    } finally {
      setCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayRecord?.id) return;

    try {
      setCheckingIn(true);
      await attendanceAPI.checkOut(todayRecord.id);
      toast({
        title: "Success",
        description: "Checked out successfully",
      });
      fetchAttendanceHistory();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.response?.data?.error || "Failed to check out",
        variant: "destructive",
      });
    } finally {
      setCheckingIn(false);
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
      <DashboardLayout role="employee">
        <div className="flex items-center justify-center h-96">
          <Loader className="h-8 w-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">My Attendance</h1>
            <p className="text-muted-foreground">Track your daily attendance and work hours.</p>
          </div>
          <div className="flex gap-2">
            {!checkedInToday ? (
              <Button size="lg" className="shadow-sm" onClick={handleCheckIn} disabled={checkingIn}>
                <Clock className="mr-2 h-5 w-5" />
                {checkingIn ? "Checking In..." : "Check In"}
              </Button>
            ) : (
              <>
                <Button size="lg" variant="outline" disabled>
                  <CheckCircle className="mr-2 h-5 w-5 text-chart-2" />
                  Checked In
                </Button>
                {!todayRecord?.check_out_time && (
                  <Button
                    size="lg"
                    variant="destructive"
                    className="shadow-sm"
                    onClick={handleCheckOut}
                    disabled={checkingIn}
                  >
                    <Clock className="mr-2 h-5 w-5" />
                    {checkingIn ? "Checking Out..." : "Check Out"}
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="border-2 border-border bg-background p-4">
            <div className="text-sm text-muted-foreground">Present Days</div>
            <div className="text-2xl font-bold">{summary.presentDays}</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-sm text-muted-foreground">On Leave</div>
            <div className="text-2xl font-bold">{summary.onLeave}</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-sm text-muted-foreground">Half Days</div>
            <div className="text-2xl font-bold">{summary.halfDays}</div>
          </div>
          <div className="border-2 border-border bg-background p-4">
            <div className="text-sm text-muted-foreground">Avg. Hours</div>
            <div className="text-2xl font-bold">{formatHours(summary.avgHours)}</div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="border-2 border-border bg-background">
          <div className="p-4 border-b-2 border-border">
            <h2 className="font-bold">Recent Attendance</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-secondary">
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Check In</th>
                  <th className="text-left p-4 font-medium">Check Out</th>
                  <th className="text-left p-4 font-medium">Hours</th>
                  <th className="text-left p-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-muted-foreground">
                      No attendance records yet
                    </td>
                  </tr>
                ) : (
                  attendanceData.slice(0, 10).map((row) => {
                    const status = getStatusFromRecord(row);
                    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.present;

                    return (
                      <tr key={row.id} className="border-b border-border last:border-0 hover:bg-secondary/50">
                        <td className="p-4 font-medium">{row.date}</td>
                        <td className="p-4">{formatTime(row.check_in_time)}</td>
                        <td className="p-4">{formatTime(row.check_out_time)}</td>
                        <td className="p-4">{formatHours(row.total_hours)}</td>
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

export default EmployeeAttendance;
