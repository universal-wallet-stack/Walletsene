import { Users, Shield, Globe, Building, Cpu } from "lucide-react";

const features = [
  { icon: Users, label: "Transparency" },
  { icon: Shield, label: "Security" },
  { icon: Globe, label: "Global access" },
  { icon: Building, label: "Decentralization" },
  { icon: Cpu, label: "Tamper-proof" },
];

const savingsTiers = [
  { range: "1-59,999", rate: "1.7%" },
  { range: "60,000-199,999", rate: "2.1%" },
  { range: "200,000-599,999", rate: "2.7%" },
  { range: "600,000-999,999", rate: "3.3%" },
  { range: "1,000,000-2,999,999", rate: "3.9%" },
  { range: "3,000,000-6,999,999", rate: "5.7%" },
  { range: "7,000,000-9,999,999", rate: "7.3%" },
  { range: "10,000,000-999,999,999", rate: "11%" },
];

const SavingsPlanSection = () => {
  return (
    <section id="savings" className="py-20 bg-background">
      <div className="container px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
          FIXED-TERM SAVINGS<br />PLAN
        </h2>
        
        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center gap-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-full border border-primary/50 flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <span className="text-xs text-muted-foreground">{feature.label}</span>
            </div>
          ))}
        </div>
        
        {/* Savings Table */}
        <div className="gradient-card rounded-xl border border-border overflow-hidden">
          <div className="bg-navy-light px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-primary text-center">
              FIXED-TERM SAVINGS PLAN
            </h3>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-2 px-4 py-3 text-muted-foreground text-sm font-medium">
              <span>Deposit(USDC)</span>
              <span className="text-right">Daily Interest Rate(%)</span>
            </div>
            
            <div className="border-t border-border">
              {savingsTiers.map((tier, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-2 px-4 py-4 border-b border-border/50 last:border-b-0 hover:bg-navy-light/50 transition-colors"
                >
                  <span className="text-primary font-medium">{tier.range}</span>
                  <span className="text-right text-primary font-semibold">{tier.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Eagle emblem */}
        <div className="flex flex-col items-center mt-12">
          <div className="text-primary text-6xl mb-4">🦅</div>
          <p className="text-primary text-sm">Terms and Conditions Apply</p>
        </div>
      </div>
    </section>
  );
};

export default SavingsPlanSection;
