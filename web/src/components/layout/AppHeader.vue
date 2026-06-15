<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
      scrolled ? 'bg-luxury-black/95 backdrop-blur-sm border-b border-white/5' : 'bg-transparent'
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 lg:px-12">
      <div class="flex items-center justify-between h-20 lg:h-24">
        <!-- Logo -->
        <RouterLink to="/" class="flex flex-col items-start group">
          <span class="font-serif-cn text-2xl lg:text-3xl tracking-[0.3em] text-gold-gradient leading-none">
            欢喜
          </span>
          <span class="font-serif-en text-[10px] tracking-[0.4em] text-luxury-muted uppercase mt-1 group-hover:text-gold transition-colors">
            HUANXI · TIANZHU
          </span>
        </RouterLink>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center gap-10">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link font-sans-cn text-sm tracking-widest text-luxury-muted hover:text-gold-light transition-colors duration-300 relative group"
          >
            {{ item.label }}
            <span class="absolute -bottom-1 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300"></span>
          </RouterLink>
        </nav>

        <!-- Right actions -->
        <div class="flex items-center gap-5">
          <!-- Cart count -->
          <button
            v-if="cartStore.count > 0"
            @click="cartStore.showCart = true"
            class="relative text-luxury-muted hover:text-gold transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            <span class="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-gold text-luxury-black text-[10px] font-bold flex items-center justify-center">
              {{ cartStore.count }}
            </span>
          </button>

          <!-- WeChat contact -->
          <a
            href="weixin://HUANXITIANZHU"
            class="hidden lg:flex items-center gap-2 text-luxury-muted hover:text-gold transition-colors text-xs tracking-wider"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.5 10.5a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 14.5c-.828 0-1.5-.448-1.5-1s.672-1 1.5-1 1.5.448 1.5 1-.672 1-1.5 1zm3 0c-.828 0-1.5-.448-1.5-1s.672-1 1.5-1 1.5.448 1.5 1-.672 1-1.5 1z"/>
            </svg>
            HUANXITIANZHU
          </a>

          <!-- Mobile menu -->
          <button
            @click="menuOpen = !menuOpen"
            class="lg:hidden text-luxury-muted hover:text-gold transition-colors"
          >
            <svg v-if="!menuOpen" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
            <svg v-else width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="lg:hidden bg-luxury-black/98 border-t border-white/5">
        <nav class="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-6">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="menuOpen = false"
            class="font-serif-cn text-lg tracking-widest text-luxury hover:text-gold transition-colors"
          >
            {{ item.label }}
          </RouterLink>
          <div class="gold-divider"></div>
          <div class="text-luxury-muted text-sm tracking-wider">
            <div>微信：HUANXITIANZHU</div>
            <div class="mt-1">电话：13188888888</div>
          </div>
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const scrolled = ref(false)
const menuOpen = ref(false)

const navItems = [
  { label: '首页', path: '/' },
  { label: '精品展示', path: '/products' },
  { label: '展厅鉴赏', path: '/exhibition' },
  { label: '关于欢喜', path: '/about' },
]

function onScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
