const stats = [
  { value: "10-200", label: "Team Size Supported" },
  { value: "95%", label: "Time Saved on HR Tasks" },
  { value: "24/7", label: "Access to Records" },
  { value: "100%", label: "Data Transparency" },
];

const StatsSection = () => {
  return (
    <section className="py-16 border-y-2 border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
