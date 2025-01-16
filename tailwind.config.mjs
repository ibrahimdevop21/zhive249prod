/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          100: '#E6E8F0', // Light text
          200: '#C2C7D6',
          300: '#9EA5BB',
          400: '#7A84A1',
          500: '#576286',
          600: '#394261', // Lighter background
          700: '#1B1F30', // Main background
          800: '#12141F',
          900: '#080A0F',
        },
        primary: {
          100: '#FFE4CC',
          200: '#FFC999',
          300: '#FFAE66',
          400: '#FF9333',
          500: '#FF7800', // Main primary color
          600: '#CC6000',
          700: '#994800',
          800: '#663000',
          900: '#331800',
        },
        accent: {
          100: '#FFE1E1',
          200: '#FFC3C3',
          300: '#FFA5A5',
          400: '#FF8787',
          500: '#FF6969', // Main accent color
          600: '#CC5454',
          700: '#993F3F',
          800: '#662A2A',
          900: '#331515',
        }
      },
      fontFamily: {
        SpaceGrotesk: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-down': 'slideDown 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
