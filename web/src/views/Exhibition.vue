<template>
  <div class="min-h-screen pt-20">
    <div class="py-16 text-center border-b border-gold/10">
      <p class="section-subtitle mb-4">Showroom</p>
      <h1 class="section-title">展厅鉴赏</h1>
      <div class="gold-divider w-24 mx-auto mt-6 mb-4"></div>
      <p class="font-sans-cn text-sm text-luxury-muted tracking-wider">亮马古玩城 · 实体展厅 · 诚邀莅临</p>
    </div>

    <!-- Main feature image -->
    <div class="relative h-[60vh] overflow-hidden">
      <img src="/static/展厅/品牌主理人照片.jpg" alt="品牌主理人与展厅" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-luxury-black/80 via-transparent to-luxury-black/20"></div>
      <div class="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
        <p class="font-serif-cn text-xl tracking-widest text-luxury mb-2">品牌主理人</p>
        <p class="font-serif-en text-xs tracking-[0.4em] text-gold/70 uppercase">BRAND DIRECTORS</p>
      </div>
    </div>

    <!-- Gallery grid -->
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(img, idx) in galleryImages"
          :key="idx"
          @click="openLightbox(idx)"
          :class="['img-luxury-overlay cursor-pointer reveal', idx % 5 === 0 ? 'md:col-span-2 aspect-video' : 'aspect-square']"
        >
          <img
            :src="imgSrc(img)"
            alt="展厅实景"
            class="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>

    <!-- Exhibition info -->
    <section class="py-16 bg-luxury-dark border-t border-gold/10">
      <div class="max-w-4xl mx-auto px-6 lg:px-12 text-center">
        <h2 class="font-serif-cn text-2xl tracking-widest text-luxury mb-8 reveal">莅临欢喜</h2>
        <div class="gold-divider w-24 mx-auto mb-10 reveal"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="reveal reveal-delay-1">
            <p class="font-sans-cn text-xs text-gold/60 tracking-wider mb-3">展厅地址</p>
            <p class="font-serif-cn text-sm text-luxury/80 tracking-wide leading-relaxed">
              北京市·亮马古玩城<br>xxx层xxx室
            </p>
          </div>
          <div class="reveal reveal-delay-2">
            <p class="font-sans-cn text-xs text-gold/60 tracking-wider mb-3">营业时间</p>
            <p class="font-serif-cn text-sm text-luxury/80 tracking-wide leading-relaxed">
              每日 10:00 - 18:00<br>节假日照常营业
            </p>
          </div>
          <div class="reveal reveal-delay-3">
            <p class="font-sans-cn text-xs text-gold/60 tracking-wider mb-3">预约参观</p>
            <p class="font-serif-cn text-sm text-luxury/80 tracking-wide leading-relaxed">
              微信：HUANXITIANZHU<br>电话：13188888888
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="lightbox >= 0"
          class="fixed inset-0 z-50 bg-luxury-black/95 flex items-center justify-center"
          @click="lightbox = -1"
        >
          <button class="absolute top-6 right-6 text-luxury-muted hover:text-luxury text-2xl">✕</button>
          <button class="absolute left-6 text-luxury-muted hover:text-gold text-3xl z-10" @click.stop="lightbox = Math.max(0, lightbox - 1)">‹</button>
          <img
            :src="imgSrc(galleryImages[lightbox])"
            class="max-w-full max-h-screen object-contain p-8"
            @click.stop
          />
          <button class="absolute right-6 text-luxury-muted hover:text-gold text-3xl z-10" @click.stop="lightbox = Math.min(galleryImages.length - 1, lightbox + 1)">›</button>
          <div class="absolute bottom-6 left-1/2 -translate-x-1/2 font-serif-en text-xs text-luxury-muted tracking-wider">
            {{ lightbox + 1 }} / {{ galleryImages.length }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { trackApi } from '@/api'

const lightbox = ref(-1)

const galleryImages = [
  '/static/展厅/品牌主理人照片.jpg',
  '/static/展厅/展厅名称屏风.jpg',
  '/static/展厅/微信图片_2026-06-15_215314_771.jpg',
  '/static/展厅/微信图片_2026-06-15_215333_095.jpg',
  '/static/展厅/微信图片_2026-06-15_215338_680.jpg',
  '/static/展厅/微信图片_2026-06-15_215346_897.jpg',
  '/static/展厅/微信图片_2026-06-15_215351_839.jpg',
  '/static/展厅/微信图片_2026-06-15_215356_136.jpg',
  '/static/展厅/微信图片_2026-06-15_215359_752.jpg',
  '/static/展厅/微信图片_2026-06-15_215404_042.jpg',
  '/static/展厅/微信图片_2026-06-15_215452_820.jpg',
]

function imgSrc(path: string) {
  return path.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}

function openLightbox(idx: number) { lightbox.value = idx }

onMounted(() => {
  trackApi.pageView('/exhibition')
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } })
  }, { threshold: 0.1 })
  setTimeout(() => document.querySelectorAll('.reveal').forEach(el => observer.observe(el)), 100)
})
</script>
