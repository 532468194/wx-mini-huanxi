<template>
  <view class="container" v-if="product">
    <!-- Image swiper -->
    <swiper class="img-swiper" :current="activeImg" @change="(e) => activeImg = e.detail.current" circular>
      <swiper-item v-for="(img, idx) in product.images" :key="idx">
        <image :src="imgUrl(img)" mode="aspectFill" class="detail-img" @tap="previewImg(idx)" />
      </swiper-item>
    </swiper>
    <!-- Image counter -->
    <view class="img-counter">{{ activeImg + 1 }}/{{ product.images.length }}</view>

    <!-- Product info -->
    <view class="info-section">
      <text class="cat-label">{{ product.category_name }}</text>
      <text class="product-title">{{ product.name }}</text>
      <text v-if="product.subtitle" class="product-subtitle">{{ product.subtitle }}</text>

      <view class="divider-gold"></view>

      <!-- Price -->
      <view class="price-row">
        <view v-if="product.is_inquiry_only" class="inquiry-price">
          <text class="inquiry-label">Price on Request</text>
          <text class="inquiry-zh">联系询价</text>
        </view>
        <view v-else class="direct-price">
          <text class="price-symbol">¥</text>
          <text class="price-value">{{ formatPrice(product.price) }}</text>
        </view>
        <text v-if="product.size_info" class="size-info">{{ product.size_info }}</text>
      </view>

      <!-- Tags -->
      <view v-if="product.tags && product.tags.length" class="tags-row">
        <text v-for="tag in product.tags" :key="tag" class="tag">{{ tag }}</text>
      </view>

      <!-- Description -->
      <view class="desc-section">
        <text class="desc-title">DESCRIPTION</text>
        <view class="desc-divider"></view>
        <text class="desc-text">{{ product.description }}</text>
      </view>
    </view>

    <!-- Related products -->
    <view v-if="related.length" class="related-section">
      <text class="related-title">相关珍品</text>
      <view class="gold-divider" style="width: 80rpx; margin: 20rpx 0;"></view>
      <scroll-view scroll-x show-scrollbar="false">
        <view class="related-row">
          <view v-for="p in related" :key="p.id" class="related-item luxury-card" @tap="goProduct(p.id)">
            <image :src="imgUrl(p.images[0])" mode="aspectFill" style="width: 160rpx; height: 160rpx;" />
            <view style="padding: 12rpx;">
              <text style="font-size: 20rpx; color: #F0EBE0; display: block; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">{{ p.name }}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>

    <!-- Bottom action bar -->
    <view class="action-bar">
      <view class="action-wechat" @tap="copyWechat">
        <text class="action-wechat-text">微信咨询</text>
      </view>
      <view class="action-buy btn-gold" @tap="openOrder">
        <text class="action-buy-text">{{ product.is_inquiry_only ? '联系询价' : '立即购买' }}</text>
      </view>
    </view>

    <!-- Order modal -->
    <view v-if="showModal" class="modal-mask" @tap="showModal = false">
      <view class="modal-content" @tap.stop>
        <text class="modal-title">{{ product.is_inquiry_only ? '联系询价' : '下单购买' }}</text>
        <view class="modal-form">
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
            <input v-model="form.customer_wechat" placeholder="方便联系" class="form-input" />
          </view>
          <view class="form-item">
            <text class="form-label">留言</text>
            <textarea v-model="form.message" placeholder="有什么想说的..." class="form-textarea" />
          </view>
        </view>
        <view class="modal-btn btn-gold" @tap="submitOrder">
          <text>{{ submitting ? '提交中...' : '确认提交' }}</text>
        </view>
        <text v-if="submitResult" :style="{ color: submitResult.success ? '#67C23A' : '#F56C6C', display: 'block', textAlign: 'center', marginTop: '20rpx', fontSize: '26rpx' }">
          {{ submitResult.message }}
        </text>
      </view>
    </view>
  </view>

  <!-- Loading -->
  <view v-else class="loading-wrap">
    <view class="skeleton" style="height: 600rpx; margin-bottom: 20rpx;"></view>
    <view style="padding: 30rpx;">
      <view class="skeleton" style="height: 40rpx; width: 60%; margin-bottom: 20rpx;"></view>
      <view class="skeleton" style="height: 60rpx; width: 80%; margin-bottom: 20rpx;"></view>
    </view>
  </view>
</template>

<script>
import { api, imgUrl } from '@/utils/api.js'

export default {
  data() {
    return {
      product: null,
      related: [],
      activeImg: 0,
      showModal: false,
      submitting: false,
      submitResult: null,
      form: { customer_name: '', customer_phone: '', customer_wechat: '', message: '' },
    }
  },
  async onLoad(options) {
    uni.setNavigationBarTitle({ title: '商品详情' })
    const res = await api.getProduct(options.id)
    this.product = res.product
    this.related = res.related
    api.track(`/products/${options.id}`, options.id)
  },
  methods: {
    imgUrl,
    formatPrice(p) { return p?.toLocaleString('zh-CN') || '' },
    goProduct(id) { uni.navigateTo({ url: `/pages/products/detail?id=${id}` }) },
    previewImg(idx) {
      uni.previewImage({
        current: idx,
        urls: this.product.images.map(img => imgUrl(img)),
      })
    },
    copyWechat() {
      uni.setClipboardData({ data: 'HUANXITIANZHU', success: () => uni.showToast({ title: '微信号已复制', icon: 'success' }) })
    },
    openOrder() {
      this.form = { customer_name: '', customer_phone: '', customer_wechat: '', message: '' }
      this.submitResult = null
      this.showModal = true
    },
    async submitOrder() {
      if (!this.form.customer_phone) {
        uni.showToast({ title: '请填写手机号', icon: 'none' })
        return
      }
      this.submitting = true
      try {
        const res = await api.createOrder({ product_id: this.product.id, ...this.form })
        this.submitResult = { success: true, message: res.message }
        setTimeout(() => { this.showModal = false }, 2500)
      } catch (e) {
        this.submitResult = { success: false, message: e.error || '提交失败，请重试' }
      } finally {
        this.submitting = false
      }
    },
  },
}
</script>

