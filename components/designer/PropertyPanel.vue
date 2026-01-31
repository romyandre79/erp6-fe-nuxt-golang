<template>
  <div class="h-full flex flex-col bg-white dark:bg-gray-900">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
      <h3 class="font-bold text-white flex items-center gap-2">
        <UIcon name="heroicons:adjustments-horizontal" class="w-5 h-5" />
        Properties
      </h3>
      <button 
        @click="$emit('close')"
        class="p-1 hover:bg-white/20 rounded-lg transition-colors"
      >
        <UIcon name="heroicons:x-mark" class="w-5 h-5 text-white" />
      </button>
    </div>

    <!-- No Selection State -->
    <div v-if="!modelValue" class="flex-1 flex items-center justify-center p-6">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
          <UIcon name="heroicons:cursor-arrow-rays" class="w-8 h-8 text-gray-400" />
        </div>
        <h4 class="font-medium text-gray-700 dark:text-gray-300 mb-1">No Selection</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400">Select a block to edit its properties</p>
      </div>
    </div>

    <!-- Properties Panel -->
    <div v-else class="flex-1 overflow-y-auto">
      <!-- Component Info Header -->
      <div class="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
        <div class="flex items-center gap-3">
          <div 
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            :style="{ backgroundColor: typeColor + '20' }"
          >
            <UIcon :name="typeIcon" class="w-5 h-5" :style="{ color: typeColor }" />
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-gray-100 text-sm">{{ modelValue.label || modelValue.type }}</h4>
            <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ modelValue.type }}</p>
          </div>
        </div>
      </div>

      <!-- Accordion Sections -->
      <div class="divide-y divide-gray-100 dark:divide-gray-800">
        <!-- General Section -->
        <PropertySection 
          title="General" 
          icon="heroicons:cog-6-tooth" 
          :expanded="expandedSections.includes('general')"
          @toggle="toggleSection('general')"
        >
          <div class="space-y-3">
            <PropertyField v-if="hasKey" label="Key" hint="Unique identifier">
              <input 
                v-model="localProps.key" 
                type="text"
                class="prop-input"
                placeholder="field_key"
                @input="emitUpdate"
              />
            </PropertyField>

            <PropertyField v-if="hasText" label="Label" hint="Display text">
              <input 
                v-model="localProps.text" 
                type="text"
                class="prop-input"
                placeholder="Field Label"
                @input="emitUpdate"
              />
            </PropertyField>

            <PropertyField v-if="hasPlace" label="Placeholder">
              <input 
                v-model="localProps.place" 
                type="text"
                class="prop-input"
                placeholder="Placeholder text..."
                @input="emitUpdate"
              />
            </PropertyField>

            <PropertyField v-if="hasSource" label="Data Source">
              <input 
                v-model="localProps.source" 
                type="text"
                class="prop-input"
                placeholder="api/data/source"
                @input="emitUpdate"
              />
            </PropertyField>
          </div>
        </PropertySection>

        <!-- Appearance Section -->
        <PropertySection 
          title="Appearance" 
          icon="heroicons:paint-brush" 
          :expanded="expandedSections.includes('appearance')"
          @toggle="toggleSection('appearance')"
        >
          <div class="space-y-3">
            <PropertyField label="CSS Class">
              <input 
                v-model="localProps.class" 
                type="text"
                class="prop-input font-mono text-xs"
                placeholder="flex gap-2 p-4..."
                @input="emitUpdate"
              />
            </PropertyField>

            <PropertyField v-if="hasIcon" label="Icon">
              <input 
                v-model="localProps.icon" 
                type="text"
                class="prop-input"
                placeholder="heroicons:icon-name"
                @input="emitUpdate"
              />
            </PropertyField>
          </div>
        </PropertySection>

        <!-- Behavior Section -->
        <PropertySection 
          title="Behavior" 
          icon="heroicons:bolt" 
          :expanded="expandedSections.includes('behavior')"
          @toggle="toggleSection('behavior')"
        >
          <div class="space-y-3">
            <PropertyField v-if="hasPrimary" label="Primary">
              <ToggleSwitch v-model="localProps.primary" @update:modelValue="emitUpdate" />
            </PropertyField>

            <PropertyField v-if="hasEnabled" label="Enabled">
              <ToggleSwitch v-model="localProps.enabled" @update:modelValue="emitUpdate" />
            </PropertyField>

            <PropertyField v-if="hasRequired" label="Required">
              <ToggleSwitch v-model="localProps.required" @update:modelValue="emitUpdate" />
            </PropertyField>

            <PropertyField v-if="hasMultiple" label="Multiple">
              <ToggleSwitch v-model="localProps.multiple" @update:modelValue="emitUpdate" />
            </PropertyField>
          </div>
        </PropertySection>

        <!-- Dependencies Section -->
        <PropertySection 
          v-if="hasDependency"
          title="Dependencies" 
          icon="heroicons:arrows-pointing-out" 
          :expanded="expandedSections.includes('dependencies')"
          @toggle="toggleSection('dependencies')"
        >
          <div class="space-y-2">
            <div 
              v-for="(dep, i) in localProps.dependency" 
              :key="i"
              class="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg"
            >
              <input 
                v-model="dep.key" 
                type="text"
                class="prop-input flex-1 !py-1.5 text-xs"
                placeholder="Parent Key"
                @input="emitUpdate"
              />
              <UIcon name="heroicons:arrow-right" class="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input 
                v-model="dep.param" 
                type="text"
                class="prop-input flex-1 !py-1.5 text-xs"
                placeholder="Param"
                @input="emitUpdate"
              />
              <button 
                @click="removeDependency(i)"
                class="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              >
                <UIcon name="heroicons:x-mark" class="w-4 h-4" />
              </button>
            </div>
            <button 
              @click="addDependency"
              class="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg flex items-center justify-center gap-1 transition-colors"
            >
              <UIcon name="heroicons:plus" class="w-4 h-4" />
              Add Dependency
            </button>
          </div>
        </PropertySection>

        <!-- Advanced Section -->
        <PropertySection 
          title="Advanced" 
          icon="heroicons:code-bracket" 
          :expanded="expandedSections.includes('advanced')"
          @toggle="toggleSection('advanced')"
        >
          <div class="space-y-3">
            <!-- Show remaining props not covered by other sections -->
            <template v-for="(value, key) in advancedProps" :key="key">
              <PropertyField :label="String(key)" v-if="!isObject(value) && !Array.isArray(value)">
                <template v-if="typeof value === 'boolean'">
                  <ToggleSwitch v-model="localProps[key]" @update:modelValue="emitUpdate" />
                </template>
                <template v-else-if="typeof value === 'number'">
                  <input 
                    v-model.number="localProps[key]" 
                    type="number"
                    class="prop-input"
                    @input="emitUpdate"
                  />
                </template>
                <template v-else>
                  <input 
                    v-model="localProps[key]" 
                    type="text"
                    class="prop-input"
                    @input="emitUpdate"
                  />
                </template>
              </PropertyField>
            </template>
          </div>
        </PropertySection>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import PropertySection from './PropertySection.vue';
