import { 
  Users, 
  Clock, 
  Calendar, 
  CreditCard, 
  Bell, 
  Shield,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Employee Profiles",
    description: "Centralized employee records with personal details, job information, salary structure, and documents.",
    highlights: ["Personal info management", "Document storage", "Role-based access"]
  },
  {
    icon: Clock,
    title: "Attendance Tracking",
    description: "Simple check-in/check-out system with daily and weekly views. Admin can correct records when needed.",
    highlights: ["Manual check-in/out", "Status tracking", "Admin override"]
  },
  {
    icon: Calendar,
    title: "Leave Management",
    description: "Complete leave lifecycle from application to approval. Multiple leave types with automatic tracking.",
    highlights: ["Leave applications", "Approval workflow", "Balance tracking"]
  },
  {
    icon: CreditCard,
    title: "Payroll Visibility",
    description: "Employees view their salary details while HR manages structures. Generate and share salary slips.",
    highlights: ["Salary breakdown", "Payslip generation", "Secure access"]
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Stay informed with in-app and email notifications for leave status, approvals, and important updates.",
    highlights: ["In-app alerts", "Email notifications", "Real-time updates"]
  },
  {
    icon: Shield,
    title: "Secure & Role-Based",
    description: "Data access restricted by role. Sensitive information protected with proper authorization levels.",
    highlights: ["Role-based access", "Data encryption", "Audit trails"]
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need for HR
          </h2>
          <p className="text-lg text-muted-foreground">
            Dayflow covers the essential HR operations without unnecessary complexity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="border-2 border-border bg-background p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 border-2 border-border flex items-center justify-center mb-4 bg-secondary">
                <feature.icon className="h-6 w-6" />
              </div>
              
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              
              <ul className="space-y-2">
                {feature.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
