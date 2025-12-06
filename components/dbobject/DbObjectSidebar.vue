<template>
  <div class="h-full flex flex-row bg-white text-gray-900 shadow-sm border-r">
    <!-- Activity Bar -->
    <div class="panel w-12 flex flex-col items-center py-2 bg-gray-800 text-gray-400 border-r border-gray-700 z-20">
      <button
        v-for="item in activities"
        :key="item.id"
        class="p-3 mb-2 rounded hover:text-white transition-colors relative"
        :class="{ 'text-white border-l-2 border-white bg-gray-700': activeActivity === item.id && isPanelOpen }"
        @click="toggleActivity(item.id)"
        :title="item.label"
      >
        <UIcon :name="item.icon" class="w-6 h-6" />
      </button>
    </div>

    <!-- Side Panel -->
    <div
      v-show="isPanelOpen"
      class="w-80 flex flex-col bg-gray-50 border-r transition-all duration-300 ease-in-out"
    >
      <div class="p-3 border-b bg-gray-100 flex justify-between items-center">
        <span class="font-semibold text-sm uppercase text-gray-600">{{ activeLabel }}</span>
        <button @click="isPanelOpen = false" class="text-gray-500 hover:text-gray-700">
          <UIcon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>

      <div class="flex-1 overflow-auto p-3">
        <!-- Toolbox Content -->
        <div v-if="activeActivity === 'toolbox'" class="space-y-4">
          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wider">Actions</h3>
            <div class="grid grid-cols-1 gap-2">
              <button @click="$emit('add-table')" class="flex items-center gap-2 px-3 py-2 bg-white border rounded hover:bg-gray-50 text-sm">
                <UIcon name="heroicons:table-cells" class="w-5 h-5 text-green-600" />
                <span>Add Table</span>
              </button>
              <button @click="$emit('add-area', $event)" class="flex items-center gap-2 px-3 py-2 bg-white border rounded hover:bg-gray-50 text-sm">
                <UIcon name="heroicons:square-3-stack-3d" class="w-5 h-5 text-purple-600" />
                <span>Add Area</span>
              </button>
              <button @click="$emit('ai-suggest')" class="flex items-center gap-2 px-3 py-2 bg-white border rounded hover:bg-gray-50 text-sm">
                <UIcon name="heroicons:building-library" class="w-5 h-5 text-purple-500" />
                <span>AI Suggest Relations</span>
              </button>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wider">Project</h3>
            <div class="grid grid-cols-2 gap-2">
              <button @click="$emit('save')" class="flex flex-col items-center justify-center p-2 bg-green-600 text-white rounded hover:bg-green-700 text-xs">
                <UIcon name="heroicons:bookmark-square" class="w-5 h-5 mb-1" />
                Save
              </button>
              <button @click="$emit('reset')" class="flex flex-col items-center justify-center p-2 bg-red-500 text-white rounded hover:bg-red-600 text-xs">
                <UIcon name="heroicons:arrows-right-left" class="w-5 h-5 mb-1" />
                Reset
              </button>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wider">View</h3>
            <div class="grid grid-cols-2 gap-2">
              <button @click="$emit('zoom-in')" class="p-2 bg-white border rounded hover:bg-gray-50 text-xs flex flex-col items-center">
                <UIcon name="heroicons:magnifying-glass-plus" class="w-4 h-4 mb-1" /> Zoom In
              </button>
              <button @click="$emit('zoom-out')" class="p-2 bg-white border rounded hover:bg-gray-50 text-xs flex flex-col items-center">
                <UIcon name="heroicons:magnifying-glass-minus" class="w-4 h-4 mb-1" /> Zoom Out
              </button>
              <button @click="$emit('reset-zoom')" class="p-2 bg-white border rounded hover:bg-gray-50 text-xs flex flex-col items-center col-span-2">
                <UIcon name="heroicons:arrows-right-left" class="w-4 h-4 mb-1" /> Reset Zoom
              </button>
              <button @click="$emit('export-png')" class="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-xs flex flex-col items-center col-span-2">
                <UIcon name="heroicons:bars-4" class="w-4 h-4 mb-1" /> Export PNG
              </button>
            </div>
          </div>
        </div>

        <!-- Explorer Content -->
        <div v-if="activeActivity === 'explorer'">
          <h3 class="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wider">Tables</h3>
          <ul class="space-y-1 mb-4">
            <li
              v-for="table in tables"
              :key="table.id"
              @click="$emit('select-table', table.id)"
              class="px-2 py-1 rounded cursor-pointer text-sm hover:bg-gray-200 flex items-center gap-2"
              :class="{ 'bg-blue-100 text-blue-700': selectedTable?.id === table.id }"
            >
              <UIcon name="heroicons:table-cells" class="w-4 h-4 text-gray-500" />
              <span class="truncate">{{ table.name }}</span>
            </li>
          </ul>

          <h3 class="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wider">Areas</h3>
          <ul class="space-y-1">
            <li
              v-for="area in areas"
              :key="area.id"
              class="px-2 py-1 rounded cursor-pointer text-sm hover:bg-gray-200 flex items-center gap-2"
            >
              <UIcon name="heroicons:square-3-stack-3d" class="w-4 h-4 text-gray-500" />
              <span class="truncate">{{ area.name }}</span>
            </li>
          </ul>
        </div>

        <!-- Properties Content -->
        <div v-if="activeActivity === 'properties'" class="h-full">
          <PropertiesPanel
            v-if="selectedTable"
            :selectedTable="selectedTable"
            :relations="relations"
            :jsonPreview="jsonPreview"
            :aiDescription="aiDescription"
            @update:jsonPreview="$emit('update:jsonPreview', $event)"
            @update:aiDescription="$emit('update:aiDescription', $event)"
            @ai-parse="$emit('ai-parse', $event)"
            @remove-column="$emit('remove-column', $event)"
            @add-column="$emit('add-column')"
            @ai-suggest-types="$emit('ai-suggest-types', $event)"
            @apply-json="$emit('apply-json', $event)"
            @copy-json="$emit('copy-json', $event)"
            @remove-relation="$emit('remove-relation', $event)"
          />
          <div v-else class="text-gray-500 text-sm italic text-center mt-10">
            Select a table to view properties.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import PropertiesPanel from '~/components/canvas/PropertiesPanel.vue';

