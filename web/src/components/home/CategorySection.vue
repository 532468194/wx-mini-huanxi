<template>
  <section class="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
    <div class="text-center mb-16 reveal" ref="titleEl">
      <p class="section-subtitle mb-4">Collections</p>
      <h2 class="section-title">精品系列</h2>
      <div class="gold-divider w-24 mx-auto mt-6"></div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      <RouterLink
        v-for="(cat, idx) in categories"
        :key="cat.id"
        :to="`/products?category=${cat.slug}`"
        :class="['reveal reveal-delay-' + (idx + 1), 'group relative overflow-hidden', idx === 0 ? 'md:row-span-2 min-h-[520px]' : 'min-h-[240px]']"
        ref="catEls"
      >
        <div class="absolute inset-0 bg-luxury-card">
          <img
            v-if="cat.cover_image"
            :src="imgSrc(cat.cover_image)"
            :alt="cat.name"
            class="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-luxury-black/90 via-luxury-black/30 to-transparent"></div>
        </div>

        <!-- Content -->
        <div class="absolute inset-0 flex flex-col justify-end p-8">
          <div class="transform group-hover:-translate-y-2 transition-transform duration-400">
            <p class="font-serif-en text-xs tracking-[0.4em] text-gold/70 uppercase mb-2">{{ categoryEngNames[cat.slug] }}</p>
            <h3 class="font-serif-cn text-2xl lg:text-3xl tracking-widest text-luxury mb-2">{{ cat.name }}</h3>
            <p class="font-sans-cn text-xs text-luxury/50 tracking-wider hidden group-hover:block transition-all">
              {{ cat.description?.substring(0, 30) }}...
            </p>
            <div class="flex items-center gap-2 mt-4">
              <span class="font-serif-en text-xs tracking-widest text-gold/60 uppercase">Explore</span>
              <div class="w-6 h-px bg-gold/60 group-hover:w-12 transition-all duration-300"></div>
            </div>
          </div>
        </div>

        <!-- Gold border on hover -->
        <div class="absolute inset-0 border border-gold/0 group-hover:border-gold/20 transition-colors duration-400 pointer-events-none"></div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Category } from '@/api'

defineProps<{ categories: Category[] }>()

const titleEl = ref<HTMLElement>()

const categoryEngNames: Record<string, string> = {
  tianzhu: 'Heavenly Beads',
  wenwan: 'Antique Crafts',
  'lao-tiantie': 'Ancient Iron',
  tea: 'Premium Tea',
}

function imgSrc(path: string) {
  return path.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible')
        observer.unobserve(e.target)
      }
    }),
    { threshold: 0.1 }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
}

onMounted(() => setupReveal())
</script>
