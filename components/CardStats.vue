<template>
  <div class="flex items-center gap-4">
    <div class="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-3xl">
      <i :class="icon"></i>
    </div>
    <div>
      <p class="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">
        {{ props.title }}
      </p>
      <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">
        {{ props.value }}
      </p>
      <p class="text-xs mt-1" :class="props.trend > 0 ? 'text-green-500' : 'text-red-500'">
        <i :class="trend > 0 ? 'fa fa-arrow-up' : 'fa fa-arrow-down'"></i>
        {{ Math.abs(props.trend) }}%
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: String,
  value: [String, Number],
  trend: Number,
  icon: String,
});
</script>

<style scoped>
.card-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
