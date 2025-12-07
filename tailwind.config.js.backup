/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./components/**/*.{vue,ts}",
    "./layouts/**/*.{vue,ts}",
    "./pages/**/*.{vue,ts}",
    "./plugins/**/*.ts",
    "./app.vue"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        stone: {
          50: '#FAFAF9',
          100: '#F5F5F4',
          200: '#E7E5E4',
          300: '#D6D3D1',
          400: '#A8A29E',
          500: '#78716C',
          600: '#57534E',
          700: '#44403C',
          800: '#292524',
          900: '#1C1917',
          950: '#0C0A09',
        },
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-10%)' },
        },
        'float-accent': {
          '0%, 100%': { transform: 'translateY(0%)' },
          '50%': { transform: 'translateY(-10%)' },
        },
        'slide-in-fade': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in-bounce': {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)' },
        },
        'cart-bounce': {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '25%': { transform: 'translateY(-5px) scale(1.1)' },
          '50%': { transform: 'translateY(0) scale(1)' },
          '75%': { transform: 'translateY(-2px) scale(1.05)' },
        },
        'slide-up-blur': {
          '0%': { opacity: '0', transform: 'translateY(20px)', filter: 'blur(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'rotate-3d': {
          '0%': { transform: 'perspective(1000px) rotateY(0deg)' },
          '100%': { transform: 'perspective(1000px) rotateY(360deg)' },
        },
        'wave': {
          '0%': { transform: 'translateX(0) translateZ(0) scaleY(1)' },
          '50%': { transform: 'translateX(-25%) translateZ(0) scaleY(0.55)' },
          '100%': { transform: 'translateX(-50%) translateZ(0) scaleY(1)' },
        },
        'heartbeat': {
          '0%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.3)' },
          '70%': { transform: 'scale(1)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-rotate': {
          '0%': { opacity: '0', transform: 'scale(0) rotate(180deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
      },
      animation: {
        float: 'float 10s ease-in-out infinite reverse',
        'float-accent': 'float-accent 8s ease-in-out infinite',
        'slide-in-fade': 'slide-in-fade 0.6s ease-out',
        'scale-in-bounce': 'scale-in-bounce 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'cart-bounce': 'cart-bounce 0.6s ease-out',
        'slide-up-blur': 'slide-up-blur 0.8s ease-out',
        'rotate-3d': 'rotate-3d 2s ease-in-out',
        'wave': 'wave 1s ease-in-out infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
        'fade-in-down': 'fade-in-down 0.6s ease-out',
        'scale-rotate': 'scale-rotate 0.8s ease-out',
      },
    },
  },
  plugins: [],
}

// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: [
//     "./components/**/*.{vue,ts}",  // barcha componentlar
//     "./layouts/**/*.{vue,ts}",     // layoutlar
//     "./pages/**/*.{vue,ts}",       // sahifalar
//     "./plugins/**/*.{ts}",         // pluginlar
//     "./app.vue"                    // asosiy app.vue
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// };