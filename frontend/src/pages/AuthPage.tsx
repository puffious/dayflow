import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login, signup } = useAuth();
  const isSignUp = searchParams.get("mode") === "signup";
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "employee" as "employee" | "admin"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const [firstName, ...lastNameParts] = formData.fullName.split(' ');
        const lastName = lastNameParts.join(' ') || 'User';
        await signup(formData.email, formData.password, firstName, lastName);
        toast({
          title: "Account created!",
          description: "Your account has been created successfully."
        });
        navigate(formData.role === "admin" ? "/admin/dashboard" : "/employee/dashboard");
      } else {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully."
        });
        navigate("/employee/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Authentication failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-16 lg:px-24">
        <div className="max-w-md w-full mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h1>
            <p className="text-muted-foreground">
              {isSignUp 
                ? "Start managing your HR operations with Dayflow." 
                : "Sign in to access your dashboard."}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                  className="h-12"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="h-12 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            
            {isSignUp && (
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "employee" })}
                    className={`p-4 border-2 text-left transition-colors ${
                      formData.role === "employee" 
                        ? "border-primary bg-secondary" 
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="font-semibold">Employee</div>
                    <div className="text-sm text-muted-foreground">View profile, attendance & leave</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "admin" })}
                    className={`p-4 border-2 text-left transition-colors ${
                      formData.role === "admin" 
                        ? "border-primary bg-secondary" 
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <div className="font-semibold">Admin / HR</div>
                    <div className="text-sm text-muted-foreground">Manage employees & approvals</div>
                  </button>
                </div>
              </div>
            )}
            
            <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
              {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            {isSignUp ? (
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/auth" className="text-foreground font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/auth?mode=signup" className="text-foreground font-medium hover:underline">
                  Create one
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Right Panel - Branding */}
      <div className="hidden lg:flex flex-1 bg-primary text-primary-foreground items-center justify-center p-16">
        <div className="max-w-md space-y-8">
          <div className="w-16 h-16 bg-primary-foreground flex items-center justify-center">
            <span className="text-primary font-bold text-3xl">D</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight">
            The calm, reliable backbone of daily work life.
          </h2>
          <p className="text-lg opacity-90">
            Dayflow helps teams stay aligned, informed, and focused without unnecessary complexity.
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-foreground"></div>
              <span>Attendance & Leave Management</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-foreground"></div>
              <span>Employee Self-Service Portal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-primary-foreground"></div>
              <span>Payroll Visibility & Reports</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
