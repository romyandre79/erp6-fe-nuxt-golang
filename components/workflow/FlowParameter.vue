<template>
  <div>
    <h3 class="font-semibold mb-3">Flow Parameters</h3>

    <button @click="add" class="px-3 py-1 bg-blue-500 text-white rounded mb-3">Add Parameter</button>

    <div v-for="(p, idx) in store.parameters" :key="p.wfparameterid ?? idx" class="flex items-center gap-2 mb-2">
      <!-- KEY -->
      <input v-model="p.parametername" placeholder="param name (e.g. search)" class="border p-2 rounded flex-1" />

      <!-- VALUE -->
      <input v-model="p.parametervalue" placeholder="value" class="border p-2 rounded flex-1" />

      <!-- TYPE SELECTOR -->
      <select v-model="p.parametertype" class="border p-2 rounded w-32" @change="autoFixType(p)">
        <option value="string">string</option>
        <option value="number">number</option>
        <option value="boolean">boolean</option>
        <option value="json">json</option>
      </select>

      <button @click="remove(p.wfparameterid)" class="text-red-500 font-bold hover:text-red-700">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkflowStore } from '~/store/workflow';

const store = useWorkflowStore();

/* ----------------------------------
   ADD NEW PARAMETER
---------------------------------- */
function add() {
  store.parameters.push({
    wfparameterid: '',
    parametername: '',
    parametervalue: '',
    parametertype: 'string',
  });
}

/* ----------------------------------
   REMOVE
---------------------------------- */
function remove(id: any) {
  store.parameters = store.parameters.filter((p: any) => p.wfparameterid !== id);
}

/* ----------------------------------
   AUTO FIX VALUE TYPE WHEN TYPE DROPDOWN CHANGES
---------------------------------- */
function autoFixType(param: any) {
  if (param.type === 'number') {
    param.value = Number(param.value) || 0;
  }
  if (param.type === 'boolean') {
    param.value = param.value === 'true' ? true : false;
  }
  if (param.type === 'json') {
    try {
      param.value = JSON.stringify(JSON.parse(param.value), null, 2);
    } catch {
      param.value = '{}';
    }
  }
}

</script>

<style>
#designer-root {
  position: relative;
  overflow: hidden;
  height: 100%;
}

#drawflow {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: #f5f7fa;
}

.w-80 {
  z-index: 20;
}
</style>