const props = defineProps<{
  tables: any[];
  areas: any[];
  selectedTable: any;
  relations: any[];
  jsonPreview: string;
  aiDescription: string;
}>();

const emit = defineEmits([
  'add-table',
  'add-area',
  'save',
  'reset',
  'ai-suggest',
  'select-table',
  'zoom-in',
  'zoom-out',
  'reset-zoom',
  'export-png',
  'update:jsonPreview',
  'update:aiDescription',
  'ai-parse',
  'remove-column',
  'add-column',
  'ai-suggest-types',
  'apply-json',
  'copy-json',
  'remove-relation',
]);

const activeActivity = ref('toolbox');
const isPanelOpen = ref(true);

const activities = [
  { id: 'toolbox', label: 'Toolbox', icon: 'heroicons:squares-plus' },
  { id: 'explorer', label: 'Explorer', icon: 'heroicons:list-bullet' },
  { id: 'properties', label: 'Properties', icon: 'heroicons:cog-6-tooth' },
];

const activeLabel = computed(() => {
  return activities.find((a) => a.id === activeActivity.value)?.label || '';
});

function toggleActivity(id: string) {
  if (activeActivity.value === id) {
    isPanelOpen.value = !isPanelOpen.value;
  } else {
    activeActivity.value = id;
    isPanelOpen.value = true;
  }
}

// Auto-switch to properties when a table is selected
watch(() => props.selectedTable, (newVal) => {
  if (newVal) {
    activeActivity.value = 'properties';
    isPanelOpen.value = true;
  }
});
</script>
