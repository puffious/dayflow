import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Clock, Calendar } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block border-2 border-border px-4 py-2 text-sm font-medium bg-secondary">
            Human Resource Management System
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Streamline Your
            <br />
            <span className="relative">
              HR Operations
              <div className="absolute -bottom-2 left-0 w-full h-3 bg-primary opacity-20" />
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Dayflow helps small to mid-sized teams manage attendance, leave, and payroll 
            with clarity and ease. No complexity, just flow.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="text-lg px-8 py-6 shadow-md" asChild>
              <Link to="/auth?mode=signup">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link to="/#features">
                See Features
              </Link>
            </Button>
          </div>
          
          <div className="pt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 border-2 border-border flex items-center justify-center bg-secondary">
                <Users className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Employee<br/>Management</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 border-2 border-border flex items-center justify-center bg-secondary">
                <Clock className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Attendance<br/>Tracking</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 border-2 border-border flex items-center justify-center bg-secondary">
                <Calendar className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium">Leave<br/>Management</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
