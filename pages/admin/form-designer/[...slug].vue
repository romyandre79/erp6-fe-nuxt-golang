<template>
  <div class="flex h-screen overflow-hidden bg-gray-100">
    <!-- 🔹 Sidebar kiri -->
    <aside class="w-1/5 bg-white border-r p-3 overflow-y-auto dark:bg-black">
      <h2 class="font-bold text-lg mb-3">Elements</h2>

      <!-- Komponen dasar -->
      <div
        v-for="(comp, idx) in availableComponents"
        :key="idx"
        class="border rounded p-2 mb-2 cursor-move hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black"
        draggable="true"
        @dragstart="onDragStart(comp)"
      >
        {{ comp.label }}
      </div>

      <!-- Kontainer layout -->
      <h3 class="font-bold text-lg mb-3">Containers</h3>
      <div
        v-for="(group, idx) in layoutContainers"
        :key="'grp-'+idx"
        class="border rounded p-2 mb-2 cursor-move hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black"
        draggable="true"
        @dragstart="onDragStart(group)"
      >
        {{ group.label }}
      </div>

      <div class="mt-5">
        <button class="bg-green-600 text-white w-full py-1 rounded" @click="saveSchema">
          💾 Save Schema
        </button>
        <button class="bg-blue-600 text-white w-full py-1 rounded mt-2" @click="loadSchema">
          📂 Load Schema
        </button>
        <button class="bg-gray-700 text-white w-full py-1 rounded mt-2" @click="togglePreview">
          {{ previewMode ? '🧱 Edit Mode' : '👁 Preview' }}
        </button>
      </div>
    </aside>

    <!-- 🔹 Canvas Tengah -->
    <main class="flex-1 p-5 overflow-auto w-full bg-white dark:bg-black">
      <div v-if="previewMode" class="flex items-center justify-between sticky top-0 z-50 px-6 py-3 transition-colors duration-300 backdrop-blur-md">
        <FormRender  v-if="formSchema" :schema="formSchema" :menuName="menuName" :formType="formType" :title="formTitle"/>

      </div>
      <div v-if="!previewMode"
        class="min-h-[80vh] rounded-xl shadow-inner p-6"
        @dragover.prevent
        @drop="onDropRoot"
      >
        <div v-if="!canvasComponents.length" class="text-gray-400 text-center py-20">
          Drag components or containers here
        </div>

<draggable
  v-model="canvasComponents"
  group="components"
  item-key="id"
  class="space-y-3"
>
  <template #item="{ element }">
    <div
      class="border rounded p-3 bg-gray-50 hover:border-blue-500 cursor-pointer relative group"
      :class="{ 'border-blue-600': selected?.id === element.id }"
      @click.stop="selectComponent(element)"
    >
      <RenderNode
        :node="element"
        :preview="previewMode"
        :selected="selected"
        @select="selectComponent"
        @drop-child="onDropChild"
        @delete="deleteNode"
      />
    </div>
  </template>
</draggable>
      </div>
    </main>

    <!-- 🔹 Tree View + Property Panel -->
    <aside class="w-1/4 bg-white border-l p-4 overflow-y-auto dark:bg-black">
      <h3 class="font-semibold mb-3">Form Structure</h3>
      <TreeView :nodes="canvasComponents" :selected="selected" @select="selectComponent" />

      <hr class="my-4" />

      <div v-if="selected && !previewMode">
        <h3 class="font-semibold mb-3">Properties</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium">Label</label>
            <input
              v-model="selected.props.label"
              type="text"
              class="border rounded w-full p-1"
            />
          </div>
          <div v-if="selected.props.placeholder !== undefined">
            <label class="block text-sm font-medium">Placeholder</label>
            <input
              v-model="selected.props.placeholder"
              type="text"
              class="border rounded w-full p-1"
            />
          </div>
          <div v-if="selected.props.required !== undefined">
            <label class="block text-sm font-medium">Required</label>
            <input type="checkbox" v-model="selected.props.required" class="mr-2" /> Required
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import draggable from 'vuedraggable'
import RenderNode from '~/components/RenderNode.vue'
import TreeView from '~/components/TreeView.vue'
const route = useRoute()
const toast = useToast()

