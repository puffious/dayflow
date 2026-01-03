import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  User, 
  Clock, 
  Calendar, 
  CreditCard,
  Bell,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "employee" | "admin";
}

const employeeNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/employee/dashboard" },
  { icon: User, label: "My Profile", href: "/employee/profile" },
  { icon: Clock, label: "Attendance", href: "/employee/attendance" },
  { icon: Calendar, label: "Leave", href: "/employee/leave" },
  { icon: CreditCard, label: "Payroll", href: "/employee/payroll" },
];

const adminNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: User, label: "Employees", href: "/admin/employees" },
  { icon: Clock, label: "Attendance", href: "/admin/attendance" },
  { icon: Calendar, label: "Leave Requests", href: "/admin/leave" },
  { icon: CreditCard, label: "Payroll", href: "/admin/payroll" },
];

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = role === "admin" ? adminNavItems : employeeNavItems;

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r-2 border-border bg-background">
        <div className="p-6 border-b-2 border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">D</span>
            </div>
            <span className="font-bold text-lg">Dayflow</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t-2 border-border space-y-1">
          <Link
            to={`/${role}/settings`}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium hover:bg-secondary transition-colors text-left"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 flex-col border-r-2 border-border bg-background z-50 transform transition-transform md:hidden ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b-2 border-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold">D</span>
            </div>
            <span className="font-bold text-lg">Dayflow</span>
          </Link>
          <button onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-secondary"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 border-b-2 border-border bg-background flex items-center justify-between px-4 md:px-6">
          <button 
            className="md:hidden p-2 hover:bg-secondary"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex-1" />
          
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-secondary relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-destructive"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                JD
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium">John Doe</div>
                <div className="text-xs text-muted-foreground capitalize">{role}</div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
