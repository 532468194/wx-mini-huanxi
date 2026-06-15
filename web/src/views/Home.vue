<template>
  <div class="min-h-screen pt-20">
    <!-- Hero Banner -->
    <HeroBanner :banners="banners" />

    <!-- Marquee strip -->
    <div class="bg-luxury-dark border-y border-gold/10 py-4 overflow-hidden">
      <div class="marquee-container">
        <div class="marquee-track">
          <span
            v-for="i in 8"
            :key="i"
            class="inline-flex items-center gap-6 px-8 font-serif-en text-xs tracking-[0.4em] text-gold/40 uppercase"
          >
            天珠 · Tianzhu
            <span class="text-gold/20">✦</span>
            文玩 · Wenwan
            <span class="text-gold/20">✦</span>
            老天铁 · Lao Tiantie
            <span class="text-gold/20">✦</span>
            茶系列 · Premium Tea
            <span class="text-gold/20">✦</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Brand Stats -->
    <section class="py-16 px-6 lg:px-12 max-w-7xl mx-auto">
      <div class="grid grid-cols-3 gap-8">
        <div v-for="stat in stats" :key="stat.label" class="text-center reveal">
          <div class="font-serif-en text-3xl md:text-4xl text-gold-gradient">{{ stat.value }}</div>
          <div class="font-sans-cn text-xs tracking-widest text-luxury-muted mt-2">{{ stat.label }}</div>
        </div>
      </div>
    </section>

    <!-- Category section -->
    <CategorySection :categories="categories" />

    <!-- Brand story interlude -->
    <BrandStory />

    <!-- Featured products -->
    <FeaturedProducts :products="featuredProducts" />

    <!-- Exhibition hall preview -->
    <section class="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
      <div class="text-center mb-16 reveal">
        <p class="section-subtitle mb-4">Showroom</p>
        <h2 class="section-title">展厅鉴赏</h2>
        <div class="gold-divider w-24 mx-auto mt-6"></div>
        <p class="font-sans-cn text-sm text-luxury-muted mt-6 tracking-wider">
          亮马古玩城 · 专属展厅 · 实物鉴赏
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4">
        <div
          v-for="(img, idx) in exhibitionImages"
          :key="idx"
          :class="['img-luxury-overlay overflow-hidden reveal reveal-delay-' + (idx % 4 + 1),
                   idx === 0 ? 'col-span-2 row-span-2' : '']"
          style="aspect-ratio: 1/1;"
        >
          <img
            :src="imgSrc(img)"
            alt="展厅实景"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div class="text-center mt-12 reveal">
        <RouterLink to="/exhibition" class="btn-ghost-gold inline-block">查看展厅全览</RouterLink>
      </div>
    </section>

    <!-- Contact section -->
    <section class="py-24 bg-luxury-dark border-t border-gold/10">
      <div class="max-w-5xl mx-auto px-6 lg:px-12 text-center">
        <p class="section-subtitle mb-4 reveal">Contact</p>
        <h2 class="section-title reveal">联系欢喜</h2>
        <div class="gold-divider w-24 mx-auto mt-6 mb-12 reveal"></div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="flex flex-col items-center gap-4 reveal reveal-delay-1">
            <div class="w-14 h-14 border border-gold/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 2H4c-1.103 0-2 .897-2 2v18l5.333-4H20c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zm-3 9H7V9h10v2zm-4 4H7v-2h6v2zm4-8H7V5h10v2z"/>
              </svg>
            </div>
            <div>
              <p class="font-sans-cn text-xs tracking-wider text-luxury-muted mb-1">微信咨询</p>
              <p class="font-sans-cn text-sm text-luxury tracking-wider">HUANXITIANZHU</p>
            </div>
          </div>
          <div class="flex flex-col items-center gap-4 reveal reveal-delay-2">
            <div class="w-14 h-14 border border-gold/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-gold" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
              </svg>
            </div>
            <div>
              <p class="font-sans-cn text-xs tracking-wider text-luxury-muted mb-1">电话咨询</p>
              <a href="tel:13188888888" class="font-serif-en text-sm text-luxury hover:text-gold transition-colors">13188888888</a>
            </div>
          </div>
          <div class="flex flex-col items-center gap-4 reveal reveal-delay-3">
            <div class="w-14 h-14 border border-gold/20 flex items-center justify-center">
              <svg class="w-6 h-6 text-gold" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <div>
              <p class="font-sans-cn text-xs tracking-wider text-luxury-muted mb-1">实体展厅</p>
              <p class="font-sans-cn text-sm text-luxury tracking-wide">亮马古玩城xxx层xxx室</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HeroBanner from '@/components/home/HeroBanner.vue'
import CategorySection from '@/components/home/CategorySection.vue'
import FeaturedProducts from '@/components/home/FeaturedProducts.vue'
import BrandStory from '@/components/home/BrandStory.vue'
import { productsApi, categoriesApi, bannersApi, trackApi } from '@/api'
import type { Product, Category, Banner } from '@/api'

const banners = ref<Banner[]>([])
const categories = ref<Category[]>([])
const featuredProducts = ref<Product[]>([])

const stats = [
  { value: '10+', label: '年藏品经验' },
  { value: '1000+', label: '精选珍品' },
  { value: '5000+', label: '信赖藏家' },
]

const exhibitionImages = [
  '/static/展厅/品牌主理人照片.jpg',
  '/static/展厅/展厅名称屏风.jpg',
  '/static/展厅/微信图片_2026-06-15_215314_771.jpg',
  '/static/展厅/微信图片_2026-06-15_215333_095.jpg',
  '/static/展厅/微信图片_2026-06-15_215338_680.jpg',
]

function imgSrc(path: string) {
  return path.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}

function setupReveal() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
    }),
    { threshold: 0.1 }
  )
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
  }, 100)
}

onMounted(async () => {
  trackApi.pageView('/')
  try {
    const [b, c, p] = await Promise.all([
      bannersApi.list(),
      categoriesApi.list(),
      productsApi.list({ featured: 1, limit: 8 }),
    ])
    banners.value = b.data
    categories.value = c.data
    featuredProducts.value = p.data.data
  } catch (e) {
    console.error(e)
  }
  setupReveal()
})
</script>
