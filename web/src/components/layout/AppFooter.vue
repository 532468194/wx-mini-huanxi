<template>
  <footer class="bg-luxury-dark border-t border-white/5 mt-24">
    <!-- Main footer -->
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
        <!-- Brand -->
        <div>
          <div class="font-serif-cn text-3xl tracking-[0.3em] text-gold-gradient mb-3">欢喜</div>
          <div class="font-serif-en text-xs tracking-[0.4em] text-luxury-muted uppercase mb-6">HUANXI · TIANZHU</div>
          <div class="gold-divider w-16 mb-6"></div>
          <p class="font-serif-cn text-sm leading-loose text-luxury-muted tracking-wide">
            天珠 戴的是气场 求的是心安<br>
            守的是福报 一眼入心 一珠一缘<br>
            佩戴天珠是最有力量的表达
          </p>
        </div>

        <!-- Navigation -->
        <div>
          <h4 class="font-serif-en text-xs tracking-[0.3em] text-gold uppercase mb-6">Navigate</h4>
          <nav class="flex flex-col gap-3">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="font-sans-cn text-sm tracking-widest text-luxury-muted hover:text-gold-light transition-colors"
            >
              {{ item.label }}
            </RouterLink>
          </nav>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-serif-en text-xs tracking-[0.3em] text-gold uppercase mb-6">Contact Us</h4>
          <div class="flex flex-col gap-4">
            <div class="flex items-start gap-3">
              <div class="w-4 h-4 mt-0.5 text-gold flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                </svg>
              </div>
              <div>
                <div class="font-sans-cn text-xs text-luxury-muted tracking-wider mb-1">电话咨询</div>
                <a href="tel:13188888888" class="font-serif-en text-luxury-muted hover:text-gold transition-colors">13188888888</a>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-4 h-4 mt-0.5 text-gold flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                </svg>
              </div>
              <div>
                <div class="font-sans-cn text-xs text-luxury-muted tracking-wider mb-1">微信咨询</div>
                <span class="font-sans-cn text-luxury-muted">HUANXITIANZHU</span>
              </div>
            </div>
            <div class="flex items-start gap-3">
              <div class="w-4 h-4 mt-0.5 text-gold flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <div class="font-sans-cn text-xs text-luxury-muted tracking-wider mb-1">实体展厅</div>
                <span class="font-sans-cn text-sm text-luxury-muted">亮马古玩城xxx层xxx室</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-white/5">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="font-sans-cn text-xs text-luxury-muted tracking-wider">
          © 2024 欢喜天珠 · 不随波逐流，只取悦自己
        </p>
        <p class="font-serif-en text-xs text-luxury-muted tracking-widest">
          HUANXI TIANZHU · EST. BEIJING
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const navItems = [
  { label: '首页', path: '/' },
  { label: '精品展示', path: '/products' },
  { label: '天珠系列', path: '/products?category=tianzhu' },
  { label: '展厅鉴赏', path: '/exhibition' },
  { label: '关于欢喜', path: '/about' },
]
</script>
