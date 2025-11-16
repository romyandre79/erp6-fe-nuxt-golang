<template>
  <div>
    <h3 class="font-semibold mb-3">Flow Parameters</h3>
    <button @click="add" class="px-3 py-1 bg-blue-500 text-white rounded mb-3">Add</button>
    <div v-for="(p, idx) in store.parameters" :key="p.wfparameterid ?? idx" class="flex gap-2 mb-2">
      <input v-model="p.parametername" class="border p-2 rounded flex-1" />
      <button @click="remove(p.wfparameterid)" class="text-red-500">X</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkflowStore } from '~/store/workflow'
const store = useWorkflowStore()

function add() { store.parameters.push({ wfparameterid: Date.now(), parametername: '' }) }
function remove(id: any) {
  // call backend removal if id exists in DB
  if (!id || typeof id !== 'number') {
    store.parameters = store.parameters.filter((p: any) => p.wfparameterid !== id)
    return
  }
  // try remove via store API if implemented
  // store.removeParameter(id)
}
</script>

<style>
/* basic helpers for drawflow layout */
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

/* ensure right panel sits above */
.w-80 {
  z-index: 20;
}

</style>
