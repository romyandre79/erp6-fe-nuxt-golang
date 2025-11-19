<script setup>
import { useRuntimeConfig } from '#app';
import { useThemeStore } from '~/store/theme';

const config = useRuntimeConfig();
const themeStore = useThemeStore();

onMounted(async () => {
  // Apply initial theme
  if (process.client) {
    document.documentElement.classList.toggle('dark', themeStore.theme === 'dark');
  }
});
</script>

<template>
  <ClientOnly>
    <UApp>
      <div class="min-h-screen flex flex-col">
        <!-- Optional Navbar -->
        <header class="bg-base-100 dark:bg-gray-900 shadow-md p-4">
          <Navbar />
        </header>

        <!-- Main content -->
        <main class="flex-1">
          <NuxtLoadingIndicator />
          <slot />
        </main>

        <!-- Optional Footer -->
        <footer class="bg-base-100 dark:bg-gray-900 p-4 text-center text-gray-500 dark:text-gray-300">
          &copy; Prisma Data Abadi 2025 {{ config.public.title }}
        </footer>
      </div>
    </UApp>
  </ClientOnly>
</template>