<style lang="scss">
.container { background: #080808; min-height: 100vh; padding-bottom: 160rpx; }

.img-swiper { width: 100%; height: 750rpx; }
.detail-img { width: 100%; height: 100%; }
.img-counter {
  position: absolute;
  bottom: 770rpx;
  right: 30rpx;
  background: rgba(0,0,0,0.5);
  color: #F0EBE0;
  font-size: 22rpx;
  padding: 6rpx 16rpx;
}

.info-section {
  padding: 40rpx 30rpx;
  .cat-label { display: block; font-size: 22rpx; letter-spacing: 8rpx; color: rgba(201,168,76,0.6); text-transform: uppercase; margin-bottom: 16rpx; }
  .product-title { display: block; font-size: 42rpx; letter-spacing: 4rpx; font-weight: 300; color: #F0EBE0; line-height: 1.4; margin-bottom: 16rpx; }
  .product-subtitle { display: block; font-size: 26rpx; color: #8A7A60; letter-spacing: 2rpx; margin-bottom: 24rpx; }
  .divider-gold { height: 2rpx; background: linear-gradient(90deg, transparent, #C9A84C, transparent); margin: 30rpx 0; }
  .price-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30rpx;
    .inquiry-price {
      .inquiry-label { display: block; font-size: 30rpx; color: rgba(201,168,76,0.5); letter-spacing: 4rpx; }
      .inquiry-zh { display: block; font-size: 20rpx; color: #8A7A60; margin-top: 6rpx; letter-spacing: 4rpx; }
    }
    .direct-price {
      display: flex;
      align-items: flex-end;
      .price-symbol { font-size: 28rpx; color: rgba(201,168,76,0.6); margin-bottom: 6rpx; }
      .price-value { font-size: 60rpx; color: #C9A84C; font-family: Georgia, serif; font-weight: 300; line-height: 1; margin-left: 6rpx; }
    }
    .size-info { font-size: 22rpx; color: #8A7A60; }
  }
  .tags-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    margin-bottom: 30rpx;
    .tag {
      font-size: 20rpx;
      color: rgba(201,168,76,0.6);
      border: 1rpx solid rgba(201,168,76,0.2);
      padding: 6rpx 16rpx;
    }
  }
  .desc-section {
    border-top: 1rpx solid rgba(201,168,76,0.1);
    padding-top: 30rpx;
    .desc-title { display: block; font-size: 22rpx; letter-spacing: 8rpx; color: rgba(201,168,76,0.5); text-transform: uppercase; }
    .desc-divider { height: 1rpx; background: rgba(201,168,76,0.1); margin: 20rpx 0; }
    .desc-text { display: block; font-size: 28rpx; color: rgba(240,235,224,0.65); line-height: 1.9; letter-spacing: 2rpx; }
  }
}

.related-section {
  padding: 40rpx 30rpx;
  border-top: 1rpx solid rgba(201,168,76,0.1);
  .related-title { display: block; font-size: 36rpx; letter-spacing: 12rpx; font-weight: 300; color: #F0EBE0; }
  .related-row {
    display: flex;
    gap: 16rpx;
    white-space: nowrap;
    .related-item { display: inline-flex; flex-direction: column; width: 160rpx; flex-shrink: 0; }
  }
}

.action-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  display: flex;
  background: #0d0d0d;
  border-top: 1rpx solid rgba(201,168,76,0.1);
  padding: 0 30rpx;
  align-items: center;
  gap: 20rpx;
  padding-bottom: env(safe-area-inset-bottom);
  .action-wechat {
    flex: 1;
    height: 80rpx;
    border: 1rpx solid rgba(201,168,76,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    .action-wechat-text { font-size: 26rpx; color: #C9A84C; letter-spacing: 4rpx; }
  }
  .action-buy {
    flex: 2;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .action-buy-text { font-size: 28rpx; color: #080808; letter-spacing: 4rpx; font-weight: 600; }
  }
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: flex-end;
  z-index: 100;
  .modal-content {
    background: #111;
    width: 100%;
    padding: 40rpx;
    border-top: 1rpx solid rgba(201,168,76,0.2);
    padding-bottom: calc(40rpx + env(safe-area-inset-bottom));
    .modal-title { display: block; font-size: 36rpx; letter-spacing: 8rpx; font-weight: 300; color: #F0EBE0; margin-bottom: 30rpx; }
    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 20rpx;
      margin-bottom: 30rpx;
      .form-item {
        .form-label { display: block; font-size: 22rpx; color: #8A7A60; letter-spacing: 4rpx; margin-bottom: 10rpx; }
        .form-input {
          width: 100%;
          background: #151515;
          border: 1rpx solid rgba(201,168,76,0.15);
          padding: 20rpx;
          font-size: 28rpx;
          color: #F0EBE0;
        }
        .form-textarea {
          width: 100%;
          background: #151515;
          border: 1rpx solid rgba(201,168,76,0.15);
          padding: 20rpx;
          font-size: 28rpx;
          color: #F0EBE0;
          height: 140rpx;
        }
      }
    }
    .modal-btn {
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      color: #080808;
      font-weight: 600;
      letter-spacing: 8rpx;
    }
  }
}

.loading-wrap { padding: 20rpx; }
</style>
