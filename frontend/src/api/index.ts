import api from './axios'
import type { Page, Product, Category, Order, SiteSettings, MenuItem, Banner, User } from '../types'

// Auth
export const sendOtp = (phone: string) => api.post('/auth/send-otp', { phone })
export const verifyOtp = (phone: string, code: string) =>
  api.post<{ token: string }>('/auth/verify-otp', { phone, code })
export const getMe = () => api.get<User>('/auth/me')
export const updateProfile = (data: Partial<User>) => api.put<User>('/auth/profile', data)

// Products
export const getProducts = (params?: Record<string, unknown>) =>
  api.get<Page<Product>>('/products', { params })
export const getProduct = (id: number) => api.get<Product>(`/products/${id}`)
export const getFeatured = () => api.get<Product[]>('/products/featured')

// Categories
export const getCategories = () => api.get<Category[]>('/categories')
export const getCategoryTree = () => api.get<Category[]>('/categories/tree')

// Orders
export const createOrder = (data: unknown) => api.post<Order>('/orders', data)
export const getOrder = (id: number) => api.get<Order>(`/orders/${id}`)
export const getMyOrders = () => api.get<Order[]>('/orders/my')

// Settings
export const getPublicSettings = () => api.get<Record<string, unknown>>('/settings/public')

// Menu
export const getHeaderMenu = () => api.get<MenuItem[]>('/menu/header')
export const getFooterMenu = () => api.get<MenuItem[]>('/menu/footer')

// Banners
export const getBanners = () => api.get<Banner[]>('/banners')

// ===== ADMIN =====
export const adminDashboard = () => api.get('/admin/dashboard')

// Admin Products
export const adminGetProducts = (page = 0, size = 20) =>
  api.get<Page<Product>>('/admin/products', { params: { page, size } })
export const adminCreateProduct = (data: Partial<Product>) =>
  api.post<Product>('/admin/products', data)
export const adminUpdateProduct = (id: number, data: Partial<Product>) =>
  api.put<Product>(`/admin/products/${id}`, data)
export const adminDeleteProduct = (id: number) => api.delete(`/admin/products/${id}`)

// Admin Categories
export const adminGetCategories = () => api.get<Category[]>('/admin/categories')
export const adminCreateCategory = (data: Partial<Category>) =>
  api.post<Category>('/admin/categories', data)
export const adminUpdateCategory = (id: number, data: Partial<Category>) =>
  api.put<Category>(`/admin/categories/${id}`, data)
export const adminDeleteCategory = (id: number) => api.delete(`/admin/categories/${id}`)

// Admin Orders
export const adminGetOrders = (page = 0, size = 20) =>
  api.get<Page<Order>>('/admin/orders', { params: { page, size } })
export const adminUpdateOrderStatus = (id: number, status: string) =>
  api.put(`/admin/orders/${id}/status`, { status })

// Admin Users
export const adminGetUsers = (page = 0, size = 20) =>
  api.get<Page<User>>('/admin/users', { params: { page, size } })
export const adminUpdateUserRole = (id: number, role: string) =>
  api.put(`/admin/users/${id}/role`, { role })

// Admin Settings
export const adminGetSettings = () => api.get<SiteSettings>('/admin/settings')
export const adminUpdateSettings = (data: SiteSettings) =>
  api.put<SiteSettings>('/admin/settings', data)

// Admin Menu
export const adminGetMenu = () => api.get<MenuItem[]>('/admin/menu')
export const adminCreateMenuItem = (data: Partial<MenuItem>) =>
  api.post<MenuItem>('/admin/menu', data)
export const adminUpdateMenuItem = (id: number, data: Partial<MenuItem>) =>
  api.put<MenuItem>(`/admin/menu/${id}`, data)
export const adminDeleteMenuItem = (id: number) => api.delete(`/admin/menu/${id}`)

// Admin Banners
export const adminGetBanners = () => api.get<Banner[]>('/admin/banners')
export const adminCreateBanner = (data: Partial<Banner>) =>
  api.post<Banner>('/admin/banners', data)
export const adminUpdateBanner = (id: number, data: Partial<Banner>) =>
  api.put<Banner>(`/admin/banners/${id}`, data)
export const adminDeleteBanner = (id: number) => api.delete(`/admin/banners/${id}`)

// Admin Upload
export const adminUploadFile = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return api.post<{ url: string }>('/admin/upload', form)
}
