<template>
  <div class="w-full">
    <!-- Toolbar -->
    <div class="flex gap-2 mb-3">
      <UButton
        icon="i-heroicons-plus"
        :label="$t('ADD ROW')"
        class="btnPrimary"
        @click="addRow"
      />
      <UButton
        icon="i-heroicons-trash"
        :label="$t('DELETE SELECTED')"
        class="btnSecondary"
        @click="deleteSelected"
        :disabled="selectedRowIndices.length === 0"
      />
    </div>

    <!-- Table -->
    <div class="w-full rounded-xl overflow-x-auto border">
      <table class="w-full">
        <thead class="text-sm uppercase font-semibold bg-gray-50 dark:bg-gray-800">
          <tr>
            <th class="px-4 py-3 w-12">
              <input
                type="checkbox"
                @change="toggleSelectAll"
                :checked="isAllSelected"
                class="w-4 h-4 rounded"
              />
            </th>
            <th
              v-for="(col, index) in columns"
              :key="index"
              class="px-4 py-3 text-left"
            >
              {{ $t(col.text?.toUpperCase() || col.label?.toUpperCase() || '') }}
              <span v-if="col.required" class="text-red-500">*</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            class="border-t hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <td class="px-4 py-3">
              <input
                type="checkbox"
                v-model="selectedRowIndices"
                :value="rowIndex"
                class="w-4 h-4 rounded"
              />
            </td>
            <td
              v-for="(col, colIndex) in columns"
              :key="colIndex"
              class="px-4 py-3"
            >
              <component
                :is="renderCell(row, col, rowIndex)"
              />
            </td>
          </tr>
          <tr v-if="rows.length === 0">
            <td :colspan="columns.length + 1" class="text-center p-4 text-gray-400">
              {{ $t('NO DATA AVAILABLE') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h, watch } from 'vue';
import { UButton } from '#components';
import { FormSelect } from '#components';

const props = defineProps({
  columns: { type: Array, required: true },
  modelValue: { type: Array, default: () => [] },
  tableKey: { type: String, required: true },
  formData: { type: Object, required: true },
});

const emit = defineEmits(['update:modelValue']);

// Initialize rows from modelValue or create one empty row
const rows = ref(props.modelValue.length > 0 ? [...props.modelValue] : [createEmptyRow()]);
const selectedRowIndices = ref<number[]>([]);

// Watch for external changes to modelValue
watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal.length > 0) {
    rows.value = [...newVal];
  }
}, { deep: true });

// Watch rows and emit changes
watch(rows, (newRows) => {
  emit('update:modelValue', newRows);
  // Also update formData with the table key
  if (props.formData) {
    props.formData[props.tableKey] = newRows;
  }
}, { deep: true });

function createEmptyRow() {
  const row: any = {};
  props.columns.forEach((col: any) => {
    const key = col.key || col.props?.key;
    if (key) {
      // Initialize with appropriate default values
      switch (col.type?.toLowerCase()) {
        case 'number':
          row[key] = 0;
          break;
        case 'bool':
        case 'boolean':
          row[key] = false;
          break;
        case 'select':
          row[key] = '';
          break;
        default:
          row[key] = '';
      }
    }
  });
  return row;
}

function addRow() {
  rows.value.push(createEmptyRow());
}

function deleteSelected() {
  if (selectedRowIndices.value.length === 0) return;
  
  // Sort indices in descending order to avoid index shifting issues
  const sortedIndices = [...selectedRowIndices.value].sort((a, b) => b - a);
  
  sortedIndices.forEach(index => {
    rows.value.splice(index, 1);
  });
  
  selectedRowIndices.value = [];
  
  // Ensure at least one row remains
  if (rows.value.length === 0) {
    rows.value.push(createEmptyRow());
  }
}

const isAllSelected = computed(() => {
  return rows.value.length > 0 && selectedRowIndices.value.length === rows.value.length;
});

function toggleSelectAll(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.checked) {
    selectedRowIndices.value = rows.value.map((_, index) => index);
  } else {
    selectedRowIndices.value = [];
  }
}

function renderCell(row: any, col: any, rowIndex: number) {
  const key = col.key || col.props?.key;
  const type = (col.type || col.props?.type || 'text').toLowerCase();
  const colProps = col.props || col;

  // Create a computed model for two-way binding
  const modelValue = computed({
    get: () => row[key],
    set: (val) => {
      row[key] = val;
      
      // Handle computed fields (e.g., total = quantity * price)
      if (colProps.computed) {
        handleComputedField(row, colProps.computed);
      }
    }
  });

  switch (type) {
    case 'number':
      return h('input', {
        type: 'number',
        class: 'w-full border rounded px-2 py-1 text-right focus:ring focus:ring-blue-200 outline-none',
        value: modelValue.value,
        step: colProps.step || 'any',
        min: colProps.min,
        max: colProps.max,
        onInput: (e: any) => {
          const value = e.target.value;
          modelValue.value = value === '' ? 0 : parseFloat(value);
        }
      });

    case 'select':
      // For select, we need to use the FormSelect component
      const selectFormData = ref({ [key]: modelValue.value });
      
      watch(() => selectFormData.value[key], (newVal) => {
        modelValue.value = newVal;
      });
      
      watch(() => modelValue.value, (newVal) => {
        selectFormData.value[key] = newVal;
      });

      return h(FormSelect, {
        component: colProps,
        formData: selectFormData,
        validationErrors: {},
        validateField: () => {},
        class: 'w-full'
      });

    case 'date':
      return h('input', {
        type: 'date',
        class: 'w-full border rounded px-2 py-1 focus:ring focus:ring-blue-200 outline-none',
        value: modelValue.value,
        onInput: (e: any) => modelValue.value = e.target.value
      });

    case 'bool':
    case 'boolean':
      return h('input', {
        type: 'checkbox',
        class: 'w-4 h-4 rounded',
        checked: modelValue.value,
        onChange: (e: any) => modelValue.value = e.target.checked
      });

    case 'text':
    default:
      return h('input', {
        type: 'text',
        class: 'w-full border rounded px-2 py-1 focus:ring focus:ring-blue-200 outline-none',
        value: modelValue.value,
        placeholder: colProps.place || '',
        maxlength: colProps.length,
        onInput: (e: any) => modelValue.value = e.target.value
      });
  }
}

function handleComputedField(row: any, computedConfig: any) {
  // Example: { formula: "quantity * price", target: "total" }
  if (computedConfig.formula && computedConfig.target) {
    try {
      // Simple formula evaluation (you can extend this)
      const formula = computedConfig.formula;
      const result = evaluateFormula(formula, row);
      row[computedConfig.target] = result;
    } catch (err) {
      console.error('Error computing field:', err);
    }
  }
}

function evaluateFormula(formula: string, row: any): number {
  // Replace variable names with their values
  let expression = formula;
  
  // Find all variables in the formula (alphanumeric + underscore)
  const variables = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || [];
  
  variables.forEach(varName => {
    const value = row[varName] || 0;
    expression = expression.replace(new RegExp(varName, 'g'), String(value));
  });
  
  // Evaluate the expression safely
  try {
    // Use Function constructor for safe evaluation
    return new Function('return ' + expression)();
  } catch {
    return 0;
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style>
