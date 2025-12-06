<template>
  <UModal v-model="isOpen" :ui="{ width: 'sm:max-w-4xl' }">
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Execute Table Operation</h3>
          <UButton icon="heroicons:x-mark" color="gray" variant="ghost" @click="closeModal" />
        </div>
      </template>

      <div class="space-y-4">
        <!-- Operation Selector -->
        <div>
          <label class="block text-sm font-medium mb-2">Operation Type</label>
          <USelectMenu
            v-model="selectedOperation"
            :options="operations"
            placeholder="Select operation"
            @update:model-value="generateSQLPreview"
          />
        </div>

        <!-- SQL Preview -->
        <div v-if="sqlPreview">
          <label class="block text-sm font-medium mb-2">Generated SQL Preview</label>
          <div class="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
            <pre v-for="(sql, index) in sqlPreview" :key="index" class="mb-2">{{ sql }}</pre>
          </div>
        </div>

        <!-- Execution Results -->
        <div v-if="executionResults.length > 0" class="mt-4">
          <label class="block text-sm font-medium mb-2">Execution Results</label>
          <div class="space-y-2">
            <div
              v-for="(result, index) in executionResults"
              :key="index"
              class="p-3 rounded-lg"
              :class="result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2">
                    <UIcon
                      :name="result.success ? 'heroicons:check-circle' : 'heroicons:x-circle'"
                      :class="result.success ? 'text-green-600' : 'text-red-600'"
                      class="w-5 h-5"
                    />
                    <span class="font-medium" :class="result.success ? 'text-green-800' : 'text-red-800'">
                      {{ result.success ? 'Success' : 'Failed' }}
                    </span>
                  </div>
                  <div class="mt-1 text-sm text-gray-600 font-mono">{{ result.sql }}</div>
                  <div v-if="result.execution_time" class="mt-1 text-xs text-gray-500">
                    Execution time: {{ result.execution_time }}ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-start gap-2">
            <UIcon name="heroicons:exclamation-triangle" class="text-red-600 w-5 h-5 mt-0.5" />
            <div class="flex-1">
              <p class="font-medium text-red-800">Error</p>
              <p class="text-sm text-red-600 mt-1">{{ errorMessage }}</p>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="gray" variant="outline" @click="closeModal">Cancel</UButton>
          <UButton
            color="primary"
            :loading="loading"
            :disabled="!selectedOperation || !sqlPreview"
            @click="executeOperation"
          >
            <UIcon name="heroicons:play" class="w-4 h-4 mr-1" />
            Execute
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDbobjectStore } from '~/store/dbobject';
import { useToast } from '#imports';

const props = defineProps<{
  modelValue: boolean;
  table: any;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  success: [];
}>();

const store = useDbobjectStore();
const toast = useToast();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const operations = [
  { label: 'CREATE TABLE', value: 'create' },
  { label: 'ALTER TABLE', value: 'alter' },
  { label: 'DROP TABLE', value: 'drop' },
];

const selectedOperation = ref(null);
const sqlPreview = ref<string[]>([]);
const executionResults = ref<any[]>([]);
const errorMessage = ref('');
const loading = ref(false);

function generateSQLPreview() {
  if (!selectedOperation.value || !props.table) {
    sqlPreview.value = [];
    return;
  }

  // Generate SQL preview based on operation
  const tableName = props.table.name;
  const columns = props.table.columns || [];

  switch (selectedOperation.value) {
    case 'create':
      sqlPreview.value = [generateCreateTableSQL(tableName, columns)];
      break;
    case 'alter':
      sqlPreview.value = [`-- ALTER TABLE statements will be generated based on existing table structure`];
      break;
    case 'drop':
      sqlPreview.value = [`DROP TABLE IF EXISTS \`${tableName}\``];
      break;
  }
}

function generateCreateTableSQL(tableName: string, columns: any[]): string {
  const colDefs = columns.map((col) => {
    let def = `  \`${col.name}\` `;

    // Map types
    switch (col.type?.toLowerCase()) {
      case 'auto':
        def += 'INT AUTO_INCREMENT PRIMARY KEY';
        break;
      case 'text':
        def += 'VARCHAR(255)';
        break;
      case 'boolean':
        def += 'TINYINT(1)';
        break;
      case 'timestamp':
        def += 'TIMESTAMP';
        break;
      default:
        def += 'VARCHAR(255)';
    }

    // Add constraints
    if (col.type?.toLowerCase() !== 'auto') {
      if (col.allownull === 'false' || col.allownull === false) {
        def += ' NOT NULL';
      }
      if (col.default) {
        if (col.default === 'CURRENT_TIMESTAMP') {
          def += ' DEFAULT CURRENT_TIMESTAMP';
        } else {
          def += ` DEFAULT '${col.default}'`;
        }
      }
    }

    return def;
  });

  return `CREATE TABLE \`${tableName}\` (\n${colDefs.join(',\n')}\n)`;
}

async function executeOperation() {
  if (!selectedOperation.value || !props.table) return;

  loading.value = true;
  errorMessage.value = '';
  executionResults.value = [];

  try {
    const tableData = {
      table: props.table,
      relations: [],
      areas: [],
    };

    const response = await store.executeTableOperation(selectedOperation.value, tableData);

    if (response?.data?.results) {
      executionResults.value = response.data.results;
      toast.add({
        title: 'Success',
        description: `${selectedOperation.value.toUpperCase()} operation completed successfully`,
        color: 'success',
      });
      emit('success');
    } else if (response?.message === 'NO_CHANGES_DETECTED') {
      toast.add({
        title: 'No Changes',
        description: 'No schema changes detected',
        color: 'info',
      });
    }
  } catch (error: any) {
    console.error('Execution error:', error);
    errorMessage.value = error?.response?.data?.details || error?.message || 'Failed to execute operation';
    toast.add({
      title: 'Error',
      description: errorMessage.value,
      color: 'error',
    });
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  isOpen.value = false;
  selectedOperation.value = null;
  sqlPreview.value = [];
  executionResults.value = [];
  errorMessage.value = '';
}

// Watch for table changes to regenerate preview
watch(
  () => props.table,
  () => {
    if (selectedOperation.value) {
      generateSQLPreview();
    }
  },
);

// Generate preview when operation changes
watch(selectedOperation, generateSQLPreview);
</script>
