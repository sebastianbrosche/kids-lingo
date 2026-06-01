/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        kids: {
          yellow: '#FFD93D',
          orange: '#FF8C42',
          pink: '#FF6B9D',
          purple: '#C084FC',
          blue: '#4FC3F7',
          green: '#69F0AE',
          red: '#FF5252',
          cream: '#FFF8E7',
          brown: '#5D4037',
        },
      },
      fontFamily: {
        display: ['"Comic Sans MS", "Chalkboard SE", "Marker Felt", sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 1s infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'pop': 'pop 0.3s ease-out',
        'shake': 'shake 0.4s ease-in-out',
        'puddle-jump': 'puddle-jump 0.6s ease-in-out',
        'laser-left': 'laser-left 0.3s ease-in-out infinite',
        'laser-right': 'laser-right 0.3s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.4s ease-out forwards',
        'monster-fade': 'monster-fade 1.5s ease-out forwards',
        'magic-missile': 'magic-missile 0.8s ease-out forwards',
        'missile-trail': 'missile-trail 0.6s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pop: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-8px)' },
          '75%': { transform: 'translateX(8px)' },
        },
      },
    },
  },
  plugins: [],
}
