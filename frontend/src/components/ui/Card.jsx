import { motion } from 'framer-motion'

export function Card({ children, className = '', gradient = false, ...props }) {
  const baseClasses = "rounded-3xl shadow-xl border border-white/20 p-6 backdrop-blur-lg"
  const bgClasses = gradient 
    ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white" 
    : "bg-white/70"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseClasses} ${bgClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-bold ${className}`}>
      {children}
    </h3>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}