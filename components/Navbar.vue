<script setup>
import { ref } from 'vue';
import { useUserStore } from '~/store/user';
import { useDevice } from '~/composables/useDevice';

const userStore = useUserStore();
const { isMobile, isTablet } = useDevice();
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};
</script>

<template>
  <nav class="flex items-center justify-between py-4">
    <!-- Logo / Brand -->
    <div class="flex items-center gap-3">
      <NuxtLink to="/" class="flex items-center gap-2 group" @click="closeMobileMenu">
        <div
          class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105"
        >
          <i class="fa-solid fa-cube text-white text-sm"></i>
        </div>
        <span class="font-bold text-lg text-gray-800 dark:text-white tracking-tight">
          ERP<span class="text-indigo-500">6</span>
        </span>
      </NuxtLink>
    </div>

    <!-- Desktop Navigation Links -->
    <div v-if="!isMobile" class="flex items-center gap-1">
      <NuxtLink
        to="/"
        class="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
      >
        <i class="fa-solid fa-home mr-2 text-xs"></i>
        {{ $t('HOME') }}
      </NuxtLink>

      <NuxtLink
        v-if="!userStore.token"
        to="/login"
        class="ml-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02]"
      >
        <i class="fa-solid fa-sign-in-alt mr-2 text-xs"></i>
        {{ $t('SIGN IN') }}
      </NuxtLink>

      <NuxtLink
        v-if="userStore.token"
        to="/admin/dashboard"
        class="ml-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:scale-[1.02]"
      >
        <i class="fa-solid fa-tachometer-alt mr-2 text-xs"></i>
        {{ $t('ADMIN') }}
      </NuxtLink>

      <!-- Language Switcher -->
      <LanguageWatcher class="ml-2" />
    </div>

    <!-- Mobile Menu Toggle -->
    <button
      v-if="isMobile"
      @click="toggleMobileMenu"
      class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
      aria-label="Toggle menu"
    >
      <i :class="mobileMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'" class="text-xl"></i>
    </button>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div
        v-if="isMobile && mobileMenuOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        @click="closeMobileMenu"
      ></div>
    </Transition>

    <!-- Mobile Menu Slide-out -->
    <Transition name="slide">
      <div
        v-if="isMobile && mobileMenuOpen"
        class="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-2xl z-50 flex flex-col"
      >
        <!-- Mobile Menu Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <span class="font-bold text-lg text-gray-800 dark:text-white">
            ERP<span class="text-indigo-500">6</span>
          </span>
          <button
            @click="closeMobileMenu"
            class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <i class="fa-solid fa-times text-xl"></i>
          </button>
        </div>

        <!-- Mobile Menu Items -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-2">
          <NuxtLink
            to="/"
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all duration-200"
          >
            <i class="fa-solid fa-home text-base"></i>
            {{ $t('HOME') }}
          </NuxtLink>

          <NuxtLink
            v-if="!userStore.token"
            to="/login"
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-300"
          >
            <i class="fa-solid fa-sign-in-alt text-base"></i>
            {{ $t('SIGN IN') }}
          </NuxtLink>

          <NuxtLink
            v-if="userStore.token"
            to="/admin/dashboard"
            @click="closeMobileMenu"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/25 transition-all duration-300"
          >
            <i class="fa-solid fa-tachometer-alt text-base"></i>
            {{ $t('ADMIN') }}
          </NuxtLink>

          <div class="px-4 py-3">
            <LanguageWatcher />
          </div>
        </nav>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
/* Fade transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide transition for mobile menu */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}
</style>
