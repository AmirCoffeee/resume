import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getPublicSettings } from './api'
import { useSettingsStore } from './store/useSettingsStore'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Public Pages
import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import PaymentCallbackPage from './pages/PaymentCallbackPage'

// Admin Pages
import AdminDashboard from './pages/admin/DashboardPage'
import AdminProducts from './pages/admin/ProductsPage'
import AdminCategories from './pages/admin/CategoriesPage'
import AdminOrders from './pages/admin/OrdersPage'
import AdminUsers from './pages/admin/UsersPage'
import AdminSettings from './pages/admin/SettingsPage'
import AdminMenu from './pages/admin/MenuPage'
import AdminBanners from './pages/admin/BannersPage'

import ProtectedRoute from './components/ProtectedRoute'
import type { PublicSettings } from './types'

export default function App() {
  const { i18n } = useTranslation()
  const setSettings = useSettingsStore((s) => s.setSettings)

  useEffect(() => {
    getPublicSettings().then((res) => {
      setSettings(res.data as PublicSettings)
      document.title = i18n.language === 'fa'
        ? (res.data as PublicSettings).siteNameFA
        : (res.data as PublicSettings).siteNameEN
    }).catch(() => {})

    // Apply dir based on language
    document.documentElement.dir = i18n.language === 'fa' ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: { fontFamily: 'Vazirmatn, sans-serif', fontSize: '14px' },
          duration: 3000,
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/payment/callback" element={<PaymentCallbackPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/menu" element={<AdminMenu />} />
            <Route path="/admin/banners" element={<AdminBanners />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
