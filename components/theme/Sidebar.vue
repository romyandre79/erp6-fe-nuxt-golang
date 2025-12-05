<template>
  <div class="h-full flex flex-row bg-white text-gray-900 shadow-sm border-r">
    <!-- Activity Bar -->
    <div class="w-12 flex flex-col items-center py-2 bg-gray-800 text-gray-400 border-r border-gray-700 z-20">
      <button
        v-for="item in activities"
        :key="item.id"
        class="p-3 mb-2 rounded hover:text-white transition-colors relative"
        :class="{ 'text-white border-l-2 border-white bg-gray-700': activeActivity === item.id && isPanelOpen }"
        @click="toggleActivity(item.id)"
        :title="item.label"
      >
        <UIcon :name="item.icon" class="w-6 h-6" />
      </button>
    </div>

    <!-- Side Panel -->
    <div
      v-show="isPanelOpen"
      class="w-96 flex flex-col bg-gray-50 border-r transition-all duration-300 ease-in-out"
    >
      <div class="p-3 border-b bg-gray-100 flex justify-between items-center">
        <span class="font-semibold text-sm uppercase text-gray-600">{{ activeLabel }}</span>
        <button @click="isPanelOpen = false" class="text-gray-500 hover:text-gray-700">
          <UIcon name="heroicons:x-mark" class="w-4 h-4" />
        </button>
      </div>

      <div class="flex-1 overflow-auto p-4">
        <!-- Design Tab -->
        <div v-if="activeActivity === 'design'" class="space-y-6">
          <!-- Actions -->
          <div class="flex gap-2">
            <button class="flex-1 py-2 px-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition" @click="$emit('save')">
              Save
            </button>
            <button class="flex-1 px-3 py-2 border rounded hover:bg-gray-100 transition" @click="$emit('reset')">
              Reset
            </button>
          </div>

          <!-- Categories -->
          <div>
            <h3 class="font-semibold text-sm text-gray-700 mb-2 uppercase tracking-wider">Categories</h3>
            <ul class="space-y-1">
              <li
                v-for="cat in categories"
                :key="cat.key"
                @click="selectedCategory = cat.key"
                :class="[
                  'cursor-pointer px-3 py-2 rounded text-sm transition',
                  selectedCategory === cat.key ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-200 text-gray-600',
                ]"
              >
                {{ cat.label }}
              </li>
            </ul>
          </div>

          <!-- Properties -->
          <div v-if="selectedCategory">
            <h3 class="font-semibold text-sm text-gray-700 mb-3 uppercase tracking-wider border-t pt-4">
              Properties
            </h3>
            
            <div v-if="currentProps.length === 0" class="text-sm text-gray-500">Select a category to edit.</div>

            <div
              v-for="prop in currentProps"
              :key="prop.key"
              class="border rounded p-3 mb-3 bg-white shadow-sm"
            >
              <div class="mb-2">
                <div class="font-medium text-sm text-gray-800">{{ prop.label }}</div>
                <div class="text-xs text-gray-400 font-mono">{{ prop.key }}</div>
              </div>

              <div class="flex items-center gap-2">
                <input
                  v-if="prop.type === 'color'"
                  type="color"
                  :value="themeState[prop.key]"
                  @input="updateTheme(prop.key, ($event.target as HTMLInputElement).value)"
                  class="w-8 h-8 p-0 border rounded cursor-pointer"
                />
                <input
                  v-else-if="prop.type === 'number'"
                  type="number"
                  :value="themeState[prop.key]"
                  @input="updateTheme(prop.key, ($event.target as HTMLInputElement).value)"
                  class="border px-2 py-1 rounded w-full text-sm"
                />
                <select
                  v-else-if="prop.type === 'select'"
                  :value="themeState[prop.key]"
                  @change="updateTheme(prop.key, ($event.target as HTMLSelectElement).value)"
                  class="border px-2 py-1 rounded w-full text-sm"
                >
                  <option v-for="opt in prop.options" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
                <input
                  v-else
                  type="text"
                  :value="themeState[prop.key]"
                  @input="updateTheme(prop.key, ($event.target as HTMLInputElement).value)"
                  class="border px-2 py-1 rounded w-full text-sm"
                />
              </div>
            </div>

            <!-- Add Custom Property -->
            <div class="mt-4 border-t pt-4">
              <h4 class="font-semibold text-sm mb-2">Add Custom Property</h4>
              <div class="flex flex-col gap-2">
                <input v-model="newKey" placeholder="property-key" class="border px-2 py-1 rounded text-sm" />
                <input v-model="newValue" placeholder="value" class="border px-2 py-1 rounded text-sm" />
                <button class="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700" @click="addCustom">
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Code Tab -->
        <div v-if="activeActivity === 'code'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700">CSS Output</label>
            <textarea readonly class="w-full h-60 font-mono text-xs p-2 border rounded bg-gray-50 text-gray-600" :value="cssText"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1 text-gray-700">JSON</label>
            <textarea readonly class="w-full h-60 font-mono text-xs p-2 border rounded bg-gray-50 text-gray-600" :value="jsonText"></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  themeState: Record<string, any>;
  cssText: string;
  jsonText: string;
}>();

