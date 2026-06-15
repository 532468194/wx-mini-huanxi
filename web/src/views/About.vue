<template>
  <div class="min-h-screen pt-20">
    <div class="py-16 text-center border-b border-gold/10">
      <p class="section-subtitle mb-4">About Us</p>
      <h1 class="section-title">关于欢喜</h1>
      <div class="gold-divider w-24 mx-auto mt-6"></div>
    </div>

    <!-- Philosophy -->
    <section class="py-24 px-6 lg:px-12 max-w-5xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div class="reveal">
          <img src="/static/展厅/品牌主理人照片.jpg" alt="品牌主理人" class="w-full aspect-square object-cover" />
        </div>
        <div>
          <p class="font-serif-en text-xs tracking-[0.4em] text-gold/60 uppercase mb-6 reveal">Brand Story</p>
          <h2 class="font-serif-cn text-3xl font-light tracking-widest text-luxury mb-6 reveal">
            一眼入心<br>一珠一缘
          </h2>
          <div class="gold-divider w-16 mb-8 reveal"></div>
          <div class="space-y-4 font-serif-cn text-sm text-luxury/70 leading-loose tracking-wide reveal reveal-delay-1">
            <p>欢喜天珠，专注于正宗藏式天珠的甄选与传播。我们深信，每一颗天珠都拥有独特的灵魂，每一次相遇都是难得的缘分。</p>
            <p>天珠，戴的是气场，求的是心安。千年的藏地文化，赋予了天珠超凡的能量与气场。我们守护的，不只是一颗珠，更是一份对美好生活的信念与追求。</p>
            <p>欢喜天珠，不随波逐流，只取悦自己。愿每一位有缘人，都能找到那颗属于自己的欢喜之珠。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-luxury-dark border-y border-gold/10">
      <div class="max-w-5xl mx-auto px-6 lg:px-12">
        <div class="text-center mb-16 reveal">
          <h2 class="font-serif-cn text-2xl tracking-widest text-luxury">欢喜理念</h2>
          <div class="gold-divider w-24 mx-auto mt-6"></div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(value, idx) in values" :key="idx" :class="['text-center reveal reveal-delay-' + (idx+1)]">
            <div class="text-3xl text-gold mb-4">{{ value.icon }}</div>
            <h3 class="font-serif-cn text-lg tracking-widest text-luxury mb-3">{{ value.title }}</h3>
            <p class="font-sans-cn text-xs text-luxury-muted leading-loose tracking-wider">{{ value.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact -->
    <section class="py-24 px-6 lg:px-12 max-w-3xl mx-auto text-center">
      <h2 class="font-serif-cn text-2xl tracking-widest text-luxury mb-8 reveal">与我们连接</h2>
      <div class="gold-divider w-24 mx-auto mb-12 reveal"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 reveal reveal-delay-1">
        <a href="tel:13188888888"
          class="flex flex-col items-center gap-3 p-8 border border-gold/10 hover:border-gold/30 transition-colors">
          <span class="text-2xl text-gold">☎</span>
          <span class="font-sans-cn text-xs text-luxury-muted tracking-wider">电话咨询</span>
          <span class="font-serif-en text-sm text-luxury">13188888888</span>
        </a>
        <div class="flex flex-col items-center gap-3 p-8 border border-gold/10 hover:border-gold/30 transition-colors cursor-pointer" @click="copyWechat">
          <span class="text-2xl text-gold">💬</span>
          <span class="font-sans-cn text-xs text-luxury-muted tracking-wider">微信咨询</span>
          <span class="font-sans-cn text-sm text-luxury">HUANXITIANZHU</span>
        </div>
      </div>
      <p class="mt-8 font-sans-cn text-sm text-luxury-muted tracking-wider reveal reveal-delay-2">
        展厅地址：北京市亮马古玩城 xxx层xxx室
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { trackApi } from '@/api'

const values = [
  { icon: '◎', title: '真实有灵', desc: '所有天珠均经严格鉴定，保证正宗天然，杜绝仿制。每一颗都蕴含真实的藏地能量。' },
  { icon: '✦', title: '一珠一缘', desc: '我们相信缘分，每件藏品都有其主人。不强买强卖，只等待那个与之有缘的人。' },
  { icon: '▲', title: '专业服务', desc: '多年藏品经验，专业团队提供鉴赏指导与收藏建议，为每位藏家保驾护航。' },
]

function copyWechat() {
  navigator.clipboard?.writeText('HUANXITIANZHU').then(() => alert('微信号已复制：HUANXITIANZHU'))
}

onMounted(() => {
  trackApi.pageView('/about')
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) } }),
    { threshold: 0.1 }
  )
  setTimeout(() => document.querySelectorAll('.reveal').forEach(el => observer.observe(el)), 100)
})
</script>
