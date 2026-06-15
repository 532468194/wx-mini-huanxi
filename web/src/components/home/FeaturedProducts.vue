<template>
  <section class="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
    <div class="flex items-end justify-between mb-16">
      <div class="reveal">
        <p class="section-subtitle mb-4">Featured Items</p>
        <h2 class="section-title text-left">精选臻品</h2>
        <div class="gold-divider w-24 mt-6"></div>
      </div>
      <RouterLink to="/products" class="hidden md:flex items-center gap-2 text-gold/60 hover:text-gold transition-colors reveal">
        <span class="font-serif-en text-xs tracking-widest uppercase">View All</span>
        <div class="w-6 h-px bg-gold/60"></div>
      </RouterLink>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
      <ProductCard
        v-for="(product, idx) in products"
        :key="product.id"
        :product="product"
        :class="'reveal reveal-delay-' + Math.min(idx + 1, 5)"
      />
    </div>

    <div class="text-center mt-12 md:hidden reveal">
      <RouterLink to="/products" class="btn-ghost-gold inline-block">查看全部</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ProductCard from '@/components/common/ProductCard.vue'
import type { Product } from '@/api'

defineProps<{ products: Product[] }>()

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        observer.unobserve(e.target)
      }
    }),
    { threshold: 0.1 }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
</script>
