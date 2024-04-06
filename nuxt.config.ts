// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/image', '@vueuse/nuxt', '@nuxtjs/supabase'],
  devtools: { enabled: true },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: ['~/app.css'],
  image: {
    format: ['webp', 'avif'],
  },
  supabase: {
    redirect: false,
    /* redirectOptions: {
      login: '/login',
      callback: '/dashboard',
      exclude: ['/', '/signup'],
    }, */
  },
})
