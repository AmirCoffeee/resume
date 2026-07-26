import { motion } from 'framer-motion'

export default function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        style={{ width: size, height: size }}
        className="rounded-full border-4 border-gray-100 border-t-primary-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
