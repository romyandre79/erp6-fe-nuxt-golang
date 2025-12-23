<template>
  <div
    class="org-node relative flex flex-col items-center group width-[240px]"
    :class="{ 'opacity-50': isDragging }"
    @click.stop="$emit('click', node)"
    draggable="true"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
    @dragover.prevent
    @drop="onDrop"
  >
    <!-- Connector Point Top -->
    <div v-if="!isRoot" class="w-2 h-2 bg-gray-400 rounded-full absolute -top-3 left-1/2 transform -translate-x-1/2"></div>

    <!-- Node Card -->
    <div
      class="w-64 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200 overflow-hidden relative"
      :class="{ 'ring-2 ring-primary-500': isSelected, 'bg-gray-50': isDragOver }"
    >
      <!-- Header / Color Strip -->
      <div class="h-2 w-full" :class="statusColorClass"></div>

      <div class="p-3">
        <!-- Title & Subtitle -->
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="text-sm font-bold text-gray-900 truncate" :title="node[config.labelKey]">
              {{ node[config.labelKey] || 'Untitled' }}
            </h3>
            <p class="text-xs text-gray-500 truncate" :title="node[config.titleKey]">
              {{ node[config.titleKey] || 'No Title' }}
            </p>
          </div>
          
          <!-- Avatar -->
           <div v-if="node[config.imageKey]" class="flex-shrink-0 ml-2">
            <img :src="node[config.imageKey]" alt="" class="w-8 h-8 rounded-full bg-gray-100 object-cover" />
          </div>
           <div v-else class="flex-shrink-0 ml-2">
            <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
               <span class="text-xs">IMG</span>
            </div>
          </div>
        </div>

        <!-- Employees / Details Section -->
        <div v-if="employees.length > 0" class="mt-3 pt-2 border-t border-gray-100">
            <p class="text-[10px] uppercase font-semibold text-gray-400 mb-1">Members</p>
            <div class="flex -space-x-1 overflow-hidden">
                <template v-for="(emp, i) in employees.slice(0, 4)" :key="i">
                     <img 
                        v-if="emp.avatar"
                        :src="emp.avatar" 
                        class="inline-block h-6 w-6 rounded-full ring-2 ring-white" 
                        :title="emp.name"
                    />
                    <div v-else class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-[10px]">
                        {{ (emp.name || '?').charAt(0) }}
                    </div>
                </template>
                <div v-if="employees.length > 4" class="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[10px] text-gray-500 font-medium">
                    +{{ employees.length - 4 }}
                </div>
            </div>
        </div>
      </div>

      <!-- Action Toolbar (Visible on Hover) -->
      <div class="absolute bottom-1 right-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex gap-1">
         <button 
            class="p-1 rounded bg-white shadow text-gray-500 hover:text-green-600 hover:bg-green-50"
            @click.stop="$emit('add', node)"
            title="Add Child"
         >
             <UIcon name="i-heroicons-plus-circle" class="w-4 h-4" />
         </button>
          <button 
            class="p-1 rounded bg-white shadow text-gray-500 hover:text-blue-600 hover:bg-blue-50"
            @click.stop="$emit('edit', node)"
            title="Edit Details"
         >
             <UIcon name="i-heroicons-pencil-square" class="w-4 h-4" />
         </button>
         <button 
            class="p-1 rounded bg-white shadow text-gray-500 hover:text-red-600 hover:bg-red-50"
            @click.stop="$emit('delete', node)"
            title="Delete Node"
         >
             <UIcon name="i-heroicons-trash" class="w-4 h-4" />
         </button>
      </div>
    </div>

    <!-- Connector Point Bottom -->
    <div v-if="hasChildren" class="w-2 h-2 bg-gray-400 rounded-full absolute -bottom-3 left-1/2 transform -translate-x-1/2"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  node: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    default: () => ({
      labelKey: 'name',
      titleKey: 'title',
      imageKey: 'avatar',
    }),
  },
  isRoot: {
    type: Boolean,
    default: false,
  },
  hasChildren: {
    type: Boolean,
    default: false,
  },
  isSelected: {
      type: Boolean,
      default: false
  }
});

const emit = defineEmits(['click', 'add', 'edit', 'delete', 'dragstart', 'drop']);

const isDragging = ref(false);
const isDragOver = ref(false);

const employees = computed(() => {
    return props.node.employees || props.node.members || [];
});

const statusColorClass = computed(() => {
    // Determine color based on some status field if available, otherwise default
    const status = props.node.status?.toLowerCase();
    switch (status) {
        case 'active': return 'bg-green-500';
        case 'vacant': return 'bg-yellow-500';
        case 'inactive': return 'bg-red-500';
        default: return 'bg-blue-500';
    }
});

function onDragStart(event: DragEvent) {
  isDragging.value = true;
  if(event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', JSON.stringify(props.node));
      emit('dragstart', props.node);
  }
}

function onDragEnd() {
  isDragging.value = false;
}

function onDrop(event: DragEvent) {
    isDragOver.value = false;
    const data = event.dataTransfer?.getData('text/plain');
    if(data) {
        try {
            const droppedNode = JSON.parse(data);
             // Prevent dropping on itself
            if(droppedNode.id !== props.node.id) {
                 emit('drop', { target: props.node, source: droppedNode });
            }
        } catch(e) { console.error('Drop error', e)}
    }
}

</script>

<style scoped>
.org-node {
    /* Ensure z-index is higher than connections */
    z-index: 10;
}
</style>
