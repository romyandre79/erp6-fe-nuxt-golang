<template>
  <div
    class="relative inline-flex items-center justify-center rounded-full text-white font-medium select-none"
    :class="[sizeClasses, className]"
    :style="{ backgroundColor: backgroundColor }"
    :title="member?.name || member?.email || 'Unknown Member'"
  >
    <span class="text-xs">{{ initials }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  member: {
    name?: string;
    email?: string;
    description?: string;
    [key: string]: any;
  } | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}>();

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': return 'w-5 h-5 text-[9px]';
    case 'md': return 'w-8 h-8 text-sm';
    case 'lg': return 'w-10 h-10 text-base';
    case 'sm':
    default: return 'w-6 h-6 text-xs';
  }
});

const initials = computed(() => {
  if (!props.member) return '?';
  
  const name = props.member.name || props.member.username || props.member.email || '';
  if (!name) return '?';
  
  // If email, take part before @
  const text = name.includes('@') ? name.split('@')[0] : name;
  
  const parts = text.split(/[\s_.-]+/).filter(Boolean);
  if (parts.length === 0) return text.substring(0, 2).toUpperCase();
  
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

const backgroundColor = computed(() => {
  const name = props.member?.name || props.member?.username || props.member?.email || 'default';
  return getColorFromString(name);
});

// Generate consistent color from string
const getColorFromString = (str: string): string => {
  const colors = [
    '#ef4444', // red
    '#f97316', // orange
    '#f59e0b', // amber
    '#84cc16', // lime
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#ec4899', // pink
    '#f43f5e', // rose
    '#64748b', // slate
  ];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};
</script>