const emit = defineEmits(['save', 'reset', 'update', 'add-custom']);

const activeActivity = ref('design');
const isPanelOpen = ref(true);
const selectedCategory = ref('button');
const newKey = ref('');
const newValue = ref('');

const activities = [
  { id: 'design', label: 'Design', icon: 'heroicons:paint-brush' },
  { id: 'code', label: 'Code', icon: 'heroicons:code-bracket' },
];

const activeLabel = computed(() => {
  return activities.find((a) => a.id === activeActivity.value)?.label || '';
});

function toggleActivity(id: string) {
  if (activeActivity.value === id) {
    isPanelOpen.value = !isPanelOpen.value;
  } else {
    activeActivity.value = id;
    isPanelOpen.value = true;
  }
}

function updateTheme(key: string, value: any) {
  emit('update', key, value);
}

function addCustom() {
  if (newKey.value && newValue.value) {
    emit('add-custom', newKey.value, newValue.value);
    newKey.value = '';
    newValue.value = '';
  }
}

// Categories Definition
const optionBorderStyle = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
  { value: 'double', label: 'double' },
  { value: 'hidden', label: 'hidden' },
  { value: 'none', label: 'none' },
];
const optionBorder = [
  { label: 'Border', value: 'border' },
  { label: 'None', value: '' },
];
const optionRounded = [
  { label: 'Rounded', value: 'Rounded' },
  { label: 'None', value: '' },
];

