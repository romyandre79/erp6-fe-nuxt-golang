<template>
  <div class="h-full flex flex-col bg-white text-gray-900 shadow-sm border-l">
    <div class="flex border-b">
      <button class="px-4 py-2" :class="tab === 'toolbox' ? 'bg-blue-500 text-white' : ''" @click="tab = 'toolbox'">
        Toolbox
      </button>
      <button class="px-4 py-2" :class="tab === 'parameter' ? 'bg-blue-500 text-white' : ''" @click="tab = 'parameter'">
        Flow Parameter
      </button>
      <button class="px-4 py-2" :class="tab === 'property' ? 'bg-blue-500 text-white' : ''" @click="tab = 'property'">
        Property
      </button>
    </div>

    <div class="flex-1 overflow-auto p-3">
      <div v-if="tab === 'toolbox'">
        <div v-for="cat in store.categories" :key="cat.id" class="mb-4">
          <div class="font-semibold text-sm text-gray-700 mb-2">{{ cat.categoryname ?? cat.label ?? cat.name }}</div>
          <div>
            <div
              v-for="cmp in compsByCategory(cat)"
              :key="cmp.componentname ?? cmp.code ?? cmp.name"
              draggable="true"
              @dragstart="dragStart($event, cmp)"
              class="p-2 border rounded mb-2 cursor-grab flex items-center gap-2"
            >
              <i :class="cmp.componentclass ?? cmp.icon"></i>
              <span class="text-sm">{{ cmp.componenttitle ?? cmp.label ?? cmp.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tab === 'parameter'">
        <FlowParameter />
      </div>

      <div v-if="tab === 'property'">
        <PropertyForm
          v-if="store.selectedNode"
          :componentName="store.selectedNode.name"
          :nodeId="store.selectedNode.nodeid ?? store.selectedNode.id ?? store.selectedNode.data?.nodeid"
        />
        <div v-else class="text-gray-500">Select a node to edit properties</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useWorkflowStore } from '~/store/workflow';
import FlowParameter from './FlowParameter.vue';
import PropertyForm from './PropertyForm.vue';

const tab = ref('toolbox');
const store = useWorkflowStore();

function compsByCategory(cat: any) {
  // backend may store category id or code; try multiple matches
  return store.components.filter((c) => {
    if (!c) return false;
    return c.categoryname === cat.categoryname;
  });
}

function dragStart(ev: DragEvent, cmp: any) {
  ev.dataTransfer?.setData('node', JSON.stringify(cmp));
}
</script>
