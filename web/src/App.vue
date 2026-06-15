<template>
  <div id="app-root">
    <AppHeader />
    <main>
      <RouterView v-slot="{ Component, route }">
        <Transition :name="route.meta.transition as string || 'fade'" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <div v-if="cartStore.showCart" class="fixed inset-0 z-50">
      <CartDrawer @close="cartStore.showCart = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>
