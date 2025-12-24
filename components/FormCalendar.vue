<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useApi, useToast } from '#imports';

const props = defineProps({
  source: { type: String, default: '' },
  params: { type: Object, default: () => ({}) },
  config: { 
    type: Object, 
    default: () => ({
      dateField: 'duedate',
      titleField: 'title',
      descriptionField: 'description',
      colorField: 'priority',
      idField: 'id'
    }) 
  },
  height: { type: String, default: '600px' },
  menuName: { type: String, default: '' }
});

const Api = useApi();
const toast = useToast();
const loading = ref(false);
const items = ref<any[]>([]);

// Calendar State
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Monday start
  
  const days = [];
  
  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = 0; i < startingDay; i++) {
    days.push({
      day: prevMonthLastDay - startingDay + i + 1,
      currentMonth: false,
      date: new Date(year, month - 1, prevMonthLastDay - startingDay + i + 1)
    });
  }
  
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      currentMonth: true,
      date: new Date(year, month, i)
    });
  }
  
  // Next month padding
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      currentMonth: false,
      date: new Date(year, month + 1, i)
    });
  }
  
  return days;
});

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

// Data Fetching
const loadData = async () => {
  if (!props.source) return;
  
  loading.value = true;
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', props.source);
    if (props.menuName) dataForm.append('menu', props.menuName);
    dataForm.append('search', 'true'); // Standard search flag
    
    // Add time filtering if supported by backend? 
    // For now we fetch all and filter client side or backend should handle standard filters
    
    const res = await Api.post('/api/admin/execute-flow', dataForm);
    if (res.code === 200 && Array.isArray(res.data.data)) {
      items.value = res.data.data;
    }
  } catch (error) {
    console.error('Calendar Load Error:', error);
    toast.add({ title: 'Error', description: 'Failed to load calendar data', color: 'error' });
  } finally {
    loading.value = false;
  }
};

const getItemsForDate = (date: Date) => {
  const dateStr = date.toISOString().split('T')[0];
  const dateField = props.config.dateField || 'duedate';
  
  return items.value.filter(item => {
    const val = item[dateField];
    if (!val) return false;
    return val.startsWith(dateStr);
  });
};

const getPriorityColorClass = (priority: string) => {
    const p = (priority || '').toLowerCase();
    if (p === 'high' || p === 'urgent') return 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-100 dark:border-red-800';
    if (p === 'medium') return 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 border-orange-100 dark:border-orange-800';
    return 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-800';
};

const emit = defineEmits(['item-click']);

const onItemClick = (item: any) => {
    emit('item-click', item);
};

onMounted(() => {
  loadData();
});

watch(() => props.source, loadData);
</script>

<template>
    <div class="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden" :style="{ height: height }">
        <!-- Calendar Header -->
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800">
            <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                {{ new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' }) }}
            </h3>
            <div class="flex items-center gap-1">
                <UButton icon="i-heroicons-chevron-left" variant="ghost" color="gray" size="sm" @click="prevMonth" />
                <UButton icon="i-heroicons-chevron-right" variant="ghost" color="gray" size="sm" @click="nextMonth" />
                <UButton icon="i-heroicons-arrow-path" variant="ghost" color="gray" size="sm" :loading="loading" @click="loadData" />
            </div>
        </div>

        <!-- Calendar Grid -->
        <div class="flex-1 overflow-auto p-4">
            <div class="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden h-full">
                <!-- Weekday Headers -->
                <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="bg-gray-100 dark:bg-gray-800/50 p-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {{ day }}
                </div>

                <!-- Days -->
                <div 
                    v-for="(day, index) in calendarDays" 
                    :key="index" 
                    class="bg-white dark:bg-gray-800 p-2 transition-colors hover:bg-gray-50 dark:hover:bg-gray-750 flex flex-col gap-1 min-h-[80px]"
                    :class="{ 'opacity-50 bg-gray-50/50 dark:bg-gray-800/50 text-gray-400': !day.currentMonth }"
                >
                    <div class="text-right text-xs font-medium mb-1" :class="{ 'text-primary-600 font-bold': day.date.toDateString() === new Date().toDateString() }">
                        {{ day.day }}
                    </div>
                    
                    <div class="flex-1 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                        <div 
                            v-for="item in getItemsForDate(day.date)" 
                            :key="item[config.idField] || Math.random()"
                            class="text-[10px] px-1.5 py-1 rounded border cursor-pointer hover:shadow-sm truncate"
                            :class="getPriorityColorClass(item[config.colorField])"
                             @click="onItemClick(item)"
                             :title="item[config.titleField]"
                        >
                            {{ item[config.titleField] }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 2px;
}
</style>
