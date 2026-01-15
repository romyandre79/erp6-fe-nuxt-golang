<script setup lang="ts">
import { ref, computed, type PropType } from 'vue';

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
  formData: {
    type: Object,
    required: true,
  },
  renderChild: {
    type: Function as PropType<(child: any) => any>,
    required: true,
  },
  validationErrors: {
    type: Object,
    default: () => ({}),
  },
});

const searchQuery = ref('');
const activeTabIndex = ref(0);

// Flatten children to get tabs. 
// Assuming the structure is:
// MegaBox -> children[] (Tabs) -> children[] (Content)
const tabs = computed(() => {
  return (props.component.children || []).map((child: any, index: number) => ({
    label: child.props?.text || child.props?.title || `Tab ${index + 1}`,
    content: child.children || [],
    ...child
  }));
});

// Computed for the trigger display (selected items)
// This depends on how data is stored. For now, show a placeholder or count.
const displayValue = computed(() => {
    const key = props.component.props?.key;
    const val = props.formData[key];
    if (Array.isArray(val) && val.length > 0) {
        return `${val.length} items selected`; // Placeholder logic
    }
    return val || props.component.props?.place || 'Select...';
});

function onTabChange(index: number) {
  activeTabIndex.value = index;
}

</script>

<template>
  <div class="flex flex-col mb-3">
    <label v-if="component.props?.text" class="mb-1 text-gray-400 text-sm font-medium">
      {{ $t(component.props.text.toUpperCase()) }}
    </label>

    <UPopover :popper="{ placement: 'bottom-start' }" class="w-full">
      <template #default="{ open }">
        <div
          class="w-full px-3 py-2 border rounded cursor-pointer flex justify-between items-center bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
          :class="[
             validationErrors[component.props.key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-700',
             open ? 'ring-2 ring-blue-500 border-transparent' : ''
          ]"
        >
          <span class="truncate">{{ displayValue }}</span>
          <UIcon name="i-heroicons-chevron-down-20-solid" class="w-5 h-5 text-gray-400 transition-transform" :class="[open && 'transform rotate-180']" />
        </div>
      </template>

      <template #panel>
        <div class="p-4 w-[600px] max-w-[90vw] flex flex-col gap-4">
            
          <!-- Search -->
          <UInput
            v-if="component.props?.searchable !== false"
            v-model="searchQuery"
            icon="i-heroicons-magnifying-glass-20-solid"
            placeholder="Search..."
            autofocus
            class="w-full"
          />

          <!-- Tabs Header -->
          <div class="flex border-b border-gray-200 dark:border-gray-700">
            <button
              v-for="(tab, index) in tabs"
              :key="index"
              class="px-4 py-2 text-sm font-medium transition-colors border-b-2"
              :class="[
                activeTabIndex === index
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              ]"
              @click="onTabChange(index)"
            >
              <div class="flex items-center gap-2">
                 <UIcon v-if="tab.props?.icon" :name="tab.props.icon" class="w-4 h-4" />
                 {{ tab.label }}
              </div>
            </button>
          </div>

          <!-- Tab Content -->
          <div class="min-h-[200px] max-h-[400px] overflow-y-auto">
             <div v-if="tabs[activeTabIndex]" class="flex flex-col gap-3">
                 <!-- Iterate over children of the active tab -->
                 <component
                    v-for="(child, idx) in tabs[activeTabIndex].content"
                    :key="idx"
                    :is="renderChild(child)"
                 />
                 <div v-if="tabs[activeTabIndex].content.length === 0" class="text-gray-400 text-center py-8">
                     No content
                 </div>
             </div>
          </div>

        </div>
      </template>
    </UPopover>

    <span v-if="validationErrors[component.props.key]" class="text-xs text-red-500 mt-1">
      {{ validationErrors[component.props.key] }}
    </span>
  </div>
</template>
