module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Livvic', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#d9eeff',
          200: '#bfe4ff',
          300: '#99d8ff',
          400: '#66c7ff',
          500: '#2196f3',
          600: '#1e86da',
          700: '#1669b0',
          800: '#114f82',
          900: '#0b3555'
        }
      }
    }
  },
  plugins: []
};
