<template>
  <div class="min-h-screen pt-20" v-if="product">
    <div class="max-w-7xl mx-auto px-6 lg:px-12 py-16">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-sans-cn text-luxury-muted mb-10">
        <RouterLink to="/" class="hover:text-gold transition-colors">首页</RouterLink>
        <span class="text-gold/30">·</span>
        <RouterLink to="/products" class="hover:text-gold transition-colors">精品展示</RouterLink>
        <span class="text-gold/30">·</span>
        <span class="text-luxury/60 line-clamp-1">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <!-- Image gallery -->
        <div>
          <!-- Main image -->
          <div class="relative aspect-square overflow-hidden bg-luxury-dark mb-4">
            <Transition name="img-fade" mode="out-in">
              <img
                :key="activeImage"
                :src="imgSrc(activeImage)"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
            </Transition>
            <!-- Zoom hint -->
            <div class="absolute bottom-4 right-4 text-luxury-muted/40 text-xs font-serif-en tracking-wider">
              {{ activeIndex + 1 }} / {{ product.images.length }}
            </div>
          </div>

          <!-- Thumbnails -->
          <div class="flex gap-2 overflow-x-auto pb-2">
            <button
              v-for="(img, idx) in product.images"
              :key="idx"
              @click="activeIndex = idx"
              :class="[
                'flex-shrink-0 w-16 h-16 overflow-hidden border-2 transition-all',
                activeIndex === idx ? 'border-gold' : 'border-transparent opacity-60 hover:opacity-100'
              ]"
            >
              <img :src="imgSrc(img)" :alt="`图${idx+1}`" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product info -->
        <div class="flex flex-col">
          <!-- Category badge -->
          <div class="font-serif-en text-xs tracking-[0.4em] text-gold/60 uppercase mb-4">
            {{ product.category_name }} · {{ product.category_slug?.toUpperCase() }}
          </div>

          <!-- Name -->
          <h1 class="font-serif-cn text-2xl lg:text-3xl xl:text-4xl font-light tracking-[0.1em] text-luxury leading-snug mb-4">
            {{ product.name }}
          </h1>

          <p v-if="product.subtitle" class="font-sans-cn text-sm text-luxury-muted tracking-wider mb-6">
            {{ product.subtitle }}
          </p>

          <div class="gold-divider mb-8"></div>

          <!-- Price -->
          <div class="mb-8">
            <div v-if="product.is_inquiry_only" class="flex items-center gap-3">
              <span class="font-serif-en text-2xl text-gold/60 tracking-wider">Price on Request</span>
              <span class="font-sans-cn text-xs text-luxury-muted tracking-wider px-3 py-1 border border-gold/20">联系询价</span>
            </div>
            <div v-else>
              <span class="font-serif-en text-xs text-gold/50 tracking-wider mr-2">CNY</span>
              <span class="price-luxury text-4xl text-gold">¥{{ formatPrice(product.price!) }}</span>
              <span v-if="product.original_price" class="ml-3 font-serif-en text-lg text-luxury-muted/50 line-through">
                ¥{{ formatPrice(product.original_price) }}
              </span>
            </div>
          </div>

          <!-- Size info -->
          <div v-if="product.size_info" class="mb-6">
            <span class="font-sans-cn text-xs text-luxury-muted tracking-wider mr-3">尺寸规格</span>
            <span class="font-sans-cn text-sm text-luxury tracking-wide">{{ product.size_info }}</span>
          </div>

          <!-- Tags -->
          <div v-if="product.tags?.length" class="flex flex-wrap gap-2 mb-8">
            <span
              v-for="tag in product.tags"
              :key="tag"
              class="font-sans-cn text-[10px] tracking-wider px-3 py-1 border border-gold/15 text-luxury-muted"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Actions -->
          <div class="flex flex-col gap-3 mb-10">
            <button
              v-if="product.is_inquiry_only"
              @click="openInquiry"
              class="btn-gold w-full py-4 text-sm"
            >
              联系询价
            </button>
            <button
              v-else
              @click="openOrder"
              class="btn-gold w-full py-4 text-sm"
              :disabled="product.stock === 0"
            >
              {{ product.stock === 0 ? '暂无库存' : '立即购买' }}
            </button>
            <button
              @click="copyWechat"
              class="btn-ghost-gold w-full py-3 text-xs flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.5 10.5a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"/>
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
              </svg>
              微信咨询：HUANXITIANZHU
            </button>
          </div>

          <!-- Description -->
          <div class="border-t border-gold/10 pt-8">
            <h3 class="font-serif-en text-xs tracking-[0.3em] text-gold/60 uppercase mb-4">Description</h3>
            <p class="font-serif-cn text-sm leading-loose text-luxury/70 tracking-wide">
              {{ product.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- Related products -->
      <div v-if="related.length" class="mt-24 pt-12 border-t border-gold/10">
        <div class="text-center mb-12">
          <p class="section-subtitle mb-4">You May Also Like</p>
          <h2 class="font-serif-cn text-2xl tracking-widest text-luxury">相关珍品</h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          <ProductCard v-for="p in related" :key="p.id" :product="p" />
        </div>
      </div>
    </div>

    <!-- Order/Inquiry modal -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
          @click.self="showModal = false"
        >
          <div class="absolute inset-0 bg-luxury-black/80 backdrop-blur-sm"></div>
          <div class="relative w-full max-w-md bg-luxury-dark border border-gold/15 p-8">
            <button @click="showModal = false" class="absolute top-4 right-4 text-luxury-muted hover:text-luxury">✕</button>
            <h3 class="font-serif-cn text-xl tracking-widest text-luxury mb-6">
              {{ product.is_inquiry_only ? '联系询价' : '下单购买' }}
            </h3>

            <div class="space-y-4">
              <div>
                <label class="font-sans-cn text-xs tracking-wider text-luxury-muted block mb-2">您的姓名</label>
                <input v-model="form.customer_name" type="text" placeholder="请输入姓名"
                  class="w-full bg-luxury-card border border-gold/15 px-4 py-3 text-luxury text-sm focus:border-gold/40 outline-none transition-colors font-sans-cn" />
              </div>
              <div>
                <label class="font-sans-cn text-xs tracking-wider text-luxury-muted block mb-2">联系电话 *</label>
                <input v-model="form.customer_phone" type="tel" placeholder="请输入手机号"
                  class="w-full bg-luxury-card border border-gold/15 px-4 py-3 text-luxury text-sm focus:border-gold/40 outline-none transition-colors font-sans-cn" />
              </div>
              <div>
                <label class="font-sans-cn text-xs tracking-wider text-luxury-muted block mb-2">微信号</label>
                <input v-model="form.customer_wechat" type="text" placeholder="方便微信联系您"
                  class="w-full bg-luxury-card border border-gold/15 px-4 py-3 text-luxury text-sm focus:border-gold/40 outline-none transition-colors font-sans-cn" />
              </div>
              <div>
                <label class="font-sans-cn text-xs tracking-wider text-luxury-muted block mb-2">留言</label>
                <textarea v-model="form.message" rows="3" placeholder="有什么想说的..."
                  class="w-full bg-luxury-card border border-gold/15 px-4 py-3 text-luxury text-sm focus:border-gold/40 outline-none transition-colors resize-none font-sans-cn"></textarea>
              </div>
            </div>

            <button
              @click="submitOrder"
              :disabled="submitting"
              class="btn-gold w-full mt-6 py-4"
            >
              {{ submitting ? '提交中...' : (product.is_inquiry_only ? '提交询价' : '确认下单') }}
            </button>

            <div v-if="submitResult" :class="['mt-4 p-3 text-sm font-sans-cn text-center', submitResult.success ? 'text-green-400 border border-green-400/20' : 'text-red-400 border border-red-400/20']">
              {{ submitResult.message }}
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>

  <!-- Loading skeleton -->
  <div v-else-if="loading" class="min-h-screen pt-24 max-w-7xl mx-auto px-6 lg:px-12 py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div class="aspect-square bg-luxury-card animate-pulse"></div>
      <div class="space-y-4">
        <div class="h-4 w-24 bg-luxury-card animate-pulse"></div>
        <div class="h-10 w-3/4 bg-luxury-card animate-pulse"></div>
        <div class="h-4 w-1/2 bg-luxury-card animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductCard from '@/components/common/ProductCard.vue'
import { productsApi, ordersApi, trackApi } from '@/api'
import type { Product } from '@/api'

const route = useRoute()
const product = ref<Product | null>(null)
const related = ref<Product[]>([])
const loading = ref(true)
const activeIndex = ref(0)
const showModal = ref(false)
const submitting = ref(false)
const submitResult = ref<{ success: boolean, message: string } | null>(null)

const form = ref({
  customer_name: '',
  customer_phone: '',
  customer_wechat: '',
  message: '',
})

const activeImage = computed(() => product.value?.images[activeIndex.value] || '')

function imgSrc(path: string) {
  return path.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}

function formatPrice(price: number) {
  return price.toLocaleString('zh-CN')
}

function openInquiry() {
  form.value = { customer_name: '', customer_phone: '', customer_wechat: '', message: '' }
  submitResult.value = null
  showModal.value = true
}

function openOrder() {
  form.value = { customer_name: '', customer_phone: '', customer_wechat: '', message: '' }
  submitResult.value = null
  showModal.value = true
}

function copyWechat() {
  navigator.clipboard?.writeText('HUANXITIANZHU').then(() => {
    alert('微信号已复制：HUANXITIANZHU')
  })
}

async function submitOrder() {
  if (!form.value.customer_phone) {
    submitResult.value = { success: false, message: '请填写联系电话' }
    return
  }
  submitting.value = true
  try {
    const res = await ordersApi.create({
      product_id: product.value!.id,
      ...form.value,
    })
    submitResult.value = { success: true, message: res.data.message }
    setTimeout(() => { showModal.value = false }, 3000)
  } catch (e: any) {
    submitResult.value = { success: false, message: e.response?.data?.error || '提交失败，请稍后重试' }
  } finally {
    submitting.value = false
  }
}

async function loadProduct() {
  loading.value = true
  const id = Number(route.params.id)
  try {
    const res = await productsApi.get(id)
    product.value = res.data.product
    related.value = res.data.related
    trackApi.productView(id)
  } catch {
    product.value = null
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, loadProduct)
onMounted(() => loadProduct())
</script>

<style scoped>
.img-fade-enter-active, .img-fade-leave-active { transition: opacity 0.3s ease; }
.img-fade-enter-from, .img-fade-leave-to { opacity: 0; }
</style>
