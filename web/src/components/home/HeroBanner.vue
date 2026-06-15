<template>
  <div class="relative w-full h-screen overflow-hidden bg-luxury-black">
    <!-- Background slides -->
    <TransitionGroup name="hero-slide">
      <div
        v-for="(slide, idx) in banners"
        :key="idx"
        v-show="currentIndex === idx"
        class="absolute inset-0"
      >
        <div class="absolute inset-0 animate-slow-zoom">
          <img
            :src="imgSrc(slide.image_url)"
            :alt="slide.title"
            class="w-full h-full object-cover"
          />
        </div>
        <!-- Dark overlay -->
        <div class="absolute inset-0 bg-gradient-to-b from-luxury-black/40 via-transparent to-luxury-black/80"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-luxury-black/60 via-transparent to-luxury-black/20"></div>
      </div>
    </TransitionGroup>

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
      <!-- English subtitle -->
      <div class="font-serif-en text-xs tracking-[0.5em] text-gold/70 uppercase mb-6 animate-fade-in" style="animation-delay: 0.5s; opacity: 0; animation-fill-mode: forwards;">
        HUANXI · TIANZHU · EST. BEIJING
      </div>

      <!-- Chinese brand name -->
      <h1
        class="font-serif-cn font-light leading-none mb-6"
        style="font-size: clamp(4rem, 12vw, 9rem); letter-spacing: 0.4em; animation-delay: 0.8s; opacity: 0; animation-fill-mode: forwards;"
        :class="'animate-fade-up'"
      >
        <span class="text-gold-gradient">欢喜</span>
      </h1>

      <!-- Gold divider ornament -->
      <div class="flex items-center gap-4 mb-6 animate-fade-in" style="animation-delay: 1.1s; opacity: 0; animation-fill-mode: forwards;">
        <div class="w-16 h-px bg-gold/50"></div>
        <div class="text-gold text-xs">◆</div>
        <div class="w-16 h-px bg-gold/50"></div>
      </div>

      <!-- Tagline -->
      <div
        class="font-serif-cn text-base md:text-xl text-luxury/80 tracking-[0.3em] font-light leading-loose animate-fade-up"
        style="animation-delay: 1.3s; opacity: 0; animation-fill-mode: forwards;"
      >
        <p>戴的是气场 · 求的是心安</p>
        <p class="mt-1 text-sm md:text-base text-luxury/60">守的是福报 · 一眼入心 · 一珠一缘</p>
      </div>

      <!-- CTA -->
      <div class="flex gap-4 mt-10 animate-fade-up" style="animation-delay: 1.6s; opacity: 0; animation-fill-mode: forwards;">
        <RouterLink to="/products" class="btn-gold">探索珍品</RouterLink>
        <RouterLink to="/exhibition" class="btn-ghost-gold">展厅鉴赏</RouterLink>
      </div>
    </div>

    <!-- Slide indicators -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      <button
        v-for="(_, idx) in banners"
        :key="idx"
        @click="currentIndex = idx"
        :class="[
          'transition-all duration-300',
          currentIndex === idx ? 'w-6 h-1.5 bg-gold rounded-sm' : 'w-1.5 h-1.5 rounded-full bg-white/30'
        ]"
      />
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 right-8 flex flex-col items-center gap-2 z-10">
      <span class="font-serif-en text-[10px] tracking-[0.3em] text-white/40 uppercase" style="writing-mode: vertical-rl;">Scroll</span>
      <div class="w-px h-12 bg-gradient-to-b from-white/40 to-transparent overflow-hidden">
        <div class="w-full h-4 bg-gold/60 animate-bounce"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Banner } from '@/api'

const props = defineProps<{ banners: Banner[] }>()

const currentIndex = ref(0)
let timer: ReturnType<typeof setInterval>

function imgSrc(path: string) {
  return path.split('/').map(seg => seg.startsWith('static') || seg === '' ? seg : encodeURIComponent(seg)).join('/')
}

function autoPlay() {
  timer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % (props.banners.length || 1)
  }, 5000)
}

onMounted(() => autoPlay())
onUnmounted(() => clearInterval(timer))
</script>

<style scoped>
.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: opacity 1.2s ease;
}
.hero-slide-enter-from,
.hero-slide-leave-to {
  opacity: 0;
}
</style>
