/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The "Source of Truth" variables
        'olive-green': '#708A28', 
        'olive-green-dark': '#5a6f20', 
        
        // Brand Identity
        'primary-brand': '#708A28',
        'primary-brand-dark': '#5a6f20',

        // Global Override: Forces all purple classes to be Green
        // This solves the mobile and filter sidebar issues globally.
        purple: {
          50: '#f1f5e9',   // Very light green tint for backgrounds
          100: '#e1ebd3',
          500: '#708A28', 
          600: '#708A28',  // Main Brand Color
          700: '#5a6f20',  // Hover state
        },

        // Existing Site Colors
        cream: '#F8F5F0',
        'dark-green': '#3A5A40',
        'light-brown': '#D4A373',
        'dark-text': '#2E2E2E',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'custom': '10px',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}