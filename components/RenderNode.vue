<template>
  <div
    :class="[
      'relative transition-all duration-150',
      preview ? '' : 'hover:border-blue-400 hover:shadow-sm',
    ]"
  >
    <!-- 🔹 Container node -->
    <div
      v-if="isContainer"
      class="border-2 border-dashed rounded p-3 mb-2 bg-white transition-colors duration-150"
      :class="isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click.stop="emitSelect"
    >
      <h4
        v-if="node.props?.label"
        class="text-gray-700 font-semibold text-sm mb-2 select-none"
      >
        {{ node.props.label }}
      </h4>

      <!-- 🔹 Anak-anak draggable -->
      <draggable
        v-model="node.children"
        group="components"
        item-key="id"
        :disabled="preview"
        class="space-y-2"
        ghost-class="draggable-ghost"
        chosen-class="hover-highlight"
      >
        <template #item="{ element }">
          <RenderNode
            :node="element"
            :preview="preview"
            @select="emit('select', $event)"
            @drop-child="emit('drop-child', $event[0], $event[1])"
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
      draggable="true"
    >
      <component
        :is="resolveComponent(node.type)"
        v-bind="node.props"
        :disabled="preview"
      >
        {{ node.props?.label }}
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
const emit = defineEmits(['select', 'drop-child'])

const isDragOver = ref(false)
const isContainer = computed(() => Array.isArray(props.node.children))

const emitSelect = () => emit('select', props.node)

// 🔹 Event handlers
const onDragEnter = () => (isDragOver.value = true)
const onDragLeave = () => (isDragOver.value = false)
const onDragOver = (e: DragEvent) => e.preventDefault()

const onDrop = (event: DragEvent) => {
  isDragOver.value = false
  const data = event.dataTransfer?.getData('component')
  if (!data) return
  try {
    const comp = JSON.parse(data)
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

// 🔹 Resolver komponen runtime
const resolveComponent = (type: string) => {
  switch (type) {
    case 'button': return 'button'
    case 'input':
    case 'number':
    case 'email': return 'input'
    case 'textarea': return 'textarea'
    default: return 'div'
  }
}
</script>

<style scoped>
.draggable-ghost {
  opacity: 0.4;
}
.hover-highlight {
  border: 2px dashed #3b82f6;
}
</style>
