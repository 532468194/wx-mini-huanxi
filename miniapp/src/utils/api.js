// 运行环境判断：H5 走相对路径(vite代理)，小程序走完整服务器地址
const BASE_URL = typeof window !== 'undefined'
  ? '/api'
  : 'http://localhost:3001/api'

function request(method, url, data = {}) {
  // 小程序环境
  if (typeof uni !== 'undefined' && uni.request) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: BASE_URL + url,
        method,
        data,
        header: { 'Content-Type': 'application/json' },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(res.data)
          else reject(res.data)
        },
        fail: reject,
      })
    })
  }
  // H5/浏览器环境
  return fetch(BASE_URL + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method !== 'GET' ? JSON.stringify(data) : undefined,
  }).then(r => r.json())
}

export function imgUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const encoded = path.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
  // H5 走代理，小程序走绝对地址
  if (typeof window !== 'undefined') return encoded
  return 'http://localhost:3001' + encoded
}

export const api = {
  getBanners: () => request('GET', '/banners'),
  getCategories: () => request('GET', '/categories'),
  getProducts: (params = {}) => {
    const query = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&')
    return request('GET', `/products${query ? '?' + query : ''}`)
  },
  getProduct: (id) => request('GET', `/products/${id}`),
  createOrder: (data) => request('POST', '/orders', data),
  track: (page, productId) => request('POST', '/track', { page, productId }).catch(() => {}),
}

export default api
