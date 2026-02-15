/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#f5ebe0',
          200: '#e9d5be',
          300: '#d9b88e',
          400: '#c17d3c',
          500: '#a86830',
          600: '#8f5726',
          700: '#2d1b0e',
          800: '#1a0e08',
          900: '#0d0704',
        },
      },
      screens: {
        'xs': '475px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'strong': '0 10px 40px -10px rgba(0,0,0,0.15), 0 20px 25px -5px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}
