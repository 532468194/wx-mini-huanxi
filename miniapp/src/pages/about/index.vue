<template>
  <view class="container">
    <!-- Brand hero -->
    <view class="brand-hero">
      <image src="/static/展厅/品牌主理人照片.jpg" mode="aspectFill" class="hero-img" />
      <view class="hero-overlay">
        <text class="brand-cn">欢喜</text>
        <text class="brand-en">HUANXI TIANZHU</text>
      </view>
    </view>

    <!-- Brand story -->
    <view class="story-section">
      <text class="story-subtitle">BRAND STORY</text>
      <text class="story-title">一眼入心 · 一珠一缘</text>
      <view class="gold-divider" style="width: 80rpx; margin: 20rpx 0;"></view>
      <text class="story-text">欢喜天珠，专注于正宗藏式天珠的甄选与传播。我们深信，每一颗天珠都拥有独特的灵魂，每一次相遇都是难得的缘分。</text>
      <text class="story-text">天珠，戴的是气场，求的是心安。千年的藏地文化，赋予了天珠超凡的能量与气场。我们守护的，不只是一颗珠，更是一份对美好生活的信念与追求。</text>
      <text class="story-text">欢喜天珠，不随波逐流，只取悦自己。愿每一位有缘人，都能找到那颗属于自己的欢喜之珠。</text>
    </view>

    <!-- Values -->
    <view class="values-section">
      <view v-for="(v, idx) in values" :key="idx" class="value-item">
        <text class="value-icon">{{ v.icon }}</text>
        <text class="value-title">{{ v.title }}</text>
        <text class="value-desc">{{ v.desc }}</text>
      </view>
    </view>

    <!-- Tagline -->
    <view class="tagline-section">
      <view class="tagline-ornament">
        <view class="t-line"></view>
        <text class="t-star">✦</text>
        <view class="t-line"></view>
      </view>
      <text class="tagline-main">天珠 戴的是<text class="gold-text">气场</text></text>
      <text class="tagline-main">求的是<text class="gold-text">心安</text></text>
      <text class="tagline-sub">守的是福报 · 一眼入心 · 一珠一缘</text>
      <text class="tagline-brand">欢喜天珠 · 不随波逐流 · 只取悦自己</text>
    </view>

    <!-- Contact -->
    <view class="contact-wrap">
      <text class="contact-h">联系我们</text>
      <view class="gold-divider" style="width: 80rpx; margin: 20rpx auto;"></view>
      <view class="btn-gold contact-btn" @tap="callPhone">
        <text>☎ 电话：13188888888</text>
      </view>
      <view class="btn-ghost-gold contact-btn2" @tap="copyWechat">
        <text>💬 微信：HUANXITIANZHU</text>
      </view>
      <text class="contact-address">📍 北京市亮马古玩城xxx层xxx室</text>
    </view>
  </view>
</template>

<script>
import { api } from '@/utils/api.js'

export default {
  data() {
    return {
      values: [
        { icon: '◎', title: '真实有灵', desc: '所有天珠均经严格鉴定，保证正宗天然，杜绝仿制。' },
        { icon: '✦', title: '一珠一缘', desc: '我们相信缘分，每件藏品都有其主人，不强买强卖。' },
        { icon: '▲', title: '专业服务', desc: '多年藏品经验，专业团队提供鉴赏指导与收藏建议。' },
      ],
    }
  },
  onLoad() { api.track('/about') },
  methods: {
    callPhone() { uni.makePhoneCall({ phoneNumber: '13188888888' }) },
    copyWechat() {
      uni.setClipboardData({ data: 'HUANXITIANZHU', success: () => uni.showToast({ title: '微信号已复制', icon: 'success' }) })
    },
  },
}
</script>

<style lang="scss">
.container { background: #080808; min-height: 100vh; padding-bottom: 60rpx; }

.brand-hero {
  position: relative;
  height: 500rpx;
  .hero-img { width: 100%; height: 100%; }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16rpx;
    .brand-cn {
      font-size: 120rpx;
      letter-spacing: 30rpx;
      font-weight: 300;
      background: linear-gradient(135deg, #9A7A2F, #C9A84C, #E8C97A, #C9A84C, #9A7A2F);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      line-height: 1;
    }
    .brand-en { font-size: 20rpx; letter-spacing: 10rpx; color: rgba(201,168,76,0.6); text-transform: uppercase; }
  }
}

.story-section {
  padding: 60rpx 30rpx;
  border-bottom: 1rpx solid rgba(201,168,76,0.1);
  .story-subtitle { display: block; font-size: 20rpx; letter-spacing: 10rpx; color: rgba(201,168,76,0.5); text-transform: uppercase; margin-bottom: 16rpx; }
  .story-title { display: block; font-size: 40rpx; letter-spacing: 8rpx; font-weight: 300; color: #F0EBE0; margin-bottom: 20rpx; }
  .story-text { display: block; font-size: 27rpx; color: rgba(240,235,224,0.65); line-height: 1.9; letter-spacing: 1rpx; margin-top: 20rpx; }
}

.values-section {
  padding: 60rpx 30rpx;
  display: flex;
  flex-direction: column;
  gap: 30rpx;
  background: #0d0d0d;
  .value-item {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
    .value-icon { font-size: 40rpx; color: #C9A84C; }
    .value-title { font-size: 34rpx; letter-spacing: 8rpx; color: #F0EBE0; font-weight: 300; }
    .value-desc { font-size: 25rpx; color: #8A7A60; line-height: 1.7; letter-spacing: 1rpx; }
  }
}

.tagline-section {
  padding: 80rpx 40rpx;
  border-top: 1rpx solid rgba(201,168,76,0.1);
  border-bottom: 1rpx solid rgba(201,168,76,0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16rpx;
  .tagline-ornament {
    display: flex;
    align-items: center;
    gap: 20rpx;
    margin-bottom: 10rpx;
    .t-line { width: 60rpx; height: 2rpx; background: rgba(201,168,76,0.4); }
    .t-star { color: #C9A84C; font-size: 28rpx; }
  }
  .tagline-main { font-size: 46rpx; font-weight: 300; letter-spacing: 6rpx; color: #F0EBE0; }
  .tagline-sub { font-size: 26rpx; letter-spacing: 6rpx; color: rgba(240,235,224,0.55); margin-top: 10rpx; }
  .tagline-brand { font-size: 22rpx; letter-spacing: 4rpx; color: rgba(201,168,76,0.45); }
}

.contact-wrap {
  padding: 60rpx 30rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20rpx;
  .contact-h { font-size: 40rpx; letter-spacing: 12rpx; font-weight: 300; color: #F0EBE0; }
  .contact-btn {
    width: 100%;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #080808;
    font-weight: 600;
    letter-spacing: 4rpx;
  }
  .contact-btn2 {
    width: 100%;
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1rpx solid rgba(201,168,76,0.4);
    font-size: 28rpx;
    color: #C9A84C;
    letter-spacing: 4rpx;
  }
  .contact-address { font-size: 24rpx; color: #8A7A60; letter-spacing: 2rpx; text-align: center; }
}
</style>
