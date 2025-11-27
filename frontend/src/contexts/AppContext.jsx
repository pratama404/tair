import { createContext, useContext, useReducer, useEffect } from 'react'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

const AppContext = createContext()

const initialState = {
  user: null,
  sensorData: { sensorId: '', aqi: 0 },
  chartData: [],
  notifications: [],
  settings: {
    theme: 'system',
    network: 'testnet',
    notifications: true,
    alerts: true
  },
  loading: false,
  lastUpdate: null
}

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_SENSOR_DATA':
      return { 
        ...state, 
        sensorData: action.payload,
        lastUpdate: new Date().toISOString()
      }
    case 'ADD_CHART_DATA':
      const newChartData = [...state.chartData, action.payload].slice(-20)
      localStorage.setItem('t-air-chart-data', JSON.stringify(newChartData))
      return { ...state, chartData: newChartData }
    case 'LOAD_CHART_DATA':
      return { ...state, chartData: action.payload }
    case 'ADD_NOTIFICATION':
      const newNotifications = [action.payload, ...state.notifications].slice(0, 10)
      return { ...state, notifications: newNotifications }
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] }
    case 'UPDATE_SETTINGS':
      const newSettings = { ...state.settings, ...action.payload }
      localStorage.setItem('t-air-settings', JSON.stringify(newSettings))
      return { ...state, settings: newSettings }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'RESET_APP':
      localStorage.removeItem('t-air-chart-data')
      localStorage.removeItem('t-air-settings')
      return { ...initialState, settings: initialState.settings }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    const savedChartData = localStorage.getItem('t-air-chart-data')
    const savedSettings = localStorage.getItem('t-air-settings')
    
    if (savedChartData) {
      dispatch({ type: 'LOAD_CHART_DATA', payload: JSON.parse(savedChartData) })
    }
    
    if (savedSettings) {
      dispatch({ type: 'UPDATE_SETTINGS', payload: JSON.parse(savedSettings) })
    }
  }, [])

  const addNotification = (message, type = 'info') => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: Date.now(),
        message,
        type,
        timestamp: new Date().toISOString()
      }
    })
  }

  return (
    <TonConnectUIProvider manifestUrl="https://ton-connect.github.io/demo-dapp-with-react-ui/tonconnect-manifest.json">
      <AppContext.Provider value={{ state, dispatch, addNotification }}>
        {children}
      </AppContext.Provider>
    </TonConnectUIProvider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}