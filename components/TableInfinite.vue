<template>
  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
    <h2 class="text-2xl font-semibold">{{ title }}</h2>

    <div class="flex items-center gap-2">
      <!-- Search -->
      <div v-if="enableSearch">
        <input v-model="searchQuery" type="text" placeholder="Search..." class="border rounded px-2 py-1 text-sm" />
      </div>

      <!-- Slot actions -->
      <slot name="actions" v-if="showActions"></slot>
    </div>
  </div>
  <div
    ref="scrollContainer"
    :class="[
      'overflow-y-auto max-h-64 rounded-2xl shadow-md border border-gray-200',
      isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    ]"
    @scroll="handleScroll"
  >
    <table class="table w-full">
      <thead
        :class="['text-sm uppercase font-semibold', isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-700']"
      >
        <tr>
          <th v-for="col in headers" :key="col" class="px-4 py-3 text-left tracking-wide">
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in rows"
          :key="item.id"
          :class="[
            'transition-colors duration-200',
            isDark ? 'hover:bg-gray-700/60 text-gray-100' : 'hover:bg-gray-100 text-gray-800',
          ]"
        >
          <td v-for="(value, key) in item" :key="key" class="px-4 py-3 text-sm">
            {{ value }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loadingMore" :class="['text-center py-4', isDark ? 'text-gray-400' : 'text-gray-500']">
      Loading more...
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useThemeStore } from '~/store/theme';

const props = defineProps({
  title: String,
  headers: Array,
  rows: Array,
  batchSize: { type: Number, default: 10 },
  showActions: {
    type: Boolean,
    default: true,
  },
  enableSearch: {
    type: Boolean,
    default: true,
  },
  enablePaging: {
    type: Boolean,
    default: true,
  },
  enablePageSize: {
    type: Boolean,
    default: true,
  },
});

const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === 'dark');

const infiniteItems = ref([]);
const loadingMore = ref(false);
const scrollContainer = ref(null);
let totalCount = 100;
let loadedCount = 0;

const loadMore = () => {
  if (loadingMore.value) return;
  loadingMore.value = true;
  setTimeout(() => {
    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: loadedCount + i + 1,
      name: `Product ${loadedCount + i + 1}`,
    }));
    infiniteItems.value.push(...newItems);
    loadedCount += 10;
    loadingMore.value = false;
  }, 600);
};

const handleScroll = () => {
  const el = scrollContainer.value;
  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10 && loadedCount < totalCount) {
    loadMore();
  }
};
</script>
