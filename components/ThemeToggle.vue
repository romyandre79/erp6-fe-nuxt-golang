<template>
  <div class="flex flex-col gap-2">
    <div class="relative">
      <select v-model="localTheme" class="w-full px-3 py-2 rounded-lg border bg-base-200">
        <option v-for="t in store.themeList" :key="t.themeid" :value="t.themeid">
          {{ t.description || t.themename }}
        </option>
      </select>

      <!-- Preview color bubble -->
      <div
        v-if="previewColor"
        class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border shadow"
        :style="{ backgroundColor: previewColor }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useThemeStore } from '~/store/theme';

const store = useThemeStore();
const auth = useAuth()
const localTheme = ref(store.theme); // two-way bind

// preview color
const previewColor = computed(() => {
  const f = store.themeList.find((t) => t.themeid === localTheme.value);
  if (!f) return null;

  try {
    const themedata = JSON.parse(f.themedata || '{}');
    return themedata?.primary || null;
  } catch {
    return null;
  }
});

// ketika select berubah → apply theme
watch(localTheme, (val) => {
  auth.updateUserTheme(val)
  store.loadSingleThemes(val)
  store.applyTheme(val)
});
</script>
