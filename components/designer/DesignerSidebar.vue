<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg">
    <!-- Navigation Tabs -->
    <div class="flex border-b border-gray-200 dark:border-gray-700">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex-1 px-4 py-3 text-sm font-medium transition-all relative"
        :class="[
          activeTab === tab.id 
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30' 
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800'
        ]"
        @click="activeTab = tab.id"
      >
        <div class="flex items-center justify-center gap-2">
          <UIcon :name="tab.icon" class="w-4 h-4" />
          <span>{{ tab.label }}</span>
        </div>
        <div 
          v-if="activeTab === tab.id"
          class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
        ></div>
      </button>
    </div>

    <!-- Search Bar -->
    <div class="p-3 border-b border-gray-100 dark:border-gray-800">
      <div class="relative">
        <UIcon 
          name="heroicons:magnifying-glass" 
          class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
        />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search blocks..."
          class="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-gray-800 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button 
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <UIcon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>
      
      <!-- Category Filter -->
      <div class="flex flex-wrap gap-1.5 mt-2" v-if="!searchQuery">
        <button
          v-for="cat in allCategories"
          :key="cat.id"
          @click="toggleCategory(cat.id)"
          class="px-2.5 py-1 text-xs rounded-full transition-all font-medium"
          :class="[
            selectedCategories.includes(cat.id)
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
          ]"
        >
          {{ cat.label }}
        </button>
      </div>
    </div>

    <!-- Blocks Tab -->
    <div v-if="activeTab === 'blocks'" class="flex-1 overflow-y-auto px-3 py-2">
      <!-- Filtered/Search Results -->
      <div v-if="searchQuery" class="space-y-1.5">
        <p class="text-xs text-gray-500 mb-2">{{ filteredComponents.length }} results</p>
        <ComponentBlock
          v-for="comp in filteredComponents"
          :key="comp.type"
          :component="comp"
          @dragstart="onDragStart($event, comp)"
        />
      </div>

      <!-- Categorized View -->
      <div v-else class="space-y-2">
        <div 
          v-for="category in visibleCategories" 
          :key="category.id"
          class="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800"
        >
          <!-- Category Header -->
          <button 
            @click="toggleCategoryExpand(category.id)"
            class="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div class="flex items-center gap-2">
              <div 
                class="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs"
                :style="{ backgroundColor: category.color }"
              >
                <UIcon :name="category.icon" class="w-3.5 h-3.5" />
              </div>
              <span class="font-semibold text-sm text-gray-700 dark:text-gray-200">{{ category.label }}</span>
              <span class="text-xs text-gray-400 dark:text-gray-500">({{ category.components.length }})</span>
            </div>
            <UIcon 
              :name="expandedCategories.includes(category.id) ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
              class="w-4 h-4 text-gray-400"
            />
          </button>
          
          <!-- Category Components -->
          <transition name="expand">
            <div 
              v-if="expandedCategories.includes(category.id)"
              class="grid grid-cols-2 gap-1.5 p-2 bg-white dark:bg-gray-900"
            >
              <ComponentBlock
                v-for="comp in category.components"
                :key="comp.type"
                :component="comp"
                :compact="true"
                @dragstart="onDragStart($event, comp)"
              />
            </div>
          </transition>
        </div>
      </div>
    </div>

    <!-- Patterns Tab (Future) -->
    <div v-if="activeTab === 'patterns'" class="flex-1 overflow-y-auto p-4">
      <div class="text-center py-8">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
          <UIcon name="heroicons:puzzle-piece" class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="font-medium text-gray-700 dark:text-gray-300 mb-1">Block Patterns</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Pre-built layouts coming soon</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { availableComponents, layoutContainers } from '~/types/components';
import ComponentBlock from './ComponentBlock.vue';

const props = defineProps<{
  title?: string;
  designerType?: 'form' | 'widget';
}>();

const emit = defineEmits(['component-drag']);

const activeTab = ref('blocks');
const searchQuery = ref('');
const selectedCategories = ref<string[]>([]);
const expandedCategories = ref<string[]>(['layout', 'text']);

const tabs = [
  { id: 'blocks', label: 'Blocks', icon: 'heroicons:squares-plus' },
  { id: 'patterns', label: 'Patterns', icon: 'heroicons:puzzle-piece' },
];

