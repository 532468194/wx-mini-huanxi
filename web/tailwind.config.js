/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'luxury': {
          'black': '#080808',
          'dark': '#0f0f0f',
          'card': '#151515',
          'border': '#1e1e1e',
        },
        'gold': {
          DEFAULT: '#C9A84C',
          'light': '#E8C97A',
          'dim': '#A88A30',
          'dark': '#7A5C1C',
          'pale': '#F5E6C0',
        },
        'luxury-text': '#F0EBE0',
        'luxury-muted': '#8A7A60',
      },
      fontFamily: {
        'serif-en': ['"Cormorant Garamond"', '"IM Fell English"', 'Georgia', 'serif'],
        'sans-cn': ['"Noto Sans SC"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        'serif-cn': ['"Noto Serif SC"', '"Source Han Serif CN"', '"STSong"', '"SimSun"', 'serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #7A5C1C, #C9A84C, #E8C97A, #C9A84C, #7A5C1C)',
        'gold-shimmer': 'linear-gradient(90deg, #7A5C1C 0%, #C9A84C 25%, #E8C97A 50%, #C9A84C 75%, #7A5C1C 100%)',
        'dark-radial': 'radial-gradient(ellipse at center, #1a1410 0%, #080808 100%)',
      },
      animation: {
        'gold-shimmer': 'goldShimmer 3s ease-in-out infinite',
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-in': 'fadeIn 1s ease forwards',
        'slow-zoom': 'slowZoom 20s ease-in-out infinite alternate',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        goldShimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slowZoom: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.08)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'gold': '0 4px 30px rgba(201, 168, 76, 0.15)',
        'gold-lg': '0 10px 60px rgba(201, 168, 76, 0.2)',
        'gold-glow': '0 0 30px rgba(201, 168, 76, 0.3)',
        'luxury': '0 20px 80px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
