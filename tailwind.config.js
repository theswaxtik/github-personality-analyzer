/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gh: {
          bg:        '#0D1117',
          card:      '#161B22',
          border:    'rgba(255,255,255,0.08)',
          hover:     '#21262D',
          text:      '#E6EDF3',
          muted:     '#8B949E',
          blue:      '#2F81F7',
          green:     '#3FB950',
          purple:    '#A371F7',
          red:       '#F85149',
          orange:    '#F0883E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        lg:   '10px',
      },
    },
  },
  plugins: [],
}
