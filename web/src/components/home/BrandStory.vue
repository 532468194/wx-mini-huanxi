<template>
  <!-- Brand philosophy section -->
  <section class="relative py-32 overflow-hidden">
    <!-- Background texture -->
    <div class="absolute inset-0 bg-luxury-dark"></div>
    <div class="absolute inset-0 opacity-5" style="background-image: url('data:image/svg+xml,<svg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'><g fill=\'%23C9A84C\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'><path d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/></g></svg>');"></div>

    <!-- Gold top border -->
    <div class="absolute top-0 left-0 right-0 h-px gold-divider"></div>
    <div class="absolute bottom-0 left-0 right-0 h-px gold-divider"></div>

    <div class="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
      <!-- Ornament -->
      <div class="flex items-center justify-center gap-4 mb-10 reveal">
        <div class="w-12 h-px bg-gold/50"></div>
        <div class="text-gold text-lg">✦</div>
        <div class="w-12 h-px bg-gold/50"></div>
      </div>

      <!-- Main quote -->
      <blockquote class="reveal">
        <p class="font-serif-cn text-2xl md:text-3xl lg:text-4xl leading-loose tracking-[0.15em] text-luxury font-light">
          天珠 戴的是<span class="text-gold-gradient">气场</span>
          <br class="hidden md:block">
          求的是<span class="text-gold-gradient">心安</span>
        </p>
      </blockquote>

      <div class="gold-divider w-24 mx-auto my-8 reveal reveal-delay-1"></div>

      <div class="reveal reveal-delay-2">
        <p class="font-serif-cn text-lg md:text-xl tracking-widest text-luxury/70 font-light leading-loose">
          守的是福报 · 一眼入心 · 一珠一缘
        </p>
        <p class="font-serif-cn text-base tracking-[0.2em] text-luxury/50 mt-4 font-light">
          佩戴天珠是最有力量的表达
        </p>
      </div>

      <div class="mt-10 reveal reveal-delay-3">
        <p class="font-serif-cn text-sm tracking-[0.3em] text-gold/60">
          欢喜天珠 · 不随波逐流 · 只取悦自己
        </p>
      </div>

      <!-- Bottom ornament -->
      <div class="flex items-center justify-center gap-4 mt-10 reveal reveal-delay-4">
        <div class="w-12 h-px bg-gold/50"></div>
        <div class="text-gold text-lg">✦</div>
        <div class="w-12 h-px bg-gold/50"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
onMounted(() => {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target) }
    }),
    { threshold: 0.15 }
  )
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
})
</script>
