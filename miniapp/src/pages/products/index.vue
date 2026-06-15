<template>
  <view class="container">
    <!-- Category tabs -->
    <scroll-view scroll-x class="category-tabs" show-scrollbar="false">
      <view class="tabs-row">
        <view
          :class="['tab-item', activeCategory === '' ? 'active' : '']"
          @tap="setCategory('')"
        >全部</view>
        <view
          v-for="cat in categories"
          :key="cat.id"
          :class="['tab-item', activeCategory === cat.slug ? 'active' : '']"
          @tap="setCategory(cat.slug)"
        >{{ cat.name }}</view>
      </view>
    </scroll-view>

    <!-- Products grid -->
    <view class="products-grid" v-if="!loading">
      <view
        v-for="product in products"
        :key="product.id"
        class="product-item luxury-card"
        @tap="goProduct(product.id)"
      >
        <view class="img-wrap">
          <image
            :src="imgUrl(product.images[0])"
            mode="aspectFill"
            class="product-img"
            @error="(e) => e.target && (e.target.src = '/static/placeholder.png')"
          />
          <view v-if="product.is_inquiry_only" class="badge-inquiry">面议</view>
        </view>
        <view class="product-info">
          <text class="p-name">{{ product.name }}</text>
          <text v-if="!product.is_inquiry_only" class="p-price">¥{{ formatPrice(product.price) }}</text>
          <text v-else class="p-inquiry">联系询价</text>
        </view>
      </view>
    </view>

    <!-- Loading skeleton -->
    <view class="products-grid" v-else>
      <view v-for="i in 8" :key="i" class="product-item luxury-card skeleton" style="height: 400rpx;"></view>
    </view>

    <!-- Load more -->
    <view v-if="page < totalPages" class="load-more" @tap="loadMore">
      <text class="btn-ghost-gold-mini">加载更多</text>
    </view>
  </view>
</template>

<script>
import { api, imgUrl } from '@/utils/api.js'

export default {
  data() {
    return {
      categories: [],
      products: [],
      activeCategory: '',
      loading: true,
      page: 1,
      totalPages: 1,
    }
  },
  async onLoad(options) {
    api.track('/products')
    const cats = await api.getCategories()
    this.categories = cats
    if (options.category) this.activeCategory = options.category
    await this.loadProducts()
  },
  methods: {
    imgUrl,
    formatPrice(p) { return p?.toLocaleString('zh-CN') || '' },
    goProduct(id) { uni.navigateTo({ url: `/pages/products/detail?id=${id}` }) },
    async setCategory(slug) {
      if (this.activeCategory === slug || this.loading) return // 防重复点击
      this.activeCategory = slug
      this.page = 1
      this.products = []
      await this.loadProducts()
    },
    async loadProducts() {
      this.loading = true
      try {
        const params = { page: this.page, limit: 16 }
        if (this.activeCategory) params.category = this.activeCategory
        const res = await api.getProducts(params)
        this.products = [...this.products, ...res.data]
        this.totalPages = res.pages
      } finally {
        this.loading = false
      }
    },
    async loadMore() {
      this.page++
      await this.loadProducts()
    },
  },
}
</script>

<style lang="scss">
.container { background: #080808; min-height: 100vh; }

.category-tabs {
  background: #0d0d0d;
  border-bottom: 1rpx solid rgba(201,168,76,0.1);
  .tabs-row {
    display: flex;
    padding: 0 20rpx;
    white-space: nowrap;
  }
  .tab-item {
    display: inline-block;
    padding: 28rpx 30rpx;
    font-size: 26rpx;
    letter-spacing: 4rpx;
    color: #8A7A60;
    border-bottom: 4rpx solid transparent;
    transition: all 0.2s;
    &.active {
      color: #C9A84C;
      border-bottom-color: #C9A84C;
    }
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  padding: 20rpx;
  .product-item {
    .img-wrap {
      position: relative;
      height: 360rpx;
      overflow: hidden;
      background: #151515;
      .product-img { width: 100%; height: 100%; }
      .badge-inquiry {
        position: absolute;
        top: 12rpx; left: 12rpx;
        font-size: 18rpx;
        color: #C9A84C;
        border: 1rpx solid rgba(201,168,76,0.3);
        padding: 4rpx 12rpx;
        background: rgba(8,8,8,0.8);
      }
    }
    .product-info {
      padding: 16rpx;
      .p-name {
        display: block;
        font-size: 24rpx;
        color: #F0EBE0;
        letter-spacing: 1rpx;
        line-height: 1.4;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .p-price { display: block; font-size: 30rpx; color: #C9A84C; margin-top: 8rpx; font-family: Georgia, serif; }
      .p-inquiry { display: block; font-size: 22rpx; color: rgba(201,168,76,0.5); margin-top: 8rpx; letter-spacing: 4rpx; }
    }
  }
}

.load-more {
  text-align: center;
  padding: 40rpx;
  .btn-ghost-gold-mini {
    display: inline-block;
    border: 1rpx solid rgba(201,168,76,0.4);
    color: #C9A84C;
    font-size: 24rpx;
    letter-spacing: 8rpx;
    padding: 16rpx 60rpx;
  }
}
</style>
