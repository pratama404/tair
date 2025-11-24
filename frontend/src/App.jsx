import { useState, useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import axios from 'axios'
// import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'
import './App.css'

const API_BASE = 'https://backend-972ieecg0-pratamas-projects.vercel.app/api' // Production

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sensorId, setSensorId] = useState('')
  // const [tonConnectUI] = useTonConnectUI()

  useEffect(() => {
    WebApp.ready()
    WebApp.expand()
    
    const telegramUser = WebApp.initDataUnsafe?.user
    if (telegramUser) {
      fetchUserData(telegramUser.id)
    } else {
      // For testing without Telegram
      fetchUserData(123456) // Test user ID
    }
  }, [])

  const fetchUserData = async (telegramId) => {
    try {
      const response = await axios.get(`${API_BASE}/user?telegramId=${telegramId}`)
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser({ telegramId, points: 0, sensorId: '' })
    } finally {
      setLoading(false)
    }
  }

  const connectSensor = async () => {
    if (!sensorId.trim()) return
    
    try {
      await axios.post(`${API_BASE}/connect-sensor`, {
        telegramId: user.telegramId,
        sensorId: sensorId.trim()
      })
      
      setUser(prev => ({ ...prev, sensorId: sensorId.trim() }))
      setSensorId('')
      WebApp.showAlert('Sensor connected successfully!')
    } catch (error) {
      WebApp.showAlert('Error connecting sensor')
    }
  }

  const claimReward = async () => {
    if (user.points < 100) {
      WebApp.showAlert('You need at least 100 points to claim rewards')
      return
    }

    // Temporarily disable wallet check for testing
    // if (!tonConnectUI.wallet) {
    //   WebApp.showAlert('Please connect your TON wallet first')
    //   return
    // }

    try {
      await axios.post(`${API_BASE}/claim`, {
        telegramId: user.telegramId,
        walletAddress: 'test-wallet-address'
      })
      
      setUser(prev => ({ ...prev, points: prev.points - 100 }))
      WebApp.showAlert('0.1 TON reward sent to your wallet!')
    } catch (error) {
      WebApp.showAlert('Error claiming reward')
    }
  }

  if (loading) {
    return <div className="loading">Loading T-Air...</div>
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🌬️ T-Air</h1>
        <p>Decentralized Air Quality Network</p>
        {/* <TonConnectButton /> */}
        <div style={{padding: '10px', background: '#f0f0f0', borderRadius: '8px'}}>
          💳 Wallet: Test Mode
        </div>
      </header>

      <main className="main">
        <div className="card">
          <h2>Your Stats</h2>
          <div className="stats">
            <div className="stat">
              <span className="label">Points Earned</span>
              <span className="value">{user?.points || 0}</span>
            </div>
            <div className="stat">
              <span className="label">Sensor Status</span>
              <span className="value">{user?.sensorId ? '🟢 Connected' : '🔴 Not Connected'}</span>
            </div>
          </div>
        </div>

        {!user?.sensorId && (
          <div className="card">
            <h3>Connect Your Sensor</h3>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Sensor ID (e.g., ESP32_01)"
                value={sensorId}
                onChange={(e) => setSensorId(e.target.value)}
              />
              <button onClick={connectSensor} disabled={!sensorId.trim()}>
                Connect
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <h3>Claim TON Rewards</h3>
          <p>Exchange 100 points for rewards</p>
          <button 
            onClick={claimReward} 
            disabled={user?.points < 100}
            className="claim-btn"
          >
            Claim Reward
          </button>
        </div>
      </main>
    </div>
  )
}

export default App