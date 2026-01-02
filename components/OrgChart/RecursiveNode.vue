<template>
  <div class="flex flex-col items-center">
    
    <!-- The Node Itself -->
    <OrgNode 
        :node="node" 
        :config="config"
        :is-root="level === 0"
        :has-children="hasChildren"
        :data-node-id="node[config.nodeKey] || node.id"
        :data-parent-id="node[config.parentKey] || node.parent_id"
        @click="$emit('node-click', $event)"
        @add="$emit('node-add', $event)"
        @edit="$emit('node-edit', $event)"
        @node-delete="$emit('node-delete', $event)"
        @node-dragstart="$emit('node-dragstart', $event)"
        @node-drop="$emit('node-drop', $event)"
        @node-reorder="$emit('node-reorder', $event)"
    />

    <!-- Children Container -->
    <div v-if="hasChildren" class="flex flex-row gap-8 mt-12 relative">
      <!-- We don't draw lines here anymore, handled by parent SVG -->
      <RecursiveNode 
        v-for="child in node.children" 
        :key="child[config.nodeKey] || child.id"
        :node="child"
        :config="config"
        :level="level + 1"
         @node-click="$emit('node-click', $event)"
         @node-add="$emit('node-add', $event)"
         @node-edit="$emit('node-edit', $event)"
         @node-delete="$emit('node-delete', $event)"
         @node-dragstart="$emit('node-dragstart', $event)"
         @node-drop="$emit('node-drop', $event)"
         @node-reorder="$emit('node-reorder', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import OrgNode from './OrgNode.vue';

const props = defineProps({
  node: { type: Object, required: true },
  config: { type: Object, default: () => ({}) },
  level: { type: Number, default: 0 }
});

const emit = defineEmits([
    'node-click', 'node-add', 'node-edit', 'node-delete', 
    'node-dragstart', 'node-drop', 'node-reorder'
]);

const hasChildren = computed(() => props.node.children && props.node.children.length > 0);

</script>
