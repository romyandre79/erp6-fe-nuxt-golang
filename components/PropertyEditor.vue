<template>
  <div class="space-y-2">
    <template v-for="(value, key) in modelValue" :key="key">
      <!-- Jika object, render nested -->
      <div v-if="isObject(value)" class="border-l pl-3 mt-2">
        <label class="block text-sm font-semibold mb-1">{{ key }}</label>
        <PropertyEditor
          v-model="modelValue[key]"
        />
      </div>

      <!-- Jika bukan object, render input sesuai tipe -->
      <div v-else class="flex items-center justify-between">
        <label class="text-sm">{{ key }}</label>
        <input
          v-model="modelValue[key]"
          type="text"
          class="border rounded p-1 w-2/3 text-sm"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: Object, required: true }
})

const emit = defineEmits(['update:modelValue'])

const isObject = (val: any) => val && typeof val === 'object' && !Array.isArray(val)
</script>
