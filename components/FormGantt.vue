<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useApi, useToast } from '#imports';

const props = defineProps({
  source: { type: String, default: '' },
  params: { type: Object, default: () => ({}) },
  config: {
    type: Object,
    default: () => ({
      idField: 'id',
      titleField: 'title',
      startField: 'created_at',
      endField: 'duedate',
      colorField: 'priority',
      progressField: 'progress',
    }),
  },
  height: { type: String, default: '600px' },
  menuName: { type: String, default: '' },
});

const Api = useApi();
const toast = useToast();
const loading = ref(false);
const items = ref<any[]>([]);

// Drag and Drop State
const draggedTaskIndex = ref<number | null>(null);
const isDragging = ref(false);

// Gantt State
const ganttMonth = ref(new Date().getMonth());
const ganttYear = ref(new Date().getFullYear());

const ganttDaysInMonth = computed(() => {
  return new Date(ganttYear.value, ganttMonth.value + 1, 0).getDate();
});

const ganttTasks = computed(() => {
  if (!items.value) return [];

  // Current Month Range
  const startOfMonth = new Date(ganttYear.value, ganttMonth.value, 1);
  const endOfMonth = new Date(ganttYear.value, ganttMonth.value + 1, 0);

  const startField = props.config.startField || 'created_at';
  const endField = props.config.endField || 'duedate';

  // Filter tasks that overlap with current month
  return items.value
    .map((task) => {
      // Determine start date
      let startDate = new Date();
      if (task[startField]) startDate = new Date(task[startField]);
      else if (task['created_at']) startDate = new Date(task['created_at']);

      // Determine end date
      let endDate = new Date(startDate.getTime() + 86400000); // Default 1 day
      if (task[endField]) endDate = new Date(task[endField]);

      // Check overlap
      if (endDate < startOfMonth || startDate > endOfMonth) return null;

      // Calculate grid position (1-based day)
      let startDay = startDate.getDate();
      let endDay = endDate.getDate();

      // Clamp to month boundaries
      if (startDate < startOfMonth) startDay = 1;
      if (endDate > endOfMonth) endDay = ganttDaysInMonth.value;

      const duration = Math.max(1, endDay - startDay + 1);

      return {
        ...task,
        _ganttStart: startDay,
        _ganttDuration: duration,
      };
    })
    .filter((t) => t !== null)
    .sort((a, b) => {
      // Sort by posgantt first (if available) - Gantt-specific field
      const posA = a.posgantt ?? Infinity;
      const posB = b.posgantt ?? Infinity;
      if (posA !== posB) {
        return posA - posB;
      }
      // Fall back to start date
      return a._ganttStart - b._ganttStart;
    });
});

const nextGanttMonth = () => {
  if (ganttMonth.value === 11) {
    ganttMonth.value = 0;
    ganttYear.value++;
  } else {
    ganttMonth.value++;
  }
};

const prevGanttMonth = () => {
  if (ganttMonth.value === 0) {
    ganttMonth.value = 11;
    ganttYear.value--;
  } else {
    ganttMonth.value--;
  }
};

const loadData = async () => {
  if (!props.source) return;

  loading.value = true;
  try {
    const dataForm = new FormData();
    dataForm.append('flowname', props.source);
    if (props.menuName) dataForm.append('menu', props.menuName);
    dataForm.append('search', 'true');

    const res = await Api.post('/api/admin/execute-flow', dataForm);
    if (res.code === 200 && Array.isArray(res.data.data)) {
      items.value = res.data.data;
    }
  } catch (error) {
    console.error('Gantt Load Error:', error);
    toast.add({ title: 'Error', description: 'Failed to load Gantt data', color: 'error' });
  } finally {
    loading.value = false;
  }
};

const getPriorityColorClass = (priority: string) => {
  const p = (priority || '').toLowerCase();
  if (p === 'high' || p === 'urgent') return 'bg-red-500';
  if (p === 'medium') return 'bg-orange-500';
  if (p === 'low') return 'bg-blue-500';
  return 'bg-green-500';
};

const emit = defineEmits(['item-click']);

const onItemClick = (item: any) => {
  emit('item-click', item);
};

// Drag and Drop Handlers
const onTaskDragStart = (event: DragEvent, index: number) => {
  draggedTaskIndex.value = index;
  isDragging.value = true;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
  (event.target as HTMLElement).style.opacity = '0.5';
};

const onTaskDragOver = (event: DragEvent, index: number) => {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }

  if (draggedTaskIndex.value !== null && draggedTaskIndex.value !== index) {
    // Reorder tasks in the items array
    const draggedTask = items.value[draggedTaskIndex.value];
    items.value.splice(draggedTaskIndex.value, 1);
    items.value.splice(index, 0, draggedTask);
    draggedTaskIndex.value = index;
  }
};

const onTaskDragEnd = async (event: DragEvent) => {
  (event.target as HTMLElement).style.opacity = '1';
  isDragging.value = false;

  if (draggedTaskIndex.value !== null) {
    await saveTaskPositions();
  }

  draggedTaskIndex.value = null;
};

