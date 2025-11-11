<template>
  <div
    :class="[
      'relative group transition-all duration-150',
      preview ? '' : 'hover:border-blue-400 hover:shadow-sm',
    ]"
  >
    <!-- ❌ Tombol Delete -->
    <button
      v-if="!preview"
      class="absolute top-1 right-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-10"
      @click.stop="confirmDelete"
    >
      ✖
    </button>

    <!-- 🔹 Container node -->
    <div
      v-if="isContainer"
      class="relative border-2 border-dashed rounded p-3 mb-2 bg-white transition-colors duration-150"
      :class="isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click.stop="emitSelect"
    >
      <h4
        v-if="node.label"
        class="text-gray-700 font-semibold text-sm mb-2 select-none dark:text-black"
      >
        {{ node.type + ': '+ node.label }}
      </h4>

      <!-- 🔹 Anak-anak draggable -->
      <draggable
        v-model="node.children"
        group="components"
        item-key="id"
        :disabled="preview"
        class="space-y-2 min-h-[50px]"
        ghost-class="draggable-ghost"
        chosen-class="hover-highlight"
        @change="onChildChange"
        @add="onAdd"
      >
        <template #item="{ element }">
          <RenderNode
            :node="element"
            :preview="preview"
            @select="emit('select', $event)"
            @drop-child="emit('drop-child', $event[0], $event[1])"
            @delete="emit('delete', $event)"
          />
        </template>

        <!-- 🔹 Jika kosong -->
        <template #footer>
          <div
            v-if="!node.children || node.children.length === 0"
            class="text-xs text-gray-400 text-center italic py-2"
          >
            Drop components here
          </div>
        </template>
      </draggable>
    </div>

    <!-- 🔹 Leaf node -->
    <div
      v-else
      class="p-2 border rounded bg-white cursor-pointer hover:border-blue-400"
      @click.stop="emitSelect"
      draggable="false"
    >
      <component
    :is="resolveComponent(node.type)"
    v-bind="getComponentProps(node)"
    :disabled="preview"
  >
    {{ node.props?.text }}
  </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable'
import { ref, computed } from 'vue'

const props = defineProps({
  node: { type: Object, required: true },
  preview: { type: Boolean, default: false }
})
const emit = defineEmits(['select', 'drop-child', 'delete'])

const isDragOver = ref(false)
const containerTypes = ['buttons', 'modals', 'form', 'master', 'tables', 'columns' ,'search', 'modal']
const isContainer = computed(() =>
  Array.isArray(props.node.children) && containerTypes.includes(props.node.type)
)
const emitSelect = () => emit('select', props.node)

// 🔹 Drag events
const onDragEnter = () => (isDragOver.value = true)
const onDragLeave = () => (isDragOver.value = false)
const onDragOver = (e: DragEvent) => e.preventDefault()

// 🔹 Drop handler dengan filter tipe
const onDrop = (event: DragEvent) => {
   event.stopPropagation() 
  isDragOver.value = false
  const data = event.dataTransfer?.getData('component')
  if (!data) return

  try {
    const comp = JSON.parse(data)

    // 🧩 Validasi jenis komponen berdasarkan container
    const containerType = props.node.type
    const componentType = comp.type

    // ✅ Komponen valid → tambahkan
    const newComp = {
      id: Math.random().toString(36).substr(2, 9),
      ...comp,
      children: comp.children || []
    }
    emit('drop-child', props.node.id, newComp)
  } catch (err) {
    console.error('Invalid drop data', err) 
  }
}

const isHover = ref(false)

const onAdd = (event: any) => {
  const containerType = props.node.type
  const item = event.item.__vue__?.element || event.clone?.__vue__?.element || event.item.__vue__ || {}
  const componentType = item?.type || event?.item?.dataset?.type

  // 🧩 Validasi tipe komponen
  const allowedTypes: Record<string, string[]> = {
    buttons: ['button'],
    modals: ['title','text', 'longtext', 'number', 'email', 'button'],
    master: ['title','button','text', 'longtext', 'number', 'email'],
    columns: ['column'],
    search:['text', 'longtext', 'number', 'email', 'button'],
    table: ['column']
  }

  if (allowedTypes[containerType] && !allowedTypes[containerType].includes(componentType)) {
    alert(`❌ '${componentType}' tidak dapat ditambahkan ke '${containerType}' container.`)

    // 🧹 Hapus item yang baru ditambahkan (batalkan drop)
    props.node.children.splice(event.newIndex, 1)
    return
  }

  // ✅ Jika valid, biarkan tetap
}

// 🔹 Delete confirmation
const confirmDelete = () => emit('delete', props.node)

const onChildChange = () => emit('select', props.node)

// 🔹 Component resolver
const resolveComponent = (type: string) => {
  switch (type) {
    case 'button':
      return 'button'
    case 'input':
    case 'number':
    case 'email':
    case 'text':
      return 'input'
    case 'longtext':
      return 'textarea'
    default:
      return 'div'
  }
}

const getComponentProps = (node: any) => {
  const base = node.props || {}
  if (node.type == 'button'){
  console.log(node.props)
  }
  switch (node.type) {
    case 'shorttext':
    case 'text':
      return { ...base, type: 'text', placeholder: base.place || 'Enter text...' }

    case 'number':
      return { ...base,placeholder: base.place || 'Enter number...' }

    case 'email':
      return { ...base, placeholder: base.place || 'Enter email...' }

    case 'longtext':
      return { ...base, rows: 3, placeholder: base.place || 'Enter long text...' }

    case 'button':
      const { label, ...rest } = base
      return { ...rest, type: 'button' }

    case 'title':
      return { ...base }

    default:
      return base
  }
}
</script>

