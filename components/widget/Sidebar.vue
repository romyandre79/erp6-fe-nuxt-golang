<template>
  <div class="h-full flex flex-row bg-white text-gray-900 shadow-sm border-r">
    <!-- Activity Bar -->
    <div class="w-12 flex flex-col items-center py-2 bg-gray-800 text-gray-400 border-r border-gray-700 z-20">
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
        <!-- Elements Content -->
        <div v-if="activeActivity === 'elements'">
          <h2 class="font-bold text-sm text-gray-700 mb-3 uppercase tracking-wider">Components</h2>
          <div
            v-for="(comp, idx) in availableComponents"
            :key="idx"
            class="p-2 bg-white border rounded mb-1 cursor-grab flex items-center gap-2 hover:border-blue-400 hover:shadow-sm transition-all text-sm"
            draggable="true"
            @dragstart="onDragStart($event, comp)"
          >
            <span class="truncate">{{ comp.label }}</span>
          </div>

          <h3 class="font-bold text-sm text-gray-700 mt-4 mb-3 uppercase tracking-wider">Containers</h3>
          <div
            v-for="(group, idx) in layoutContainers"
            :key="'grp-' + idx"
            class="p-2 bg-white border rounded mb-1 cursor-grab flex items-center gap-2 hover:border-blue-400 hover:shadow-sm transition-all text-sm"
            draggable="true"
            @dragstart="onDragStart($event, group)"
          >
            <span class="truncate">{{ group.label }}</span>
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

const activities = [
  { id: 'elements', label: 'Elements', icon: 'heroicons:squares-plus' },
  // { id: 'structure', label: 'Structure', icon: 'heroicons:list-bullet' }, // Optional: Move TreeView here later
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

function onDragStart(event: DragEvent, comp: any) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('component', JSON.stringify(comp));
    (window as any).draggingComponent = comp;
  }
}
</script>
