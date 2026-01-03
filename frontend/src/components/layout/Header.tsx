import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="border-b-2 border-border bg-background">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">D</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Dayflow</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/#features" className="text-sm font-medium hover:underline underline-offset-4">
            Features
          </Link>
          <Link to="/#pricing" className="text-sm font-medium hover:underline underline-offset-4">
            Pricing
          </Link>
          <Link to="/#about" className="text-sm font-medium hover:underline underline-offset-4">
            About
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild>
            <Link to="/auth?mode=signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
