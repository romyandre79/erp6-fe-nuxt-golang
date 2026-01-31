<template>
  <div class="border-b border-gray-100 dark:border-gray-800">
    <button 
      @click="$emit('toggle')"
      class="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
    >
      <div class="flex items-center gap-2">
        <UIcon :name="icon" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span class="font-medium text-sm text-gray-700 dark:text-gray-200">{{ title }}</span>
      </div>
      <UIcon 
        :name="expanded ? 'heroicons:chevron-up' : 'heroicons:chevron-down'" 
        class="w-4 h-4 text-gray-400"
      />
    </button>
    <transition name="section">
      <div v-if="expanded" class="px-4 pb-4">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  icon: string;
  expanded: boolean;
}>();

defineEmits(['toggle']);
</script>

<style scoped>
.section-enter-active,
.section-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.section-enter-from,
.section-leave-to {
  opacity: 0;
  max-height: 0;
}
.section-enter-to,
.section-leave-from {
  max-height: 500px;
}
</style>
