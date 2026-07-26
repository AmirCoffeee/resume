import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { getBanners, getFeatured, getCategories } from '../api'
import type { Banner, Product, Category } from '../types'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HomePage() {
  const { t, i18n } = useTranslation()
  const isFa = i18n.language === 'fa'
  const [banners, setBanners] = useState<Banner[]>([])
  const [featured, setFeatured] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getBanners(), getFeatured(), getCategories()])
      .then(([b, f, c]) => {
        setBanners(b.data)
        setFeatured(f.data)
        setCategories(c.data)
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner size={48} />

  return (
    <div>
      {/* Hero Slider */}
      {banners.length > 0 && (
        <section className="w-full">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            loop
            className="w-full"
          >
            {banners.map((banner) => (
              <SwiperSlide key={banner.id}>
                <div
                  className="relative w-full h-64 md:h-96 bg-gradient-to-l from-primary-500 to-primary-600 flex items-center overflow-hidden"
                >
                  {banner.imageUrl && (
                    <img src={banner.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
                  )}
                  <div className="relative z-10 px-8 md:px-16 text-white">
                    <motion.h1
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="text-3xl md:text-5xl font-bold mb-3"
                    >
                      {isFa ? banner.titleFA : banner.titleEN}
                    </motion.h1>
                    {(banner.subtitleFA || banner.subtitleEN) && (
                      <p className="text-lg opacity-90 mb-6">
                        {isFa ? banner.subtitleFA : banner.subtitleEN}
                      </p>
                    )}
                    {banner.linkUrl && (
                      <Link to={banner.linkUrl} className="bg-white text-primary-600 font-semibold px-6 py-2.5 rounded-xl hover:shadow-lg transition-all">
                        مشاهده
                      </Link>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}

      {/* Hero fallback if no banners */}
      {banners.length === 0 && (
        <section className="bg-gradient-to-l from-primary-500 to-primary-600 text-white py-20 px-4 text-center">
          <motion.h1 initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-4xl font-bold mb-4">
            خوش آمدید
          </motion.h1>
          <p className="text-lg opacity-90 mb-8">بهترین محصولات با بهترین قیمت</p>
          <Link to="/products" className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-xl hover:shadow-lg transition-all">
            {t('products')}
          </Link>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Categories */}
        {categories.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('categories')}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/products?categoryId=${cat.id}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-gray-50 hover:bg-primary-50
                               hover:text-primary-600 transition-all group text-center"
                  >
                    {cat.icon && <span className="text-3xl">{cat.icon}</span>}
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">
                      {isFa ? cat.nameFA : cat.nameEN}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Products */}
        {featured.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{t('featured')}</h2>
              <Link to="/products" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                مشاهده همه ←
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {featured.slice(0, 10).map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
