/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#0a0a0a',      
        'dark-card': '#1a1a1a',    
        'neon-green': '#00ff41',  
      },
      fontFamily: {
       
        mono: ['"Share Tech Mono"', 'monospace'],
      },
     
      boxShadow: {
        'glow-green': '0 0 15px theme(colors.neon-green)',
        'glow-green-sm': '0 0 8px theme(colors.neon-green)',
      }
    },
  },
  plugins: [],
}