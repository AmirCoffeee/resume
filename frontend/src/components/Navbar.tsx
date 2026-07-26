import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { MdShoppingCart, MdPerson, MdSearch, MdMenu, MdClose, MdAdminPanelSettings } from 'react-icons/md'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { useSettingsStore } from '../store/useSettingsStore'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')
  const totalItems = useCartStore((s) => s.totalItems())
  const { token, user, logout } = useAuthStore()
  const settings = useSettingsStore((s) => s.settings)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search)}`)
  }

  const toggleLang = () => {
    const newLang = i18n.language === 'fa' ? 'en' : 'fa'
    i18n.changeLanguage(newLang)
    localStorage.setItem('lang', newLang)
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr'
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="font-bold text-xl text-primary-500 whitespace-nowrap">
          {settings ? (i18n.language === 'fa' ? settings.siteNameFA : settings.siteNameEN) : t('siteName')}
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search')}
              className="input pr-10 text-sm"
            />
            <button type="submit" className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-primary-500">
              <MdSearch size={20} />
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Lang Toggle */}
          <button
            onClick={toggleLang}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors"
          >
            {i18n.language === 'fa' ? 'EN' : 'FA'}
          </button>

          {/* Cart */}
          <Link to="/cart" className="relative p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <MdShoppingCart size={24} className="text-gray-700" />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </Link>

          {/* User */}
          {token ? (
            <div className="relative group">
              <button className="flex items-center gap-1 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <MdPerson size={24} className="text-gray-700" />
              </button>
              <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 hidden group-hover:block animate-slide-down">
                <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors">{t('profile')}</Link>
                <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-50 transition-colors">{t('myOrders')}</Link>
                {user?.role === 'ADMIN' && (
                  <Link to="/admin" className="block px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 transition-colors flex items-center gap-2">
                    <MdAdminPanelSettings size={16} /> {t('admin')}
                  </Link>
                )}
                <hr className="my-1 border-gray-100" />
                <button onClick={logout} className="block w-full text-right px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors">
                  {t('logout')}
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">{t('login')}</Link>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2"
          >
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('search')}
                className="input text-sm flex-1"
              />
              <button type="submit" className="btn-primary px-4 py-2 text-sm">{t('search')}</button>
            </form>
            <Link to="/products" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">{t('products')}</Link>
            <Link to="/cart" onClick={() => setMobileOpen(false)} className="block py-2 text-sm">{t('cart')}</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
