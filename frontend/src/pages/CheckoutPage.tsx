import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { createOrder } from '../api'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { useSettingsStore } from '../store/useSettingsStore'

export default function CheckoutPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const settings = useSettingsStore((s) => s.settings)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    address: user?.address || '',
    receiverName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    receiverPhone: user?.phone || '',
  })

  const total = totalPrice()
  const shippingCost = settings?.freeShipping || total >= (settings?.freeShippingThreshold ?? 500000)
    ? 0 : (settings?.shippingCost ?? 50000)
  const finalTotal = total + shippingCost

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.address || !form.receiverName || !form.receiverPhone) {
      toast.error('لطفاً همه فیلدها را پر کنید')
      return
    }
    setLoading(true)
    try {
      const orderData = {
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        ...form,
      }
      const res = await createOrder(orderData)
      clearCart()
      // Redirect to payment gateway
      toast.success('سفارش ثبت شد - در حال انتقال به درگاه پرداخت...')
      setTimeout(() => navigate(`/orders`), 1500)
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'خطا در ثبت سفارش')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('checkout')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form */}
        <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleSubmit} className="card p-6 space-y-4">
          <h2 className="font-semibold text-gray-900 mb-2">{t('receiverInfo')}</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('receiverName')}</label>
            <input className="input" value={form.receiverName} onChange={(e) => setForm({ ...form, receiverName: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('receiverPhone')}</label>
            <input className="input" dir="ltr" value={form.receiverPhone} onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('shippingAddress')}</label>
            <textarea className="input resize-none" rows={3} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t('loading') : 'پرداخت و ثبت سفارش'}
          </button>
        </motion.form>

        {/* Order Summary */}
        <div className="card p-6 h-fit">
          <h2 className="font-semibold text-gray-900 mb-4">خلاصه سفارش</h2>
          <div className="space-y-2 text-sm">
            {items.map((i) => (
              <div key={i.product.id} className="flex justify-between text-gray-600">
                <span className="line-clamp-1 flex-1">{i.product.nameFA} × {i.quantity}</span>
                <span className="mr-2 shrink-0">
                  {((i.product.discountPrice ?? i.product.price) * i.quantity).toLocaleString('fa-IR')}
                </span>
              </div>
            ))}
            <hr className="border-gray-100 my-2" />
            <div className="flex justify-between">
              <span className="text-gray-600">{t('shipping')}</span>
              <span className={shippingCost === 0 ? 'text-green-500' : ''}>
                {shippingCost === 0 ? t('freeShipping') : `${shippingCost.toLocaleString('fa-IR')}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base pt-2">
              <span>مجموع</span>
              <span className="text-primary-500">{finalTotal.toLocaleString('fa-IR')} {t('toman')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
