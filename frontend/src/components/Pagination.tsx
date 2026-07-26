import { motion } from 'framer-motion'

interface Props {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40
                   hover:border-primary-300 transition-colors disabled:cursor-not-allowed"
      >
        قبلی
      </button>

      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i).map((i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(i)}
          className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
            page === i
              ? 'bg-primary-500 text-white shadow-sm'
              : 'border border-gray-200 hover:border-primary-300'
          }`}
        >
          {i + 1}
        </motion.button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="px-4 py-2 rounded-xl border border-gray-200 text-sm disabled:opacity-40
                   hover:border-primary-300 transition-colors disabled:cursor-not-allowed"
      >
        بعدی
      </button>
    </div>
  )
}
