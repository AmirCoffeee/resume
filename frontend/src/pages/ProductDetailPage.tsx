import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { MdShoppingCart, MdStar, MdArrowBack, MdAdd, MdRemove } from 'react-icons/md'
import { getProduct } from '../api'
import type { Product } from '../types'
import { useCartStore } from '../store/useCartStore'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isFa = i18n.language === 'fa'
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [qty, setQty] = useState(1)
  const [activeImg, setActiveImg] = useState(0)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => {
    getProduct(Number(id))
      .then((r) => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner size={48} />
  if (!product) return null

  const name = isFa ? product.nameFA : product.nameEN
  const desc = isFa ? product.descriptionFA : product.descriptionEN
  const price = product.discountPrice ?? product.price
  const hasDiscount = !!product.discountPrice
  const discount = hasDiscount ? Math.round((1 - product.discountPrice! / product.price) * 100) : 0

  const handleAddToCart = () => {
    addItem(product, qty)
    toast.success(`${name} به سبد اضافه شد`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-500 mb-6 transition-colors">
        <MdArrowBack />
        بازگشت
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-2xl overflow-hidden bg-gray-50 mb-3"
          >
            {product.images?.[activeImg] ? (
              <img src={product.images[activeImg]} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <MdShoppingCart size={80} />
              </div>
            )}
          </motion.div>
          {product.images?.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${activeImg === i ? 'border-primary-500' : 'border-transparent'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">{name}</h1>

          {product.reviewCount > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1,2,3,4,5].map((s) => (
                  <MdStar key={s} className={s <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'} size={18} />
                ))}
              </div>
              <span className="text-sm text-gray-500">({product.reviewCount} نظر)</span>
            </div>
          )}

          {/* Price */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-primary-500">
                {price.toLocaleString('fa-IR')}
              </span>
              <span className="text-gray-500">{t('toman')}</span>
              {hasDiscount && (
                <span className="badge bg-red-100 text-red-600">{discount}% تخفیف</span>
              )}
            </div>
            {hasDiscount && (
              <div className="text-sm text-gray-400 line-through mt-1">
                {product.price.toLocaleString('fa-IR')} {t('toman')}
              </div>
            )}
          </div>

          {/* Stock */}
          <div className={`flex items-center gap-2 mb-6 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
            {product.stock > 0 ? `${t('inStock')} (${product.stock} عدد)` : t('outOfStock')}
          </div>

          {/* Qty + Add to Cart */}
          {product.stock > 0 && (
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                  <MdRemove />
                </button>
                <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                  <MdAdd />
                </button>
              </div>
              <button onClick={handleAddToCart} className="btn-primary flex items-center gap-2 flex-1 justify-center">
                <MdShoppingCart size={20} />
                {t('addToCart')}
              </button>
            </div>
          )}

          {/* Description */}
          {desc && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">توضیحات</h3>
              <p className="text-sm text-gray-600 leading-7">{desc}</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
