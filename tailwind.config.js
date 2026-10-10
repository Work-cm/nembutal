/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Clean pharmacy palette
        bone: {
          DEFAULT: '#FFFFFF', // page canvas
          light: '#F5F9FC',
          dark: '#E3ECF4',
          deep: '#C9D9E6',
        },
        ink: {
          DEFAULT: '#0B1D33', // primary text (deep navy)
          soft: '#27405C',
          muted: '#546B86',
          faint: '#93A5BC',
        },
        amber: {
          DEFAULT: '#0E9BA8', // teal accent
          dark: '#0A7E88',
          light: '#35B8C4',
          wash: '#DDF3F5',
        },
        primary: {
          DEFAULT: '#0E9BA8',
          dark: '#0A7E88',
          light: '#35B8C4',
        },
        secondary: {
          DEFAULT: '#0B1D33',
          dark: '#061120',
          light: '#27405C',
        },
        dark: {
          DEFAULT: '#0B1D33',
          lighter: '#F5F9FC',
          darker: '#061120',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-sora)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
        display: ['var(--font-sora)', 'var(--font-inter)', 'ui-sans-serif', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.22em',
      },
      borderRadius: {
        editorial: '10px',
      },
      boxShadow: {
        editorial: '0 1px 2px rgba(11, 29, 51, 0.05), 0 18px 40px -28px rgba(11, 29, 51, 0.25)',
        'editorial-lg': '0 2px 4px rgba(11, 29, 51, 0.06), 0 40px 80px -40px rgba(11, 29, 51, 0.32)',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'line-grow': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'slow-zoom': {
          '0%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 1.2s ease both',
        'line-grow': 'line-grow 1.1s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 38s linear infinite',
        'slow-zoom': 'slow-zoom 12s ease-out both',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
