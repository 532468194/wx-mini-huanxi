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
    <CartDrawer :show="cartStore.showCart" @close="cartStore.showCart = false" />
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import CartDrawer from '@/components/common/CartDrawer.vue'
import { useCartStore } from '@/stores/cart'

const cartStore = useCartStore()
</script>
