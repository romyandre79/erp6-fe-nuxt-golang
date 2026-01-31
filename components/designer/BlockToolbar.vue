<template>
  <transition name="toolbar-fade">
    <div 
      v-if="visible"
      class="fixed z-50 flex items-center gap-1 bg-gray-900 text-white rounded-xl shadow-2xl shadow-gray-900/50 py-1.5 px-2"
      :style="{ 
        left: position.x + 'px', 
        top: position.y + 'px',
        transform: 'translateX(-50%)'
      }"
    >
      <!-- Component Type Badge -->
      <div class="px-2 py-1 bg-gray-800 rounded-lg mr-1 flex items-center gap-1.5">
        <UIcon :name="nodeIcon" class="w-3.5 h-3.5 text-gray-400" />
        <span class="text-xs font-medium text-gray-300">{{ nodeType }}</span>
      </div>

      <div class="w-px h-6 bg-gray-700"></div>

      <!-- Move Up -->
      <button
        @click.stop="$emit('move-up')"
        class="toolbar-btn"
        title="Move Up"
        :disabled="!canMoveUp"
      >
        <UIcon name="heroicons:chevron-up" class="w-4 h-4" />
      </button>

      <!-- Move Down -->
      <button
        @click.stop="$emit('move-down')"
        class="toolbar-btn"
        title="Move Down"
        :disabled="!canMoveDown"
      >
        <UIcon name="heroicons:chevron-down" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-gray-700"></div>

      <!-- Duplicate -->
      <button
        @click.stop="$emit('duplicate')"
        class="toolbar-btn"
        title="Duplicate (Ctrl+D)"
      >
        <UIcon name="heroicons:document-duplicate" class="w-4 h-4" />
      </button>

      <!-- Copy -->
      <button
        @click.stop="$emit('copy')"
        class="toolbar-btn"
        title="Copy (Ctrl+C)"
      >
        <UIcon name="heroicons:clipboard-document" class="w-4 h-4" />
      </button>

      <div class="w-px h-6 bg-gray-700"></div>

      <!-- Settings -->
      <button
        @click.stop="$emit('settings')"
        class="toolbar-btn hover:!bg-blue-600"
        title="Settings"
      >
        <UIcon name="heroicons:cog-6-tooth" class="w-4 h-4" />
      </button>

      <!-- Delete -->
      <button
        @click.stop="$emit('delete')"
        class="toolbar-btn hover:!bg-red-600"
        title="Delete"
      >
        <UIcon name="heroicons:trash" class="w-4 h-4" />
      </button>

      <!-- More Options -->
      <div class="relative" v-if="showMore">
        <button
          @click.stop="moreOpen = !moreOpen"
          class="toolbar-btn"
          title="More options"
        >
          <UIcon name="heroicons:ellipsis-vertical" class="w-4 h-4" />
        </button>
        
        <transition name="dropdown">
          <div 
            v-if="moreOpen" 
            class="absolute right-0 top-full mt-1 w-40 bg-gray-900 rounded-lg shadow-xl border border-gray-700 py-1"
          >
            <button 
              class="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
              @click.stop="$emit('wrap'); moreOpen = false"
            >
              <UIcon name="heroicons:square-2-stack" class="w-4 h-4" />
              Wrap in container
            </button>
            <button 
              class="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 flex items-center gap-2"
              @click.stop="$emit('view-json'); moreOpen = false"
            >
              <UIcon name="heroicons:code-bracket" class="w-4 h-4" />
              View JSON
            </button>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  visible: boolean;
  position: { x: number; y: number };
  nodeType: string;
  nodeIcon: string;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  showMore?: boolean;
}>();

defineEmits([
  'move-up',
  'move-down', 
  'duplicate',
  'copy',
  'settings',
  'delete',
  'wrap',
  'view-json'
]);

const moreOpen = ref(false);

// Close dropdown on outside click
function handleClickOutside(e: MouseEvent) {
  if (moreOpen.value) {
    moreOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.toolbar-btn {
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}
.toolbar-btn:hover {
  background-color: #374151;
}
.toolbar-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.toolbar-fade-enter-active,
.toolbar-fade-leave-active {
  transition: all 0.15s ease;
}

.toolbar-fade-enter-from,
.toolbar-fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-4px);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
