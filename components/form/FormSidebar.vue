<template>
  <div class="h-full flex flex-row bg-white text-gray-900 shadow-sm border-r">
    <!-- Activity Bar -->
    <div class="panel w-12 flex flex-col items-center py-2 bg-gray-800 text-gray-400 border-r border-gray-700 z-20">
      <button
        v-for="item in activities"
        :key="item.id"
        class="w-full relative flex justify-center py-3 mb-1 hover:bg-gray-700 transition-colors"
        :class="activeActivity === item.id && isPanelOpen ? 'text-white' : 'text-gray-400 hover:text-gray-200'"
        @click="toggleActivity(item.id)"
        :title="item.label"
      >
        <div
          v-if="activeActivity === item.id && isPanelOpen"
          class="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"
        ></div>
        <UIcon :name="item.icon" class="w-6 h-6" />
      </button>
    </div>

    <!-- Side Panel -->
    <div v-show="isPanelOpen" class="w-80 flex flex-col bg-gray-50 border-r transition-all duration-300 ease-in-out">
      <div class="p-3 border-b bg-gray-100 flex justify-between items-center">
        <span class="font-semibold text-sm uppercase text-gray-600">{{ activeLabel }}</span>
        <button @click="isPanelOpen = false" class="text-gray-500 hover:text-gray-700">
          <UIcon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>

      <div class="flex-1 overflow-auto p-3">
        <!-- Elements Content -->
        <div v-if="activeActivity === 'elements'">
          <div class="mb-4">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search components..."
              class="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div v-if="filteredComponents.length > 0">
            <h2 class="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider">Components</h2>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(comp, idx) in filteredComponents"
                :key="idx"
                class="flex flex-col items-center justify-center p-3 bg-white border rounded cursor-grab hover:border-blue-400 hover:shadow-md transition-all text-center aspect-square"
                draggable="true"
                @dragstart="onDragStart($event, comp)"
              >
                <UIcon :name="comp.icon || 'heroicons:cube'" class="w-8 h-8 mb-2 text-gray-500" />
                <span class="text-xs font-medium text-gray-700 leading-tight">{{ comp.label }}</span>
              </div>
            </div>
          </div>

          <div v-if="filteredContainers.length > 0">
            <h3 class="font-bold text-sm text-gray-700 mt-6 mb-3 uppercase tracking-wider">Containers</h3>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="(group, idx) in filteredContainers"
                :key="'grp-' + idx"
                class="flex flex-col items-center justify-center p-3 bg-white border rounded cursor-grab hover:border-blue-400 hover:shadow-md transition-all text-center aspect-square"
                draggable="true"
                @dragstart="onDragStart($event, group)"
              >
                <UIcon :name="group.icon || 'heroicons:square-3-stack-3d'" class="w-8 h-8 mb-2 text-gray-500" />
                <span class="text-xs font-medium text-gray-700 leading-tight">{{ group.label }}</span>
              </div>
            </div>
          </div>

          <div
            v-if="filteredComponents.length === 0 && filteredContainers.length === 0"
            class="text-center text-gray-500 mt-4 text-sm"
          >
            No components found.
          </div>
        </div>

        <!-- Structure Content (Placeholder for now, or move TreeView here) -->
        <div v-if="activeActivity === 'structure'">
          <div class="text-gray-500 text-sm italic text-center mt-10">
            Structure view is currently on the right panel.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { availableComponents, layoutContainers } from '~/types/components';

const activeActivity = ref('elements');
const isPanelOpen = ref(true);
const searchQuery = ref('');

const activities = [
  { id: 'elements', label: 'Elements', icon: 'heroicons:squares-plus' },
  // { id: 'structure', label: 'Structure', icon: 'heroicons:list-bullet' }, // Optional: Move TreeView here later
];

const activeLabel = computed(() => {
  return activities.find((a) => a.id === activeActivity.value)?.label || '';
});

const filteredComponents = computed(() => {
  if (!searchQuery.value) return availableComponents;
  const lowerQuery = searchQuery.value.toLowerCase();
  return availableComponents.filter((c) => c.label.toLowerCase().includes(lowerQuery));
});

const filteredContainers = computed(() => {
  if (!searchQuery.value) return layoutContainers;
  const lowerQuery = searchQuery.value.toLowerCase();
  return layoutContainers.filter((c) => c.label.toLowerCase().includes(lowerQuery));
});

function toggleActivity(id: string) {
  if (activeActivity.value === id) {
    isPanelOpen.value = !isPanelOpen.value;
  } else {
    activeActivity.value = id;
    isPanelOpen.value = true;
  }
}

function onDragStart(event: DragEvent, comp: any) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('component', JSON.stringify(comp));
    (window as any).draggingComponent = comp;
  }
}
</script>