interface NodeSchema {
  id: string
  type: string
  label: string
  props: Record<string, any>
  children?: NodeSchema[]
}

const availableComponents = [
  { type: 'button', label: 'Button', props: { label: 'Button', placeholder: 'Button', required: false } },
  { type: 'shorttext', label: 'Short Text', props: { label: 'Short Text', placeholder: 'Enter text', required: false } },
  { type: 'longtext', label: 'Long Text', props: { label: 'Long Text', placeholder: 'Enter long text', required: false } },
  { type: 'number', label: 'Number', props: { label: 'Number', placeholder: '0', required: false } },
  { type: 'email', label: 'Email', props: { label: 'Email', placeholder: 'example@mail.com', required: false } }
]

const layoutContainers = [
  { type: 'buttons', label: 'Buttons', props: { label: 'Buttons' }, children: [] },
  { type: 'tables', label: 'Tables', props: { label: 'Tables' }, children: [] },
  { type: 'modals', label: 'Modals', props: { label: 'Modals' }, children: [] },
  { type: 'action', label: 'Action', props: { label: 'Actions' }, children: [] },
]

const canvasComponents = ref<NodeSchema[]>([])
const selected = ref<NodeSchema | null>(null)
const formSchema = ref<Record<string, any> | null>(null)
const previewMode = ref(false)
const { getMenuForm } = useAuth()

const onDragStart = (comp: any) => {
  event?.dataTransfer?.setData('component', JSON.stringify(comp))
  window.draggingComponent = comp // ✅ simpan global
}

const onDropRoot = (event: DragEvent) => {
  const data = event.dataTransfer?.getData('component')
  if (!data) return
  const comp = JSON.parse(data)
  const newComp: NodeSchema = {
    id: Math.random().toString(36).substr(2, 9),
    ...comp
  }
  canvasComponents.value.push(newComp)
  window.draggingComponent = null // ✅ reset
}

const onDropChild = (parentId: string, comp: NodeSchema) => {
  const findNode = (nodes: NodeSchema[]): NodeSchema | null => {
    for (const node of nodes) {
      if (node.id === parentId) return node
      if (node.children) {
        const child = findNode(node.children)
        if (child) return child
      }
    }
    return null
  }

  const parent = findNode(canvasComponents.value)
  if (parent) {
    if (!parent.children) parent.children = []
    parent.children.push(comp)
  }
}

const deleteNode = (target: NodeSchema) => {
  if (!confirm(`Are you sure you want to delete "${target.label}"?`)) return

  const removeFrom = (nodes: NodeSchema[]): boolean => {
    const index = nodes.findIndex((n) => n.id === target.id)
    if (index !== -1) {
      nodes.splice(index, 1)
      return true
    }
    for (const node of nodes) {
      if (node.children && removeFrom(node.children)) return true
    }
    return false
  }

  removeFrom(canvasComponents.value)
  selected.value = null
}

const selectComponent = (node: NodeSchema) => {
  selected.value = node
}

const togglePreview = () => {
  previewMode.value = !previewMode.value
  selected.value = null
}

const saveSchema = () => {
  localStorage.setItem(route.params.slug, JSON.stringify(canvasComponents.value))
  toast.add({ title: 'Success', description: 'Schema already saved' })
}

const loadSchema = () => {
  const saved = localStorage.getItem('form'+route.params.slug)
  if (saved) {
    canvasComponents.value = JSON.parse(saved)
    alert('Schema loaded!')
  } else {
    alert('No schema found.')
  }
}

onMounted(async() => {
  try {
    const res = await getMenuForm(route.params.slug)
    if (res?.code == 200 && res?.data.menuform != '') {
      formSchema.value = res?.data?.menuform
      localStorage.setItem('form'+route.params.slug, res.data.menuform)
      loadSchema()
    } else {
      console.error('Invalid response from ', res)
    }
  } catch (err) {
    console.error('Error loading user info:', err)
  }
})
</script>
