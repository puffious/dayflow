import DashboardLayout from "@/components/layout/DashboardLayout";
import { Search, Plus, Filter, MoreHorizontal, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const employees = [
  { 
    id: 1,
    name: "John Doe", 
    email: "john.doe@company.com",
    phone: "+1 555-123-4567",
    department: "Engineering",
    position: "Senior Software Engineer",
    status: "Active",
    joinDate: "Mar 15, 2023",
    initials: "JD"
  },
  { 
    id: 2,
    name: "Sarah Johnson", 
    email: "sarah.johnson@company.com",
    phone: "+1 555-234-5678",
    department: "Design",
    position: "Lead Designer",
    status: "Active",
    joinDate: "Jun 1, 2022",
    initials: "SJ"
  },
  { 
    id: 3,
    name: "Michael Chen", 
    email: "michael.chen@company.com",
    phone: "+1 555-345-6789",
    department: "Engineering",
    position: "Backend Developer",
    status: "Active",
    joinDate: "Sep 10, 2023",
    initials: "MC"
  },
  { 
    id: 4,
    name: "Emily Davis", 
    email: "emily.davis@company.com",
    phone: "+1 555-456-7890",
    department: "Marketing",
    position: "Marketing Manager",
    status: "On Leave",
    joinDate: "Jan 5, 2024",
    initials: "ED"
  },
  { 
    id: 5,
    name: "Alex Thompson", 
    email: "alex.thompson@company.com",
    phone: "+1 555-567-8901",
    department: "Engineering",
    position: "Software Engineer",
    status: "Active",
    joinDate: "Jan 2, 2026",
    initials: "AT"
  },
];

const AdminEmployees = () => {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage your organization's employees.</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-10" />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>

        {/* Employees Table */}
        <div className="border-2 border-border bg-background">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-border bg-secondary">
                  <th className="text-left p-4 font-medium">Employee</th>
                  <th className="text-left p-4 font-medium">Department</th>
                  <th className="text-left p-4 font-medium">Position</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Join Date</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.id} className="border-b border-border last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {employee.initials}
                        </div>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {employee.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">{employee.department}</td>
                    <td className="p-4">{employee.position}</td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-1 text-xs font-medium ${
                        employee.status === "Active" 
                          ? "bg-chart-2 text-background" 
                          : "bg-chart-4 text-background"
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{employee.joinDate}</td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Attendance</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing 1-5 of 48 employees</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminEmployees;