const categories = [
  {
    key: 'button',
    label: 'Button',
    props: [
      { key: 'button-radius', label: 'Button Radius', type: 'text' },
      { key: 'button-border-color', label: 'Button Border Color', type: 'color' },
      { key: 'button-padding', label: 'Button Padding', type: 'text' },
      { key: 'button-color', label: 'Common Button Text Color', type: 'color' },
      { key: 'button-background', label: 'Common Button Background', type: 'color' },
      { key: 'button-hover-color', label: 'Common Button Hover Text Color', type: 'color' },
      { key: 'button-hover-background', label: 'Common Button Hover Background', type: 'color' },
      { key: 'button-primary-color', label: 'Primary Text Color', type: 'color' },
      { key: 'button-primary-background', label: 'Primary Background', type: 'color' },
      { key: 'button-primary-hover-background', label: 'Primary Hover Background', type: 'color' },
      { key: 'button-primary-hover-color', label: 'Primary Hover Text Color', type: 'color' },
      { key: 'button-secondary-color', label: 'Secondary Text Color', type: 'color' },
      { key: 'button-secondary-background', label: 'Secondary Background', type: 'color' },
      { key: 'button-secondary-hover-background', label: 'Secondary Hover Background', type: 'color' },
      { key: 'button-secondary-hover-color', label: 'Secondary Hover Text Color', type: 'color' },
    ],
  },
  {
    key: 'common',
    label: 'Common',
    props: [
      { key: 'body-background', label: 'Body Background Color', type: 'color' },
      { key: 'body-color', label: 'Body Text Color', type: 'color' },
      { key: 'border-color', label: 'Common Border Color', type: 'color' },
      { key: 'border-radius', label: 'Common Border Radius', type: 'text' },
      { key: 'border', label: 'Common Border', type: 'select', options: optionBorder },
      { key: 'font-size', label: 'Common Font Size', type: 'text' },
      { key: 'font-family', label: 'Common Font Family', type: 'text' },
    ],
  },
  {
    key: 'nav',
    label: 'Nav',
    props: [
      { key: 'nav-background', label: 'Nav Background', type: 'color' },
      { key: 'nav-color', label: 'Nav Color', type: 'color' },
    ],
  },
  {
    key: 'navbar-admin',
    label: 'Navbar Admin',
    props: [
      { key: 'navbar-admin-background', label: 'Navbar Admin Background', type: 'color' },
      { key: 'navbar-admin-color', label: 'Navbar Admin Color', type: 'color' },
    ],
  },
  {
    key: 'link',
    label: 'Link',
    props: [
      { key: 'a-background', label: 'Link Background', type: 'color' },
      { key: 'a-color', label: 'Link Color', type: 'color' },
      { key: 'a-hover-background', label: 'Link Hover Background', type: 'color' },
      { key: 'a-hover-color', label: 'Link Hover Color', type: 'color' },
    ],
  },
  {
    key: 'heading',
    label: 'Heading',
    props: [
      { key: 'h1-color', label: 'H1 Font Color', type: 'color' },
      { key: 'h1-font-size', label: 'H1 Font Size', type: 'text' },
      { key: 'h1-padding-top', label: 'H1 Padding Top', type: 'text' },
      { key: 'h1-padding-bottom', label: 'H1 Padding Bottom', type: 'text' },
      { key: 'h2-color', label: 'H2 Font Color', type: 'color' },
      { key: 'h2-font-size', label: 'H2 Font Size', type: 'text' },
      { key: 'h2-padding-top', label: 'H2 Padding Top', type: 'text' },
      { key: 'h2-padding-bottom', label: 'H2 Padding Bottom', type: 'text' },
      { key: 'p-color', label: 'Paragraph Font Color', type: 'color' },
      { key: 'p-font-size', label: 'Paragraph Font Size', type: 'text' },
      { key: 'p-padding-top', label: 'Paragraph Padding Top', type: 'text' },
      { key: 'p-padding-bottom', label: 'Paragraph Padding Bottom', type: 'text' },
    ],
  },
  {
    key: 'table',
    label: 'Table',
    props: [
      { key: 'table-color', label: 'Table Font Color', type: 'color' },
      { key: 'table-border-size', label: 'Table Border Size', type: 'text' },
      { key: 'table-border-style', label: 'Table Border Style', type: 'select', options: optionBorderStyle },
      { key: 'table-border-color', label: 'Table Border Color', type: 'color' },
      { key: 'table-background', label: 'Table Background Color', type: 'color' },
      { key: 'table-head-color', label: 'Table Head Color', type: 'color' },
      { key: 'table-head-background', label: 'Table Head Background Color', type: 'color' },
      { key: 'table-row-even-color', label: 'Table Row Even Color', type: 'color' },
      { key: 'table-row-even-background', label: 'Table Row Even Background Color', type: 'color' },
      { key: 'table-row-odd-color', label: 'Table Row Odd Color', type: 'color' },
      { key: 'table-row-odd-background', label: 'Table Row odd Background Color', type: 'color' },
      { key: 'table-footer-color', label: 'Table Footer Color', type: 'color' },
      { key: 'table-footer-background', label: 'Table Footer Background Color', type: 'color' },
      { key: 'table-pagination-color', label: 'Table Pagination Color', type: 'color' },
      { key: 'table-pagination-background', label: 'Table Pagination Background Color', type: 'color' },
    ],
  },
  {
    key: 'input',
    label: 'Input',
    props: [
      { key: 'label-color', label: 'Label Font Color', type: 'color' },
      { key: 'label-background', label: 'Label Background Color', type: 'color' },
      { key: 'input-color', label: 'Input Font Color', type: 'color' },
      { key: 'input-background', label: 'Input Background Color', type: 'color' },
      { key: 'input-border-size', label: 'Input Border Size', type: 'text' },
      { key: 'input-border-style', label: 'Input Border Style', type: 'select', options: optionBorderStyle },
      { key: 'input-focus-border-color', label: 'Input Focus Border Color', type: 'color' },
      { key: 'input-rounded', label: 'Input Rounded', type: 'select', options: optionRounded },
    ],
  },
  {
    key: 'panel',
    label: 'Panel',
    props: [
      { key: 'panel-background', label: 'Panel Background', type: 'color' },
      { key: 'panel-color', label: 'Panel Color', type: 'color' },
      { key: 'panel-header-background', label: 'Panel Header Background', type: 'color' },
      { key: 'panel-header-color', label: 'Panel Header Color', type: 'color' },
      { key: 'panel-shadow', label: 'Panel Shadow', type: 'color' },
    ],
  },
  {
    key: 'tab',
    label: 'Tab',
    props: [
      { key: 'tab-color', label: 'Tab Color', type: 'color' },
      { key: 'tab-active-background', label: 'Tab Active Background', type: 'color' },
      { key: 'tab-active-color', label: 'Tab Active Header Color', type: 'color' },
      { key: 'tab-border-color', label: 'Tab Border Color', type: 'color' },
    ],
  },
  {
    key: 'accordion',
    label: 'Accordion',
    props: [
      { key: 'accordion-header-background', label: 'Accordion Header Background', type: 'color' },
      { key: 'accordion-header-active-background', label: 'Accordion Header Active Background', type: 'color' },
      { key: 'accordion-header-color', label: 'Accordion Header Color', type: 'color' },
    ],
  },
  {
    key: 'slider',
    label: 'Slider',
    props: [
      { key: 'slider-track-background', label: 'Slider Track Background', type: 'color' },
      { key: 'slider-thumb-background', label: 'Slider Thumb Background', type: 'color' },
      { key: 'slider-thumb-border-color', label: 'Slider Thumb Border Color', type: 'color' },
    ],
  },
  {
    key: 'progress',
    label: 'Progress',
    props: [
      { key: 'progress-background', label: 'Progress Background', type: 'color' },
      { key: 'progress-bar-background', label: 'Progress Bar Background', type: 'color' },
      { key: 'progress-bar-color', label: 'Progress Bar Color', type: 'color' },
    ],
  },
  {
    key: 'calendar',
    label: 'Calendar',
    props: [
      { key: 'calendar-background', label: 'Calendar Background', type: 'color' },
      { key: 'calendar-header-background', label: 'Calendar Header Background', type: 'color' },
      { key: 'calendar-header-color', label: 'Calendar Header Color', type: 'color' },
      { key: 'calendar-day-color', label: 'Calendar Day Color', type: 'color' },
      { key: 'calendar-day-hover-background', label: 'Calendar Day Hover Background', type: 'color' },
      { key: 'calendar-today-background', label: 'Calendar Today Background', type: 'color' },
      { key: 'calendar-today-color', label: 'Calendar Today Color', type: 'color' },
    ],
  },
  {
    key: 'dialog',
    label: 'Dialog',
    props: [
      { key: 'dialog-background', label: 'Dialog Background', type: 'color' },
      { key: 'dialog-color', label: 'Dialog Color', type: 'color' },
      { key: 'dialog-header-background', label: 'Dialog Header Background', type: 'color' },
      { key: 'dialog-header-color', label: 'Dialog Header Color', type: 'color' },
      { key: 'dialog-border-color', label: 'Dialog Border Color', type: 'color' },
      { key: 'dialog-shadow', label: 'Dialog Shadow', type: 'color' },
    ],
  },
];

const currentProps = computed(() => {
  if (!selectedCategory.value) return [];
  const cat = categories.find((c) => c.key === selectedCategory.value);
  return cat ? cat.props : [];
});
</script>
