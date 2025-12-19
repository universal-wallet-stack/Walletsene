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

    const handleOpenSendWithArguments = async (assetSymbol?: string, amount: string = '1') => {
        try {
            if (!address) {
                throw new Error('Wallet not connected')
            }

            if (!assetSymbol) {
                console.log('No assetSymbol provided, opening Account view')
                await open({ view: 'Account' })
                return
            }

            const nativeSymbol = caipNetwork?.nativeCurrency?.symbol?.toLowerCase() || 'eth'
            const isNative = assetSymbol.toLowerCase() === nativeSymbol || assetSymbol.toLowerCase() === 'eth'

            let assetAddress = isNative
                ? undefined
                : TokenUtil.TOKEN_ADDRESSES_BY_SYMBOL[assetSymbol]?.[currentChainId]

            // Fallback for common tokens if TokenUtil lookup fails
            if (!isNative && !assetAddress) {
                const upperSymbol = assetSymbol.toUpperCase()
                // Common token addresses for Mainnet (1) and Base (8453)
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
                assetAddress = fallbacks[upperSymbol]?.[currentChainId]
            }

            if (!isNative && !assetAddress) {
                throw new Error(`${assetSymbol} Asset Address not found for current network (${currentChainId})`)
            }

            // REPLACE THIS WITH YOUR OWN ETH ADDRESS
            const recipientAddress = '0x1234567890123456789012345678901234567000'

            const sendArgs = {
                amount,
                assetAddress,
                namespace: CommonConstantsUtil.CHAIN.EVM,
                chainId: currentChainId,
                to: recipientAddress
            }

            console.log('Opening WalletSend with arguments:', {
                isNative,
                nativeSymbol,
                ...sendArgs
            })

            const response = await open({
                view: 'WalletSend',
                arguments: sendArgs
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
