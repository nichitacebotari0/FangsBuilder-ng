/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  safelist: [
    'border-sky-600',
    'border-red-600',
    'border-yellow-500',
    'border-yellow-800',
    'border-purple-600',
    'border-stone-500',
    'text-sky-600',
    'text-red-600',
    'text-yellow-500',
    'text-yellow-800',
    'text-purple-600',
    'text-stone-500'
  ],
  theme: {
    extend: {
      screens: {
        'xs': '360px',
        // => @media (min-width: 992px) { ... }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
