/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // bg and botton
        'main-primary': 'var(--main-primary)',
        'main-secondary': 'var(--main-secondary)',
        'main-third': 'var(--main-third)',
        
        // text
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        
        // misc
        'bg-input': 'var(--bg-input)',
        'border-primary': 'var(--border-primary)'

      }
    },
  },
  plugins: [],
}

