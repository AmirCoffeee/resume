import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getMyOrders } from '../api'
import type { Order } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-700',
}

export default function OrdersPage() {
  const { t } = useTranslation()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders().then((r) => setOrders(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('myOrders')}</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <span className="text-5xl block mb-3">📦</span>
          سفارشی یافت نشد
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">سفارش #{order.id}</span>
                <span className={`badge ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {t(order.status.toLowerCase())}
                </span>
              </div>
              <div className="text-sm text-gray-500 mb-3">
                {new Date(order.createdAt).toLocaleDateString('fa-IR')}
              </div>
              <div className="space-y-1">
                {order.items?.map((item) => (
                  <div key={item.id} className="text-sm flex justify-between">
                    <span className="text-gray-700">{item.product?.nameFA} × {item.quantity}</span>
                    <span className="text-gray-500">{item.totalPrice?.toLocaleString('fa-IR')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                <span className="text-sm text-gray-600">مجموع</span>
                <span className="font-bold text-primary-500">
                  {order.finalAmount?.toLocaleString('fa-IR')} {t('toman')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
