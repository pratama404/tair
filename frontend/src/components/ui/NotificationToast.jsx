import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useApp } from '../../contexts/AppContext'
import { formatDistanceToNow } from 'date-fns'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
}

const colors = {
  success: 'bg-green-500',
  error: 'bg-red-500', 
  info: 'bg-blue-500'
}

export function NotificationToast() {
  const { state, dispatch } = useApp()
  const latestNotification = state.notifications[0]

  if (!latestNotification) return null

  const Icon = icons[latestNotification.type]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-4 left-4 right-4 z-50"
      >
        <div className={`${colors[latestNotification.type]} text-white p-4 rounded-2xl shadow-lg flex items-center gap-3`}>
          <Icon size={20} />
          <div className="flex-1">
            <p className="font-medium">{latestNotification.message}</p>
            <p className="text-xs opacity-75">
              {formatDistanceToNow(new Date(latestNotification.timestamp), { addSuffix: true })}
            </p>
          </div>
          <button
            onClick={() => dispatch({ type: 'CLEAR_NOTIFICATIONS' })}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}