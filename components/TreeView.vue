<template>
  <ul class="text-sm select-none">
    <li v-for="node in nodes" :key="node.id" class="mb-1 pl-2 border-l border-gray-200">
      <div
        class="flex items-center gap-1 py-0.5 cursor-pointer rounded hover:bg-gray-50"
        :class="{
          'bg-blue-50 text-blue-700 font-semibold border-l-2 border-blue-500': selected?.id === node.id,
        }"
      >
        <!-- 🔹 Expand/Collapse toggle -->
        <button
          v-if="node.children && node.children.length"
          class="text-gray-500 hover:text-gray-700 transition w-4 h-4 flex items-center justify-center"
          @click.stop="toggleExpand(node)"
        >
          <span v-if="expanded[node.id]">▾</span>
          <span v-else>▸</span>
        </button>

        <!-- 🔹 Node icon -->
        <span class="text-gray-400 text-xs">
          {{ node.children && node.children.length ? '📁' : '🧩' }}
        </span>

        <!-- 🔹 Node label -->
        <span class="truncate" @click.stop="$emit('select', node)">
          {{ node.label || node.props?.label || node.type }}
        </span>
      </div>

      <!-- 🔹 Child nodes -->
      <transition name="fade">
        <TreeView
          v-if="node.children && node.children.length && expanded[node.id]"
          :nodes="node.children"
          :selected="selected"
          @select="$emit('select', $event)"
          class="ml-4 mt-1"
        />
      </transition>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  nodes: { type: Array, required: true },
  selected: { type: Object, default: null },
});
const emit = defineEmits(['select']);

// 🔹 Simpan state expand/collapse per node
const expanded = ref<Record<string, boolean>>({});

const toggleExpand = (node: any) => {
  expanded.value[node.id] = !expanded.value[node.id];
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>
