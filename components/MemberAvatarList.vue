<template>
  <div class="flex items-center -space-x-2">
    <MemberAvatar
      v-for="member in visibleMembers"
      :key="member.userid || member.email || Math.random()"
      :member="member"
      :size="size"
      class="ring-2 ring-white dark:ring-gray-800"
    />
    
    <div
      v-if="remainingCount > 0"
      class="relative inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-medium ring-2 ring-white dark:ring-gray-800 z-10"
      :class="sizeClasses"
      :title="remainingNames"
    >
      <span class="text-xs">+{{ remainingCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import MemberAvatar from './MemberAvatar.vue';

const props = defineProps<{
  members: any[];
  maxVisible?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}>();

const limit = computed(() => props.maxVisible || 3);

const visibleMembers = computed(() => {
  if (!props.members) return [];
  return props.members.slice(0, limit.value);
});

const remainingCount = computed(() => {
  if (!props.members) return 0;
  return Math.max(0, props.members.length - limit.value);
});

const remainingNames = computed(() => {
  if (!props.members || remainingCount.value <= 0) return '';
  return props.members
    .slice(limit.value)
    .map(m => m.name || m.username || m.email)
    .join(', ');
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-5 h-5 text-[9px]';
    case 'md': return 'w-8 h-8 text-sm';
    case 'lg': return 'w-10 h-10 text-base';
    case 'sm':
    default: return 'w-6 h-6 text-xs';
  }
});
</script>