// Define component categories with WordPress-like styling
const componentCategories = computed(() => [
  {
    id: 'layout',
    label: 'Layout',
    icon: 'heroicons:squares-2x2',
    color: '#8b5cf6',
    types: ['row', 'col', 'columns', 'form', 'master', 'widget', 'wizard', 'step'],
    components: layoutContainers.filter(c => ['row', 'col', 'columns', 'form', 'master', 'widget', 'wizard', 'step'].includes(c.type))
  },
  {
    id: 'text',
    label: 'Text',
    icon: 'heroicons:document-text',
    color: '#3b82f6',
    types: ['text', 'longtext', 'html', 'title', 'subtitle', 'label'],
    components: availableComponents.filter(c => ['text', 'longtext', 'html', 'title', 'subtitle', 'label'].includes(c.type))
  },
  {
    id: 'input',
    label: 'Inputs',
    icon: 'heroicons:pencil-square',
    color: '#10b981',
    types: ['shorttext', 'number', 'email', 'password', 'tel', 'url', 'hidden'],
    components: availableComponents.filter(c => ['shorttext', 'number', 'email', 'password', 'tel', 'url', 'hidden'].includes(c.type))
  },
  {
    id: 'selection',
    label: 'Selection',
    icon: 'heroicons:check-circle',
    color: '#f59e0b',
    types: ['select', 'selectgroup', 'bool', 'radio', 'megabox'],
    components: availableComponents.filter(c => ['select', 'selectgroup', 'bool', 'radio', 'megabox'].includes(c.type))
  },
  {
    id: 'datetime',
    label: 'Date & Time',
    icon: 'heroicons:calendar',
    color: '#ef4444',
    types: ['date', 'datetime', 'time', 'month', 'schedule'],
    components: availableComponents.filter(c => ['date', 'datetime', 'time', 'month', 'schedule'].includes(c.type))
  },
  {
    id: 'media',
    label: 'Media',
    icon: 'heroicons:photo',
    color: '#ec4899',
    types: ['file', 'image', 'color'],
    components: availableComponents.filter(c => ['file', 'image', 'color'].includes(c.type))
  },
  {
    id: 'containers',
    label: 'Containers',
    icon: 'heroicons:square-3-stack-3d',
    color: '#6366f1',
    types: ['tabs', 'tab', 'cards', 'card', 'buttons', 'modals', 'modal', 'search'],
    components: layoutContainers.filter(c => ['tabs', 'tab', 'cards', 'card', 'buttons', 'modals', 'modal', 'search'].includes(c.type))
  },
  {
    id: 'data',
    label: 'Data Display',
    icon: 'heroicons:table-cells',
    color: '#0ea5e9',
    types: ['table', 'tables', 'detailtable', 'chart', 'charts', 'kanban', 'kanbanboard'],
    components: layoutContainers.filter(c => ['table', 'tables', 'detailtable', 'chart', 'charts', 'kanban', 'kanbanboard'].includes(c.type))
  },
  {
    id: 'actions',
    label: 'Actions',
    icon: 'heroicons:bolt',
    color: '#14b8a6',
    types: ['button', 'action', 'callother', 'reset', 'separator', 'range'],
    components: availableComponents.filter(c => ['button', 'action', 'callother', 'reset', 'separator', 'range'].includes(c.type))
  },
]);

const allCategories = computed(() => 
  componentCategories.value.map(c => ({ id: c.id, label: c.label }))
);

const visibleCategories = computed(() => {
  if (selectedCategories.value.length === 0) {
    return componentCategories.value.filter(c => c.components.length > 0);
  }
  return componentCategories.value.filter(c => 
    selectedCategories.value.includes(c.id) && c.components.length > 0
  );
});

const filteredComponents = computed(() => {
  if (!searchQuery.value) return [];
  const query = searchQuery.value.toLowerCase();
  const allComps = [...availableComponents, ...layoutContainers];
  return allComps.filter(c => 
    c.label.toLowerCase().includes(query) || 
    c.type.toLowerCase().includes(query)
  );
});

function toggleCategory(catId: string) {
  const idx = selectedCategories.value.indexOf(catId);
  if (idx === -1) {
    selectedCategories.value.push(catId);
  } else {
    selectedCategories.value.splice(idx, 1);
  }
}

function toggleCategoryExpand(catId: string) {
  const idx = expandedCategories.value.indexOf(catId);
  if (idx === -1) {
    expandedCategories.value.push(catId);
  } else {
    expandedCategories.value.splice(idx, 1);
  }
}

function onDragStart(event: DragEvent, comp: any) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('component', JSON.stringify(comp));
    (window as any).draggingComponent = comp;
  }
  emit('component-drag', comp);
}
</script>

<style scoped>
.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease-out;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 500px;
}
</style>
