/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: '#F8F5F0',
        'olive-green': '#708A28', 
        'olive-green-dark': '#5a6f20', 
        
        // GLOBAL OVERRIDE: 
        // This ensures that even if you miss a file, 
        // 'purple' classes will now show your brand green.
        purple: {
          50: '#f1f5e9',   // Very light green tint
          100: '#e1ebd3',
          600: '#708A28',  // Your main brand color
          700: '#5a6f20',  // Darker hover state
        },

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