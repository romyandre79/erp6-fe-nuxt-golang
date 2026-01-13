<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Schedule',
  },
  class: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

// Options
const mode = ref('now'); // 'now' | 'schedule'
const date = ref('');
const hour = ref('00');
const minute = ref('00');

// Initial setup from modelValue
onMounted(() => {
  if (props.modelValue && props.modelValue !== 'now') {
    mode.value = 'schedule';
    try {
      // Parse cron: minute hour day month weekday
      // Example: 30 14 25 12 * (14:30 on 25th Dec)
      const parts = props.modelValue.split(' ');
      if (parts.length >= 4) {
        minute.value = parts[0].padStart(2, '0');
        hour.value = parts[1].padStart(2, '0');
        
        // Month needs 0-padding
        const month = parts[3].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        
        // Current year for the date picker (Cron doesn't usually have year)
        // We assume the next occurrence of this date, or just current year
        const currentYear = new Date().getFullYear();
        date.value = `${currentYear}-${month}-${day}`;
      }
    } catch (e) {
      console.error('Failed to parse cron:', e);
    }
  } else {
    mode.value = 'now';
    // Set default date to today, time to current next hour
    const now = new Date();
    date.value = now.toISOString().split('T')[0];
    hour.value = String(now.getHours() + 1).padStart(2, '0');
    if (parseInt(hour.value) > 23) hour.value = '00';
  }
});

// Generate Cron based on inputs
const computedValue = computed(() => {
  if (mode.value === 'now') {
    return 'now';
  }
  
  if (!date.value) return '';

  const d = new Date(date.value);
  const day = d.getDate();
  const month = d.getMonth() + 1; // 0-indexed
  
  // Format: minute hour day month weekday
  // We use * for weekday to mean "any day of week" but specific date
  return `${parseInt(minute.value)} ${parseInt(hour.value)} ${day} ${month} *`;
});

// Watch for changes and emit
watch(computedValue, (val) => {
  emit('update:modelValue', val);
});

// Watch prop to sync back if changed externally? 
// Usually not needed for simple inputs but good for reset.
watch(() => props.modelValue, (val) => {
    if (val === 'now' && mode.value !== 'now') {
        mode.value = 'now';
    }
});

// Helpers for hours/minutes
const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

</script>

<template>
  <div :class="['w-full', props.class]">
    <label v-if="label" class="block mb-2 font-medium text-gray-700">{{ label }}</label>
    
    <div class="space-y-4">
      <!-- Radio Options -->
      <div class="flex flex-col gap-2">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" v-model="mode" value="now" class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500">
          <span>Send now</span>
        </label>
        
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" v-model="mode" value="schedule" class="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500">
          <span>Schedule for later</span>
        </label>
      </div>

      <!-- Schedule Inputs -->
      <div v-if="mode === 'schedule'" class="ml-6 space-y-3 transition-all duration-300">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input 
            type="date" 
            v-model="date"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <div class="flex gap-2">
            <select v-model="hour" class="block w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border">
              <option v-for="h in hours" :key="h" :value="h">{{ h }}</option>
            </select>
            <span class="self-center">:</span>
            <select v-model="minute" class="block w-20 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2 border">
              <option v-for="m in minutes" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
          <p class="mt-1 text-xs text-gray-500">Asia/Jakarta GMT +07:00</p>
        </div>
      </div>
    </div>
  </div>
</template>
