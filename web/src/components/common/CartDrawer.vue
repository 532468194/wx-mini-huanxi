<template>
  <div v-if="show" class="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-luxury-dark border-l border-gold/15 shadow-luxury">
    <div class="flex items-center justify-between p-6 border-b border-gold/10">
      <h3 class="font-serif-cn text-lg tracking-widest text-luxury">购物车</h3>
      <button @click="emit('close')" class="text-luxury-muted hover:text-luxury">✕</button>
    </div>
    <div class="flex-1 overflow-y-auto p-6">
      <div v-if="cartStore.items.length === 0" class="text-center py-12">
        <p class="font-serif-cn text-luxury/30 tracking-widest">购物车为空</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="item in cartStore.items" :key="item.product.id" class="flex gap-3 luxury-card p-3">
          <img :src="imgSrc(item.product.images[0])" class="w-16 h-16 object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <p class="font-serif-cn text-xs text-luxury line-clamp-2">{{ item.product.name }}</p>
            <p class="font-serif-en text-sm text-gold mt-1">¥{{ formatPrice(item.product.price! * item.quantity) }}</p>
          </div>
          <button @click="cartStore.remove(item.product.id)" class="text-luxury-muted hover:text-red-400 text-xs self-start">✕</button>
        </div>
      </div>
    </div>
    <div v-if="cartStore.items.length > 0" class="p-6 border-t border-gold/10">
      <div class="flex justify-between mb-4">
        <span class="font-sans-cn text-sm text-luxury-muted">合计</span>
        <span class="font-serif-en text-xl text-gold">¥{{ formatPrice(cartStore.total) }}</span>
      </div>
      <RouterLink to="/cart" @click="emit('close')" class="btn-gold block text-center py-3 text-sm">查看购物车</RouterLink>
    </div>
  </div>
  <div v-if="show" class="fixed inset-0 bg-luxury-black/50 z-40" @click="emit('close')"></div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart'

defineProps<{ show?: boolean }>()
const emit = defineEmits(['close'])
const cartStore = useCartStore()

function imgSrc(path: string) {
  return path.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}
function formatPrice(price: number) { return price.toLocaleString('zh-CN') }
</script>
