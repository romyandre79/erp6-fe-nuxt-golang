<script setup>
import { useRuntimeConfig } from '#app';
import { useUserStore } from '../store/user';
import { useDevice } from '~/composables/useDevice';

const config = useRuntimeConfig();
const userStore = useUserStore();
import { useAppStore } from '~/store/app';

const appStore = useAppStore();
const { isMobile, isTablet, isDesktop, deviceType } = useDevice();

const reloadPage = () => {
  window.location.reload();
};

</script>

<template>
  <ClientOnly>
    <UApp>
      <div class="min-h-screen flex flex-col bg-white text-slate-800 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        
        <!-- Main content -->
        <main class="flex-1 w-full">
          <NuxtLoadingIndicator color="#2f9cf4" height="3" />
          <slot />
        </main>
        
      </div>
      <AiAssistant v-if="userStore.token" />
      
      <!-- Connection Error Overlay -->
      <div v-if="appStore.connectionError" class="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900/75 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4 border border-gray-100 dark:border-gray-700">
          <div class="flex flex-col items-center justify-center gap-4 text-center">
            <div class="p-3 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
              <UIcon name="i-heroicons-exclamation-triangle-20-solid" class="w-8 h-8" />
            </div>
            
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Connection Error
            </h3>
            
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ appStore.errorMessage }}. Please check your internet connection or try again later.
            </p>

            <UButton
              color="error"
              variant="solid"
              label="Retry Connection"
              icon="i-heroicons-arrow-path"
              class="mt-2"
              @click="reloadPage"
            />
          </div>
        </div>
      </div>
    </UApp>
  </ClientOnly>
</template>

<style>
@import '@/assets/css/default.css';

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.4s ease-out;
}
</style>
