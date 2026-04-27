/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background:   '#0A0A0F',
        surface:      '#111118',
        surfaceRaised:'#1A1A25',
        primary:      '#6C63FF',
        secondary:    '#00D9B5',
        textPrimary:  '#F0EEFF',
        textMuted:    '#7A7A9A',
        border:       '#2A2A3F',
        danger:       '#FF5E6C',
        success:      '#3DDC84',
      },
      fontFamily: {
        syne:    ['Syne', 'sans-serif'],
        cabinet: ['Cabinet Grotesk', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'pulse-glow':  'pulseGlow 2s ease-in-out infinite',
        'shimmer':     'shimmer 2.5s linear infinite',
        'bounce-y':    'bounceY 1.5s ease-in-out infinite',
        'fade-in-up':  'fadeInUp 0.7s ease forwards',
        'slide-left':  'slideInLeft 0.7s ease forwards',
        'blink':       'blink 1s step-end infinite',
        'spin-slow':   'spin 8s linear infinite',
      },
      keyframes: {
        float:       { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        pulseGlow:   { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        bounceY:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(8px)' } },
        fadeInUp:    { from: { opacity: '0', transform: 'translateY(30px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideInLeft: { from: { opacity: '0', transform: 'translateX(-30px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        blink:       { '0%,100%': { opacity: '1' }, '50%': { opacity: '0' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}