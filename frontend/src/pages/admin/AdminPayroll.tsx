import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreditCard, Download, FileText, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const payrollSummary = [
  { label: "Total Payroll", value: "$267,500", sublabel: "This Month" },
  { label: "Total Employees", value: "48", sublabel: "On Payroll" },
  { label: "Pending Payments", value: "0", sublabel: "All Processed" },
  { label: "Average Salary", value: "$5,573", sublabel: "Per Employee" },
];

const payrollData = [
  { 
    id: 1,
    name: "John Doe",
    initials: "JD",
    department: "Engineering",
    position: "Senior Software Engineer",
    grossSalary: "$5,500.00",
    deductions: "$825.00",
    netSalary: "$4,675.00",
    status: "Processed"
  },
  { 
    id: 2,
    name: "Sarah Johnson",
    initials: "SJ",
    department: "Design",
    position: "Lead Designer",
    grossSalary: "$5,200.00",
    deductions: "$780.00",
    netSalary: "$4,420.00",
    status: "Processed"
  },
  { 
    id: 3,
    name: "Michael Chen",
    initials: "MC",
    department: "Engineering",
    position: "Backend Developer",
    grossSalary: "$4,800.00",
    deductions: "$720.00",
    netSalary: "$4,080.00",
    status: "Processed"
  },
  { 
    id: 4,
    name: "Emily Davis",
    initials: "ED",
    department: "Marketing",
    position: "Marketing Manager",
    grossSalary: "$5,000.00",
    deductions: "$750.00",
    netSalary: "$4,250.00",
    status: "Processed"
  },
  { 
    id: 5,
    name: "Alex Thompson",
    initials: "AT",
    department: "Engineering",
    position: "Software Engineer",
    grossSalary: "$4,500.00",
    deductions: "$675.00",
    netSalary: "$3,825.00",
    status: "Processed"
  },
];

const AdminPayroll = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Payroll Management</h1>
            <p className="text-muted-foreground">Manage employee salaries and generate payslips.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button>
              Run Payroll
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {payrollSummary.map((item, index) => (
            <div key={index} className="border-2 border-border bg-background p-4">
              <div className="text-sm text-muted-foreground">{item.label}</div>
              <div className="text-2xl font-bold">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Month Selector and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input type="month" defaultValue="2026-01" className="w-auto" />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Payroll Table */}
        <div className="border-2 border-border bg-background">
          <div className="p-4 border-b-2 border-border flex items-center justify-between">
            <h2 className="font-bold">January 2026 Payroll</h2>
            <span className="text-sm text-muted-foreground">48 employees</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-secondary">
                  <th className="text-left p-4 font-medium">Employee</th>
                  <th className="text-left p-4 font-medium">Department</th>
                  <th className="text-left p-4 font-medium">Gross Salary</th>
                  <th className="text-left p-4 font-medium">Deductions</th>
                  <th className="text-left p-4 font-medium">Net Salary</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payrollData.map((row) => (
                  <tr key={row.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {row.initials}
                        </div>
                        <div>
                          <div className="font-medium">{row.name}</div>
                          <div className="text-xs text-muted-foreground">{row.position}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground">{row.department}</td>
                    <td className="p-4">{row.grossSalary}</td>
                    <td className="p-4 text-muted-foreground">{row.deductions}</td>
                    <td className="p-4 font-medium">{row.netSalary}</td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-chart-2 text-background">
                        {row.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPayroll;
