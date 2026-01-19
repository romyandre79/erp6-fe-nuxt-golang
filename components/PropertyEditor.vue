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
        
        <!-- Special handling for 'dependency' -->
        <div v-if="key === 'dependency'" class="space-y-2 border p-2 rounded bg-gray-50">
           <div v-for="(item, i) in value" :key="i" class="flex flex-col space-y-1 mb-2 border-b pb-2 last:border-0">
              <div v-if="isObject(item)" class="flex items-center gap-2">
                  <input v-model="item.key" placeholder="Parent Key" class="border rounded px-2 py-1 text-xs w-full" />
                  <input v-model="item.param" placeholder="Param Name" class="border rounded px-2 py-1 text-xs w-full" />
                  <button type="button" class="text-red-500 hover:text-red-700 font-bold px-1" @click="removeItem(key, i)">✕</button>
              </div>
              <div v-else class="flex items-center gap-2 bg-red-50 p-1 rounded">
                   <span class="text-xs text-red-600 truncate flex-1">Invalid: {{ item }}</span>
                   <button type="button" class="text-xs text-blue-600 underline" @click="fixDependency(key, i)">Fix</button>
                   <button type="button" class="text-red-500 hover:text-red-700 font-bold px-1" @click="removeItem(key, i)">✕</button>
              </div>
           </div>
           <button type="button" class="text-xs text-blue-600 hover:text-blue-800 font-medium" @click="addItem(key)">
            + Add Dependency
          </button>
        </div>

        <!-- Generic Array Handling -->
        <div v-else class="space-y-1">
          <div v-for="(item, i) in value" :key="i" class="flex items-center space-x-2">
            <input v-if="typeof item !== 'object'" v-model="modelValue[key][i]" type="text" class="border rounded p-1 text-sm w-full" />
            <div v-else class="text-xs text-gray-500 italic">Complex Object (Edit via JSON)</div>
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
  if (key === 'dependency') {
      props.modelValue[key].push({ key: '', param: '' });
  } else {
      props.modelValue[key].push('');
  }
  emit('update:modelValue', { ...props.modelValue });
};

const removeItem = (key: string, index: number) => {
  props.modelValue[key].splice(index, 1);
  emit('update:modelValue', { ...props.modelValue });
};

const fixDependency = (key: string, index: number) => {
  const Val = props.modelValue[key][index];
  if (typeof Val === 'string') {
      // Clean up string: remove [] if accidentally wrapped, remove quotes
      let clean = Val.trim();
      if(clean.startsWith('[') && clean.endsWith(']')) clean = clean.slice(1, -1);
      
      // Try to parse relaxed JSON {key:..., param:...}
      // Regex to extract key and param values
      const keyMatch = clean.match(/key\s*[:=]\s*([^,}\s]+)/);
      const paramMatch = clean.match(/param\s*[:=]\s*([^,}\s]+)/);
      
      const newObj = {
          key: keyMatch ? keyMatch[1] : '',
          param: paramMatch ? paramMatch[1] : ''
      };
      
      props.modelValue[key][index] = newObj;
      emit('update:modelValue', { ...props.modelValue });
  } else {
      // Fallback reset
      props.modelValue[key][index] = { key: '', param: '' };
      emit('update:modelValue', { ...props.modelValue });
  }
};
</script>
