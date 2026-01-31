<template>
  <div class="select-none">
    <!-- Empty State -->
    <div v-if="!nodes || nodes.length === 0" class="text-center py-8">
      <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
        <UIcon name="heroicons:rectangle-stack" class="w-6 h-6 text-gray-400" />
      </div>
      <p class="text-sm text-gray-500 dark:text-gray-400">No blocks yet</p>
      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Drag blocks to the canvas</p>
    </div>

    <!-- Tree Structure -->
    <ul v-else class="space-y-0.5">
      <li v-for="(node, index) in nodes" :key="node.id">
        <div
          class="group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-all"
          :class="getNodeClasses(node)"
          @click.stop="$emit('select', node)"
        >
          <!-- Expand/Collapse Arrow -->
          <button
            v-if="hasChildren(node)"
            class="w-5 h-5 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click.stop="toggleExpand(node)"
          >
            <UIcon 
              :name="expanded[node.id] ? 'heroicons:chevron-down' : 'heroicons:chevron-right'" 
              class="w-3.5 h-3.5 text-gray-400"
            />
          </button>
          <div v-else class="w-5"></div>

          <!-- Component Type Icon -->
          <div 
            class="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            :style="{ backgroundColor: getTypeColor(node.type) + '20' }"
          >
            <UIcon 
              :name="getTypeIcon(node.type)" 
              class="w-3.5 h-3.5"
              :style="{ color: getTypeColor(node.type) }"
            />
          </div>

          <!-- Node Label -->
          <span class="flex-1 truncate text-sm">
            {{ getNodeLabel(node) }}
          </span>

          <!-- Type Badge -->
          <span 
            class="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {{ node.type }}
          </span>

          <!-- Children Count -->
          <span 
            v-if="hasChildren(node)" 
            class="text-[10px] px-1.5 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
          >
            {{ node.children.length }}
          </span>
        </div>

        <!-- Children -->
        <transition name="slide">
          <div
            v-if="hasChildren(node) && expanded[node.id]"
            class="ml-4 pl-2 border-l-2 border-gray-200 dark:border-gray-700 mt-0.5"
          >
            <TreeView
              :nodes="node.children"
              :selected="selected"
              :depth="depth + 1"
              @select="$emit('select', $event)"
            />
          </div>
        </transition>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { availableComponents, layoutContainers } from '~/types/components';

interface NodeSchema {
  id: string;
  type: string;
  label?: string;
  props?: Record<string, any>;
  children?: NodeSchema[];
}

const props = defineProps<{
  nodes: NodeSchema[];
  selected?: NodeSchema | null;
  depth?: number;
}>();

defineEmits(['select']);

const expanded = ref<Record<string, boolean>>({});

// Auto-expand first level on mount
onMounted(() => {
  if (props.depth === undefined || props.depth === 0) {
    props.nodes.forEach(node => {
      if (hasChildren(node)) {
        expanded.value[node.id] = true;
      }
    });
  }
});

function hasChildren(node: NodeSchema): boolean {
  return !!(node.children && node.children.length > 0);
}

function toggleExpand(node: NodeSchema) {
  expanded.value[node.id] = !expanded.value[node.id];
}

function getNodeLabel(node: NodeSchema): string {
  return node.label || node.props?.text || node.props?.label || node.type;
}

function getNodeClasses(node: NodeSchema) {
  const isSelected = props.selected?.id === node.id;
  return {
    'bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500/50': isSelected,
    'hover:bg-gray-50 dark:hover:bg-gray-800': !isSelected,
    'text-blue-700 dark:text-blue-300 font-medium': isSelected,
    'text-gray-700 dark:text-gray-200': !isSelected,
  };
}

function getTypeIcon(type: string): string {
  const comp = availableComponents.find(c => c.type === type) || 
               layoutContainers.find(c => c.type === type);
  return comp?.icon || 'heroicons:cube';
}

function getTypeColor(type: string): string {
  const colorMap: Record<string, string> = {
    // Layout
    row: '#8b5cf6', col: '#8b5cf6', columns: '#8b5cf6', form: '#8b5cf6',
    master: '#8b5cf6', widget: '#8b5cf6', wizard: '#8b5cf6', step: '#8b5cf6',
    // Text  
    text: '#3b82f6', longtext: '#3b82f6', html: '#3b82f6', 
    title: '#3b82f6', subtitle: '#3b82f6', label: '#3b82f6',
    // Input
    shorttext: '#10b981', number: '#10b981', email: '#10b981',
    password: '#10b981', tel: '#10b981', url: '#10b981', hidden: '#10b981',
    // Selection
    select: '#f59e0b', selectgroup: '#f59e0b', bool: '#f59e0b', 
    radio: '#f59e0b', megabox: '#f59e0b',
    // Date
    date: '#ef4444', datetime: '#ef4444', time: '#ef4444', month: '#ef4444',
    // Media
    file: '#ec4899', image: '#ec4899', color: '#ec4899',
    // Containers
    tabs: '#6366f1', tab: '#6366f1', cards: '#6366f1', card: '#6366f1',
    buttons: '#6366f1', modals: '#6366f1', modal: '#6366f1', search: '#6366f1',
    // Data
    table: '#0ea5e9', tables: '#0ea5e9', detailtable: '#0ea5e9',
    chart: '#0ea5e9', charts: '#0ea5e9', kanban: '#0ea5e9',
    // Actions
    button: '#14b8a6', action: '#14b8a6', callother: '#14b8a6',
  };
  return colorMap[type] || '#6b7280';
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease-out;
  overflow: hidden;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
}
</style>
