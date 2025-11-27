import { User, Wallet, Radio, Edit3, Award, Save, X } from 'lucide-react'
import { useTonAddress } from '@tonconnect/ui-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useSensorData } from '../hooks/useSensorData'
import { useState } from 'react'

export function Profile() {
  const { user } = useSensorData()
  const walletAddress = useTonAddress()
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    username: 'T-Air User',
    email: '',
    location: '',
    bio: ''
  })

  const handleAddSensor = () => {
    const sensorId = prompt('Enter new sensor ID (e.g., ESP32_02):')
    if (sensorId && sensorId.trim()) {
      // Call API to add sensor
      fetch('https://backend-oqwgc3m5x-pratamas-projects.vercel.app/api/connect-sensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: user?.telegramId || 123456789,
          sensorId: sensorId.trim()
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          alert(`Sensor ${sensorId} added successfully!`)
          window.location.reload()
        } else {
          alert('Failed to add sensor')
        }
      })
      .catch(() => alert('Network error'))
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="text-white" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Profile</h1>
        <p className="text-gray-600">Manage your T-Air account</p>
      </div>

      {/* User Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User size={20} className="text-blue-500" />
            User Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">User ID</span>
                <span className="font-medium">{user?.telegramId || 'Not connected'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Username</span>
                <span className="font-medium">{editData.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{editData.email || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Location</span>
                <span className="font-medium">{editData.location || 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">January 2025</span>
              </div>
              {editData.bio && (
                <div>
                  <span className="text-gray-600 block mb-2">Bio</span>
                  <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-2xl">{editData.bio}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Username</label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({...editData, username: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Location</label>
                <input
                  type="text"
                  value={editData.location}
                  onChange={(e) => setEditData({...editData, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City, Country"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({...editData, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          )}
          
          {!isEditing ? (
            <Button 
              className="w-full mt-4 flex items-center gap-2"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 size={16} />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-3 mt-4">
              <Button 
                variant="secondary"
                className="flex-1 flex items-center gap-2"
                onClick={() => setIsEditing(false)}
              >
                <X size={16} />
                Cancel
              </Button>
              <Button 
                className="flex-1 flex items-center gap-2"
                onClick={() => {
                  // Save profile data (in real app, send to API)
                  setIsEditing(false)
                  alert('Profile updated successfully!')
                }}
              >
                <Save size={16} />
                Save
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wallet Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet size={20} className="text-green-500" />
            Wallet Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${walletAddress ? 'text-green-600' : 'text-red-600'}`}>
                {walletAddress ? '🟢 Connected' : '🔴 Not Connected'}
              </span>
            </div>
            {walletAddress && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Address</span>
                <span className="font-mono text-sm">
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Network</span>
              <span className="font-medium">TON Testnet</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award size={20} className="text-purple-500" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-2xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">{user?.points || 0}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-2xl">
              <div className="text-2xl font-bold text-green-600 mb-1">1</div>
              <div className="text-sm text-gray-600">Sensors Linked</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-2xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">24/7</div>
              <div className="text-sm text-gray-600">Monitoring</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-2xl">
              <div className="text-2xl font-bold text-orange-600 mb-1">0</div>
              <div className="text-sm text-gray-600">Rewards Claimed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio size={20} className="text-cyan-500" />
            Connected Sensors
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
                  📡
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user?.sensorId || 'ESP32_01'}</p>
                  <p className="text-sm text-gray-500">MQ-135 Air Quality Sensor</p>
                </div>
              </div>
              <div className="text-green-500 font-medium text-sm">🟢 Online</div>
            </div>
          </div>
          <Button 
            variant="secondary" 
            className="w-full mt-4"
            onClick={handleAddSensor}
          >
            Add New Sensor
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}