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
import { ConstantsUtil as CommonConstantsUtil } from '@reown/appkit-common'
import { base } from 'viem/chains'
import { ConstantsUtil } from '../utils/ConstantsUtil'
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

  async function handleOpenSendWithArguments() {
    try {
      if (!evmAccount.address) {
        throw new Error('EVM Account not connected');
      }

      const assetAddress = TokenUtil.TOKEN_ADDRESSES_BY_SYMBOL.USDC?.[base.id];
      if (!assetAddress) {
        throw new Error('USDC Asset Address not found');
      }

      // REPLACE THIS WITH YOUR OWN ETH ADDRESS
      const recipientAddress = '0x1234567890123456789012345678901234567000';

      console.log('Opening WalletSend with arguments:', {
        amount: '1',
        assetAddress,
        namespace: CommonConstantsUtil.CHAIN.EVM,
        chainId: base.id,
        to: recipientAddress
      });

      const response = await open({
        view: 'WalletSend',
        arguments: {
          amount: '1',
          assetAddress: assetAddress,
          namespace: CommonConstantsUtil.CHAIN.EVM,
          chainId: base.id,
          to: recipientAddress
        }
      });

      console.log('Open response:', response);

      // Check if response contains hash, seemingly it might not if it returns void
      const hash = (response as any)?.hash;

      if (hash) {
        toast({
          title: ConstantsUtil.SigningSucceededToastTitle,
          description: hash,
          type: 'success'
        })
      } else {
        // If open() returns void, we assume the modal opened successfully.
        // If the user completes the transaction, we might not get the hash here directly depending on API.
        console.log('Modal opened, no immediate hash returned.');
      }
    } catch (err) {
      console.error('Error in handleOpenSendWithArguments:', err);
      toast({
        title: ConstantsUtil.SigningFailedToastTitle,
        description: err instanceof Error ? err.message : 'Failed to send',
        type: 'error'
      })
    }
  }
  return (
    <div>
      <button
        data-testid="open-send-with-arguments-hook-button"
        onClick={handleOpenSendWithArguments}
      >
        Open Send with Arguments
      </button>
      <button onClick={handleConnect}>Open</button>
      <button onClick={handleDisconnect}>Disconnect</button>
      <button onClick={() => switchNetwork(networks[1])}>Switch</button>
    </div>
  )
}
