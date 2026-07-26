import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { adminDashboard } from '../../api'
import { MdShoppingBag, MdShoppingCart, MdPeople, MdPendingActions } from 'react-icons/md'

interface Stats {
  totalProducts: number
  totalOrders: number
  totalUsers: number
  pendingOrders: number
}

const cards = [
  { key: 'totalProducts', label: 'محصولات', icon: MdShoppingBag, color: 'bg-blue-50 text-blue-600' },
  { key: 'totalOrders', label: 'سفارشات', icon: MdShoppingCart, color: 'bg-green-50 text-green-600' },
  { key: 'totalUsers', label: 'کاربران', icon: MdPeople, color: 'bg-purple-50 text-purple-600' },
  { key: 'pendingOrders', label: 'انتظار پرداخت', icon: MdPendingActions, color: 'bg-orange-50 text-orange-600' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    adminDashboard().then((r) => setStats(r.data as Stats)).catch(() => {})
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">داشبورد</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card p-6"
          >
            <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-4`}>
              <card.icon size={24} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats ? stats[card.key as keyof Stats].toLocaleString('fa-IR') : '—'}
            </div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
