import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Mail, Phone, MapPin, Building, Calendar, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmployeeProfile = () => {
  const profile = {
    name: "John Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    department: "Engineering",
    position: "Senior Software Engineer",
    joinDate: "March 15, 2023",
    employeeId: "EMP-2023-001",
    manager: "Sarah Wilson",
    workLocation: "New York Office"
  };

  return (
    <DashboardLayout role="employee">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* Profile Header */}
        <div className="border-2 border-border bg-background p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold">
              JD
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-muted-foreground">{profile.position}</p>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Building className="h-4 w-4" />
                  {profile.department}
                </span>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.workLocation}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Employee ID</div>
              <div className="font-mono font-bold">{profile.employeeId}</div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="border-2 border-border bg-background p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Email Address</div>
                  <div className="font-medium">{profile.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Phone Number</div>
                  <div className="font-medium">{profile.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Address</div>
                  <div className="font-medium">{profile.address}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="border-2 border-border bg-background p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Building className="h-5 w-5" />
              Employment Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Department</div>
                  <div className="font-medium">{profile.department}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Reporting To</div>
                  <div className="font-medium">{profile.manager}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="text-sm text-muted-foreground">Join Date</div>
                  <div className="font-medium">{profile.joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmployeeProfile;
