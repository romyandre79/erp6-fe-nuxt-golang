<template>
  <div class="relative w-10 h-10 flex items-center justify-center cursor-pointer group navbar-icon-wrapper">
    <!-- Hidden select (interactive) -->
    <select 
      v-model="localTheme" 
      class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      :title="selectedThemeName"
    >
      <option v-for="t in store.themeList" :key="t.themeid" :value="t.themeid">
        {{ t.description || t.themename }}
      </option>
    </select>
    
    <!-- Visible icon -->
    <i class="fa-solid fa-palette text-lg transition-colors"></i>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useThemeStore } from '~/store/theme';
import { useAuth } from '#imports';

const store = useThemeStore();
const auth = useAuth();
const localTheme = ref(store.theme);

// Get selected theme name
const selectedThemeName = computed(() => {
  const f = store.themeList.find((t) => t.themeid === localTheme.value);
  return f?.description || f?.themename || 'Theme';
});

// when select changes → apply theme
watch(localTheme, (val) => {
  auth.updateUserTheme(val);
  store.loadSingleThemes(val);
  store.applyTheme(val);
});
</script>
