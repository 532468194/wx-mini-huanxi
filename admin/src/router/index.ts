import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: () => import('@/layouts/AdminLayout.vue'),
      children: [
        { path: '', redirect: '/dashboard' },
        { path: 'dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '数据看板' } },
        { path: 'products', component: () => import('@/views/ProductList.vue'), meta: { title: '商品管理' } },
        { path: 'products/new', component: () => import('@/views/ProductEdit.vue'), meta: { title: '新增商品' } },
        { path: 'products/:id/edit', component: () => import('@/views/ProductEdit.vue'), meta: { title: '编辑商品' } },
        { path: 'orders', component: () => import('@/views/OrderList.vue'), meta: { title: '订单管理' } },
        { path: 'analytics', component: () => import('@/views/Analytics.vue'), meta: { title: '数据分析' } },
        { path: 'banners', component: () => import('@/views/BannerList.vue'), meta: { title: '轮播图管理' } },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const token = localStorage.getItem('admin_token')
  if (!to.meta.public && !token) return '/login'
})

export default router
