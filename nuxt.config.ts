// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxt/image', '@nuxt/ui', '@nuxtjs/i18n'],
  ssr: false,
  nitro: {
    preset: 'static',
    output: {
      publicDir: '../erp6-be-golang-dist/public', // default folder Nuxt
    },
    rollupConfig: {
      // Suppress warnings for Nitro internal virtual modules
      onwarn(warning, warn) {
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.exporter?.includes('cache-driver')) {
          return; // Ignore cache-driver warning
        }
        if (warning.code === 'CIRCULAR_DEPENDENCY' && warning.ids?.some((id) => id.includes('node_modules'))) {
          return; // Ignore circular dependencies in node_modules
        }
        warn(warning);
      },
    },
  },
  compatibilityDate: '2025-07-15',
  css: ['@fortawesome/fontawesome-free/css/all.min.css', 'drawflow/dist/drawflow.min.css', 'assets/css/drawflow.css'],
  vite: {
    build: {
      sourcemap: false,
      chunkSizeWarningLimit: 2000, // Increase limit - chunks are already optimized with code splitting
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // Separate node_modules into vendor chunks
            if (id.includes('node_modules')) {
              // Drawflow library
              if (id.includes('drawflow')) {
                return 'vendor-drawflow';
              }
              // Chart libraries
              if (id.includes('chart.js') || id.includes('apexcharts') || id.includes('vue-chartjs')) {
                return 'vendor-charts';
              }
              // Font Awesome
              if (id.includes('fortawesome')) {
                return 'vendor-icons';
              }
              // html-to-image
              if (id.includes('html-to-image')) {
                return 'vendor-export';
              }
            }
          },
        },
      },
    },
    plugins: [tailwindcss()],
  },
  pinia: {
    storesDirs: ['./store/**'],
  },
  i18n: {
    langDir: 'locales',
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
      chatMaxFileSize: process.env.CHAT_MAX_FILE_SIZE || 10485760,
    },
  },
  app: {
    head: {
      title: process.env.APP_NAME,
      meta: [{ name: 'description', content: 'CMS + Ecommerce ERP frontend SSR' }],
    },
  },
  components: [{ path: '~/components', extensions: ['vue'], pathPrefix: false }],
  devtools: { enabled: true },
});
