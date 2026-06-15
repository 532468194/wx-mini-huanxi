import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token')
      router.push('/login')
    } else {
      ElMessage.error(err.response?.data?.error || '请求失败')
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login: (data: { username: string; password: string }) => api.post('/auth/login', data),
}

export const productsApi = {
  list: (params?: any) => api.get('/products', { params }),
  get: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
}

export const categoriesApi = {
  list: () => api.get('/categories'),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
}

export const ordersApi = {
  list: (params?: any) => api.get('/orders', { params }),
  get: (id: number) => api.get(`/orders/${id}`),
  updateStatus: (id: number, status: string) => api.put(`/orders/${id}/status`, { status }),
}

export const analyticsApi = {
  overview: () => api.get('/analytics/overview'),
  traffic: (days?: number) => api.get('/analytics/traffic', { params: { days } }),
  products: (days?: number) => api.get('/analytics/products', { params: { days } }),
}

export const bannersApi = {
  list: () => api.get('/banners/all'),
  create: (data: any) => api.post('/banners', data),
  update: (id: number, data: any) => api.put(`/banners/${id}`, data),
  delete: (id: number) => api.delete(`/banners/${id}`),
}

export const filesApi = {
  browse: (dir?: string) => api.get('/files/browse', { params: { dir } }),
}

export const uploadApi = {
  image: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/upload/image', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
}

export default api
