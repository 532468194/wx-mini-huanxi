<template>
  <view class="container">
    <!-- Feature photo -->
    <view class="feature-photo">
      <image src="/static/展厅/品牌主理人照片.jpg" mode="aspectFill" class="feature-img" @tap="preview(0)" />
      <view class="feature-overlay">
        <text class="feature-label">品牌主理人与展厅</text>
        <text class="feature-sub">BRAND DIRECTORS</text>
      </view>
    </view>

    <!-- Gallery -->
    <view class="section-header" style="padding: 60rpx 30rpx 30rpx;">
      <text class="section-subtitle">GALLERY</text>
      <text class="section-title">展厅实景</text>
      <view class="gold-divider" style="width: 80rpx; margin: 20rpx auto 0;"></view>
    </view>

    <view class="gallery-grid">
      <view
        v-for="(img, idx) in galleryImages"
        :key="idx"
        class="gallery-item"
        @tap="preview(idx)"
      >
        <image :src="imgUrl(img)" mode="aspectFill" class="gallery-img" />
      </view>
    </view>

    <!-- Info -->
    <view class="info-section">
      <text class="info-title">莅临欢喜</text>
      <view class="gold-divider" style="width: 80rpx; margin: 20rpx 0;"></view>
      <view class="info-list">
        <view class="info-item">
          <text class="info-label">📍 展厅地址</text>
          <text class="info-value">北京市亮马古玩城xxx层xxx室</text>
        </view>
        <view class="info-item">
          <text class="info-label">⏰ 营业时间</text>
          <text class="info-value">每日 10:00 - 18:00 · 节假日照常</text>
        </view>
        <view class="info-item">
          <text class="info-label">📞 预约参观</text>
          <text class="info-value" @tap="callPhone">13188888888</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { imgUrl } from '@/utils/api.js'
import { api } from '@/utils/api.js'

export default {
  data() {
    return {
      galleryImages: [
        '/static/展厅/品牌主理人照片.jpg',
        '/static/展厅/展厅名称屏风.jpg',
        '/static/展厅/微信图片_2026-06-15_215314_771.jpg',
        '/static/展厅/微信图片_2026-06-15_215333_095.jpg',
        '/static/展厅/微信图片_2026-06-15_215338_680.jpg',
        '/static/展厅/微信图片_2026-06-15_215346_897.jpg',
        '/static/展厅/微信图片_2026-06-15_215351_839.jpg',
        '/static/展厅/微信图片_2026-06-15_215356_136.jpg',
        '/static/展厅/微信图片_2026-06-15_215359_752.jpg',
        '/static/展厅/微信图片_2026-06-15_215404_042.jpg',
        '/static/展厅/微信图片_2026-06-15_215452_820.jpg',
      ],
    }
  },
  onLoad() { api.track('/exhibition') },
  methods: {
    imgUrl,
    preview(idx) {
      uni.previewImage({
        current: idx,
        urls: this.galleryImages.map(img => imgUrl(img)),
      })
    },
    callPhone() { uni.makePhoneCall({ phoneNumber: '13188888888' }) },
  },
}
</script>

<style lang="scss">
.container { background: #080808; min-height: 100vh; padding-bottom: 40rpx; }

.feature-photo {
  position: relative;
  height: 500rpx;
  .feature-img { width: 100%; height: 100%; }
  .feature-overlay {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    background: linear-gradient(transparent, rgba(0,0,0,0.8));
    padding: 30rpx;
    .feature-label { display: block; font-size: 32rpx; letter-spacing: 6rpx; color: #F0EBE0; font-weight: 300; }
    .feature-sub { display: block; font-size: 18rpx; letter-spacing: 8rpx; color: rgba(201,168,76,0.6); text-transform: uppercase; margin-top: 8rpx; }
  }
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6rpx;
  padding: 0 6rpx;
  .gallery-item { height: 240rpx; overflow: hidden; }
  .gallery-img { width: 100%; height: 100%; transition: transform 0.3s; }
}

.info-section {
  padding: 60rpx 30rpx;
  border-top: 1rpx solid rgba(201,168,76,0.1);
  margin-top: 20rpx;
  .info-title { display: block; font-size: 44rpx; letter-spacing: 16rpx; font-weight: 300; color: #F0EBE0; }
  .info-list { display: flex; flex-direction: column; gap: 24rpx; margin-top: 30rpx; }
  .info-item {
    .info-label { display: block; font-size: 22rpx; color: #8A7A60; letter-spacing: 4rpx; margin-bottom: 8rpx; }
    .info-value { display: block; font-size: 28rpx; color: #F0EBE0; letter-spacing: 2rpx; }
  }
}
</style>
