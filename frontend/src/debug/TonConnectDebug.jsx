import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { useState, useEffect } from 'react'

export function TonConnectDebug() {
  const [tonConnectUI] = useTonConnectUI()
  const userFriendlyAddress = useTonAddress()
  const [debugInfo, setDebugInfo] = useState({})

  useEffect(() => {
    const info = {
      isInitialized: !!tonConnectUI,
      hasAddress: !!userFriendlyAddress,
      address: userFriendlyAddress,
      manifestUrl: tonConnectUI?.manifestUrl,
      isConnected: tonConnectUI?.connected,
      wallet: tonConnectUI?.wallet,
      account: tonConnectUI?.account
    }
    setDebugInfo(info)
    console.log('TonConnect Debug Info:', info)
  }, [tonConnectUI, userFriendlyAddress])

  const testConnection = async () => {
    try {
      console.log('Testing TonConnect...')
      if (tonConnectUI) {
        await tonConnectUI.openModal()
        console.log('Modal opened successfully')
      } else {
        console.error('TonConnect UI not initialized')
      }
    } catch (error) {
      console.error('Connection test failed:', error)
    }
  }

  return (
    <div className="fixed bottom-20 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs text-xs">
      <h4 className="font-bold mb-2">TonConnect Debug</h4>
      <div className="space-y-1">
        <div>Initialized: {debugInfo.isInitialized ? '✅' : '❌'}</div>
        <div>Connected: {debugInfo.hasAddress ? '✅' : '❌'}</div>
        <div>Address: {debugInfo.address || 'None'}</div>
        <div>Manifest: {debugInfo.manifestUrl ? '✅' : '❌'}</div>
      </div>
      <button 
        onClick={testConnection}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Test Connect
      </button>
    </div>
  )
}