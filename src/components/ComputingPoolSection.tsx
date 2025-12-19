import miningBanner from "@/assets/mining-banner.png";

const poolUsers = [
  { nationality: "UK", address: "0xba289a20********78d6fcb476", hashrate: "2.2529998 USDC" },
  { nationality: "US", address: "0xe45e5bf5********eb08b7b549", hashrate: "3.600735 USDC" },
  { nationality: "HK", address: "0x9fc2e74c********0e893fa213", hashrate: "2.727793 USDC" },
  { nationality: "KL", address: "0x018cc4d9********e6818ebc43", hashrate: "3.0801908 USDC" },
];

const ComputingPoolSection = () => {
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
          {poolUsers.map((user, index) => (
            <div 
              key={index}
              className="py-6 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
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
