/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rounded': ['Righteous', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-yellow-400', 'hover:bg-yellow-500',
    'bg-blue-400', 'hover:bg-blue-500',
    'bg-red-400', 'hover:bg-red-500',
    'bg-purple-400', 'hover:bg-purple-500',
    'bg-green-400', 'hover:bg-green-500',
    'border-rose-300', 'bg-rose-50', 'text-gray-700', 'font-medium',
    'border-gray-200', 'text-gray-500', 'hover:border-gray-300',
    'bg-rose-400', 'hover:bg-rose-500', 'text-white',
    'bg-gray-100', 'text-gray-300', 'cursor-not-allowed'
  ]
}
