/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './providers/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#818CF8',
          dark: '#3730A3',
          muted: 'rgba(79, 70, 229, 0.12)',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          muted: 'rgba(124, 58, 237, 0.12)',
        },
        accent: {
          DEFAULT: '#06B6D4',
          light: '#22D3EE',
          muted: 'rgba(6, 182, 212, 0.12)',
        },
        success: {
          DEFAULT: '#22C55E',
          muted: 'rgba(34, 197, 94, 0.12)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          muted: 'rgba(245, 158, 11, 0.12)',
        },
        error: {
          DEFAULT: '#EF4444',
          muted: 'rgba(239, 68, 68, 0.12)',
        },
        info: {
          DEFAULT: '#3B82F6',
          muted: 'rgba(59, 130, 246, 0.12)',
        },
        background: {
          light: '#F8FAFC',
          dark: '#09090B',
          secondary: '#F1F5F9',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          elevated: '#FFFFFF',
          dark: '#18181B',
        },
        border: {
          DEFAULT: '#E2E8F0',
          dark: '#27272A',
        },
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        card: '24px',
      },
      spacing: {
        // 8px system — Tailwind 1 = 4px, so 2 = 8px
      },
      fontSize: {
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '30px',
        '4xl': '36px',
      },
      boxShadow: {
        card: '0 2px 8px rgba(15, 23, 42, 0.08)',
        elevated: '0 4px 16px rgba(15, 23, 42, 0.1)',
      },
    },
  },
  plugins: [],
};
