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
        <div v-if="activeActivity === 'toolbox'">
          <div v-for="cat in store.categories" :key="cat.id" class="mb-4">
            <div class="font-semibold text-xs text-gray-500 uppercase mb-2 tracking-wider">
              {{ cat.categoryname ?? cat.label ?? cat.name }}
            </div>
            <div>
              <div
                v-for="cmp in compsByCategory(cat)"
                :key="cmp.componentname ?? cmp.code ?? cmp.name"
                draggable="true"
                @dragstart="dragStart($event, cmp)"
                class="p-2 bg-white border rounded mb-1 cursor-grab flex items-center gap-2 hover:border-blue-400 hover:shadow-sm transition-all text-sm"
              >
                <i :class="cmp.componentclass ?? cmp.icon" class="text-gray-600"></i>
                <span class="truncate">{{ cmp.componenttitle ?? cmp.label ?? cmp.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Parameters Content -->
        <div v-if="activeActivity === 'parameter'">
          <FlowParameter />
        </div>

        <!-- Properties Content -->
        <div v-if="activeActivity === 'property'">
          <PropertyForm
            v-if="store.selectedNode"
            :componentName="store.selectedNode.name"
            :nodeId="store.selectedNode.nodeid ?? store.selectedNode.id ?? store.selectedNode.data?.nodeid"
          />
          <div v-else class="text-gray-500 text-sm italic text-center mt-10">Select a node to edit properties</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useWorkflowStore } from '~/store/workflow';
import FlowParameter from './FlowParameter.vue';
import PropertyForm from './PropertyForm.vue';

const store = useWorkflowStore();
const activeActivity = ref('toolbox');
const isPanelOpen = ref(true);

const activities = [
  { id: 'toolbox', label: 'Toolbox', icon: 'heroicons:squares-2x2' },
  { id: 'parameter', label: 'Parameters', icon: 'heroicons:variable' },
  { id: 'property', label: 'Properties', icon: 'heroicons:cog-6-tooth' },
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

function compsByCategory(cat: any) {
  return store.components.filter((c) => {
    if (!c) return false;
    return c.categoryname === cat.categoryname;
  });
}

function dragStart(ev: DragEvent, cmp: any) {
  ev.dataTransfer?.setData('node', JSON.stringify(cmp));
}
</script>
