<template>
  <button
    class="relative flex items-center justify-center w-10 h-10 rounded-xl bg-base-200 hover:bg-base-300 transition-all duration-300"
    @click="toggleTheme"
  >
    <i
      v-if="isDark"
      class="fa-solid fa-moon text-lg text-yellow-400 transition-transform duration-300"
    ></i>
    <i
      v-else
      class="fa-solid fa-sun text-lg text-amber-500 transition-transform duration-300"
    ></i>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '~/store/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.theme === 'dark')

const toggleTheme = () => {
  themeStore.setTheme(isDark.value ? 'light' : 'dark')
}
</script>
