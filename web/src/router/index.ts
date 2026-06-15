import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0, behavior: 'smooth' }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: '欢喜天珠 - 首页' },
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/Products.vue'),
      meta: { title: '精品展示 - 欢喜天珠' },
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: () => import('@/views/ProductDetail.vue'),
      meta: { title: '商品详情 - 欢喜天珠' },
    },
    {
      path: '/exhibition',
      name: 'exhibition',
      component: () => import('@/views/Exhibition.vue'),
      meta: { title: '展厅鉴赏 - 欢喜天珠' },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/About.vue'),
      meta: { title: '关于欢喜 - 欢喜天珠' },
    },
    {
      path: '/cart',
      name: 'cart',
      component: () => import('@/views/Cart.vue'),
      meta: { title: '购物车 - 欢喜天珠' },
    },
    {
      path: '/checkout/:productId',
      name: 'checkout',
      component: () => import('@/views/Checkout.vue'),
      meta: { title: '下单 - 欢喜天珠' },
    },
  ],
})

router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router
