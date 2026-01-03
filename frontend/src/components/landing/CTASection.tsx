import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Simplify Your HR?
          </h2>
          <p className="text-lg opacity-90">
            Join teams that have eliminated manual HR processes and improved transparency 
            for their employees. Start your free trial today.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6"
              asChild
            >
              <Link to="/auth?mode=signup">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link to="/#">
                Schedule Demo
              </Link>
            </Button>
          </div>
          
          <p className="text-sm opacity-75">
            No credit card required · Free 14-day trial · Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
