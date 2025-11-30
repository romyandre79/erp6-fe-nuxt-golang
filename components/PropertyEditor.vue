<template>
  <div class="space-y-2">
    <template v-for="(value, key) in modelValue" :key="key">
      <!-- Jika object -->
      <div v-if="isObject(value)" class="border-l pl-3 mt-3">
        <label class="block text-sm font-semibold mb-1 text-gray-700">{{ key }}</label>
        <PropertyEditor v-model="modelValue[key]" />
      </div>

      <!-- Jika array -->
      <div v-else-if="Array.isArray(value)" class="mt-2">
        <label class="block text-sm font-semibold mb-1 text-gray-700">{{ key }}</label>
        <div class="space-y-1">
          <div v-for="(item, i) in value" :key="i" class="flex items-center space-x-2">
            <input v-model="modelValue[key][i]" type="text" class="border rounded p-1 text-sm w-full" />
            <button type="button" class="text-xs text-red-500 hover:text-red-700" @click="removeItem(key, i)">✕</button>
          </div>
          <button type="button" class="text-xs text-blue-600 hover:text-blue-800 mt-1" @click="addItem(key)">
            + Add Item
          </button>
        </div>
      </div>

      <!-- Jika boolean -->
      <div v-else-if="typeof value === 'boolean'" class="flex items-center justify-between">
        <label class="text-sm font-medium text-gray-700">{{ key }}</label>
        <input type="checkbox" v-model="modelValue[key]" class="h-4 w-4" />
      </div>

      <!-- Jika number -->
      <div v-else-if="typeof value === 'number'" class="flex items-center justify-between">
        <label class="text-sm font-medium text-gray-700">{{ key }}</label>
        <input type="number" v-model.number="modelValue[key]" class="border rounded p-1 text-sm w-2/3" />
      </div>

      <!-- Jika string -->
      <div v-else class="flex items-center justify-between">
        <label class="text-sm font-medium text-gray-700">{{ key }}</label>
        <input
          type="text"
          v-model="modelValue[key]"
          :disabled="key == 'type'"
          class="border rounded p-1 text-sm w-2/3"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: { type: Object, required: true },
});

const emit = defineEmits(['update:modelValue']);

const isObject = (val: any) => val && typeof val === 'object' && !Array.isArray(val);

const addItem = (key: string) => {
  props.modelValue[key].push('');
  emit('update:modelValue', { ...props.modelValue });
};

const removeItem = (key: string, index: number) => {
  props.modelValue[key].splice(index, 1);
  emit('update:modelValue', { ...props.modelValue });
};
</script>
