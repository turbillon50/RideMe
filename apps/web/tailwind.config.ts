import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        foreground: 'var(--text-primary)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        'surface-3': 'var(--surface-3)',
        card: { DEFAULT: 'var(--surface)', foreground: 'var(--text-primary)' },
        muted: { DEFAULT: 'var(--surface-2)', foreground: 'var(--text-muted)' },

        // Brand
        brand: { DEFAULT: '#2563EB', hover: '#1A45BF', deep: '#0D1B3D' },
        cyan: { DEFAULT: '#00B4FF', hover: '#0099E0', light: '#5BD0FF' },

        // Aliases
        primary: { DEFAULT: '#2563EB', foreground: '#FFFFFF', hover: '#1A45BF' },
        accent: '#2563EB',
        'accent-hover': '#1A45BF',
        secondary: { DEFAULT: '#00B4FF', foreground: '#0D1B3D', hover: '#0099E0' },
        'secondary-hover': '#0099E0',
        ring: '#2563EB',
        border: 'var(--border)',
        input: 'var(--surface)',

        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',

        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      backgroundImage: {
        'gradient-cta': 'linear-gradient(135deg, #2563EB 0%, #00B4FF 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(37,99,235,0.08), rgba(0,180,255,0.05))',
        'gradient-brand-deep': 'linear-gradient(135deg, #0D1B3D 0%, #2563EB 60%, #00B4FF 100%)',
        'gradient-hero': 'radial-gradient(ellipse at top, rgba(37,99,235,0.15) 0%, transparent 60%)',
      },
      boxShadow: {
        'glow-accent': '0 0 20px rgba(37,99,235,0.4)',
        'glow-secondary': '0 0 20px rgba(0,180,255,0.4)',
        'glow-success': '0 0 20px rgba(16,185,129,0.4)',
        'card': '0 2px 6px rgba(13,27,61,0.06), 0 1px 2px rgba(13,27,61,0.04)',
        'card-hover': '0 8px 24px rgba(13,27,61,0.10)',
        'modal': '0 24px 60px rgba(13,27,61,0.16)',
        'brand': '0 8px 24px rgba(37,99,235,0.28)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'count-up': 'countUp 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'logo-breath': 'logoBreath 3.4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(16,185,129,0.4), 0 0 20px rgba(16,185,129,0.2)' },
          '50%': { boxShadow: '0 0 20px rgba(16,185,129,0.7), 0 0 40px rgba(16,185,129,0.4)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        logoBreath: {
          '0%, 100%': { filter: 'drop-shadow(0 0 18px rgba(0,180,255,0.40)) drop-shadow(0 0 36px rgba(37,99,235,0.20))' },
          '50%': { filter: 'drop-shadow(0 0 28px rgba(0,180,255,0.60)) drop-shadow(0 0 52px rgba(37,99,235,0.40))' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};

export default config;
