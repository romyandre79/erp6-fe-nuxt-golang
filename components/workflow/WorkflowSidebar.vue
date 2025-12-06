<template>
  <div class="h-full flex flex-row bg-white text-gray-900 shadow-sm border-r">
    <!-- Activity Bar -->
    <div class="panel w-14 flex flex-col items-center py-2  border-r border-gray-700 z-20">
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
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="cmp in compsByCategory(cat)"
                :key="cmp.componentname ?? cmp.code ?? cmp.name"
                draggable="true"
                @dragstart="dragStart($event, cmp)"
                class="toolbox-node cursor-grab hover:scale-105 transition-all"
              >
                <div class="node-icon-wrapper">
                  <div class="node-icon">
                    <i :class="cmp.componentclass ?? cmp.icon ?? 'fa-solid fa-cube'"></i>
                  </div>
                  <div class="node-label">{{ cmp.componenttitle ?? cmp.label ?? cmp.name }}</div>
                </div>
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

<style scoped>
.toolbox-node .node-icon-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
}

.toolbox-node .node-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
  transition: all 0.2s ease;
}

.toolbox-node .node-icon i {
  font-size: 20px;
  color: #fff !important;
}

.toolbox-node .node-label {
  font-size: 11px;
  font-weight: 500;
  color: #374151;
  text-align: center;
  max-width: 70px;
  line-height: 1.2;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.toolbox-node:hover .node-icon {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(6, 182, 212, 0.4);
}
</style>
