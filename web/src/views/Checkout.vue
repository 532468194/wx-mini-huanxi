<template>
  <div class="min-h-screen pt-24 pb-20 max-w-2xl mx-auto px-6 lg:px-12">
    <h1 class="font-serif-cn text-3xl tracking-widest text-luxury mb-4">下单购买</h1>
    <div class="gold-divider mb-10"></div>

    <div v-if="product" class="flex gap-4 luxury-card p-4 mb-10">
      <img :src="imgSrc(product.images[0])" class="w-20 h-20 object-cover flex-shrink-0" />
      <div>
        <p class="font-serif-cn text-sm text-luxury">{{ product.name }}</p>
        <p class="font-serif-en text-xl text-gold mt-1">
          {{ product.is_inquiry_only ? '面议' : '¥' + formatPrice(product.price!) }}
        </p>
      </div>
    </div>

    <div v-if="!submitted" class="space-y-5">
      <div>
        <label class="font-sans-cn text-xs text-luxury-muted tracking-wider block mb-2">姓名</label>
        <input v-model="form.customer_name" type="text" placeholder="请输入您的姓名"
          class="w-full bg-luxury-card border border-gold/15 px-4 py-3 text-luxury focus:border-gold/40 outline-none font-sans-cn text-sm" />
      </div>
      <div>
        <label class="font-sans-cn text-xs text-luxury-muted tracking-wider block mb-2">手机号 *</label>
        <input v-model="form.customer_phone" type="tel" placeholder="请输入手机号（必填）"
          class="w-full bg-luxury-card border border-gold/15 px-4 py-3 text-luxury focus:border-gold/40 outline-none font-sans-cn text-sm" />
      </div>
      <div>
        <label class="font-sans-cn text-xs text-luxury-muted tracking-wider block mb-2">微信号</label>
        <input v-model="form.customer_wechat" type="text" placeholder="方便微信联系"
          class="w-full bg-luxury-card border border-gold/15 px-4 py-3 text-luxury focus:border-gold/40 outline-none font-sans-cn text-sm" />
      </div>
      <div>
        <label class="font-sans-cn text-xs text-luxury-muted tracking-wider block mb-2">留言</label>
        <textarea v-model="form.message" rows="3" placeholder="有什么想说的..."
          class="w-full bg-luxury-card border border-gold/15 px-4 py-3 text-luxury focus:border-gold/40 outline-none resize-none font-sans-cn text-sm"></textarea>
      </div>

      <div v-if="error" class="text-red-400 text-sm font-sans-cn p-3 border border-red-400/20">{{ error }}</div>

      <button @click="submit" :disabled="submitting" class="btn-gold w-full py-4 mt-2">
        {{ submitting ? '提交中...' : (product?.is_inquiry_only ? '提交询价' : '确认下单') }}
      </button>
    </div>

    <!-- Success state -->
    <div v-else class="text-center py-16">
      <div class="text-gold text-5xl mb-6">✓</div>
      <h2 class="font-serif-cn text-2xl tracking-widest text-luxury mb-4">提交成功</h2>
      <p class="font-sans-cn text-sm text-luxury-muted tracking-wide mb-2">订单编号：{{ orderNo }}</p>
      <p class="font-sans-cn text-sm text-luxury/60 tracking-wide mb-10">{{ successMsg }}</p>
      <RouterLink to="/products" class="btn-ghost-gold inline-block">继续选购</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { productsApi, ordersApi } from '@/api'
import type { Product } from '@/api'

const route = useRoute()
const product = ref<Product | null>(null)
const submitting = ref(false)
const submitted = ref(false)
const error = ref('')
const orderNo = ref('')
const successMsg = ref('')

const form = ref({
  customer_name: '',
  customer_phone: '',
  customer_wechat: '',
  message: '',
})

function imgSrc(path: string) {
  return path.split('/').map((seg, i) => i === 0 ? seg : encodeURIComponent(seg)).join('/')
}
function formatPrice(price: number) { return price.toLocaleString('zh-CN') }

async function submit() {
  if (!form.value.customer_phone) {
    error.value = '请填写手机号'
    return
  }
  submitting.value = true
  error.value = ''
  try {
    const res = await ordersApi.create({
      product_id: product.value!.id,
      ...form.value,
    })
    orderNo.value = res.data.order_no
    successMsg.value = res.data.message
    submitted.value = true
  } catch (e: any) {
    error.value = e.response?.data?.error || '提交失败，请重试'
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const id = Number(route.params.productId)
  try {
    const res = await productsApi.get(id)
    product.value = res.data.product
  } catch {}
})
</script>
