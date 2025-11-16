<template>
  <div>
    <h3 class="font-semibold mb-3">Properties — {{ componentName }}</h3>
    <form @submit.prevent="save" class="space-y-3">
      <div v-for="(field, key) in properties" :key="key">
        <label class="block text-sm font-medium mb-1">{{ field.label ?? key }}</label>

        <input v-if="field.type === 'string' || field.type === 'text'" v-model="form[key]" class="border p-2 rounded w-full" />
        <textarea v-else-if="field.type === 'longtext'" v-model="form[key]" class="border p-2 rounded w-full" rows="4"></textarea>
        <select v-else-if="field.type === 'select'" v-model="form[key]" class="border p-2 rounded w-full">
          <option v-for="opt in (field.options || [])" :key="opt" :value="opt">{{ opt }}</option>
        </select>

        <div v-else>
          <input v-model="form[key]" class="border p-2 rounded w-full" />
        </div>
      </div>

      <div class="flex gap-2">
        <button type="submit" class="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
        <button type="button" @click="clear" class="px-3 py-1 bg-gray-200 rounded">Clear</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useWorkflowStore } from '~/store/workflow'

const props = defineProps<{ componentName: string }>()
const store = useWorkflowStore()

const properties = store.componentProperties
const form = reactive<Record<string, any>>({})

watch(() => props.componentName, async (name) => {
  if (!name) return
  await store.loadComponentProperties(name)
  // init form values from componentProperties
  Object.keys(store.componentProperties || {}).forEach((k) => {
    form[k] = store.componentProperties[k].default ?? ''
  })
})

function save() {
  // update currently selected node data and persist
  store.updateSelectedNodeData(form)
}

function clear() {
  Object.keys(form).forEach((k) => (form[k] = ''))
}
</script>
