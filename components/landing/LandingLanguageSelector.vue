<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

const { locale, setLocale, locales } = useI18n();
const isOpen = ref(false);

const currentLocale = computed(() => {
  const current = locales.value.find((l: any) => l.code === locale.value) as any;
  return current ? current.code.toUpperCase() : locale.value.toUpperCase();
});

const switchLocale = (code: string) => {
  setLocale(code);
  isOpen.value = false;
};

// Close dropdown when clicking outside
const dropdown = ref(null);
onClickOutside(dropdown, () => {
  isOpen.value = false;
});
</script>

<template>
  <div ref="dropdown" class="relative">
    <button 
      @click="isOpen = !isOpen"
      class="text-sm text-gray-300 hover:text-white font-medium transition flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
      </svg>
      {{ currentLocale }}
      <svg 
        class="w-3 h-3 transition-transform" 
        :class="{ 'rotate-180': isOpen }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div 
        v-if="isOpen"
        class="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50"
      >
        <button
          v-for="l in locales"
          :key="l.code"
          @click="switchLocale(l.code)"
          class="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition flex items-center justify-between"
          :class="{ 'bg-gray-700 text-white': locale === l.code }"
        >
          <span>{{ l.name }}</span>
          <svg 
            v-if="locale === l.code"
            class="w-4 h-4 text-red-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>
