<template>
  <div
    :class="[
      'relative group group/container transition-all duration-150',
      preview ? '' : 'hover:border-blue-400 hover:shadow-sm',
      node.props?.class,
    ]"
  >
    <!-- ❌ Tombol Delete -->
    <button
      v-if="!preview"
      class="absolute top-1 right-1 text-xs bg-red-500 cursor-pointer text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition z-10"
      @click.stop="confirmDelete"
    >
      ✖
    </button>

    <!-- 🔹 Container node -->
    <component
      :is="resolveComponent(node.type)"
      v-if="isContainer"
      class="w-full h-full col-span-full relative border border-transparent min-h-[50px] p-3 rounded transition-all duration-150 group-hover/container:border-gray-200 hover:!border-blue-300 hover:bg-blue-50/10"
      :class="[
        isDragOver ? 'border-blue-400 bg-blue-50' : '',
        node.type === 'search' ? '!border-dashed !border-green-200 bg-green-50/20' : '',
        node.type === 'columns' ? '!border-dashed !border-purple-200 bg-purple-50/20' : '',
      ]"
      @dragover.prevent="onDragOver"
      @dragenter.prevent="onDragEnter"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click.stop="emitSelect"
    >
      <h4
        v-if="node.label"
        class="text-xs text-gray-400 mb-1 select-none hidden group-hover/container:block absolute -top-5 left-0 bg-gray-100 px-1 rounded"
      >
        {{ node.type }}
      </h4>

      <!-- 🔹 Anak-anak draggable -->
      <draggable
        v-model="node.children"
        group="components"
        item-key="id"
        :disabled="preview"
        :class="node.props?.class || 'space-y-2'"
        ghost-class="draggable-ghost"
        chosen-class="hover-highlight"
        @change="onChildChange"
      >
        <template #item="{ element }">
          <RenderNode
            :node="element"
            :preview="preview"
            @select="emit('select', $event)"
            @drop-child="emit('drop-child', $event)"
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
    </component>

    <!-- 🔹 Leaf node -->
    <div
      v-else
      class="p-2 border roundedcursor-pointer hover:border-blue-400"
      @click.stop="emitSelect"
      draggable="false"
    >
      <label
        v-if="!['button', 'label', 'title', 'subtitle'].includes(node.type) && node.props?.text"
        class="block text-xs font-bold text-gray-500 mb-1"
      >
        {{ node.props.text }}
      </label>
      <component :is="resolveComponent(node.type)" v-bind="getComponentProps(node)" :disabled="preview">
        {{ node.type + ':' + (node.props?.text || node.label) }}
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { ref, computed } from 'vue';
import { UButton } from '#components';
import { useToast } from '#imports';
import { layoutContainers, availableComponents } from '~/types/components';

const props = defineProps({
  node: { type: Object, required: true },
  preview: { type: Boolean, default: false },
  showJson: { type: Boolean, default: false },
});
const emit = defineEmits(['select', 'drop-child', 'delete']);

const isDragOver = ref(false);
const containerTypes = layoutContainers.map((c) => c.type);

const isContainer = computed(() => {
  if (!props.node.children) props.node.children = [];
  return containerTypes.includes(props.node.type);
});
const emitSelect = () => emit('select', props.node);

const toast = useToast();

// 🔹 Drag events
const onDragEnter = () => (isDragOver.value = true);
const onDragLeave = () => (isDragOver.value = false);
const onDragOver = (e: DragEvent) => e.preventDefault();

// 🔹 Drop handler dengan filter tipe
const onDrop = (event: DragEvent) => {
  event.stopPropagation();

  isDragOver.value = false;
  const data = event.dataTransfer?.getData('component');
  if (!data) return;

  try {
    const comp = JSON.parse(data);

    // ✅ Komponen valid → tambahkan
    const hydrateIds = (node: any) => {
      return {
        ...node,
        id: Math.random().toString(36).substr(2, 9),
        children: node.children ? node.children.map(hydrateIds) : [],
      };
    };

    const newComp = hydrateIds(comp);

    emit('drop-child', [props.node.id, newComp]);
  } catch (err) {
    console.error('Invalid drop data', err);
  }
};

// 🔹 Delete confirmation
const confirmDelete = () => emit('delete', props.node);

const onChildChange = () => emit('select', props.node);

const componentMap: Record<string, any> = {};
[...availableComponents, ...layoutContainers].forEach((item) => {
  // Jika component berupa string → native element
  // Jika berupa komponen Vue → #components otomatis resolve
  componentMap[item.type] = item.component;
});
const resolveComponent = (type: string) => {
  return componentMap[type] || 'div';
};

const getComponentProps = (node: any) => {
  const base = node.props || {};
  switch (node.type) {
    case 'shorttext':
    case 'number':
    case 'hidden':
    case 'password':
    case 'email':
    case 'text':
      return {
        ...base,
        type: 'text',
        disabled: true,
        placeholder: base.key || 'Enter text...',
        class: (base.class || '') + ' w-full border border-gray-300 rounded px-2 py-1 text-sm',
      };

    case 'longtext':
      return {
        ...base,
        rows: 3,
        placeholder: base.key || 'Enter long text...',
        class: (base.class || '') + ' w-full border border-gray-300 rounded px-2 py-1 text-sm',
      };

    case 'select':
    case 'combobox':
      return {
        ...base,
        placeholder: 'Select option...',
        class: (base.class || '') + ' w-full border border-gray-300 rounded px-2 py-1 text-sm bg-white',
      };

    case 'button':
      const { label, ...rest } = base;
      return { ...rest, type: 'button' };

    case 'title':
      return { ...base };

    case 'boolean':
    case 'bool':
      return { ...base, type: 'checkbox' };

    default:
      return { ...base, class: 'panel' };
  }
};
</script>
