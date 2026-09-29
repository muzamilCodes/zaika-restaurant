/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          50: '#f6efe4',
          100: '#eadcc7',
          200: '#d2b98b',
          300: '#b38c4c',
          400: '#8a662a',
          500: '#5f441c',
          600: '#3c2c17',
          700: '#221911',
          800: '#16100b',
          900: '#0b0b0d'
        },
        gold: '#d7b46a',
        ember: '#f28f3b',
        zomato: {
          red: '#E23744',
          green: '#24963F',
          ink: '#1C1C1C',
          mute: '#696969',
          line: '#E8E8E8',
          soft: '#F8F8F8',
          card: '#FFFFFF'
        }
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'serif'],
        body: ['Manrope', 'sans-serif']
      },
      boxShadow: {
        glow: '0 0 40px rgba(215, 180, 106, 0.15)',
        glass: '0 20px 80px rgba(0, 0, 0, 0.35)'
      },
      backgroundImage: {
        hero: 'radial-gradient(circle at top, rgba(242,143,59,0.16), transparent 34%), radial-gradient(circle at right, rgba(215,180,106,0.18), transparent 26%), linear-gradient(180deg, #121214 0%, #0b0b0d 100%)'
      }
    }
  },
  plugins: []
};
