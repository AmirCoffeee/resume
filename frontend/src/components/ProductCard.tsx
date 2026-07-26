import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { MdShoppingCart, MdStar } from 'react-icons/md'
import { useCartStore } from '../store/useCartStore'
import toast from 'react-hot-toast'
import type { Product } from '../types'

interface Props {
  product: Product
  index?: number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { t, i18n } = useTranslation()
  const addItem = useCartStore((s) => s.addItem)
  const isFa = i18n.language === 'fa'

  const name = isFa ? product.nameFA : product.nameEN
  const price = product.discountPrice ?? product.price
  const hasDiscount = !!product.discountPrice
  const discount = hasDiscount
    ? Math.round((1 - product.discountPrice! / product.price) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock === 0) return
    addItem(product)
    toast.success(`${name} به سبد اضافه شد`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="card group overflow-hidden"
    >
      <Link to={`/products/${product.id}`}>
        {/* Image */}
        <div className="relative overflow-hidden bg-gray-50 aspect-square">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <MdShoppingCart size={48} />
            </div>
          )}
          {hasDiscount && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
              {discount}%
            </span>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <span className="text-gray-500 font-medium text-sm">{t('outOfStock')}</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2 leading-relaxed">{name}</h3>

          {/* Rating */}
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <MdStar className="text-amber-400" size={14} />
              <span className="text-xs text-gray-500">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between mt-auto">
            <div>
              <div className="text-primary-500 font-bold text-base">
                {price.toLocaleString('fa-IR')} {t('toman')}
              </div>
              {hasDiscount && (
                <div className="text-gray-400 text-xs line-through">
                  {product.price.toLocaleString('fa-IR')}
                </div>
              )}
            </div>
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="p-2 bg-primary-50 hover:bg-primary-500 text-primary-500 hover:text-white
                         rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MdShoppingCart size={20} />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