const saveTaskPositions = async () => {
  try {
    // Update position for all tasks based on current order
    const tasksToUpdate = ganttTasks.value;

    // Save each task's position to backend
    for (let index = 0; index < tasksToUpdate.length; index++) {
      const task = tasksToUpdate[index];
      const dataForm = new FormData();
      dataForm.append('flowname', 'modifcard');
      dataForm.append('menu', props.menuName || 'admin');
      dataForm.append('search', 'false');
      dataForm.append('cardid', task[props.config.idField].toString());
      dataForm.append('posgantt', index.toString());

      // Include other required fields to avoid clearing them
      dataForm.append('title', task[props.config.titleField] || '');
      dataForm.append('status', task.status || '');

      await Api.post('/api/admin/execute-flow', dataForm);
    }

    // Update local items with new positions
    items.value = items.value.map((item) => {
      const taskIndex = tasksToUpdate.findIndex((t) => t[props.config.idField] === item[props.config.idField]);
      if (taskIndex !== -1) {
        return { ...item, posgantt: taskIndex };
      }
      return item;
    });

    toast.add({
      title: 'Order Saved',
      description: 'Task order has been updated',
      color: 'green',
      icon: 'i-heroicons-check-circle',
    });
  } catch (error) {
    console.error('Error saving task positions:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to save task order',
      color: 'red',
      icon: 'i-heroicons-exclamation-triangle',
    });
  }
};

onMounted(() => {
  loadData();
});

watch(() => props.source, loadData);
</script>

<template>
  <div
    class="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    :style="{ height: height }"
  >
    <!-- Gantt Header -->
    <div
      class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800"
    >
      <h3 class="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
        {{ new Date(ganttYear, ganttMonth).toLocaleString('default', { month: 'long', year: 'numeric' }) }}
      </h3>
      <div class="flex items-center gap-1">
        <UButton icon="i-heroicons-chevron-left" variant="ghost" color="gray" size="sm" @click="prevGanttMonth" />
        <UButton icon="i-heroicons-chevron-right" variant="ghost" color="gray" size="sm" @click="nextGanttMonth" />
        <UButton
          icon="i-heroicons-arrow-path"
          variant="ghost"
          color="gray"
          size="sm"
          :loading="loading"
          @click="loadData"
        />
      </div>
    </div>

    <!-- Gantt Chart -->
    <div class="flex-1 overflow-auto flex">
      <!-- Task List (Sticky Left) -->
      <div
        class="w-64 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 box-border"
      >
        <div
          class="h-10 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 px-4 flex items-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
        >
          Task Name
        </div>
        <div class="bg-white dark:bg-gray-800">
          <div
            v-for="(task, index) in ganttTasks"
            :key="task[config.idField] || Math.random()"
            class="h-9 px-4 border-b border-gray-100 dark:border-gray-700 flex items-center text-sm truncate hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-move text-gray-700 dark:text-gray-200 transition-opacity"
            draggable="true"
            @dragstart="onTaskDragStart($event, index)"
            @dragover="onTaskDragOver($event, index)"
            @dragend="onTaskDragEnd"
            @click="onItemClick(task)"
            :title="task[config.titleField]"
            :style="{ opacity: draggedTaskIndex === index ? 0.5 : 1 }"
          >
            {{ task[config.titleField] }}
          </div>
        </div>
      </div>

      <!-- Timeline -->
      <div class="flex-1 overflow-x-auto">
        <div class="min-w-max">
          <!-- Days Header -->
          <div
            class="h-10 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 grid"
            :style="`grid-template-columns: repeat(${ganttDaysInMonth}, 32px)`"
          >
            <div
              v-for="d in ganttDaysInMonth"
              :key="d"
              class="border-r border-gray-200 dark:border-gray-600/50 text-center text-xs leading-10 text-gray-400 font-medium"
            >
              {{ d }}
            </div>
          </div>

          <!-- Bars -->
          <div class="relative bg-white dark:bg-gray-800">
            <!-- Grid Lines -->
            <div
              class="absolute inset-0 grid pointer-events-none"
              :style="`grid-template-columns: repeat(${ganttDaysInMonth}, 32px)`"
            >
              <div
                v-for="d in ganttDaysInMonth"
                :key="d"
                class="border-r border-gray-100 dark:border-gray-800/50 h-full"
              ></div>
            </div>

            <!-- Rows -->
            <div
              v-for="task in ganttTasks"
              :key="task[config.idField] || Math.random()"
              class="h-9 border-b border-gray-100 dark:border-gray-800/50 relative grid items-center"
              :style="`grid-template-columns: repeat(${ganttDaysInMonth}, 32px)`"
            >
              <div
                class="h-5 rounded text-[10px] text-white px-2 flex items-center truncate shadow-sm cursor-pointer hover:opacity-90 relative z-10 transition-all"
                :class="getPriorityColorClass(task[config.colorField])"
                :style="`grid-column: ${task._ganttStart} / span ${task._ganttDuration}`"
                @click="onItemClick(task)"
              >
                {{ task[config.titleField] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
