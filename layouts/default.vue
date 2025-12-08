<script setup>
import { useRuntimeConfig } from '#app';
import { useThemeStore } from '../store/theme';
import { useUserStore } from '../store/user';

const config = useRuntimeConfig();
const themeStore = useThemeStore();
const userStore = useUserStore();

onMounted(async () => {
  themeStore.applyCurrentTheme();
});
</script>

<template>
  <ClientOnly>
    <UApp>
      <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-500">
        
        <!-- Modern Glassmorphism Navbar -->
        <header class="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-white/20 dark:border-gray-800/50 shadow-sm transition-all duration-300">
          <div class="container mx-auto px-6">
            <Navbar class="nav" />
          </div>
        </header>

        <!-- Main content with subtle fade animation -->
        <main class="flex-1 animate-fade-in">
          <NuxtLoadingIndicator color="#6366f1" />
          <slot />
        </main>

        <!-- Minimal Modern Footer -->
        <footer class="relative mt-auto">
          <!-- Top accent line -->
          <div class="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
          
          <div class="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md py-6 px-4">
            <div class="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <!-- Copyright -->
              <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">
                &copy; {{ new Date().getFullYear() }} Prisma Data Abadi
                <span class="text-indigo-500 ml-1">{{ config.public.title }}</span>
              </p>
              
              <!-- Optional social/links area -->
              <div class="flex items-center gap-4 text-gray-400 dark:text-gray-500">
                <span class="text-xs tracking-wide uppercase opacity-60">Made with ❤️</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <AiAssistant v-if="userStore.token" />
    </UApp>
  </ClientOnly>
</template>

<style>
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
