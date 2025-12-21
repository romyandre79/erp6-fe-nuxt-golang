<template>
  <div class="kanban-board w-full overflow-x-auto">
    <div class="flex gap-4 pb-4 min-h-[600px]">
      <!-- Render columns from children or default columns -->
      <div
        v-for="(column, colIndex) in columns"
        :key="column.key || colIndex"
        class="kanban-column flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-800 rounded-lg p-4"
        :style="{ borderTop: `4px solid var(--color-${column.color || 'gray'}-500)` }"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <h3 class="font-semibold text-gray-800 dark:text-white">
              {{ column.title }}
            </h3>
            <span class="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
              {{ getColumnCards(column.status).length }}
              <span v-if="column.limit > 0">/ {{ column.limit }}</span>
            </span>
          </div>
          <UButton
            icon="i-heroicons-plus"
            size="xs"
            color="gray"
            variant="ghost"
            @click="addCard(column.status)"
          />
        </div>

        <!-- Cards Container -->
        <div
          class="kanban-cards space-y-3 min-h-[400px]"
          @drop="onDrop($event, column.status)"
          @dragover.prevent
          @dragenter.prevent
        >
          <div
            v-for="card in getColumnCards(column.status)"
            :key="card[primaryKey]"
            class="kanban-card bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move border border-gray-200 dark:border-gray-700"
            draggable="true"
            @dragstart="onDragStart($event, card)"
            @click="editCard(card)"
          >
            <!-- Priority Badge -->
            <div v-if="card[priorityField]" class="flex items-center gap-2 mb-2">
              <span
                class="text-xs px-2 py-1 rounded-full font-medium"
                :class="getPriorityClass(card[priorityField])"
              >
                {{ card[priorityField] }}
              </span>
            </div>

            <!-- Card Title -->
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">
              {{ card[titleField] || 'Untitled' }}
            </h4>

            <!-- Card Description -->
            <p
              v-if="card[descriptionField]"
              class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2"
            >
              {{ card[descriptionField] }}
            </p>

            <!-- Tags -->
            <div v-if="card[tagsField] && card[tagsField].length > 0" class="flex flex-wrap gap-1 mb-3">
              <span
                v-for="(tag, idx) in parseTagsArray(card[tagsField])"
                :key="idx"
                class="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded"
              >
                {{ tag }}
              </span>
            </div>

            <!-- Card Footer -->
            <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div v-if="card[assigneeField]" class="flex items-center gap-1">
                <UIcon name="i-heroicons-user-circle" class="w-4 h-4" />
                <span>{{ card[assigneeField] }}</span>
              </div>
              <div v-if="card[dueDateField]" class="flex items-center gap-1">
                <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
                <span :class="{ 'text-red-500': isOverdue(card[dueDateField]) }">
                  {{ formatDate(card[dueDateField]) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div
            v-if="getColumnCards(column.status).length === 0"
            class="text-center text-gray-400 dark:text-gray-600 py-8"
          >
            <UIcon name="i-heroicons-inbox" class="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p class="text-sm">No cards</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from '#imports';

const props = defineProps({
  container: {
    type: Object,
    required: true,
  },
  formData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update', 'statusChange', 'cardClick']);

const toast = useToast();
const cards = ref<any[]>([]);
const draggedCard = ref<any>(null);

// Extract configuration from container props
const primaryKey = computed(() => props.container.props?.primary || 'id');
const titleField = computed(() => props.container.props?.titlefield || 'title');
const descriptionField = computed(() => props.container.props?.descriptionfield || 'description');
const statusField = computed(() => props.container.props?.statusfield || 'status');
const assigneeField = computed(() => props.container.props?.assigneefield || 'assignee');
const dueDateField = computed(() => props.container.props?.duedatefield || 'duedate');
const priorityField = computed(() => props.container.props?.priorityfield || 'priority');
const tagsField = computed(() => props.container.props?.tagsfield || 'tags');

// Get columns from children or use defaults
const columns = computed(() => {
  if (props.container.children && props.container.children.length > 0) {
    return props.container.children
      .filter((child: any) => child.type === 'kanbancolumn')
      .map((child: any) => ({
        key: child.props.key,
        title: child.props.title,
        status: child.props.status,
        color: child.props.color || 'gray',
        limit: child.props.limit || 0,
      }));
  }
  
  // Default columns
  return [
    { key: 'col_todo', title: 'To Do', status: 'todo', color: 'gray', limit: 0 },
    { key: 'col_inprogress', title: 'In Progress', status: 'inprogress', color: 'blue', limit: 0 },
    { key: 'col_review', title: 'Review', status: 'review', color: 'yellow', limit: 0 },
    { key: 'col_done', title: 'Done', status: 'done', color: 'green', limit: 0 },
  ];
});

// Get cards for a specific column
const getColumnCards = (status: string) => {
  return cards.value.filter((card) => card[statusField.value] === status);
};

// Parse tags (handle both string and array)
const parseTagsArray = (tags: any) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string') {
    try {
      return JSON.parse(tags);
    } catch {
      return tags.split(',').map((t: string) => t.trim());
    }
  }
  return [];
};

// Priority styling
const getPriorityClass = (priority: string) => {
  const p = priority?.toLowerCase();
  if (p === 'high' || p === 'urgent') {
    return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
  }
  if (p === 'medium') {
    return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200';
  }
  return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
};

// Date formatting
const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const isOverdue = (date: string) => {
  if (!date) return false;
  return new Date(date) < new Date();
};

// Drag and Drop handlers
const onDragStart = (event: DragEvent, card: any) => {
  draggedCard.value = card;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
  }
};

const onDrop = async (event: DragEvent, newStatus: string) => {
  event.preventDefault();
  
  if (!draggedCard.value) return;
  
  const oldStatus = draggedCard.value[statusField.value];
  if (oldStatus === newStatus) {
    draggedCard.value = null;
    return;
  }

  // Check column limit
  const targetColumn = columns.value.find((col) => col.status === newStatus);
  if (targetColumn && targetColumn.limit > 0) {
    const currentCount = getColumnCards(newStatus).length;
    if (currentCount >= targetColumn.limit) {
      toast.add({
        title: 'Column Limit Reached',
        description: `${targetColumn.title} is limited to ${targetColumn.limit} cards`,
        color: 'orange',
      });
      draggedCard.value = null;
      return;
    }
  }

  // Update card status
  draggedCard.value[statusField.value] = newStatus;
  
  // Emit status change event
  emit('statusChange', {
    card: draggedCard.value,
    oldStatus,
    newStatus,
  });

  toast.add({
    title: 'Card Moved',
    description: `Moved to ${targetColumn?.title || newStatus}`,
    color: 'green',
  });

  draggedCard.value = null;
};

// Card actions
const addCard = (status: string) => {
  const newCard = {
    [primaryKey.value]: Date.now(), // Temporary ID
    [titleField.value]: 'New Card',
    [descriptionField.value]: '',
    [statusField.value]: status,
    [assigneeField.value]: '',
    [dueDateField.value]: '',
    [priorityField.value]: 'medium',
    [tagsField.value]: [],
  };
  
  cards.value.push(newCard);
  emit('update', newCard);
};

const editCard = (card: any) => {
  emit('cardClick', card);
};

// Load data from source or formData
const loadCards = async () => {
  // If source is provided, fetch from API
  if (props.container.props?.source) {
    try {
      // This would integrate with your existing API system
      // For now, we'll use formData
      const key = props.container.props.key;
      if (props.formData[key]) {
        cards.value = Array.isArray(props.formData[key]) 
          ? props.formData[key] 
          : [];
      }
    } catch (error) {
      console.error('Failed to load kanban data:', error);
      toast.add({
        title: 'Error',
        description: 'Failed to load kanban board data',
        color: 'red',
      });
    }
  } else {
    // Use formData directly
    const key = props.container.props.key;
    if (props.formData[key]) {
      cards.value = Array.isArray(props.formData[key]) 
        ? props.formData[key] 
        : [];
    }
  }
};

onMounted(() => {
  loadCards();
});

// Expose methods for parent components
defineExpose({
  loadCards,
  cards,
});
</script>

<style scoped>
.kanban-board {
  user-select: none;
}

.kanban-column {
  transition: background-color 0.2s;
}

.kanban-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.kanban-card:hover {
  transform: translateY(-2px);
}

.kanban-card:active {
  cursor: grabbing;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
