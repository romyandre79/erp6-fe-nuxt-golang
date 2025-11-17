<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">{{ componentName ?? 'Properties' }}</h3>
    </div>

    <div v-if="fields.length === 0" class="text-sm text-gray-500">
      No properties available for this component.
    </div>

    <form v-else class="space-y-3" @submit.prevent>
      <template v-for="field in fields" :key="field.componentdetailid">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700">{{ field.lable ?? field.inputname }}</label>

          <!-- TEXTBOX -->
          <input
            v-if="isTextbox(field)"
            v-model="form[field.inputname]"
            :placeholder="field.inputdesc || ''"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            @input="onInput(field)"
          />

          <!-- TEXTAREA -->
          <textarea
            v-else-if="isTextarea(field)"
            v-model="form[field.inputname]"
            :placeholder="field.inputdesc || ''"
            rows="4"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            @input="onInput(field)"
          ></textarea>

          <!-- COMBOBOX / SELECT -->
          <select
            v-else-if="isCombo(field)"
            v-model="form[field.inputname]"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            @change="onInput(field)"
          >
            <option v-if="!hasOptions(field)" :value="''">-- select --</option>
            <option v-for="opt in getOptions(field)" :key="opt" :value="opt">{{ opt }}</option>
          </select>

          <!-- FALLBACK -->
          <input
            v-else
            v-model="form[field.inputname]"
            class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            @input="onInput(field)"
          />

          <p v-if="field.inputdesc" class="text-xs text-gray-400">{{ field.inputdesc }}</p>
        </div>
      </template>

    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import { useWorkflowStore } from '~/store/workflow'

// props
const props = defineProps({
  componentName: { type: String, required: false },
  nodeId: { type: [String, Number], required: false }
})

// store
const store = useWorkflowStore()

// local reactive form
const form = reactive<Record<string, any>>({})

// fields array (normalized from store.componentProperties or from store.loadComponentProperties result)
const fields = ref<any[]>([])

// debounce util (simple)
function debounce<T extends (...args: any[]) => void>(fn:T, wait = 500){
  let t:any = null
  return function(this: any, ...args: any[]){
    clearTimeout(t)
    t = setTimeout(()=> fn.apply(this, args), wait)
  }
}

// Helper: decide types
function isTextbox(f:any){ return (f.inputtype ?? '').toLowerCase() === 'textbox' }
function isTextarea(f:any){ return (f.inputtype ?? '').toLowerCase() === 'textarea' }
function isCombo(f:any){ return (f.inputtype ?? '').toLowerCase() === 'combobox' || (f.inputtype ?? '').toLowerCase() === 'select' }
function hasOptions(f:any){
  const ds = f.datasource
  return !!(ds && ds.length)
}

// parse datasource into options (for List type -> comma separated)
function getOptions(f:any): string[] {
  if (!f) return []
  // If datasource is a comma-separated list
  if (f.datasourcetype && f.datasourcetype.toLowerCase() === 'list' && f.datasource) {
    return f.datasource.split(',').map((s:string) => s.trim())
  }
  // If datasource is a preloaded array (not in your current response) handle elsewhere
  if (Array.isArray(f.datasource)) return f.datasource
  // fallback: empty
  return []
}

// Initialize form from fields (use componentvalue or node.data if exists)
function initFormFromFields() {
  fields.value.sort((a:any,b:any) => (Number(a.order)||0) - (Number(b.order)||0))

  // ambil node data dari editor
  let nodeData = {}
  const editor = (window as any).editor
  if (editor) {
    const home = editor.drawflow?.drawflow?.Home?.data
    const node = store.selectedNode
    if (home && node) {
      const nodeKey = Object.keys(home).find(k => Number(home[k].id) === Number(node.id))
      if (nodeKey && home[nodeKey]?.data) {
        nodeData = home[nodeKey].data
      }
    }
  }

  // isi form
  fields.value.forEach((f:any) => {
    const key = f.inputname
    if (nodeData && Object.prototype.hasOwnProperty.call(nodeData, key)) {
      form[key] = nodeData[key]
    } else {
      form[key] = f.componentvalue ?? ''
    }
  })
}


// UPDATE selected node data (debounced)
const updateNodeDataDebounced = debounce(() => {
  // push only keys that exist in form
  const payload:any = {}
  fields.value.forEach((f:any) => {
    payload[f.inputname] = form[f.inputname]
  })
  // update store (this will update editor node data and persist)
  store.updateSelectedNodeData(payload)
}, 500)

// event handlers
function onInput(field:any){
  // live update (debounced)
  updateNodeDataDebounced()
}

/* =====================================================
   WATCHERS: when componentName changes -> load properties
   and when store.selectedNode changes -> reinit
   ===================================================== */

watch([() => props.componentName, () => props.nodeId], async ([name, nodeId]) => {
  if (!name) {
    fields.value = []
    Object.keys(form).forEach(k => delete form[k])
    return
  }

  // load properties dari store
  const merged = await store.loadComponentProperties(name, nodeId)

  // gunakan hasil merge langsung
  fields.value = merged
  initFormFromFields()
}, { immediate: true })



/* Also watch store.selectedNode: if user selects different node, re-init form from node.data */
watch(() => store.selectedNode, (node) => {
  // If selectedNode has its own data map, prefer it
  if (!node) return
  // If currently showing properties for a different component name, skip (componentName prop usually updated by parent)
  // But still reinit values if fields loaded
  initFormFromFields()
}, { deep: true })

</script>

<style scoped>
/* small nicety */
label { display: block; }
</style>
