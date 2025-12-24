import { useState, useEffect, useCallback } from "react";
import miningBanner from "@/assets/mining-banner.png";

const nationalities = ["UK", "US", "HK", "KL", "SG", "JP", "DE", "FR", "AU", "CA", "CN", "KR"];

const generateRandomAddress = () => {
  const chars = "0123456789abcdef";
  const start = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const end = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `0x${start}********${end}`;
};

const generateRandomHashrate = () => {
  return (Math.random() * 5 + 0.5).toFixed(6) + " USDC";
};

const generateRandomNationality = () => {
  return nationalities[Math.floor(Math.random() * nationalities.length)];
};

const ComputingPoolSection = () => {
  const [poolUsers, setPoolUsers] = useState(() =>
    Array.from({ length: 4 }, () => ({
      nationality: generateRandomNationality(),
      address: generateRandomAddress(),
      hashrate: generateRandomHashrate(),
      key: Math.random()
    }))
  );

  const addNewUser = useCallback(() => {
    setPoolUsers(prev => {
      const newUser = {
        nationality: generateRandomNationality(),
        address: generateRandomAddress(),
        hashrate: generateRandomHashrate(),
        key: Math.random()
      };
      return [newUser, ...prev.slice(0, 3)];
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(addNewUser, 2000);
    return () => clearInterval(interval);
  }, [addNewUser]);

  return (
    <section id="pool" className="py-20 bg-background">
      <div className="container px-4">
        {/* Mining Banner */}
        <div className="relative rounded-xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/90 to-orange-400/90" />
          <div className="relative p-6 flex items-center justify-between">
            <div className="z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Computing Pool
              </h2>
              <p className="text-primary-foreground/80 text-sm md:text-base">
                The following users are welcome<br />to join the blockchain savings plan.
              </p>
            </div>
            <img 
              src={miningBanner} 
              alt="Mining" 
              className="absolute right-0 top-0 h-full w-auto object-cover opacity-80"
            />
          </div>
        </div>
        
        {/* Users Table */}
        <div className="divide-y divide-border">
          {poolUsers.map((user) => (
            <div 
              key={user.key}
              className="py-6 animate-fade-in transition-all duration-500"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-muted-foreground text-sm">User's nationality</span>
                <span className="text-primary font-semibold">{user.nationality}</span>
              </div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-muted-foreground text-sm">Public chain address</span>
                <span className="text-primary font-mono text-sm text-right max-w-[200px] break-all">{user.address}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Wallet Hashrate</span>
                <span className="text-primary font-semibold">{user.hashrate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ComputingPoolSection;
