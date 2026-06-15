<template>
  <view class="container">
    <view class="form-header">
      <text class="form-title">{{ product && product.is_inquiry_only ? '联系询价' : '下单购买' }}</text>
      <view class="gold-divider" style="width: 60rpx; margin: 20rpx 0;"></view>
    </view>

    <!-- Product info -->
    <view class="product-row luxury-card" v-if="product">
      <image :src="imgUrl(product.images[0])" mode="aspectFill" style="width: 100rpx; height: 100rpx; flex-shrink: 0;" />
      <view style="flex: 1; padding-left: 20rpx;">
        <text style="display: block; font-size: 26rpx; color: #F0EBE0; line-height: 1.4;">{{ product.name }}</text>
        <text style="display: block; font-size: 30rpx; color: #C9A84C; margin-top: 8rpx; font-family: Georgia, serif;">
          {{ product.is_inquiry_only ? '面议' : '¥' + formatPrice(product.price) }}
        </text>
      </view>
    </view>

    <view class="form-section" v-if="!submitted">
      <view class="form-item">
        <text class="form-label">姓名</text>
        <input v-model="form.customer_name" placeholder="请输入姓名" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">手机号 *</text>
        <input v-model="form.customer_phone" type="number" placeholder="必填" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">微信号</text>
        <input v-model="form.customer_wechat" placeholder="方便微信联系" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">收货地址</text>
        <input v-model="form.customer_address" placeholder="可选" class="form-input" />
      </view>
      <view class="form-item">
        <text class="form-label">留言</text>
        <textarea v-model="form.message" placeholder="有什么想说的..." class="form-textarea" />
      </view>

      <view v-if="errorMsg" class="error-msg">{{ errorMsg }}</view>

      <view class="submit-btn btn-gold" @tap="submit">
        <text>{{ submitting ? '提交中...' : (product && product.is_inquiry_only ? '提交询价' : '确认下单') }}</text>
      </view>
    </view>

    <!-- Success state -->
    <view class="success-section" v-else>
      <text class="success-icon">✓</text>
      <text class="success-title">提交成功</text>
      <text class="success-no">订单编号：{{ orderNo }}</text>
      <text class="success-msg">{{ successMsg }}</text>
      <view class="back-btn btn-ghost-gold" @tap="goBack">
        <text>继续选购</text>
      </view>
    </view>
  </view>
</template>

<script>
import { api, imgUrl } from '@/utils/api.js'

export default {
  data() {
    return {
      product: null,
      productId: null,
      submitting: false,
      submitted: false,
      errorMsg: '',
      orderNo: '',
      successMsg: '',
      form: { customer_name: '', customer_phone: '', customer_wechat: '', customer_address: '', message: '' },
    }
  },
  async onLoad(options) {
    this.productId = options.id
    try {
      const res = await api.getProduct(options.id)
      this.product = res.product
    } catch {}
  },
  methods: {
    imgUrl,
    formatPrice(p) { return p?.toLocaleString('zh-CN') || '' },
    goBack() { uni.switchTab({ url: '/pages/products/index' }) },
    async submit() {
      if (!this.form.customer_phone) {
        this.errorMsg = '请填写手机号'
        return
      }
      this.submitting = true
      this.errorMsg = ''
      try {
        const res = await api.createOrder({ product_id: this.productId, ...this.form })
        this.orderNo = res.order_no
        this.successMsg = res.message
        this.submitted = true
      } catch (e) {
        this.errorMsg = e.error || '提交失败，请重试'
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style lang="scss">
.container { background: #080808; min-height: 100vh; padding: 40rpx 30rpx 80rpx; }

.form-header {
  padding-bottom: 30rpx;
  .form-title { display: block; font-size: 44rpx; letter-spacing: 12rpx; font-weight: 300; color: #F0EBE0; }
}

.product-row {
  display: flex;
  align-items: center;
  padding: 24rpx;
  margin-bottom: 40rpx;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  .form-item {
    .form-label { display: block; font-size: 22rpx; color: #8A7A60; letter-spacing: 4rpx; margin-bottom: 10rpx; }
    .form-input {
      width: 100%; background: #111; border: 1rpx solid rgba(201,168,76,0.15);
      padding: 20rpx; font-size: 28rpx; color: #F0EBE0;
    }
    .form-textarea {
      width: 100%; background: #111; border: 1rpx solid rgba(201,168,76,0.15);
      padding: 20rpx; font-size: 28rpx; color: #F0EBE0; height: 150rpx;
    }
  }
  .error-msg { font-size: 26rpx; color: #F56C6C; text-align: center; padding: 10rpx; }
  .submit-btn {
    height: 90rpx; display: flex; align-items: center; justify-content: center;
    font-size: 28rpx; color: #080808; font-weight: 600; letter-spacing: 6rpx;
    margin-top: 20rpx;
  }
}

.success-section {
  display: flex; flex-direction: column; align-items: center;
  padding: 80rpx 0; gap: 20rpx;
  .success-icon { font-size: 80rpx; color: #C9A84C; }
  .success-title { font-size: 44rpx; letter-spacing: 12rpx; font-weight: 300; color: #F0EBE0; }
  .success-no { font-size: 24rpx; color: #8A7A60; letter-spacing: 2rpx; }
  .success-msg { font-size: 26rpx; color: rgba(240,235,224,0.6); letter-spacing: 2rpx; text-align: center; padding: 0 40rpx; }
  .back-btn {
    margin-top: 30rpx; height: 80rpx; padding: 0 60rpx; display: flex; align-items: center;
    border: 1rpx solid rgba(201,168,76,0.4); font-size: 26rpx; color: #C9A84C; letter-spacing: 6rpx;
  }
}
</style>
