import { useEffect, useCallback } from 'react'
import axios from 'axios'
import { useApp } from '../contexts/AppContext'

const API_BASE = 'https://backend-oqwgc3m5x-pratamas-projects.vercel.app/api'

export function useSensorData() {
  const { state, dispatch, addNotification } = useApp()

  const fetchUserData = useCallback(async (telegramId = 123456789) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await axios.get(`${API_BASE}/user?telegramId=${telegramId}`)
      dispatch({ type: 'SET_USER', payload: response.data })
    } catch (error) {
      console.error('Error fetching user data:', error)
      addNotification('Failed to load user data', 'error')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [dispatch, addNotification])

  const fetchSensorData = useCallback(async () => {
    try {
      // Try to get real data from backend first
      const response = await axios.get(`${API_BASE}/sensor-data`)
      const sensorData = response.data
      
      dispatch({ type: 'SET_SENSOR_DATA', payload: sensorData })
      
      // Add to chart data only if AQI changed
      const lastPoint = state.chartData[state.chartData.length - 1]
      if (!lastPoint || lastPoint.aqi !== sensorData.aqi) {
        const chartPoint = {
          time: new Date().toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          aqi: sensorData.aqi,
          timestamp: Date.now()
        }
        dispatch({ type: 'ADD_CHART_DATA', payload: chartPoint })
        
        // Only notify on significant changes
        if (Math.abs((lastPoint?.aqi || 0) - sensorData.aqi) > 10) {
          addNotification(`AQI updated: ${sensorData.aqi}`, 'info')
        }
      }

      // Check for alerts only on high values
      if (sensorData.aqi > 150 && (!lastPoint || lastPoint.aqi <= 150)) {
        addNotification(`⚠️ High AQI detected: ${sensorData.aqi}`, 'error')
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error)
      // Fallback to mock data if API fails
      const mockData = {
        sensorId: 'ESP32_01',
        aqi: Math.floor(Math.random() * 100) + 30
      }
      dispatch({ type: 'SET_SENSOR_DATA', payload: mockData })
    }
  }, [dispatch, addNotification, state.chartData])

  const claimReward = useCallback(async (walletAddress) => {
    try {
      if (!state.user || state.user.points < 100) {
        addNotification('Need 100+ points to claim rewards', 'error')
        return
      }

      const response = await axios.post(`${API_BASE}/claim`, {
        telegramId: state.user.telegramId,
        walletAddress
      })

      dispatch({ 
        type: 'SET_USER', 
        payload: { ...state.user, points: state.user.points - 100 }
      })
      
      addNotification('Reward +5 points claimed!', 'success')
    } catch (error) {
      addNotification('Failed to claim reward', 'error')
    }
  }, [state.user, dispatch, addNotification])

  // Auto-fetch with proper intervals
  useEffect(() => {
    fetchUserData()
    fetchSensorData()
    
    // Fetch user data every 5 minutes
    const userInterval = setInterval(fetchUserData, 300000)
    // Fetch sensor data every 2 minutes
    const sensorInterval = setInterval(fetchSensorData, 120000)
    
    return () => {
      clearInterval(userInterval)
      clearInterval(sensorInterval)
    }
  }, [])

  return {
    user: state.user,
    sensorData: state.sensorData,
    chartData: state.chartData,
    loading: state.loading,
    lastUpdate: state.lastUpdate,
    claimReward,
    refetch: fetchSensorData
  }
}