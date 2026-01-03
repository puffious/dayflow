import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t-2 border-border bg-secondary">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">D</span>
              </div>
              <span className="font-bold text-lg">Dayflow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The calm, reliable backbone of daily work life.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/#features" className="text-sm text-muted-foreground hover:text-foreground">Features</Link></li>
              <li><Link to="/#pricing" className="text-sm text-muted-foreground hover:text-foreground">Pricing</Link></li>
              <li><Link to="/#" className="text-sm text-muted-foreground hover:text-foreground">Integrations</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/#about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
              <li><Link to="/#" className="text-sm text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link to="/#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Dayflow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
