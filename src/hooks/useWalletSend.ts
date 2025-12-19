'use client'

import { useAppKit, useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { TokenUtil } from '@reown/appkit-utils'
import { ConstantsUtil as CommonConstantsUtil } from '@reown/appkit-common'
import { base } from 'viem/chains'
import { useChakraToast } from '../components/Toast'
import { ConstantsUtil } from '../utils/ConstantsUtil'

export const useWalletSend = () => {
    const { open } = useAppKit()
    const { address } = useAppKitAccount()
    const toast = useChakraToast()

    const { caipNetwork } = useAppKitNetwork()
    const currentChainId = caipNetwork?.id
        ? (typeof caipNetwork.id === 'string' && caipNetwork.id.includes(':')
            ? Number(caipNetwork.id.split(':')[1])
            : Number(caipNetwork.id))
        : base.id

    const handleOpenSendWithArguments = async (assetSymbol: string = 'USDC', amount: string = '1') => {
        try {
            if (!address) {
                throw new Error('Wallet not connected')
            }

            const isNative = assetSymbol.toLowerCase() === 'eth'
            const assetAddress = isNative
                ? undefined
                : TokenUtil.TOKEN_ADDRESSES_BY_SYMBOL[assetSymbol]?.[currentChainId]

            if (!isNative && !assetAddress) {
                throw new Error(`${assetSymbol} Asset Address not found for current network`)
            }

            // REPLACE THIS WITH YOUR OWN ETH ADDRESS
            const recipientAddress = '0x1234567890123456789012345678901234567000'

            console.log('Opening WalletSend with arguments:', {
                amount,
                assetAddress,
                namespace: CommonConstantsUtil.CHAIN.EVM,
                chainId: currentChainId,
                to: recipientAddress
            })

            const response = await open({
                view: 'WalletSend',
                arguments: {
                    amount,
                    assetAddress,
                    namespace: CommonConstantsUtil.CHAIN.EVM,
                    chainId: currentChainId,
                    to: recipientAddress
                }
            })

            console.log('Open response:', response)

            const hash = (response as any)?.hash

            if (hash) {
                toast({
                    title: ConstantsUtil.SigningSucceededToastTitle,
                    description: hash,
                    type: 'success'
                })
            } else {
                console.log('Modal opened, no immediate hash returned.')
            }

            return response
        } catch (err) {
            console.error('Error in handleOpenSendWithArguments:', err)
            toast({
                title: ConstantsUtil.SigningFailedToastTitle,
                description: err instanceof Error ? err.message : 'Failed to send',
                type: 'error'
            })
            throw err
        }
    }

    return { handleOpenSendWithArguments }
}
