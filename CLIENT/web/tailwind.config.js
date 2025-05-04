/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/context/**/*.{js,ts,jsx,tsx}",
    "./src/services/**/*.{js,ts,jsx,tsx}",
    "./src/types/**/*.{js,ts,jsx,tsx}",
    "./src/App.{js,ts,jsx,tsx}",
    "./src/main.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10B981', // Emerald
          dark: '#059669',
        },
        secondary: {
          DEFAULT: '#6B7280', // Gray
          dark: '#4B5563',
        },
        background: {
          light: '#F9FAFB',
          dark: '#0A0A0A', // Darker background
        },
        chatBg: {
          light: '#FFFFFF',
          dark: '#111111', // Darker chat background
        },
        userMsg: {
          light: '#10B981',
          dark: '#059669',
        },
        botMsg: {
          light: '#F3F4F6',
          dark: '#1A1A1A', // Darker bot message background
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-in-out',
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} 