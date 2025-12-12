<template>
  <div class="p-4">
    <h3 class="font-semibold mb-4">Components</h3>

    <!-- Component Categories -->
    <div v-for="category in categories" :key="category.name" class="mb-6">
      <h4 class="text-sm font-medium text-gray-700 mb-2">{{ category.label }}</h4>
      <div class="space-y-1">
        <div
          v-for="component in category.components"
          :key="component.type"
          class="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-move"
          draggable="true"
          @dragstart="onDragStart($event, component)"
        >
          <UIcon :name="component.icon" class="text-gray-600" />
          <span class="text-sm">{{ component.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reportComponents } from '~/types/report-components';

const categories = computed(() => {
  const grouped = {
    basic: { name: 'basic', label: 'Basic Elements', components: [] as any[] },
    data: { name: 'data', label: 'Data Elements', components: [] as any[] },
    charts: { name: 'charts', label: 'Charts & Graphs', components: [] as any[] },
    special: { name: 'special', label: 'Special Elements', components: [] as any[] },
  };

  reportComponents.forEach((comp) => {
    if (grouped[comp.category]) {
      grouped[comp.category].components.push(comp);
    }
  });

  return Object.values(grouped).filter((cat) => cat.components.length > 0);
});

function onDragStart(event: DragEvent, component: any) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('application/json', JSON.stringify(component));
  }
}
</script>
