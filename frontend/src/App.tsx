import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeProfile from "./pages/employee/EmployeeProfile";
import EmployeeAttendance from "./pages/employee/EmployeeAttendance";
import EmployeeLeave from "./pages/employee/EmployeeLeave";
import EmployeePayroll from "./pages/employee/EmployeePayroll";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminAttendance from "./pages/admin/AdminAttendance";
import AdminLeave from "./pages/admin/AdminLeave";
import AdminPayroll from "./pages/admin/AdminPayroll";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Employee Routes */}
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/profile" element={<EmployeeProfile />} />
          <Route path="/employee/attendance" element={<EmployeeAttendance />} />
          <Route path="/employee/leave" element={<EmployeeLeave />} />
          <Route path="/employee/payroll" element={<EmployeePayroll />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/employees" element={<AdminEmployees />} />
          <Route path="/admin/attendance" element={<AdminAttendance />} />
          <Route path="/admin/leave" element={<AdminLeave />} />
          <Route path="/admin/payroll" element={<AdminPayroll />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
