import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

export interface Product {
  id: number
  category_id: number
  category_name: string
  category_slug: string
  name: string
  subtitle: string
  description: string
  price: number | null
  original_price: number | null
  size_info: string | null
  is_inquiry_only: boolean
  stock: number
  featured: boolean
  images: string[]
  tags: string[]
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string
  cover_image: string
  product_count: number
}

export interface Banner {
  id: number
  title: string
  subtitle: string
  image_url: string
  link: string
}

export interface Order {
  id: number
  order_no: string
  product_id: number
  product_name: string
  product_image: string
  price: number
  quantity: number
  total_price: number
  customer_name: string
  customer_phone: string
  customer_wechat: string
  message: string
  status: string
  created_at: string
}

export const productsApi = {
  list: (params?: Record<string, any>) => api.get<{ data: Product[], total: number, pages: number }>('/products', { params }),
  get: (id: number) => api.get<{ product: Product, related: Product[] }>(`/products/${id}`),
}

export const categoriesApi = {
  list: () => api.get<Category[]>('/categories'),
}

export const bannersApi = {
  list: () => api.get<Banner[]>('/banners'),
}

export const ordersApi = {
  create: (data: Partial<Order> & { product_id: number, customer_phone: string }) =>
    api.post<{ order_no: string, message: string }>('/orders', data),
}

export const trackApi = {
  pageView: (page: string) => api.post('/track', { page }).catch(() => {}),
  productView: (productId: number) => api.post('/track', { page: '/products/' + productId, productId }).catch(() => {}),
}

export default api
