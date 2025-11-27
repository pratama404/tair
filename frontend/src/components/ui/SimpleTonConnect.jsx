import { TonConnectButton, useTonAddress } from '@tonconnect/ui-react'
import { Wallet, X } from 'lucide-react'

export function SimpleTonConnect() {
  const userFriendlyAddress = useTonAddress()

  if (userFriendlyAddress) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-green-700">
          {userFriendlyAddress.slice(0, 6)}...{userFriendlyAddress.slice(-4)}
        </span>
      </div>
    )
  }

  return (
    <div className="ton-connect-wrapper">
      <TonConnectButton />
    </div>
  )
}