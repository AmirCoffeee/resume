import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/useAuthStore'
import {
  MdDashboard, MdShoppingBag, MdCategory, MdShoppingCart,
  MdPeople, MdSettings, MdMenu, MdImage, MdLogout
} from 'react-icons/md'
import { motion } from 'framer-motion'

const navItems = [
  { to: '/admin', icon: MdDashboard, label: 'dashboard', exact: true },
  { to: '/admin/products', icon: MdShoppingBag, label: 'products' },
  { to: '/admin/categories', icon: MdCategory, label: 'categories' },
  { to: '/admin/orders', icon: MdShoppingCart, label: 'orders' },
  { to: '/admin/users', icon: MdPeople, label: 'users' },
  { to: '/admin/menu', icon: MdMenu, label: 'menu' },
  { to: '/admin/banners', icon: MdImage, label: 'banners' },
  { to: '/admin/settings', icon: MdSettings, label: 'settings' },
]

export default function AdminLayout() {
  const { t } = useTranslation()
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-white shadow-sm border-l border-gray-100 flex flex-col"
      >
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-500">پنل مدیریت</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon size={20} />
              {t(item.label)}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => { logout(); navigate('/') }}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-500
                       hover:bg-red-50 rounded-xl transition-colors"
          >
            <MdLogout size={20} />
            {t('logout')}
          </button>
        </div>
      </motion.aside>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
