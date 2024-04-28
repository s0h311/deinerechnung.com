import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontSize: {
        xxs: '8.5px',
      },
      screens: {
        desktop: '1850px',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ['emerald'],
  },
}
