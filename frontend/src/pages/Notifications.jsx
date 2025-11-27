import { Bell, CheckCircle, AlertCircle, Info, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useApp } from '../contexts/AppContext'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
}

const colors = {
  success: 'text-green-500 bg-green-50',
  error: 'text-red-500 bg-red-50',
  info: 'text-blue-500 bg-blue-50'
}

export function Notifications() {
  const { state, dispatch } = useApp()
  const [notificationSettings, setNotificationSettings] = useState({
    aqi: true,
    danger: true,
    rewards: true
  })

  const toggleNotificationSetting = (type) => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const clearAllNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' })
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your T-Air system</p>
        </div>
        {state.notifications.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={clearAllNotifications}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear All
          </Button>
        )}
      </div>

      {state.notifications.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-gray-400" size={24} />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No notifications yet</h3>
            <p className="text-gray-600">You'll see notifications about your air quality data here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {state.notifications.map((notification) => {
              const Icon = icons[notification.type]
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card>
                    <CardContent>
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[notification.type]}`}>
                          <Icon size={20} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-1">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} className="text-purple-500" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">AQI Updates</p>
                <p className="text-sm text-gray-500">Get notified of new readings</p>
              </div>
              <button
                onClick={() => toggleNotificationSetting('aqi')}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  notificationSettings.aqi ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                  notificationSettings.aqi ? 'translate-x-6' : 'translate-x-0.5'
                } mt-0.5`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Danger Alerts</p>
                <p className="text-sm text-gray-500">Alert when AQI exceeds safe levels</p>
              </div>
              <div className="w-12 h-6 bg-red-500 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full shadow-md translate-x-6 mt-0.5" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Reward Notifications</p>
                <p className="text-sm text-gray-500">Get notified when you earn points</p>
              </div>
              <div className="w-12 h-6 bg-green-500 rounded-full">
                <div className="w-5 h-5 bg-white rounded-full shadow-md translate-x-6 mt-0.5" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}