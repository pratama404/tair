import { motion } from 'framer-motion'

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  className = '',
  ...props 
}) {
  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg',
    secondary: 'bg-white/20 text-gray-700 border border-gray-200 hover:bg-white/30',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
  }

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        rounded-2xl font-medium transition-all duration-300 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}