import { Monitor, Moon, Sun, Smartphone, Wifi, Bell, RotateCcw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useApp } from '../contexts/AppContext'

export function Settings() {
  const { state, dispatch, addNotification } = useApp()

  const updateSetting = (key, value) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } })
    addNotification(`${key} updated to ${value}`, 'success')
  }

  const resetApp = () => {
    if (confirm('Are you sure you want to reset all app data? This cannot be undone.')) {
      dispatch({ type: 'RESET_APP' })
      addNotification('App data reset successfully', 'success')
    }
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Customize your T-Air experience</p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor size={20} className="text-blue-500" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { value: 'light', label: 'Light', icon: Sun },
              { value: 'dark', label: 'Dark', icon: Moon },
              { value: 'system', label: 'System Default', icon: Smartphone }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => updateSetting('theme', value)}
                className={`w-full p-3 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${
                  state.settings.theme === value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon size={20} className={state.settings.theme === value ? 'text-blue-500' : 'text-gray-500'} />
                <span className={`font-medium ${state.settings.theme === value ? 'text-blue-700' : 'text-gray-700'}`}>
                  {label}
                </span>
                {state.settings.theme === value && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Network Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi size={20} className="text-green-500" />
            Network Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { value: 'testnet', label: 'Testnet', desc: 'For development and testing' },
              { value: 'mainnet', label: 'Mainnet', desc: 'Production network' }
            ].map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => updateSetting('network', value)}
                className={`w-full p-3 rounded-2xl border-2 transition-all duration-300 text-left ${
                  state.settings.network === value
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-medium ${state.settings.network === value ? 'text-green-700' : 'text-gray-700'}`}>
                      {label}
                    </p>
                    <p className="text-sm text-gray-500">{desc}</p>
                  </div>
                  {state.settings.network === value && (
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell size={20} className="text-purple-500" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">Enable Notifications</p>
                <p className="text-sm text-gray-500">Receive app notifications</p>
              </div>
              <button
                onClick={() => updateSetting('notifications', !state.settings.notifications)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  state.settings.notifications ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                  state.settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-700">AQI Danger Alerts</p>
                <p className="text-sm text-gray-500">Alert when AQI exceeds 150</p>
              </div>
              <button
                onClick={() => updateSetting('alerts', !state.settings.alerts)}
                className={`w-12 h-6 rounded-full transition-all duration-300 ${
                  state.settings.alerts ? 'bg-red-500' : 'bg-gray-300'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
                  state.settings.alerts ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Reset */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RotateCcw size={20} className="text-red-500" />
            App Reset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Clear all cached data, reset chart history, and restore default settings.
          </p>
          <Button
            variant="danger"
            onClick={resetApp}
            className="w-full"
          >
            Reset App Data
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}