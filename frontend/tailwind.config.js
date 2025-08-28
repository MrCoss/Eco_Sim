/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scan all src files for Tailwind classes
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],   // Use as font-inter
        manrope: ['Manrope', 'sans-serif'], // Use as font-manrope
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
