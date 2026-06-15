<template>
  <RouterLink :to="`/products/${product.id}`" class="luxury-card group block overflow-hidden cursor-pointer">
    <!-- Image container -->
    <div class="relative aspect-[3/4] overflow-hidden bg-luxury-dark">
      <img
        v-if="firstImage"
        :src="imgSrc(firstImage)"
        :alt="product.name"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="text-gold/20 text-4xl font-serif-cn">欢喜</div>
      </div>

      <!-- Tags overlay -->
      <div class="absolute top-3 left-3 flex gap-2">
        <span
          v-if="product.is_inquiry_only"
          class="font-sans-cn text-[10px] tracking-wider px-2 py-1 bg-luxury-black/80 text-gold/70 border border-gold/20"
        >
          面议
        </span>
        <span
          v-if="!product.is_inquiry_only && product.stock <= 3"
          class="font-sans-cn text-[10px] tracking-wider px-2 py-1 bg-luxury-black/80 text-luxury/60 border border-white/10"
        >
          仅剩{{ product.stock }}件
        </span>
      </div>

      <!-- Hover overlay -->
      <div class="absolute inset-0 bg-luxury-black/0 group-hover:bg-luxury-black/20 transition-colors duration-400"></div>

      <!-- Quick action -->
      <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
        <button class="w-full btn-gold text-center text-xs py-2.5">
          {{ product.is_inquiry_only ? '联系询价' : '立即购买' }}
        </button>
      </div>
    </div>

    <!-- Info -->
    <div class="p-5">
      <h3 class="font-serif-cn text-sm tracking-widest text-luxury leading-snug line-clamp-2 mb-2 group-hover:text-gold-light transition-colors">
        {{ product.name }}
      </h3>
      <p v-if="product.subtitle" class="font-sans-cn text-xs text-luxury-muted tracking-wide line-clamp-1 mb-3">
        {{ product.subtitle }}
      </p>

      <!-- Price -->
      <div class="flex items-end justify-between">
        <div v-if="product.is_inquiry_only" class="font-serif-en text-sm tracking-widest text-gold/60">
          Price on Request
        </div>
        <div v-else class="price-luxury">
          <span class="text-xs text-gold/60 mr-1">¥</span>
          <span class="text-xl text-gold">{{ formatPrice(product.price!) }}</span>
        </div>
        <div v-if="product.size_info" class="font-sans-cn text-[10px] text-luxury-muted tracking-wider">
          {{ product.size_info }}
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/api'

const props = defineProps<{ product: Product }>()

const firstImage = computed(() => props.product.images?.[0])

function imgSrc(path: string) {
  return path.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}

function formatPrice(price: number) {
  return price.toLocaleString('zh-CN')
}
</script>
