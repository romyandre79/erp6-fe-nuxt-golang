// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxt/image', '@nuxt/ui', '@nuxtjs/i18n'],
  ssr: false,
  nitro: {
    preset: 'static',
    output: {
      publicDir: process.env.MODE === 'prod' ? '../erp6-be-golang-dist/public' : './.output/public', // default folder Nuxt
    },
    rollupConfig: {
      // Suppress warnings for Nitro internal virtual modules
      onwarn(warning, warn) {
        if (warning.code === 'UNRESOLVED_IMPORT' && warning.exporter?.includes('cache-driver')) {
          return; // Ignore cache-driver warning
        }
        warn(warning);
      },
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
      chunkSizeWarningLimit: 1000, // Increase limit - chunks are already optimized with code splitting
      rollupOptions: {
        output: {
          manualChunks: (id: string) => {
            // Separate node_modules into vendor chunks
            if (id.includes('node_modules')) {
              // Vue ecosystem
              if (id.includes('vue') || id.includes('@vue') || id.includes('pinia')) {
                return 'vendor-vue';
              }
              // Drawflow library
              if (id.includes('drawflow')) {
                return 'vendor-drawflow';
              }
              // Chart libraries
              if (id.includes('chart.js') || id.includes('apexcharts') || id.includes('vue-chartjs')) {
                return 'vendor-charts';
              }
              // UI libraries
              if (id.includes('@nuxt/ui') || id.includes('@headlessui') || id.includes('radix')) {
                return 'vendor-ui';
              }
              // i18n
              if (id.includes('i18n') || id.includes('@intlify')) {
                return 'vendor-i18n';
              }
              // Font Awesome
              if (id.includes('fortawesome')) {
                return 'vendor-icons';
              }
              // html-to-image
              if (id.includes('html-to-image')) {
                return 'vendor-export';
              }
              // Other large vendor libs
              return 'vendor-misc';
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
      title: process.env.APP_NAME,
      meta: [{ name: 'description', content: 'CMS + Ecommerce ERP frontend SSR' }],
    },
  },
  components: [{ path: '~/components', extensions: ['vue'], pathPrefix: false }],
  devtools: { enabled: true },
});
