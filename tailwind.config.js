/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#050505',
        panel: '#0a0a0c',
        line: '#22332a',
        neon: '#00ff66',
        flipper: '#ff6600',
        cyan: '#00e5ff',
        warn: '#ff2e6e',
        ink: '#e6e6e6',
        dim: '#9aaba1',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
        display: ['"Share Tech Mono"', '"JetBrains Mono"', 'monospace'],
        // Testi lunghi: un sans leggibile, le parti "da terminale" restano monospace
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 0 1px rgba(0,255,102,.35), 0 0 18px -4px rgba(0,255,102,.45)',
        flipper: '0 0 0 1px rgba(255,102,0,.4), 0 0 18px -4px rgba(255,102,0,.5)',
      },
      keyframes: {
        blink: { '0%,49%': { opacity: 1 }, '50%,100%': { opacity: 0 } },
        float: {
          '0%,100%': { transform: 'translateY(0) rotate(-2deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1deg)' },
        },
        shadow: {
          '0%,100%': { transform: 'translateX(-50%) scaleX(1)', opacity: 0.8 },
          '50%': { transform: 'translateX(-50%) scaleX(0.8)', opacity: 0.4 },
        },
        radar: {
          '0%': { transform: 'translate(-50%,-50%) scale(0.4)', opacity: 0.8 },
          '100%': { transform: 'translate(-50%,-50%) scale(2.6)', opacity: 0 },
        },
        sweep: {
          '0%': { backgroundPosition: '150% 0' },
          '60%,100%': { backgroundPosition: '-50% 0' },
        },
        blip: {
          '0%,100%': { opacity: 0.35, transform: 'translateY(0)' },
          '15%,45%': { opacity: 1, transform: 'translateY(-4px)' },
        },
      },
      animation: {
        blink: 'blink 1s steps(1) infinite',
        float: 'float 5s ease-in-out infinite',
        shadow: 'shadow 5s ease-in-out infinite',
        radar: 'radar 3s ease-out infinite',
        sweep: 'sweep 4s ease-in-out infinite',
        blip: 'blip 4.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
