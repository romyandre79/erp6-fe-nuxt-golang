<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useI18n } from 'vue-i18n';

// Page metadata
definePageMeta({
  layout: false,
});

// Auth composable
const { login } = useAuth();
const { t } = useI18n();
const store = useThemeStore();

// Form & state
const form = reactive({ username: '', password: '', remember: false });
const loading = ref(false);
const error = ref('');
const submitted = ref(false);

const demoAccounts = [
  { name: 'Super Admin', email: 'superadmin@example.com', role: 'Super Admin' },
  { name: 'Keuangan', email: 'keuangan@example.com', role: 'Keuangan' },
  { name: 'Pembelian', email: 'pembelian@example.com', role: 'Pembelian' },
  { name: 'Pemasaran', email: 'pemasaran@example.com', role: 'Pemasaran' },
  { name: 'Gudang', email: 'gudang@example.com', role: 'Gudang' },
  { name: 'Viewer', email: 'viewer@example.com', role: 'Viewer' },
];

onMounted(async () => {
  store.themeCookie = '1';
  await store.applyCurrentTheme();
});

// Handle login
const handleLogin = async () => {
  submitted.value = true;

  // Simple client-side validation
  if (!form.username || !form.password) return;

  loading.value = true;
  error.value = '';
  try {
    await login(form);
  } catch (err: any) {
    console.warn(err);
    error.value = err?.data?.message || t('INVALID_CREDENTIAL');
  } finally {
    loading.value = false;
  }
};

const fillDemoAccount = (account: any) => {
  form.username = account.email;
  // Assuming a default password for demo accounts or leaving it empty for user to fill if sensitive
  form.password = 'password'; 
};
</script>

<template>
  <!-- Outer Container for Centering and Background -->
  <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-sans p-4 relative z-0">
    <!-- Optional: Background decoration for the page -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -left-[10%] w-[70vh] h-[70vh] rounded-full bg-purple-200/30 dark:bg-purple-900/10 blur-3xl"></div>
      <div class="absolute top-[40%] -right-[10%] w-[60vh] h-[60vh] rounded-full bg-indigo-200/30 dark:bg-indigo-900/10 blur-3xl"></div>
    </div>

    <!-- Card Container -->
    <div class="w-full max-w-[1000px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex overflow-hidden relative z-10 border border-white/20 dark:border-gray-800">
      
      <!-- Left Side: Branding -->
      <div class="hidden md:flex w-5/12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] relative overflow-hidden flex-col justify-center items-center text-white p-8 lg:p-12">
        <!-- Decorative circles -->
        <div class="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
        
        <div class="relative z-10 text-center">
          <div class="bg-white/20 p-4 rounded-3xl inline-block mb-8 backdrop-blur-sm border border-white/20 shadow-xl">
             <!-- Using existing logo -->
            <img src="/images/logo_small.png" alt="Logo" class="w-20 h-20 object-contain drop-shadow-lg" />
          </div>
          <h1 class="text-3xl lg:text-4xl font-bold mb-4 tracking-wide">CAPELLA ERP INDONESIA</h1>
          <h2 class="text-xl lg:text-2xl font-semibold mb-2 opacity-90">Welcome Back!</h2>
          <p class="text-blue-100/80 text-base max-w-sm mx-auto leading-relaxed">
            Sign in continue manage your best ERP System.
          </p>
        </div>
      </div>

      <!-- Right Side: Form -->
      <div class="w-full md:w-7/12 flex flex-col justify-center bg-gray-50 dark:bg-gray-900/50 p-6 sm:p-8 lg:p-12">
        <div class="w-full max-w-md mx-auto space-y-6">
          <div class="text-left mb-6">
            <p class="text-gray-500 dark:text-gray-400 text-sm">Please enter your credentials to login</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div class="form-control">
              <label class="label mb-1.5 p-0">
                <span class="label-text font-medium text-gray-700 dark:text-gray-300">Email Address</span>
              </label>
              <input
                type="text"
                v-model="form.username"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm shadow-sm"
                placeholder="Enter your email"
                autocomplete="username"
              />
              <p v-if="submitted && !form.username" class="text-red-500 text-xs mt-1">{{ t('INVALID USER') }}</p>
            </div>

            <div class="form-control">
              <label class="label mb-1.5 p-0">
                <span class="label-text font-medium text-gray-700 dark:text-gray-300">Password</span>
              </label>
              <input
                type="password"
                v-model="form.password"
                class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm shadow-sm"
                placeholder="Enter your password"
                autocomplete="current-password"
              />
              <p v-if="submitted && !form.password" class="text-red-500 text-xs mt-1">{{ t('INVALID PASSWORD') }}</p>
            </div>

            <div class="flex items-center justify-between">
              <label class="flex items-center cursor-pointer select-none">
                <input type="checkbox" v-model="form.remember" class="checkbox checkbox-sm checkbox-primary rounded border-gray-300" />
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a href="#" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 transition-colors">Forgot Password?</a>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none select-none"
            >
              <span v-if="!loading">Sign In</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('LOADING') }}...
              </span>
            </button>
            
            <p v-if="error" class="text-red-500 text-center text-sm font-medium bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-900/50">
              {{ error }}
            </p>
          </form>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-gray-50 dark:bg-gray-900 text-gray-400 uppercase tracking-wider font-semibold">Demo Accounts</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2.5">
            <button
              v-for="account in demoAccounts"
              :key="account.name"
              @click="fillDemoAccount(account)"
              class="p-2.5 text-left border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 hover:bg-white dark:hover:bg-gray-800 transition-all group relative overflow-hidden bg-white/50 dark:bg-gray-800/50"
            >
              <div class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-0.5">{{ account.name }}</div>
              <div class="text-[10px] text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300 truncate">{{ account.email }}</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure the page styling is self-contained */
</style>
