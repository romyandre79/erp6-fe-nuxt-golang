<template>
  <div
    class="group relative rounded-xl cursor-grab transition-all duration-200 select-none"
    :class="[
      compact 
        ? 'p-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md hover:shadow-blue-100 dark:hover:shadow-blue-900/20'
        : 'p-3 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg hover:shadow-blue-100 dark:hover:shadow-blue-900/30 hover:-translate-y-0.5'
    ]"
    draggable="true"
    @dragstart="$emit('dragstart', $event)"
  >
    <!-- Drag Indicator -->
    <div 
      v-if="!compact"
      class="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-gray-200 dark:bg-gray-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
    ></div>

    <div class="flex items-center gap-2.5" :class="compact ? '' : 'pl-2'">
      <!-- Icon Container -->
      <div 
        class="flex-shrink-0 flex items-center justify-center rounded-lg transition-transform group-hover:scale-110"
        :class="compact ? 'w-8 h-8' : 'w-10 h-10'"
        :style="{ 
          backgroundColor: getIconBgColor(component.icon),
          boxShadow: compact ? 'none' : '0 2px 8px ' + getIconBgColor(component.icon) + '40'
        }"
      >
        <UIcon 
          :name="component.icon || 'heroicons:cube'" 
          class="text-white"
          :class="compact ? 'w-4 h-4' : 'w-5 h-5'"
        />
      </div>

      <!-- Text Content -->
      <div class="flex-1 min-w-0">
        <h4 
          class="font-medium text-gray-800 dark:text-gray-100 truncate leading-tight"
          :class="compact ? 'text-xs' : 'text-sm'"
        >
          {{ component.label }}
        </h4>
        <p 
          v-if="!compact && component.description"
          class="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5"
        >
          {{ component.description }}
        </p>
        <p 
          v-else-if="!compact"
          class="text-xs text-gray-400 dark:text-gray-500 truncate mt-0.5"
        >
          {{ getComponentDescription(component.type) }}
        </p>
      </div>
    </div>

    <!-- Hover Glow Effect -->
    <div 
      class="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
      :style="{ 
        background: `radial-gradient(circle at center, ${getIconBgColor(component.icon)}10 0%, transparent 70%)`
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  component: {
    type: string;
    label: string;
    icon?: string;
    description?: string;
    props?: Record<string, any>;
    children?: any[];
  };
  compact?: boolean;
}>();

defineEmits(['dragstart']);

// Icon color mapping based on category/type
function getIconBgColor(icon?: string): string {
  if (!icon) return '#6b7280';
  
  const iconColorMap: Record<string, string> = {
    // Layout
    'heroicons:squares-2x2': '#8b5cf6',
    'heroicons:view-columns': '#8b5cf6',
    'heroicons:bars-3': '#8b5cf6',
    // Text
    'heroicons:document-text': '#3b82f6',
    'heroicons:pencil-square': '#3b82f6',
    'heroicons:tag': '#3b82f6',
    'mdi:format-header-1': '#3b82f6',
    'mdi:format-header-2': '#3b82f6',
    // Inputs
    'heroicons:calculator': '#10b981',
    'heroicons:envelope': '#10b981',
    'heroicons:lock-closed': '#10b981',
    'heroicons:phone': '#10b981',
    'heroicons:link': '#10b981',
    'heroicons:eye-slash': '#10b981',
    // Selection
    'heroicons:check-circle': '#f59e0b',
    'heroicons:list-bullet': '#f59e0b',
    'heroicons:queue-list': '#f59e0b',
    'heroicons:radio': '#f59e0b',
    // DateTime
    'heroicons:calendar': '#ef4444',
    'heroicons:calendar-days': '#ef4444',
    'heroicons:clock': '#ef4444',
    // Media
    'heroicons:photo': '#ec4899',
    'heroicons:document': '#ec4899',
    'heroicons:swatch': '#ec4899',
    // Containers
    'heroicons:folder': '#6366f1',
    'heroicons:folder-open': '#6366f1',
    'heroicons:credit-card': '#6366f1',
    'heroicons:window': '#6366f1',
    'heroicons:magnifying-glass': '#6366f1',
    // Data
    'heroicons:table-cells': '#0ea5e9',
    'heroicons:chart-bar': '#0ea5e9',
    'heroicons:chart-pie': '#0ea5e9',
    // Actions
    'heroicons:bolt': '#14b8a6',
    'heroicons:stop': '#14b8a6',
    'heroicons:arrow-path': '#14b8a6',
    'heroicons:adjustments-horizontal': '#14b8a6',
  };
  
  return iconColorMap[icon] || '#6b7280';
}

// Component descriptions for help text
function getComponentDescription(type: string): string {
  const descriptions: Record<string, string> = {
    // Layout
    'row': 'Horizontal flex container',
    'col': 'Vertical flex column',
    'columns': 'Multi-column layout',
    'form': 'Form container',
    'master': 'Master-detail layout',
    'widget': 'Widget container',
    'wizard': 'Multi-step wizard',
    'step': 'Wizard step',
    // Text
    'text': 'Single line text input',
    'longtext': 'Multi-line textarea',
    'html': 'Rich text editor',
    'title': 'Heading text',
    'subtitle': 'Subheading text',
    'label': 'Static label text',
    // Inputs
    'number': 'Numeric input',
    'email': 'Email address input',
    'password': 'Secure password field',
    'tel': 'Phone number input',
    'url': 'URL/link input',
    'hidden': 'Hidden field',
    // Selection
    'select': 'Dropdown selector',
    'selectgroup': 'Grouped selector',
    'bool': 'Checkbox toggle',
    'radio': 'Radio button group',
    'megabox': 'Advanced multi-select',
    // DateTime
    'date': 'Date picker',
    'datetime': 'Date & time picker',
    'time': 'Time picker',
    'month': 'Month selector',
    'schedule': 'Cron scheduler',
    // Media
    'file': 'File upload',
    'image': 'Image upload/display',
    'color': 'Color picker',
    // Containers
    'tabs': 'Tabbed container',
    'tab': 'Single tab panel',
    'cards': 'Card grid container',
    'card': 'Info card',
    'buttons': 'Button group',
    'modals': 'Modal container',
    'modal': 'Modal dialog',
    'search': 'Search container',
    // Data
    'table': 'Data table',
    'tables': 'Multiple tables',
    'detailtable': 'Inline detail table',
    'chart': 'Single chart',
    'charts': 'Chart container',
    'kanban': 'Kanban board',
    'kanbanboard': 'Full kanban board',
    // Actions
    'button': 'Action button',
    'action': 'Action handlers',
    'callother': 'Call other flow',
    'reset': 'Form reset',
    'separator': 'Visual divider',
    'range': 'Range slider',
  };
  
  return descriptions[type] || 'Drag to add';
}
</script>
