import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, X, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from './Button'
import { useApp } from '../../contexts/AppContext'

export function WalletConnect() {
  const [tonConnectUI] = useTonConnectUI()
  const userFriendlyAddress = useTonAddress()
  const { addNotification } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState('')

  useEffect(() => {
    if (userFriendlyAddress) {
      addNotification('TON wallet connected successfully!', 'success')
      setShowModal(false)
      setIsConnecting(false)
      setConnectionError('')
    }
  }, [userFriendlyAddress, addNotification])

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false)
      }
    }
    
    if (showModal) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [showModal])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setConnectionError('')
      
      // Check if TonConnect is properly initialized
      if (!tonConnectUI) {
        throw new Error('TonConnect not initialized')
      }
      
      await tonConnectUI.openModal()
    } catch (error) {
      console.error('Wallet connection error:', error)
      setConnectionError(error.message || 'Failed to connect wallet')
      addNotification('Failed to connect wallet: ' + (error.message || 'Unknown error'), 'error')
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect()
      addNotification('Wallet disconnected', 'info')
    } catch (error) {
      console.error('Disconnect error:', error)
    }
  }

  if (userFriendlyAddress) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-green-100 rounded-full">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-green-700">
          {userFriendlyAddress.slice(0, 6)}...{userFriendlyAddress.slice(-4)}
        </span>
        <button
          onClick={handleDisconnect}
          className="text-green-600 hover:text-green-800 ml-1"
        >
          <X size={14} />
        </button>
      </div>
    )
  }

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="flex items-center gap-2"
        size="sm"
      >
        <Wallet size={16} />
        Connect TON
      </Button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowModal(false)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="text-blue-500" size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Connect your TON wallet
                </h3>
                <p className="text-gray-600 text-sm">
                  Scan with your mobile wallet or choose from available options
                </p>
              </div>

              {connectionError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2">
                  <AlertCircle className="text-red-500" size={16} />
                  <span className="text-red-700 text-sm">{connectionError}</span>
                </div>
              )}

              <div className="mb-6">
                <div className="ton-connect-button-container">
                  <TonConnectButton className="ton-connect-custom" />
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-xs text-gray-500">
                  Or use the button above to connect directly
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowModal(false)
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleConnect}
                  disabled={isConnecting}
                >
                  {isConnecting ? 'Connecting...' : 'Open Wallet Selector'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}