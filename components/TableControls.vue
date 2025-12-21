<template>
  <div v-if="enablePaging" class="paging flex justify-center items-center gap-2">
    <span class="text-base-content/70"> Page {{ currentPage }} / {{ totalPages }} </span>

    <select
      v-if="enablePageSize"
      v-model.number="pageSizeModel"
      class="border rounded px-2 py-1 text-sm"
      @change="$emit('page-size-change')"
    >
      <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
    </select>

    <button
      class="px-3 py-1 rounded-lg border hover:bg-base-100"
      :disabled="currentPage === 1 || loading || totalPages === 0"
      @click="$emit('first-page')"
    >
      &lt;&lt;
    </button>
    <button
      class="px-3 py-1 rounded-lg border hover:bg-base-100"
      :disabled="currentPage === 1 || loading || totalPages === 0"
      @click="$emit('prev-page')"
    >
      &lt;
    </button>
    <button
      class="px-3 py-1 rounded-lg border hover:bg-base-100"
      :disabled="currentPage === totalPages || loading || totalPages === 0"
      @click="$emit('next-page')"
    >
      &gt;
    </button>
    <button
      class="px-3 py-1 rounded-lg border hover:bg-base-100"
      :disabled="currentPage === totalPages || loading || totalPages === 0"
      @click="$emit('last-page')"
    >
      &gt;&gt;
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  currentPage: Number,
  totalPages: Number,
  pageSize: Number,
  loading: Boolean,
  enablePaging: Boolean,
  enablePageSize: Boolean,
  pageSizeOptions: { type: Array, default: () => [5, 10, 20, 50, 100, 1000] },
});

const emit = defineEmits(['update:pageSize', 'page-size-change', 'first-page', 'prev-page', 'next-page', 'last-page']);

const pageSizeModel = computed({
  get: () => props.pageSize,
  set: (val) => emit('update:pageSize', val),
});
</script>
