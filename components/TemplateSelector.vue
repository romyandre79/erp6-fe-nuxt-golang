<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/75"
    @click.self="closeModal"
  >
    <div class="relative w-full max-w-4xl rounded-lg shadow-xl max-h-[90vh] flex flex-col">
      <UCard
        style="background: var(--panel-background); border: 1px solid var(--border-color)"
        class="flex flex-col max-h-[90vh]"
      >
        <template #header>
          <div class="flex items-center justify-between gap-4">
            <h3 class="text-lg font-semibold">Choose a Template</h3>
            <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="sm" @click="closeModal" />
          </div>
          <div class="mt-3">
            <UInput
              v-model="searchQuery"
              icon="i-heroicons-magnifying-glass"
              placeholder="Search templates..."
              class="w-full"
            />
          </div>
        </template>

        <div class="overflow-y-auto max-h-[60vh] pr-2">
          <div class="grid grid-cols-3 gap-4">
            <div
              v-for="template in filteredTemplates"
              :key="template.id"
              class="p-6 border-2 rounded-lg cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all"
              style="border-color: var(--border-color)"
              @click="selectTemplate(template)"
            >
              <div class="text-4xl mb-3">{{ template.icon }}</div>
              <h4 class="font-semibold mb-1">{{ template.name }}</h4>
              <p class="text-sm">{{ template.description }}</p>
              <div class="mt-3 text-xs text-gray-500">{{ getColumnCount(template) }} columns</div>
            </div>
          </div>

          <div v-if="filteredTemplates.length === 0" class="text-center py-12 text-gray-500">
            <UIcon name="i-heroicons-magnifying-glass" class="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No templates found matching "{{ searchQuery }}"</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  templates: any[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  select: [template: any];
}>();

const searchQuery = ref('');

// Filtered templates based on search query
const filteredTemplates = computed(() => {
  if (!searchQuery.value) return props.templates;

  const query = searchQuery.value.toLowerCase();
  return props.templates.filter(
    (template: any) =>
      template.name?.toLowerCase().includes(query) || template.description?.toLowerCase().includes(query),
  );
});

// Get column count from template (handles JSON string)
const getColumnCount = (template: any): number => {
  if (!template.columns) return 0;

  // Handle empty string or whitespace-only string
  if (typeof template.columns === 'string' && template.columns.trim() === '') return 0;

  try {
    let columns;

    if (typeof template.columns === 'string') {
      // Fix invalid JSON: replace single quotes with double quotes
      let jsonString = template.columns.replace(/'/g, '"').replace(/(\w+):/g, '"$1":');

      columns = JSON.parse(jsonString);
    } else {
      columns = template.columns;
    }

    return Array.isArray(columns) ? columns.length : 0;
  } catch (e) {
    console.error('Error parsing template columns:', e);
    return 0;
  }
};

const closeModal = () => {
  emit('update:modelValue', false);
  searchQuery.value = ''; // Reset search on close
};

const selectTemplate = (template: any) => {
  emit('select', template);
  closeModal();
};
</script>
