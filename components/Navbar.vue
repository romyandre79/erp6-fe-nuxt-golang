<script setup>
import { useUserStore } from '~/store/user';

const userStore = useUserStore();
</script>

<template>
  <nav class="flex items-center justify-between py-4">
    <!-- Logo / Brand -->
    <div class="flex items-center gap-3">
      <NuxtLink 
        to="/" 
        class="flex items-center gap-2 group"
      >
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105">
          <i class="fa-solid fa-cube text-white text-sm"></i>
        </div>
        <span class="font-bold text-lg text-gray-800 dark:text-white tracking-tight">
          ERP<span class="text-indigo-500">6</span>
        </span>
      </NuxtLink>
    </div>

    <!-- Navigation Links -->
    <div class="flex items-center gap-1">
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
    </div>
  </nav>
</template>
