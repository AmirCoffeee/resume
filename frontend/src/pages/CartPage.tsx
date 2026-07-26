import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MdDelete, MdAdd, MdRemove, MdShoppingCart } from 'react-icons/md'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { useSettingsStore } from '../store/useSettingsStore'

export default function CartPage() {
  const { t, i18n } = useTranslation()
  const isFa = i18n.language === 'fa'
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const { token } = useAuthStore()
  const settings = useSettingsStore((s) => s.settings)

  const total = totalPrice()
  const shippingCost = settings?.freeShipping || total >= (settings?.freeShippingThreshold ?? 500000)
    ? 0 : (settings?.shippingCost ?? 50000)
  const finalTotal = total + shippingCost

  const handleCheckout = () => {
    if (!token) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <MdShoppingCart size={80} className="text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">{t('emptyCart')}</h2>
          <Link to="/products" className="btn-primary inline-block mt-4">{t('products')}</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t('cart')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-3">
          <AnimatePresence>
            {items.map((item) => {
              const name = isFa ? item.product.nameFA : item.product.nameEN
              const price = item.product.discountPrice ?? item.product.price
              return (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="card p-4 flex gap-4"
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                    {item.product.images?.[0]
                      ? <img src={item.product.images[0]} alt={name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-gray-300"><MdShoppingCart size={28} /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm text-gray-900 line-clamp-1">{name}</h3>
                    <div className="text-primary-500 font-bold mt-1 text-sm">
                      {price.toLocaleString('fa-IR')} {t('toman')}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="px-2 py-1 hover:bg-gray-50 transition-colors">
                          <MdRemove size={16} />
                        </button>
                        <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="px-2 py-1 hover:bg-gray-50 transition-colors">
                          <MdAdd size={16} />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700 shrink-0">
                    {(price * item.quantity).toLocaleString('fa-IR')}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="card p-5 h-fit sticky top-20">
          <h3 className="font-semibold text-gray-900 mb-4">خلاصه سفارش</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('total')}</span>
              <span>{total.toLocaleString('fa-IR')} {t('toman')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('shipping')}</span>
              <span className={shippingCost === 0 ? 'text-green-500 font-medium' : ''}>
                {shippingCost === 0 ? t('freeShipping') : `${shippingCost.toLocaleString('fa-IR')} ${t('toman')}`}
              </span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex justify-between font-bold text-base">
              <span>مجموع نهایی</span>
              <span className="text-primary-500">{finalTotal.toLocaleString('fa-IR')} {t('toman')}</span>
            </div>
          </div>
          <button onClick={handleCheckout} className="btn-primary w-full mt-5">
            {t('checkout')}
          </button>
        </div>
      </div>
    </div>
  )
}
