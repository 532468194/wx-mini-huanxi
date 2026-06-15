import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/api'

export interface CartItem {
  product: Product
  quantity: number
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const showCart = ref(false)

  const total = computed(() => items.value.reduce((sum, item) => {
    return sum + (item.product.price || 0) * item.quantity
  }, 0))

  const count = computed(() => items.value.reduce((sum, i) => sum + i.quantity, 0))

  function add(product: Product, quantity = 1) {
    const existing = items.value.find(i => i.product.id === product.id)
    if (existing) {
      existing.quantity += quantity
    } else {
      items.value.push({ product, quantity })
    }
    showCart.value = true
  }

  function remove(productId: number) {
    items.value = items.value.filter(i => i.product.id !== productId)
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(i => i.product.id === productId)
    if (item) {
      if (quantity <= 0) remove(productId)
      else item.quantity = quantity
    }
  }

  function clear() {
    items.value = []
  }

  return { items, showCart, total, count, add, remove, updateQuantity, clear }
})
