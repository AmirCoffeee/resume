import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { adminGetOrders, adminUpdateOrderStatus } from '../../api'
import type { Order, Page } from '../../types'
import LoadingSpinner from '../../components/LoadingSpinner'
import Pagination from '../../components/Pagination'

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  PAID: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
}

const statusLabels: Record<string, string> = {
  PENDING: 'در انتظار', PAID: 'پرداخت شده', PROCESSING: 'در پردازش',
  SHIPPED: 'ارسال شده', DELIVERED: 'تحویل داده شده',
  CANCELLED: 'لغو شده', REFUNDED: 'مسترد شده',
}

const allStatuses = Object.keys(statusLabels)

export default function AdminOrdersPage() {
  const [data, setData] = useState<Page<Order> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  const load = () => {
    setLoading(true)
    adminGetOrders(page, 20).then((r) => setData(r.data)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page])

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await adminUpdateOrderStatus(orderId, status)
      toast.success('وضعیت به‌روز شد')
      load()
    } catch { toast.error('خطا') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">سفارشات</h1>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600"># سفارش</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">کاربر</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">مبلغ</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">تاریخ</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {data?.content.map((order) => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-700">#{order.id}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-900">{order.receiverName || '—'}</div>
                      <div className="text-xs text-gray-400" dir="ltr">{order.receiverPhone}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-primary-600">
                      {order.finalAmount?.toLocaleString('fa-IR')} تومان
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('fa-IR')}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded-lg border-0 cursor-pointer ${statusColors[order.status] || 'bg-gray-100'}`}
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data && <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />}
        </>
      )}
    </div>
  )
}
