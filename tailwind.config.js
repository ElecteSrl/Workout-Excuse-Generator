/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-cyan-500',
    'bg-orange-500',
    'bg-purple-500',
    'text-orange-500',
    'hover:bg-orange-100',
    {
      pattern: /bg-(gray|orange)-(50|100|500|600|700|800|900)/,
      variants: ['hover', 'dark'],
    },
    {
      pattern: /text-(gray|orange)-(300|400|500|600)/,
      variants: ['dark'],
    },
  ],
};