'use client'
import { networks } from '@/config'
import { useChakraToast } from './Toast'
import { TokenUtil } from '@reown/appkit-utils'
import {
  AppKitButton,
  AppKitNetworkButton,
  type CaipNetwork,
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
  useDisconnect
} from '@reown/appkit/react'
import { useConnect, useConnectors } from 'wagmi'
import { base } from 'viem/chains'
import { useWalletSend } from '../hooks/useWalletSend'

export const ActionButtonList = () => {
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { switchNetwork } = useAppKitNetwork();
  const { connect } = useConnect()
  const connectors = useConnectors()
  const toast = useChakraToast()
  const evmAccount = useAppKitAccount({ namespace: 'eip155' })
  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }

  const handleConnect = () => {
    const injectedConnector = connectors.find(c => c.type === 'injected' || c.id === 'injected' || c.name === 'Injected');

    if (injectedConnector) {
      connect({ connector: injectedConnector })
    } else {
      open()
    }
  }

  const { handleOpenSendWithArguments } = useWalletSend()

  return (
    <div>
      <button
        data-testid="open-send-with-arguments-hook-button"
        onClick={() => handleOpenSendWithArguments()}
      >
        Open Send with Arguments
      </button>
      <button onClick={handleConnect}>Open</button>
      <button onClick={handleDisconnect}>Disconnect</button>
      <button onClick={() => switchNetwork(networks[1])}>Switch</button>
    </div>
  )
}
