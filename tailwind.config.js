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
        
        // Dark theme colors
        'primary-bg': 'var(--primary-bg)',
        'primary-bg-light': 'var(--primary-bg-light)',
        'primary-bg-dark': 'var(--primary-bg-dark)',
        'secondary-bg': 'var(--secondary-bg)',
        'secondary-bg-light': 'var(--secondary-bg-light)',
        'secondary-bg-dark': 'var(--secondary-bg-dark)',
        'tertiary-bg': 'var(--tertiary-bg)',
        'tertiary-bg-light': 'var(--tertiary-bg-light)',
        'tertiary-bg-dark': 'var(--tertiary-bg-dark)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        
        primary: {
          DEFAULT: 'var(--primary-accent)',
          foreground: 'var(--primary-bg)',
          light: 'var(--primary-accent-light)',
          dark: 'var(--primary-accent-dark)',
        },
        secondary: {
          DEFAULT: 'var(--secondary-accent)',
          foreground: 'var(--text-primary)',
          light: 'var(--secondary-accent-light)',
          dark: 'var(--secondary-accent-dark)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          light: 'hsl(var(--accent) / 0.9)',
          dark: 'hsl(var(--accent) / 1.1)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'var(--text-secondary)',
        },
        destructive: {
          DEFAULT: 'var(--error-color)',
          foreground: 'var(--text-primary)',
        },
        card: {
          DEFAULT: 'var(--secondary-bg)',
          foreground: 'var(--text-primary)',
        },
        success: {
          DEFAULT: 'var(--success-color)',
          light: 'color-mix(in srgb, var(--success-color), white 10%)',
          dark: 'color-mix(in srgb, var(--success-color), black 10%)',
        },
        warning: {
          DEFAULT: 'var(--warning-color)',
          light: 'color-mix(in srgb, var(--warning-color), white 10%)',
          dark: 'color-mix(in srgb, var(--warning-color), black 10%)',
        },
        error: {
          DEFAULT: 'var(--error-color)',
          light: 'color-mix(in srgb, var(--error-color), white 10%)',
          dark: 'color-mix(in srgb, var(--error-color), black 10%)',
        },
      },
      fontFamily: {
        primary: ['Inter', 'system-ui', 'sans-serif'],
        secondary: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        headline: 'var(--font-headline)',
        subheading: 'var(--font-subheading)',
        featured: 'var(--font-featured)',
        body: 'var(--font-body)',
        caption: 'var(--font-caption)',
        small: 'var(--font-small)',
      },
      lineHeight: {
        headline: 'var(--line-height-headline)',
        body: 'var(--line-height-body)',
        ui: 'var(--line-height-ui)',
      },
      letterSpacing: {
        headline: 'var(--letter-spacing-headline)',
        body: 'var(--letter-spacing-body)',
        caps: 'var(--letter-spacing-caps)',
      },
      borderRadius: {
        'sm': 'var(--radius-sm)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        'elevation-1': 'var(--elevation-1)',
        'elevation-2': 'var(--elevation-2)',
        'elevation-3': 'var(--elevation-3)',
        'elevation-4': 'var(--elevation-4)',
        'inner-light': 'inset 0px 1px 0px 0px rgba(255, 255, 255, 0.08)',
      },
      backgroundImage: {
        'card-gradient': 'linear-gradient(165deg, var(--secondary-bg) 0%, var(--tertiary-bg) 100%)',
        'primary-gradient': 'linear-gradient(135deg, var(--primary-accent) 0%, var(--secondary-accent) 100%)',
        'glow-primary': 'radial-gradient(circle, var(--primary-accent) / 0.8) 0%, transparent 70%)',
        'glow-secondary': 'radial-gradient(circle, var(--secondary-accent) / 0.8) 0%, transparent 70%)',
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
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%': { boxShadow: '0 0 0 0 rgba(0, 229, 255, 0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(0, 229, 255, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 229, 255, 0)' },
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
        '150': 'var(--transition-fast)',
        '300': 'var(--transition-medium)',
        '500': 'var(--transition-slow)',
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
      zIndex: {
        'ground': 'var(--z-ground)',
        'raised': 'var(--z-raised)',
        'floating': 'var(--z-floating)',
        'overlay': 'var(--z-overlay)',
        'modal': 'var(--z-modal)',
        'toast': 'var(--z-toast)',
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
        '.preserve-3d': {
          transformStyle: 'preserve-3d',
        },
        '.rotate-y-1': {
          transform: 'rotateY(1deg)',
        },
        '.rotate-y-2': {
          transform: 'rotateY(2deg)',
        },
        '.rotate-y-minus-1': {
          transform: 'rotateY(-1deg)',
        },
        '.rotate-y-minus-2': {
          transform: 'rotateY(-2deg)',
        },
        '.translate-z-0': {
          transform: 'translateZ(0)',
        },
        '.translate-z-2': {
          transform: 'translateZ(2px)',
        },
        '.translate-z-4': {
          transform: 'translateZ(4px)',
        },
        '.translate-z-8': {
          transform: 'translateZ(8px)',
        },
        '.translate-z-10': {
          transform: 'translateZ(10px)',
        },
        '.translate-z-20': {
          transform: 'translateZ(20px)',
        },
        '.light-source-top': {
          boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        },
        '.light-source-top-left': {
          boxShadow: 'inset 1px 1px 0 0 rgba(255, 255, 255, 0.1)',
        },
        '.frosted-glass': {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(30, 30, 36, 0.8)',
        },
        '.inner-light': {
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'rgba(255, 255, 255, 0.08)',
            zIndex: 1,
          },
        },
      };
      addUtilities(newUtilities);
    },
  ],
} 