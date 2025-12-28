<script setup lang="ts">
import { useAppStore } from '~/store/app';
import { useDevice } from '~/composables/useDevice';
import { useUserStore } from '~/store/user';

const appStore = useAppStore();
const userStore = useUserStore();
const { isMobile } = useDevice();
</script>

<template>
  <ClientOnly>
    <UApp>
      <div class="project-layout min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <!-- Main Content -->
        <main class="h-[calc(100vh-64px)] overflow-hidden">
          <slot />
        </main>
      </div>
    </UApp>
  </ClientOnly>
</template>

<style scoped>
.project-layout {
  font-family: 'Inter', sans-serif;
}
</style>
