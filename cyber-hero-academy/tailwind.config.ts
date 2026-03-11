import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cyber Hero brand palette
        brand: {
          purple:  '#7C3AED',
          violet:  '#8B5CF6',
          cyan:    '#06B6D4',
          yellow:  '#FBBF24',
          orange:  '#F97316',
          green:   '#10B981',
          red:     '#EF4444',
          dark:    '#0F0F1A',
          darker:  '#07070F',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 10px #7C3AED, 0 0 20px #7C3AED' },
          to:   { boxShadow: '0 0 20px #06B6D4, 0 0 40px #06B6D4' },
        },
      },
      backgroundImage: {
        'hero-gradient':    'linear-gradient(135deg, #0F0F1A 0%, #1E0B3B 50%, #0A1628 100%)',
        'card-gradient':    'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(6,182,212,0.1) 100%)',
        'mission-gradient': 'linear-gradient(180deg, #1A1A2E 0%, #16213E 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
