import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getProducts, getCategories } from '../api'
import type { Product, Category, Page } from '../types'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import Pagination from '../components/Pagination'

export default function ProductsPage() {
  const { t, i18n } = useTranslation()
  const isFa = i18n.language === 'fa'
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState<Page<Product> | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const page = parseInt(searchParams.get('page') || '0')
  const categoryId = searchParams.get('categoryId')
  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'newest'

  useEffect(() => {
    getCategories().then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params: Record<string, unknown> = { page, size: 12, sort }
    if (categoryId) params.categoryId = categoryId
    if (q) params.q = q

    getProducts(params)
      .then((r) => setData(r.data))
      .finally(() => setLoading(false))
  }, [page, categoryId, q, sort])

  const setParam = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams)
    p.set(key, val)
    if (key !== 'page') p.set('page', '0')
    setSearchParams(p)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-56 shrink-0">
          <div className="card p-4 sticky top-20">
            <h3 className="font-semibold text-gray-900 mb-3">{t('categories')}</h3>
            <ul className="space-y-1">
              <li>
                <button
                  onClick={() => { const p = new URLSearchParams(searchParams); p.delete('categoryId'); p.set('page','0'); setSearchParams(p) }}
                  className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${!categoryId ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-gray-50'}`}
                >
                  همه محصولات
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setParam('categoryId', cat.id.toString())}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${categoryId === cat.id.toString() ? 'bg-primary-50 text-primary-600 font-medium' : 'hover:bg-gray-50'}`}
                  >
                    {cat.icon && <span className="ml-1">{cat.icon}</span>}
                    {isFa ? cat.nameFA : cat.nameEN}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Products */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              {data ? `${data.totalElements} محصول` : ''}
              {q && <span className="mr-1 text-primary-500">· جستجو: "{q}"</span>}
            </p>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value)}
              className="input w-auto text-sm py-2"
            >
              <option value="newest">{t('newest')}</option>
              <option value="price_asc">{t('cheapest')}</option>
              <option value="price_desc">{t('expensive')}</option>
            </select>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : !data?.content.length ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-gray-400">
              <span className="text-5xl block mb-3">🔍</span>
              {t('noResults')}
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.content.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={data.totalPages}
                onChange={(p) => setParam('page', p.toString())}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
