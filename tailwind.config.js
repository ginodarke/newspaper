/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          light: 'hsl(var(--primary) / 0.9)',
          dark: 'hsl(var(--primary) / 1.1)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
          light: 'hsl(var(--secondary) / 0.9)',
          dark: 'hsl(var(--secondary) / 1.1)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          light: 'hsl(var(--accent) / 0.9)',
          dark: 'hsl(var(--accent) / 1.1)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          light: 'hsl(var(--success) / 0.9)',
          dark: 'hsl(var(--success) / 1.1)',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          light: 'hsl(var(--warning) / 0.9)',
          dark: 'hsl(var(--warning) / 1.1)',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          light: 'hsl(var(--error) / 0.9)',
          dark: 'hsl(var(--error) / 1.1)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        headline: '2rem',      // 32px
        subheading: '1.625rem', // 26px
        featured: '1.375rem',   // 22px
        body: '1.125rem',       // 18px
        caption: '0.9375rem',   // 15px
        small: '0.8125rem',     // 13px
      },
      lineHeight: {
        headline: '1.3',
        body: '1.5',
        ui: '1.2',
      },
      letterSpacing: {
        headline: '-0.02em',
        body: '0',
        caps: '0.03em',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      boxShadow: {
        'elevation-1': '0px 2px 6px rgba(0, 0, 0, 0.2)',
        'elevation-2': '0px 6px 16px rgba(0, 0, 0, 0.3)',
        'elevation-3': '0px 8px 24px rgba(0, 0, 0, 0.4)',
        'elevation-4': '0px 12px 28px rgba(0, 0, 0, 0.5)',
        'inner-light': 'inset 0px 1px 0px 0px rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(165deg, hsl(var(--card)), hsl(var(--accent)))',
        'glow-primary': 'radial-gradient(circle, hsl(var(--primary) / 0.8) 0%, transparent 70%)',
        'glow-secondary': 'radial-gradient(circle, hsl(var(--secondary) / 0.8) 0%, transparent 70%)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        'press': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.97)' },
        },
        'micro-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 1.5s ease-in-out infinite',
        'press': 'press 0.2s ease-out',
        'micro-bounce': 'micro-bounce 0.2s ease-out',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'elevation': 'box-shadow, transform',
      },
      transitionDuration: {
        '250': '250ms',
        '300': '300ms',
        '400': '400ms',
      },
      transitionTimingFunction: {
        'bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'out-back': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      springConfig: {
        'button': { tension: 120, friction: 14 },
        'card': { tension: 100, friction: 10 },
        'page': { tension: 90, friction: 12 },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
      translate: {
        '3d-hover': 'translate3d(0, -3px, 0)',
        '3d-press': 'translate3d(0, 1px, 0)',
      },
      perspective: {
        '500': '500px',
        '1000': '1000px',
        '1500': '1500px',
      },
      rotate: {
        '1': '1deg',
        '2': '2deg',
        '-1': '-1deg',
        '-2': '-2deg',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function({ addUtilities }) {
      const newUtilities = {
        '.perspective-500': {
          perspective: '500px',
        },
        '.perspective-1000': {
          perspective: '1000px',
        },
        '.backface-hidden': {
          backfaceVisibility: 'hidden',
        },
        '.rotate-y-5': {
          transform: 'rotateY(5deg)',
        },
        '.rotate-y-minus-5': {
          transform: 'rotateY(-5deg)',
        },
        '.translate-z-0': {
          transform: 'translateZ(0)',
        },
        '.translate-z-10': {
          transform: 'translateZ(10px)',
        },
        '.translate-z-20': {
          transform: 'translateZ(20px)',
        },
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.light-source-top-left': {
          boxShadow: 'inset 1px 1px 0px 0px rgba(255, 255, 255, 0.1)',
        },
        '.frosted-glass': {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(30, 30, 36, 0.8)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
} 