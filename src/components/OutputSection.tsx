const transactions = [
  { address: "0x018cc4d9********e6818ebc43", quantity: "0.701642" },
  { address: "0x60796884********b81ccdb7e4", quantity: "12.017267" },
  { address: "0x018cc4d9********e6818ebc43", quantity: "1.001448" },
  { address: "0xba289a20********78d6fcb476", quantity: "2.2529998" },
  { address: "0xe45e5bf5********eb08b7b549", quantity: "3.600735" },
  { address: "0x9fc2e74c********0e893fa213", quantity: "2.727793" },
  { address: "0x018cc4d9********e6818ebc43", quantity: "3.0801908" },
  { address: "0xe45e5bf5********eb08b7b549", quantity: "0.600115" },
  { address: "0xe45e5bf5********eb08b7b549", quantity: "2.90001252" },
];

const cryptoData = {
  name: "Huobi",
  value: "2974.23",
  currencies: [
    { name: "BitCoin", icon: "₿", volume: "2937.84", liquidity: "255969878.62", color: "bg-orange-500" },
    { name: "Ethereum", icon: "◆", volume: "72687.09", liquidity: "211000586.82", color: "bg-blue-500" },
  ]
};

const OutputSection = () => {
  return (
    <section id="output" className="py-20 bg-background">
      <div className="container px-4">
        {/* Output Table */}
        <div className="gradient-card rounded-xl border border-border overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-accent italic mb-6">Output</h2>
            
            <div className="grid grid-cols-2 px-2 pb-4 text-muted-foreground text-sm font-medium border-b border-primary/30">
              <span>Address</span>
              <span className="text-right">Quantity</span>
            </div>
            
            <div className="divide-y divide-border/30">
              {transactions.map((tx, index) => (
                <div 
                  key={index}
                  className="grid grid-cols-2 py-4 px-2 hover:bg-navy-light/30 transition-colors"
                >
                  <span className="text-foreground text-sm font-mono">{tx.address}</span>
                  <span className="text-right text-primary font-semibold">{tx.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Huobi Card */}
        <div className="gradient-card rounded-xl border border-border overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-foreground font-bold">🔷</span>
                </div>
                <span className="text-xl font-bold text-foreground">{cryptoData.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{cryptoData.value}</span>
                <span className="text-primary">⬆</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-muted-foreground text-sm mb-4 pb-2 border-b border-border">
              <span>Currency24h</span>
              <span>Volume</span>
              <span>Liquidity</span>
            </div>
            
            {cryptoData.currencies.map((currency, index) => (
              <div key={index} className="grid grid-cols-3 gap-4 py-3 items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 ${currency.color} rounded-full flex items-center justify-center text-foreground text-xs font-bold`}>
                    {currency.icon}
                  </div>
                  <span className="text-foreground text-sm">{currency.name}</span>
                </div>
                <span className="text-foreground text-sm">{currency.volume}</span>
                <span className="text-foreground text-sm">{currency.liquidity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OutputSection;
