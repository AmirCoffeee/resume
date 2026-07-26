export interface Product {
  id: number
  nameFA: string
  nameEN: string
  descriptionFA: string
  descriptionEN: string
  price: number
  discountPrice?: number
  stock: number
  images: string[]
  category?: Category
  active: boolean
  featured: boolean
  rating: number
  reviewCount: number
  createdAt: string
}

export interface Category {
  id: number
  nameFA: string
  nameEN: string
  slug: string
  icon?: string
  sortOrder: number
  active: boolean
  parent?: Category
  children?: Category[]
}

export interface User {
  id: number
  phone: string
  firstName?: string
  lastName?: string
  email?: string
  address?: string
  role: 'USER' | 'ADMIN'
  active: boolean
  createdAt: string
}

export interface OrderItem {
  id: number
  product: Product
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: number
  user: User
  items: OrderItem[]
  totalAmount: number
  discountAmount: number
  finalAmount: number
  shippingAddress: string
  receiverName: string
  receiverPhone: string
  status: OrderStatus
  paymentRefId?: string
  paymentGateway?: string
  createdAt: string
  updatedAt?: string
}

export type OrderStatus =
  | 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'

export interface CartItem {
  product: Product
  quantity: number
}

export interface SiteSettings {
  id?: number
  siteNameFA: string
  siteNameEN: string
  logo?: string
  favicon?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  phone?: string
  email?: string
  address?: string
  telegram?: string
  instagram?: string
  paymentGateway: string
  zarinpalMerchantId?: string
  idpayApiKey?: string
  paymentSandbox: boolean
  smsProvider?: string
  smsApiKey?: string
  smsSender?: string
  freeShipping: boolean
  freeShippingThreshold: number
  shippingCost: number
  metaDescription?: string
  metaKeywords?: string
}

export interface PublicSettings {
  siteNameFA: string
  siteNameEN: string
  logo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  phone: string
  email: string
  telegram: string
  instagram: string
  freeShipping: boolean
  freeShippingThreshold: number
  shippingCost: number
  metaDescription: string
  metaKeywords: string
}

export interface MenuItem {
  id: number
  titleFA: string
  titleEN: string
  url: string
  icon?: string
  sortOrder: number
  active: boolean
  location: 'HEADER' | 'FOOTER' | 'SIDEBAR'
  children?: MenuItem[]
}

export interface Banner {
  id: number
  titleFA: string
  titleEN: string
  subtitleFA?: string
  subtitleEN?: string
  imageUrl: string
  linkUrl?: string
  sortOrder: number
  active: boolean
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}
