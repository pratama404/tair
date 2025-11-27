import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'
import { Activity, Wifi, Clock, TrendingUp } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { WalletConnect } from '../components/ui/WalletConnect'
import { AQIRecommendations } from '../components/ui/AQIRecommendations'

import { useSensorData } from '../hooks/useSensorData'
import { useApp } from '../contexts/AppContext'

function getAQIColor(aqi) {
  if (aqi <= 50) return 'text-green-500'
  if (aqi <= 100) return 'text-yellow-500'
  if (aqi <= 150) return 'text-orange-500'
  return 'text-red-500'
}

function getAQIStatus(aqi) {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy'
  return 'Hazardous'
}

export function Dashboard() {
  const { user, sensorData, chartData, loading, lastUpdate, claimReward } = useSensorData()
  const { state } = useApp()
  const [showAQIRecommendations, setShowAQIRecommendations] = useState(false)

  return (
    <div className="p-4 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            🌬️ T-Air
          </h1>
          <p className="text-sm text-gray-600">Decentralized Air Quality Network</p>
        </div>
        <div className="flex gap-2">
          <WalletConnect />
        </div>
      </div>

      {/* Alert Card */}
      {sensorData.aqi > 150 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-2xl shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              ⚠️
            </div>
            <div>
              <p className="font-bold">Air Quality Alert</p>
              <p className="text-sm opacity-90">AQI {sensorData.aqi} - {getAQIStatus(sensorData.aqi)} air quality detected</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AQI Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="text-blue-500" size={20} />
              Air Quality Index
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <button 
                  onClick={() => setShowAQIRecommendations(true)}
                  className={`text-5xl font-bold mb-2 ${getAQIColor(sensorData.aqi)} hover:scale-105 transition-transform cursor-pointer`}
                >
                  {sensorData.aqi}
                </button>
                <div className="text-sm text-gray-600 mb-2">Current AQI</div>
                <div className={`text-sm font-medium ${getAQIColor(sensorData.aqi)}`}>
                  {getAQIStatus(sensorData.aqi)}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      sensorData.aqi <= 50 ? 'bg-green-500' : 
                      sensorData.aqi <= 100 ? 'bg-yellow-500' : 
                      sensorData.aqi <= 150 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(sensorData.aqi / 2, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Wifi className="text-green-500" size={16} />
                    Sensor Status
                  </span>
                  <span className="font-medium text-green-600">🟢 Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sensor ID</span>
                  <span className="font-medium">{sensorData.sensorId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock size={16} />
                    Last Update
                  </span>
                  <span className="font-medium text-xs">
                    {lastUpdate ? formatDistanceToNow(new Date(lastUpdate), { addSuffix: true }) : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Card */}
        <Card gradient>
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              🎁 Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-white">
              <div className="text-3xl font-bold mb-2">{user?.points || 0}</div>
              <div className="text-sm opacity-90 mb-4">Points Earned</div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                <div 
                  className="h-2 bg-white rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((user?.points || 0) / 100 * 100, 100)}%` }}
                />
              </div>
              <Button
                variant="secondary"
                className="w-full bg-white text-blue-500 hover:bg-white/90"
                disabled={!user || user.points < 100}
              >
                {user?.points >= 100 ? '🎉 Claim 0.1 TON' : `Need ${100 - (user?.points || 0)} more`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="text-blue-500" size={20} />
            Real-time Data
            <div className="ml-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-600">Live</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => value.split(':').slice(0, 2).join(':')}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => `Time: ${value}`}
                  formatter={(value) => [`${value}`, 'AQI']}
                />
                <Line 
                  type="monotone" 
                  dataKey="aqi" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-green-400 to-emerald-400 text-white">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                📊
              </div>
              <div>
                <h4 className="font-bold">Data Collection Active</h4>
                <p className="text-sm opacity-90">Contributing to air quality network</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                🔄
              </div>
              <div>
                <h4 className="font-bold">Auto-refresh Active</h4>
                <p className="text-sm opacity-90">Updates every 2 minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AQIRecommendations 
        aqi={sensorData.aqi}
        isOpen={showAQIRecommendations}
        onClose={() => setShowAQIRecommendations(false)}
      />
    </div>
  )
}