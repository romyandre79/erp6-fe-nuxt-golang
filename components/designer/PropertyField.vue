<template>
  <div class="space-y-1">
    <label class="flex items-center justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
      <span>{{ label }}</span>
      <span v-if="hint" class="text-gray-400 dark:text-gray-500 font-normal">{{ hint }}</span>
    </label>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  hint?: string;
}>();
</script>
