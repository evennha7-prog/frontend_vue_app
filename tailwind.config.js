/**
 * Tailwind CSS Configuration.
 * Defines template content paths, typography font families, custom navy/brand palettes,
 * and micro-animations for interactive cards and modals.
 * 
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Modern sans-serif typography stack
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Custom deep navy color palette matching design system
        navy: {
          50: '#f4f6fa',
          100: '#e7ecf5',
          200: '#d3dded',
          300: '#b2c4df',
          400: '#8ba6ce',
          500: '#6483ba',
          600: '#4c6aa3',
          700: '#3c5384',
          800: '#2b3a67',
          900: '#233258',
          950: '#17213b',
        },
        // Indigo accent palette for highlights and focus rings
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      // Smooth micro-animations for card entries and modals
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-subtle': 'pulseSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      }
    },
  },
  plugins: [],
}
