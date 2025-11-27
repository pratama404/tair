import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Shield, Home, Activity } from 'lucide-react'
import { Button } from './Button'

const aqiRecommendations = {
  good: {
    level: "Good (0-50)",
    color: "text-green-500",
    bgColor: "bg-green-50",
    icon: Heart,
    recommendations: [
      "Perfect air quality for outdoor activities",
      "Great time for exercise and sports",
      "Windows can be kept open for fresh air",
      "No health precautions needed"
    ]
  },
  moderate: {
    level: "Moderate (51-100)", 
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    icon: Activity,
    recommendations: [
      "Air quality is acceptable for most people",
      "Sensitive individuals may experience minor issues",
      "Outdoor activities are generally safe",
      "Consider reducing prolonged outdoor exertion"
    ]
  },
  unhealthy: {
    level: "Unhealthy for Sensitive (101-150)",
    color: "text-orange-500", 
    bgColor: "bg-orange-50",
    icon: Shield,
    recommendations: [
      "Sensitive groups should limit outdoor activities",
      "Consider wearing a mask when outside",
      "Keep windows closed and use air purifier",
      "Reduce outdoor exercise intensity"
    ]
  },
  dangerous: {
    level: "Unhealthy (151+)",
    color: "text-red-500",
    bgColor: "bg-red-50", 
    icon: Home,
    recommendations: [
      "Everyone should avoid outdoor activities",
      "Stay indoors with windows closed",
      "Use air purifiers and masks if available",
      "Seek medical attention if experiencing symptoms"
    ]
  }
}

function getAQICategory(aqi) {
  if (aqi <= 50) return 'good'
  if (aqi <= 100) return 'moderate'  
  if (aqi <= 150) return 'unhealthy'
  return 'dangerous'
}

export function AQIRecommendations({ aqi, isOpen, onClose }) {
  const category = getAQICategory(aqi)
  const data = aqiRecommendations[category]
  const Icon = data.icon

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`bg-white rounded-3xl p-6 max-w-md w-full ${data.bgColor}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${data.bgColor} rounded-2xl flex items-center justify-center`}>
                  <Icon className={data.color} size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">AQI: {aqi}</h3>
                  <p className={`text-sm font-medium ${data.color}`}>{data.level}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-gray-800 mb-3">Health Recommendations:</h4>
              <ul className="space-y-2">
                {data.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className={`w-2 h-2 ${data.color.replace('text-', 'bg-')} rounded-full mt-2 flex-shrink-0`} />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>

            <Button
              className="w-full"
              onClick={onClose}
            >
              Got it
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}