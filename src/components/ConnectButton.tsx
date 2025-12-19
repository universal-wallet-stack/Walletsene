import { Button } from "@/components/ui/button"
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useBalance } from 'wagmi'
import { useEffect, useRef } from 'react'
import { logUserConnection } from '@/lib/firebase'

export const ConnectButton = () => {
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
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

  return (
    <Button variant="gold" size="lg" className="px-8" onClick={() => open()}>
      {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Login'}
    </Button>
  )
}
