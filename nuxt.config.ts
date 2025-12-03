// https://nuxt.com/docs/api/configuration/nuxt-config
import colors from 'tailwindcss/colors';
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxt/image', '@nuxt/ui', '@nuxtjs/i18n'],
  ssr: false,
  nitro: {
    preset: 'static',
    output: {
      publicDir: process.env.MODE === 'production'
        ? '../erp6-be-golang-dist/public'
        : './.output/public', // default folder Nuxt
    },
  },
  compatibilityDate: '2025-07-15',
  css: [
    'assets/css/main.css',
    '@fortawesome/fontawesome-free/css/all.min.css',
    'drawflow/dist/drawflow.min.css',
    'assets/css/drawflow.css',
  ],
  vite: {
    build: {
      sourcemap: false,
    },
    plugins: [tailwindcss()],
  },
  devServer: {
    watch: {
      usePolling: true,
    },
  },
  pinia: {
    storesDirs: ['./store/**'],
  },
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'id', name: 'Indonesian', file: 'id.json' },
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
  },
  runtimeConfig: {
    // Variabel private (tidak dikirim ke client)
    appName: process.env.APP_NAME,

    // Variabel public (dikirim ke client & composables)
    public: {
      appName: process.env.APP_NAME,
      companyId: process.env.COMPANY_ID,
      apiBase: process.env.PUBLIC_API_URL || 'http://localhost:8888',
      apiToken: process.env.PUBLIC_API_TOKEN || '',
      mode: process.env.MODE || 'development',
    },
  },
  app: {
    head: {
      title: process.env.APP_NAME || 'Nuxt ERP CMS',
      meta: [{ name: 'description', content: 'CMS + Ecommerce ERP frontend SSR' }],
    },
  },
  components: [{ path: '~/components', extensions: ['vue'], pathPrefix: false }],
  devtools: { enabled: true },
});
