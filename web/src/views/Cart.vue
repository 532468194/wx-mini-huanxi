<template>
  <div class="min-h-screen pt-24 pb-20 max-w-4xl mx-auto px-6 lg:px-12">
    <h1 class="font-serif-cn text-3xl tracking-widest text-luxury mb-4">购物车</h1>
    <div class="gold-divider mb-10"></div>

    <div v-if="cartStore.items.length === 0" class="text-center py-24">
      <p class="font-serif-cn text-xl text-luxury/30 tracking-widest mb-6">购物车为空</p>
      <RouterLink to="/products" class="btn-ghost-gold inline-block">去选购</RouterLink>
    </div>

    <div v-else>
      <div class="space-y-4 mb-10">
        <div v-for="item in cartStore.items" :key="item.product.id" class="luxury-card flex gap-4 p-4">
          <img :src="imgSrc(item.product.images[0])" class="w-20 h-20 object-cover flex-shrink-0" />
          <div class="flex-1">
            <p class="font-serif-cn text-sm text-luxury tracking-wide line-clamp-2">{{ item.product.name }}</p>
            <p class="font-serif-en text-lg text-gold mt-1">¥{{ formatPrice(item.product.price! * item.quantity) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="cartStore.updateQuantity(item.product.id, item.quantity - 1)" class="w-7 h-7 border border-gold/20 text-gold hover:border-gold text-sm">-</button>
            <span class="w-8 text-center text-luxury text-sm">{{ item.quantity }}</span>
            <button @click="cartStore.updateQuantity(item.product.id, item.quantity + 1)" class="w-7 h-7 border border-gold/20 text-gold hover:border-gold text-sm">+</button>
            <button @click="cartStore.remove(item.product.id)" class="ml-2 text-luxury-muted hover:text-red-400 text-sm">✕</button>
          </div>
        </div>
      </div>

      <div class="border-t border-gold/10 pt-6 flex items-center justify-between">
        <div>
          <span class="font-sans-cn text-sm text-luxury-muted">合计</span>
          <span class="font-serif-en text-3xl text-gold ml-4">¥{{ formatPrice(cartStore.total) }}</span>
        </div>
        <RouterLink v-if="cartStore.items.length === 1" :to="`/checkout/${cartStore.items[0].product.id}`" class="btn-gold">结算</RouterLink>
        <button v-else @click="showBatchOrder = true" class="btn-gold">联系结算</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
const showBatchOrder = ref(false)

function imgSrc(path: string) {
  return path.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}
function formatPrice(price: number) { return price.toLocaleString('zh-CN') }
</script>
