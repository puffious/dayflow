import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreditCard, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const payrollHistory = [
  { 
    month: "December 2025", 
    grossSalary: "$5,500.00",
    deductions: "$825.00",
    netSalary: "$4,675.00",
    status: "Paid",
    paidOn: "Dec 31, 2025"
  },
  { 
    month: "November 2025", 
    grossSalary: "$5,500.00",
    deductions: "$825.00",
    netSalary: "$4,675.00",
    status: "Paid",
    paidOn: "Nov 30, 2025"
  },
  { 
    month: "October 2025", 
    grossSalary: "$5,500.00",
    deductions: "$825.00",
    netSalary: "$4,675.00",
    status: "Paid",
    paidOn: "Oct 31, 2025"
  },
];

const salaryBreakdown = {
  earnings: [
    { label: "Basic Salary", amount: "$4,000.00" },
    { label: "Housing Allowance", amount: "$800.00" },
    { label: "Transport Allowance", amount: "$400.00" },
    { label: "Medical Allowance", amount: "$300.00" },
  ],
  deductions: [
    { label: "Income Tax", amount: "$550.00" },
    { label: "Social Security", amount: "$165.00" },
    { label: "Health Insurance", amount: "$110.00" },
  ]
};

const EmployeePayroll = () => {
  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Payroll</h1>
          <p className="text-muted-foreground">View your salary details and download payslips.</p>
        </div>

        {/* Current Salary Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-border bg-background p-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Gross Salary</span>
            </div>
            <div className="text-3xl font-bold">$5,500.00</div>
            <div className="text-sm text-muted-foreground">Per month</div>
          </div>
          <div className="border-2 border-border bg-background p-6">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Deductions</span>
            </div>
            <div className="text-3xl font-bold">$825.00</div>
            <div className="text-sm text-muted-foreground">Per month</div>
          </div>
          <div className="border-2 border-border bg-primary text-primary-foreground p-6">
            <div className="flex items-center gap-3 mb-2">
              <CreditCard className="h-5 w-5 opacity-75" />
              <span className="text-sm opacity-75">Net Salary</span>
            </div>
            <div className="text-3xl font-bold">$4,675.00</div>
            <div className="text-sm opacity-75">Per month</div>
          </div>
        </div>

        {/* Salary Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border-2 border-border bg-background p-6">
            <h2 className="font-bold mb-4">Earnings</h2>
            <div className="space-y-3">
              {salaryBreakdown.earnings.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.amount}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-bold">
                <span>Total Earnings</span>
                <span>$5,500.00</span>
              </div>
            </div>
          </div>

          <div className="border-2 border-border bg-background p-6">
            <h2 className="font-bold mb-4">Deductions</h2>
            <div className="space-y-3">
              {salaryBreakdown.deductions.map((item, index) => (
                <div key={index} className="flex justify-between py-2 border-b border-border last:border-0">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium">{item.amount}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-bold">
                <span>Total Deductions</span>
                <span>$825.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payroll History */}
        <div className="border-2 border-border bg-background">
          <div className="p-4 border-b-2 border-border">
            <h2 className="font-bold">Payroll History</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-secondary">
                  <th className="text-left p-4 font-medium">Month</th>
                  <th className="text-left p-4 font-medium">Gross</th>
                  <th className="text-left p-4 font-medium">Deductions</th>
                  <th className="text-left p-4 font-medium">Net</th>
                  <th className="text-left p-4 font-medium">Paid On</th>
                  <th className="text-left p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {payrollHistory.map((row, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="p-4 font-medium">{row.month}</td>
                    <td className="p-4">{row.grossSalary}</td>
                    <td className="p-4">{row.deductions}</td>
                    <td className="p-4 font-medium">{row.netSalary}</td>
                    <td className="p-4 text-muted-foreground">{row.paidOn}</td>
                    <td className="p-4">
                      <Button variant="outline" size="sm">
                        <Download className="mr-1 h-4 w-4" />
                        Payslip
                      </Button>
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

export default EmployeePayroll;
