/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        campus: {
          navy: '#0f172a',
          navyLight: '#1e293b',
          royal: '#2563eb',
          royalHover: '#1d4ed8',
          violet: '#7c3aed',
          violetLight: '#8b5cf6',
          cyan: '#06b6d4',
          cyanLight: '#22d3ee',
          surface: '#f8fafc',
          border: '#e2e8f0',
          darkBg: '#0b0f19',
          darkCard: '#131b2e',
          darkBorder: '#1e293b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 10px 25px -3px rgba(37, 99, 235, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.06)',
        'glow-royal': '0 0 20px -2px rgba(37, 99, 235, 0.4)',
        'glow-violet': '0 0 20px -2px rgba(124, 58, 237, 0.4)',
        'glow-cyan': '0 0 20px -2px rgba(6, 182, 212, 0.4)',
      }
    },
  },
  plugins: [],
}
