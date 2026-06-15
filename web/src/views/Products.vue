<template>
  <div class="min-h-screen pt-24 pb-20">
    <div class="py-16 text-center border-b border-gold/10 mb-12">
      <p class="section-subtitle mb-4">Collections</p>
      <h1 class="section-title">精品展示</h1>
      <div class="gold-divider w-24 mx-auto mt-6"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <!-- Category tabs -->
      <div class="flex flex-wrap gap-3 mb-10">
        <button @click="switchCategory('')" :class="tabClass('')">全部系列</button>
        <button
          v-for="cat in categories"
          :key="cat.id"
          @click="switchCategory(cat.slug)"
          :class="tabClass(cat.slug)"
        >
          {{ cat.name }}
        </button>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <div v-for="i in 8" :key="i" class="luxury-card aspect-[3/4] animate-pulse"></div>
      </div>

      <!-- Products grid -->
      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          class="reveal"
        />
      </div>

      <div v-if="!loading && products.length === 0" class="text-center py-24">
        <p class="font-serif-cn text-2xl text-luxury/30 tracking-widest">暂无商品</p>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-center gap-3 mt-16">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="w-10 h-10 border border-gold/20 text-gold/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors"
        >←</button>
        <span class="font-serif-en text-sm text-luxury-muted tracking-widest">
          {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="w-10 h-10 border border-gold/20 text-gold/60 disabled:opacity-30 hover:border-gold hover:text-gold transition-colors"
        >→</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/common/ProductCard.vue'
import { productsApi, categoriesApi, trackApi } from '@/api'
import type { Product, Category } from '@/api'

const route = useRoute()
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const activeCategory = ref('')
const currentPage = ref(1)
const totalPages = ref(1)

// Single observer instance – cleaned up on unmount
let revealObserver: IntersectionObserver | null = null

function setupRevealObserver() {
  revealObserver?.disconnect()
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        revealObserver?.unobserve(e.target)
      }
    })
  }, { threshold: 0.05 })
  document.querySelectorAll('.reveal').forEach(el => {
    el.classList.remove('visible')
    revealObserver!.observe(el)
  })
}

onUnmounted(() => revealObserver?.disconnect())

function tabClass(slug: string) {
  const active = activeCategory.value === slug
  return [
    'font-serif-cn text-sm tracking-widest px-5 py-2.5 border transition-all duration-300',
    active ? 'border-gold bg-gold/10 text-gold' : 'border-gold/20 text-luxury-muted hover:border-gold/40 hover:text-luxury',
  ]
}

function switchCategory(slug: string) {
  if (activeCategory.value === slug) return // avoid redundant reload
  activeCategory.value = slug
  currentPage.value = 1
}

async function loadProducts() {
  loading.value = true
  try {
    const params: Record<string, any> = { page: currentPage.value, limit: 16 }
    if (activeCategory.value) params.category = activeCategory.value
    const res = await productsApi.list(params)
    products.value = res.data.data
    totalPages.value = res.data.pages
    setTimeout(setupRevealObserver, 100)
  } finally {
    loading.value = false
  }
}

// Watch changes but debounce to avoid double-firing on category+page reset
watch([activeCategory, currentPage], () => loadProducts())

onMounted(async () => {
  trackApi.pageView('/products')
  if (route.query.category) activeCategory.value = route.query.category as string
  const catRes = await categoriesApi.list()
  categories.value = catRes.data
  await loadProducts()
})
</script>
