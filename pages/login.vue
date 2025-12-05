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
const form = reactive({ username: '', password: '' });
const loading = ref(false);
const error = ref('');
const submitted = ref(false);

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
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-300 dark:from-gray-900 dark:to-gray-800"
  >
    <div
      class="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30"
    >
      <!-- Logo -->
      <div class="flex justify-center mb-6">
        <img src="/images/logo_small.png" alt="Logo" class="w-16 h-16 rounded-full shadow-md" />
      </div>

      <h2 class="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-2">{{ t('WELCOME BACK') }}</h2>
      <p class="text-center text-gray-500 dark:text-gray-400 mb-8">{{ t('LOGIN TO ACCOUNT') }}</p>

      <form>
        <div class="form-control mb-5">
          <label class="label">
            <span class="label-text text-gray-600 dark:text-gray-300">{{ t('USER') }}</span>
          </label>
          <input
            type="text"
            v-model="form.username"
            class="input input-bordered w-full px-4 py-2.5 text-gray-600"
            :placeholder="t('ENTER USER')"
            autocomplete="on"
          />
          <p v-if="submitted && !form.username" class="text-red-500 text-sm mt-1">{{ t('INVALID USER') }}</p>
        </div>

        <div class="form-control mb-6">
          <label class="label">
            <span class="label-text text-gray-600 dark:text-gray-300">{{ t('PASSWORD') }}</span>
          </label>
          <input
            type="password"
            v-model="form.password"
            class="input input-bordered w-full px-4 py-2.5"
            placeholder="••••••••"
            autocomplete="on"
          />
          <p v-if="submitted && !form.password" class="text-red-500 text-sm mt-1">{{ t('INVALID PASSWORD') }}</p>
        </div>

        <button
          @click="handleLogin"
          :disabled="loading"
          class="w-full py-2.5 rounded-lg font-semibold text-white bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all duration-300 ease-in-out"
        >
          <span v-if="!loading">{{ t('LOGIN') }}</span>
          <span v-else>{{ t('LOADING') }}...</span>
        </button>

        <p v-if="error" class="text-red-500 text-center mt-3 text-sm">{{ error }}</p>
      </form>
    </div>
  </div>
</template>
