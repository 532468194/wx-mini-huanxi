<template>
  <view class="container">
    <!-- Hero Banner -->
    <swiper
      class="hero-swiper"
      :autoplay="true"
      :interval="5000"
      :duration="800"
      indicator-dots
      indicator-color="rgba(201,168,76,0.4)"
      indicator-active-color="#C9A84C"
      circular
    >
      <swiper-item v-for="(banner, idx) in banners" :key="idx">
        <view class="banner-item">
          <image :src="imgUrl(banner.image_url)" mode="aspectFill" class="banner-img" />
          <view class="banner-overlay">
            <view class="banner-content">
              <text class="brand-en">HUANXI · TIANZHU</text>
              <text class="brand-cn">欢喜</text>
              <view class="ornament-line">
                <view class="line"></view>
                <text class="diamond">◆</text>
                <view class="line"></view>
              </view>
              <text class="brand-tagline">戴的是气场 · 求的是心安</text>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>

    <!-- Marquee strip -->
    <view class="marquee-strip">
      <text class="marquee-text">天珠 · TIANZHU · 文玩 · WENWAN · 老天铁 · LAO TIANTIE · 茶系列 · TEA ·</text>
    </view>

    <!-- Categories -->
    <view class="section">
      <view class="section-header">
        <text class="section-subtitle">COLLECTIONS</text>
        <text class="section-title">精品系列</text>
        <view class="gold-divider center-divider"></view>
      </view>

      <view class="category-grid">
        <view
          v-for="cat in categories"
          :key="cat.id"
          class="category-item luxury-card"
          @tap="goCategory(cat.slug)"
        >
          <image :src="imgUrl(cat.cover_image)" mode="aspectFill" class="category-img" />
          <view class="category-overlay">
            <text class="category-en">{{ catEngNames[cat.slug] }}</text>
            <text class="category-cn">{{ cat.name }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- Featured Products -->
    <view class="section">
      <view class="section-header">
        <text class="section-subtitle">FEATURED ITEMS</text>
        <text class="section-title">精选臻品</text>
        <view class="gold-divider center-divider"></view>
      </view>

      <scroll-view scroll-x class="products-scroll" show-scrollbar="false">
        <view class="products-row">
          <view
            v-for="product in featuredProducts"
            :key="product.id"
            class="product-card luxury-card"
            @tap="goProduct(product.id)"
          >
            <view class="product-img-wrap">
              <image :src="imgUrl(product.images[0])" mode="aspectFill" class="product-img" />
              <view v-if="product.is_inquiry_only" class="inquiry-badge">面议</view>
            </view>
            <view class="product-info">
              <text class="product-name">{{ product.name }}</text>
              <text v-if="!product.is_inquiry_only" class="product-price">¥{{ formatPrice(product.price) }}</text>
              <text v-else class="product-price-inquiry">联系询价</text>
            </view>
          </view>
        </view>
      </scroll-view>

      <view class="view-all-btn" @tap="goProducts">
        <text class="btn-ghost-gold-mini">查看全部</text>
      </view>
    </view>

    <!-- Brand Philosophy -->
    <view class="philosophy-section">
      <view class="philosophy-ornament">
        <view class="phi-line"></view>
        <text class="phi-star">✦</text>
        <view class="phi-line"></view>
      </view>
      <text class="phi-quote">天珠 戴的是<text class="gold-text">气场</text></text>
      <text class="phi-quote">求的是<text class="gold-text">心安</text></text>
      <view class="gold-divider phi-divider"></view>
      <text class="phi-sub">守的是福报 · 一眼入心 · 一珠一缘</text>
      <text class="phi-brand">欢喜天珠 · 不随波逐流 · 只取悦自己</text>
    </view>

    <!-- Contact -->
    <view class="contact-section">
      <text class="contact-title">联系欢喜</text>
      <view class="gold-divider contact-divider"></view>
      <view class="contact-list">
        <view class="contact-item" @tap="callPhone">
          <text class="contact-icon">☎</text>
          <view class="contact-info">
            <text class="contact-label">电话咨询</text>
            <text class="contact-value">13188888888</text>
          </view>
        </view>
        <view class="contact-item" @tap="copyWechat">
          <text class="contact-icon">💬</text>
          <view class="contact-info">
            <text class="contact-label">微信咨询</text>
            <text class="contact-value">HUANXITIANZHU</text>
          </view>
        </view>
        <view class="contact-item">
          <text class="contact-icon">📍</text>
          <view class="contact-info">
            <text class="contact-label">实体展厅</text>
            <text class="contact-value">亮马古玩城xxx层xxx室</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { api, imgUrl } from '@/utils/api.js'

export default {
  data() {
    return {
      banners: [],
      categories: [],
      featuredProducts: [],
      catEngNames: {
        tianzhu: 'Heavenly Beads',
        wenwan: 'Antique Crafts',
        'lao-tiantie': 'Ancient Iron',
        tea: 'Premium Tea',
      },
    }
  },
  async onLoad() {
    api.track('/')
    try {
      const [b, c, p] = await Promise.all([
        api.getBanners(),
        api.getCategories(),
        api.getProducts({ featured: 1, limit: 6 }),
      ])
      this.banners = b
      this.categories = c
      this.featuredProducts = p.data
    } catch (e) {
      console.error('加载失败', e)
    }
  },
  methods: {
    imgUrl,
    formatPrice(p) { return p?.toLocaleString('zh-CN') || '' },
    goCategory(slug) { uni.switchTab({ url: '/pages/products/index' }) },
    goProduct(id) { uni.navigateTo({ url: `/pages/products/detail?id=${id}` }) },
    goProducts() { uni.switchTab({ url: '/pages/products/index' }) },
    callPhone() { uni.makePhoneCall({ phoneNumber: '13188888888' }) },
    copyWechat() {
      uni.setClipboardData({ data: 'HUANXITIANZHU', success: () => uni.showToast({ title: '微信号已复制', icon: 'success' }) })
    },
  },
}
</script>

<style lang="scss">
.container {
  background: #080808;
  min-height: 100vh;
}

.hero-swiper {
  height: 100vh;
  .banner-item {
    position: relative;
    height: 100%;
  }
  .banner-img {
    width: 100%;
    height: 100%;
  }
  .banner-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .banner-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20rpx;
  }
  .brand-en {
    font-size: 22rpx;
    letter-spacing: 12rpx;
    color: rgba(201,168,76,0.7);
    text-transform: uppercase;
  }
  .brand-cn {
    font-size: 160rpx;
    letter-spacing: 30rpx;
    font-weight: 300;
    background: linear-gradient(135deg, #9A7A2F, #C9A84C, #E8C97A, #C9A84C, #9A7A2F);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    line-height: 1;
  }
  .ornament-line {
    display: flex;
    align-items: center;
    gap: 20rpx;
    .line { width: 80rpx; height: 2rpx; background: rgba(201,168,76,0.5); }
    .diamond { color: #C9A84C; font-size: 20rpx; }
  }
  .brand-tagline {
    font-size: 30rpx;
    letter-spacing: 6rpx;
    color: rgba(240,235,224,0.8);
    font-weight: 300;
  }
}

.marquee-strip {
  background: #0d0d0d;
  border-top: 1rpx solid rgba(201,168,76,0.1);
  border-bottom: 1rpx solid rgba(201,168,76,0.1);
  padding: 20rpx 0;
  overflow: hidden;
  .marquee-text {
    font-size: 22rpx;
    letter-spacing: 8rpx;
    color: rgba(201,168,76,0.4);
    text-transform: uppercase;
    display: block;
    animation: marquee 20s linear infinite;
    white-space: nowrap;
  }
}
@keyframes marquee {
  0% { transform: translateX(100vw); }
  100% { transform: translateX(-100%); }
}

.section {
  padding: 80rpx 30rpx;
  .section-header {
    margin-bottom: 50rpx;
    .section-subtitle {
      display: block;
      text-align: center;
      font-size: 22rpx;
      letter-spacing: 12rpx;
      color: #8A7A60;
      text-transform: uppercase;
      margin-bottom: 16rpx;
    }
    .section-title {
      display: block;
      text-align: center;
      font-size: 52rpx;
      letter-spacing: 16rpx;
      font-weight: 300;
      color: #F0EBE0;
    }
    .center-divider {
      width: 120rpx;
      margin: 24rpx auto 0;
    }
  }
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
  .category-item {
    position: relative;
    height: 280rpx;
    overflow: hidden;
    .category-img {
      width: 100%;
      height: 100%;
    }
    .category-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 24rpx;
    }
    .category-en {
      font-size: 18rpx;
      letter-spacing: 6rpx;
      color: rgba(201,168,76,0.6);
      text-transform: uppercase;
    }
    .category-cn {
      font-size: 38rpx;
      letter-spacing: 12rpx;
      color: #F0EBE0;
      font-weight: 300;
    }
  }
}

.products-scroll {
  width: 100%;
  .products-row {
    display: flex;
    gap: 20rpx;
    padding: 0 30rpx;
    white-space: nowrap;
  }
}
.product-card {
  display: inline-flex;
  flex-direction: column;
  width: 280rpx;
  flex-shrink: 0;
  .product-img-wrap {
    position: relative;
    width: 280rpx;
    height: 360rpx;
    overflow: hidden;
    background: #151515;
    .product-img { width: 100%; height: 100%; }
    .inquiry-badge {
      position: absolute;
      top: 12rpx;
      left: 12rpx;
      font-size: 18rpx;
      color: #C9A84C;
      border: 1rpx solid rgba(201,168,76,0.3);
      padding: 4rpx 12rpx;
      background: rgba(8,8,8,0.7);
    }
  }
  .product-info {
    padding: 16rpx;
    .product-name {
      display: block;
      font-size: 24rpx;
      letter-spacing: 2rpx;
      color: #F0EBE0;
      line-height: 1.4;
      white-space: normal;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    .product-price {
      display: block;
      font-size: 32rpx;
      color: #C9A84C;
      margin-top: 8rpx;
      font-family: Georgia, serif;
    }
    .product-price-inquiry {
      display: block;
      font-size: 24rpx;
      color: rgba(201,168,76,0.5);
      margin-top: 8rpx;
      letter-spacing: 4rpx;
    }
  }
}
.view-all-btn {
  text-align: center;
  margin-top: 40rpx;
  .btn-ghost-gold-mini {
    display: inline-block;
    border: 1rpx solid rgba(201,168,76,0.4);
    color: #C9A84C;
    font-size: 24rpx;
    letter-spacing: 8rpx;
    padding: 16rpx 60rpx;
  }
}

.philosophy-section {
  background: #0d0d0d;
  border-top: 1rpx solid rgba(201,168,76,0.1);
  border-bottom: 1rpx solid rgba(201,168,76,0.1);
  padding: 100rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  .philosophy-ornament {
    display: flex;
    align-items: center;
    gap: 20rpx;
    .phi-line { width: 60rpx; height: 2rpx; background: rgba(201,168,76,0.4); }
    .phi-star { color: #C9A84C; font-size: 28rpx; }
  }
  .phi-quote {
    font-size: 48rpx;
    font-weight: 300;
    letter-spacing: 8rpx;
    color: #F0EBE0;
  }
  .phi-divider { width: 120rpx; margin: 10rpx 0; }
  .phi-sub {
    font-size: 28rpx;
    letter-spacing: 6rpx;
    color: rgba(240,235,224,0.6);
    font-weight: 300;
  }
  .phi-brand {
    font-size: 24rpx;
    letter-spacing: 4rpx;
    color: rgba(201,168,76,0.5);
    margin-top: 10rpx;
  }
}

.contact-section {
  padding: 80rpx 30rpx;
  .contact-title {
    display: block;
    font-size: 44rpx;
    letter-spacing: 16rpx;
    font-weight: 300;
    color: #F0EBE0;
    text-align: center;
  }
  .contact-divider { width: 120rpx; margin: 30rpx auto; }
  .contact-list {
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    margin-top: 20rpx;
  }
  .contact-item {
    display: flex;
    align-items: center;
    gap: 30rpx;
    padding: 30rpx;
    background: #111;
    border: 1rpx solid rgba(201,168,76,0.1);
    .contact-icon { font-size: 44rpx; }
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 8rpx;
      .contact-label { font-size: 22rpx; color: #8A7A60; letter-spacing: 4rpx; }
      .contact-value { font-size: 30rpx; color: #F0EBE0; letter-spacing: 2rpx; }
    }
  }
}
</style>