import PropertyField from './PropertyField.vue';
import ToggleSwitch from './ToggleSwitch.vue';

interface NodeProps {
  key?: string;
  text?: string;
  label?: string;
  place?: string;
  class?: string;
  source?: string;
  icon?: string;
  primary?: boolean;
  enabled?: boolean;
  required?: boolean;
  multiple?: boolean;
  dependency?: Array<{ key: string; param: string }>;
  [key: string]: any;
}

interface NodeSchema {
  id: string;
  type: string;
  label: string;
  props: NodeProps;
  children?: NodeSchema[];
}

const props = defineProps<{
  modelValue: NodeSchema | null;
}>();

const emit = defineEmits(['update:modelValue', 'close']);

const expandedSections = ref(['general', 'behavior']);
const localProps = ref<NodeProps>({});

// Watch for external changes
watch(() => props.modelValue?.props, (newProps) => {
  if (newProps) {
    localProps.value = { ...newProps };
  }
}, { immediate: true, deep: true });

// Type-based styling
const typeColor = computed(() => {
  const colors: Record<string, string> = {
    text: '#3b82f6', longtext: '#3b82f6', html: '#3b82f6',
    select: '#f59e0b', bool: '#f59e0b', radio: '#f59e0b',
    date: '#ef4444', datetime: '#ef4444', time: '#ef4444',
    row: '#8b5cf6', col: '#8b5cf6', columns: '#8b5cf6',
    table: '#0ea5e9', chart: '#0ea5e9',
    button: '#14b8a6', action: '#14b8a6',
  };
  return colors[props.modelValue?.type || ''] || '#6b7280';
});

const typeIcon = computed(() => {
  const icons: Record<string, string> = {
    text: 'heroicons:pencil-square',
    longtext: 'heroicons:document-text',
    select: 'heroicons:list-bullet',
    bool: 'heroicons:check-circle',
    date: 'heroicons:calendar',
    row: 'heroicons:bars-3',
    col: 'heroicons:view-columns',
    table: 'heroicons:table-cells',
    button: 'heroicons:stop',
  };
  return icons[props.modelValue?.type || ''] || 'heroicons:cube';
});

// Property availability checks
const hasKey = computed(() => 'key' in (localProps.value || {}));
const hasText = computed(() => 'text' in (localProps.value || {}));
const hasPlace = computed(() => 'place' in (localProps.value || {}));
const hasSource = computed(() => 'source' in (localProps.value || {}));
const hasIcon = computed(() => 'icon' in (localProps.value || {}));
const hasPrimary = computed(() => 'primary' in (localProps.value || {}));
const hasEnabled = computed(() => 'enabled' in (localProps.value || {}));
const hasRequired = computed(() => 'required' in (localProps.value || {}));
const hasMultiple = computed(() => 'multiple' in (localProps.value || {}));
const hasDependency = computed(() => 'dependency' in (localProps.value || {}));

// Get advanced props (not in other sections)
const standardKeys = ['key', 'text', 'label', 'place', 'class', 'source', 'icon', 'primary', 'enabled', 'required', 'multiple', 'dependency', 'type'];
const advancedProps = computed(() => {
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(localProps.value || {})) {
    if (!standardKeys.includes(k)) {
      result[k] = v;
    }
  }
  return result;
});

function isObject(val: any) {
  return val && typeof val === 'object' && !Array.isArray(val);
}

function toggleSection(section: string) {
  const idx = expandedSections.value.indexOf(section);
  if (idx === -1) {
    expandedSections.value.push(section);
  } else {
    expandedSections.value.splice(idx, 1);
  }
}

function emitUpdate() {
  if (props.modelValue) {
    emit('update:modelValue', {
      ...props.modelValue,
      props: { ...localProps.value }
    });
  }
}

function addDependency() {
  if (!localProps.value.dependency) {
    localProps.value.dependency = [];
  }
  localProps.value.dependency.push({ key: '', param: '' });
  emitUpdate();
}

function removeDependency(index: number) {
  localProps.value.dependency?.splice(index, 1);
  emitUpdate();
}
</script>

<style scoped>
.prop-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  background-color: #f3f4f6;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: all 0.15s ease;
}
.prop-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px #3b82f6;
}
.prop-input::placeholder {
  color: #9ca3af;
}
</style>
