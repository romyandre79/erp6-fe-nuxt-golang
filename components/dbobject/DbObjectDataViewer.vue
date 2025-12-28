<template>
  <div class="flex flex-col h-[80vh] w-[80vw]">
    <!-- Header -->
    <div class="flex justify-between items-center p-4 border-b">
      <h3 class="font-semibold text-lg">Data Viewer: {{ tableName }}</h3>
      <div class="flex gap-2">
        <button
          @click="addRow"
          class="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        >
          <UIcon name="heroicons:plus" class="w-4 h-4" />
          Add Row
        </button>

        <button
          @click="saveChanges"
          class="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 text-sm"
          :disabled="!canSave || saving"
        >
          <UIcon v-if="saving" name="heroicons:arrow-path" class="w-4 h-4 animate-spin" />
          <UIcon v-else name="heroicons:check" class="w-4 h-4" />
          Save Changes
        </button>

        <div class="w-px h-6 bg-gray-300 mx-1"></div>

        <button
          @click="refreshData"
          class="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
          :disabled="loading || saving"
        >
          <UIcon name="heroicons:arrow-path" class="w-4 h-4" :class="{ 'animate-spin': loading }" />
          Refresh
        </button>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <UIcon name="heroicons:x-mark" class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-auto p-4 relative">
      <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-10">
        <span class="loading loading-spinner loading-lg text-blue-600"></span>
      </div>

      <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded mb-4">
        {{ error }}
      </div>

      <div v-if="!loading && localRows.length === 0 && !error" class="text-center text-gray-500 mt-10">
        No data found.
      </div>

      <table v-if="localRows.length > 0 || columns.length > 0" class="w-full text-sm text-left border-collapse">
        <thead class="bg-gray-100 text-gray-700 uppercase font-semibold sticky top-0 z-10 shadow-sm">
          <tr>
            <th class="p-3 border-b border-r w-10 text-center text-gray-400">#</th>
            <th v-for="col in columns" :key="col" class="p-3 border-b border-r min-w-[150px] whitespace-nowrap">
              {{ col }}
            </th>
          </tr>
          <!-- Filter Row -->
          <tr class="bg-gray-50">
            <th class="p-2 border-b border-r"></th>
            <th v-for="col in columns" :key="'filter-' + col" class="p-2 border-b border-r">
              <input
                type="text"
                v-model="columnFilters[col]"
                @keydown.enter="refreshData"
                placeholder="Filter..."
                class="w-full px-2 py-1 text-xs border rounded focus:border-blue-500 outline-none"
              />
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, idx) in localRows"
            :key="idx"
            class="hover:bg-gray-50 group"
            :class="{
              'bg-yellow-50': modifiedRowIndices.has(idx),
              'bg-green-50': newRowIndices.has(idx),
            }"
          >
            <td class="p-2 border-b border-r text-center text-gray-400 select-none group-hover:bg-gray-100 relative">
              {{ idx + 1 + (page - 1) * pageSize }}
              <div v-if="modifiedRowIndices.has(idx)" class="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>
              <div v-if="newRowIndices.has(idx)" class="absolute left-0 top-0 bottom-0 w-1 bg-green-400"></div>
            </td>
            <td
              v-for="col in columns"
              :key="col"
              class="p-0 border-b border-r align-top font-mono text-gray-800 relative min-w-[100px]"
              @click="startEdit(idx, col)"
            >
              <!-- View Mode -->
              <div
                v-if="!editingCell || editingCell.rowIdx !== idx || editingCell.col !== col"
                class="p-2 w-full h-full min-h-[40px] cursor-text whitespace-pre-wrap break-words"
                :title="String(row[col])"
              >
                {{ formatValue(row[col]) }}
              </div>

              <!-- Edit Mode -->
              <div v-else class="absolute inset-0 z-20">
                <textarea
                  :id="`edit-${idx}-${col}`"
                  :value="row[col]"
                  @input="(e: any) => updateCell(idx, col, e.target.value)"
                  @blur="stopEdit"
                  @keydown.enter.prevent="stopEdit"
                  class="w-full h-full p-2 outline-none border-2 border-blue-500 bg-white resize-none shadow-lg text-sm font-mono"
                ></textarea>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Footer -->
    <div class="p-2 border-t text-xs text-gray-500 flex justify-between items-center bg-gray-50">
      <div class="flex gap-4">
        <span>Total: {{ totalRecords }} rows</span>
        <span>Page {{ page }} of {{ totalPages }}</span>
      </div>

      <div class="flex gap-2">
        <button
          @click="changePage(page - 1)"
          class="px-2 py-1 border rounded hover:bg-white disabled:opacity-50"
          :disabled="page <= 1 || loading"
        >
          Previous
        </button>
        <button
          @click="changePage(page + 1)"
          class="px-2 py-1 border rounded hover:bg-white disabled:opacity-50"
          :disabled="page >= totalPages || loading"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';

const props = defineProps<{
  table: any;
}>();

const emit = defineEmits(['close']);

const loading = ref(false);
const saving = ref(false);
const rows = ref<any[]>([]); // Original data from server
const localRows = ref<any[]>([]); // Data being edited
const error = ref('');
const api = useApi();
const toast = useToast();

// Pagination & Filtering
const page = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);
const totalPages = ref(0);
const columnFilters = ref<Record<string, string>>({});

// Editing state
const editingCell = ref<{ rowIdx: number; col: string } | null>(null);
const modifiedRowIndices = ref<Set<number>>(new Set());
const newRowIndices = ref<Set<number>>(new Set());

const tableName = computed(() => props.table?.name || '');

// Compute columns from the first row of data, or fallback to table definition if available
const columns = computed(() => {
  if (localRows.value.length > 0) return Object.keys(localRows.value[0]);
  if (props.table && props.table.columns) return props.table.columns.map((c: any) => c.name);
  return [];
});

const canSave = computed(() => modifiedRowIndices.value.size > 0 || newRowIndices.value.size > 0);

function formatValue(val: any) {
  if (val === null || val === undefined) return '';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

function startEdit(rowIdx: number, col: string) {
  editingCell.value = { rowIdx, col };
  nextTick(() => {
    // Focus the input
    const input = document.getElementById(`edit-${rowIdx}-${col}`);
    if (input) input.focus();
  });
}

function stopEdit() {
  editingCell.value = null;
}

function updateCell(rowIdx: number, col: string, value: any) {
  if (localRows.value[rowIdx][col] !== value) {
    localRows.value[rowIdx][col] = value;
    if (!newRowIndices.value.has(rowIdx)) {
      modifiedRowIndices.value.add(rowIdx);
    }
  }
}

function addRow() {
  const newRow: any = {};
  columns.value.forEach((col) => {
    newRow[col] = null; // Initialize with null or defaults
  });

  // Add to local rows
  localRows.value.unshift(newRow); // Add to top

  // Shift existing indices up by 1
  const newModified = new Set<number>();
  modifiedRowIndices.value.forEach((idx) => newModified.add(idx + 1));
  modifiedRowIndices.value = newModified;

  const newNew = new Set<number>();
  newRowIndices.value.forEach((idx) => newNew.add(idx + 1));
  newRowIndices.value = newNew;

  // Add 0 as new
  newRowIndices.value.add(0);

  // Start editing first cell
  if (columns.value.length > 0) {
    startEdit(0, columns.value[0]);
  }
}

async function saveChanges() {
  if (!props.table.modifflow) {
    alert('No Modification Flow defined for this table. Please set "modifflow" in properties.');
    return;
  }

  saving.value = true;
  error.value = '';

  const promises: Promise<any>[] = [];

  // Process New Rows
  newRowIndices.value.forEach((idx) => {
    const row = localRows.value[idx];
    promises.push(saveRow(row));
  });

  // Process Modified Rows
  modifiedRowIndices.value.forEach((idx) => {
    const row = localRows.value[idx];
    promises.push(saveRow(row));
  });

  try {
    await Promise.all(promises);
    toast.add({ title: 'Success', description: 'Changes saved successfully', color: 'success' });

    // Refresh data to get clean state
    await refreshData();
  } catch (err: any) {
    console.error('Save error:', err);
    error.value = err.message || 'Failed to save some changes';
  } finally {
    saving.value = false;
  }
}

async function saveRow(row: any) {
  const dataForm = new FormData();
  dataForm.append('flowname', props.table.modifflow);
  dataForm.append('menu', 'admin');
  dataForm.append('search', 'true');

  // Append row data
  Object.keys(row).forEach((key) => {
    // Handle nulls
    const val = row[key];
    if (val !== null && val !== undefined) {
      dataForm.append(key, typeof val === 'object' ? JSON.stringify(val) : val);
    }
  });

  return api.post('/api/admin/execute-flow', dataForm);
}

async function refreshData() {
  if (!props.table) return;

  loading.value = true;
  error.value = '';
  // Clear edit state on refresh
  modifiedRowIndices.value.clear();
  newRowIndices.value.clear();
  editingCell.value = null;
  // Don't clear localRows yet to avoid flash, but we will overwrite it.

  try {
    let res;
    // Prepare payload
    const payload: any = {
      table: props.table.name,
      limit: pageSize.value,
      rows: pageSize.value, // for flow
      page: page.value,
    };

    // Add filters
    Object.keys(columnFilters.value).forEach((key) => {
      if (columnFilters.value[key]) {
        payload[key] = columnFilters.value[key];
      }
    });

    if (props.table.flow) {
      // Use custom flow
      const dataForm = new FormData();
      dataForm.append('flowname', props.table.flow);
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');

      // Add pagination and filters to FormData
      Object.keys(payload).forEach((key) => {
        dataForm.append(key, payload[key]);
      });

      res = await api.post('/api/admin/execute-flow', dataForm);
    } else {
      // Default SELECT behavior
      // Construct payload for default select if needed, or stick to standard params
      // Assuming default select also accepts these via POST
      res = await api.post('/api/admin/db/select', payload);
    }

    const data = res?.data?.data || res?.data || [];
    const meta = res?.data?.meta || res?.data?.pagination || {};

    if (Array.isArray(data)) {
      rows.value = JSON.parse(JSON.stringify(data));
      totalRecords.value = data.length; // Fallback if no meta
    } else if (data.rows && Array.isArray(data.rows)) {
      rows.value = JSON.parse(JSON.stringify(data.rows));
      totalRecords.value = Number(data.total) || Number(meta.total) || rows.value.length;
    } else {
      // Support direct array return
      if (Array.isArray(data)) {
        rows.value = JSON.parse(JSON.stringify(data));
      } else {
        console.warn('Unexpected data format:', data);
        rows.value = [];
      }
    }

    // Update pagination info if available
    if (meta.totalPages) totalPages.value = meta.totalPages;
    else totalPages.value = Math.ceil(totalRecords.value / pageSize.value) || 1;

    // Init local rows
    localRows.value = JSON.parse(JSON.stringify(rows.value));
  } catch (err: any) {
    console.error('Fetch data error:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to fetch data';
  } finally {
    loading.value = false;
  }
}

function changePage(newPage: number) {
  if (newPage < 1 || newPage > totalPages.value) return;
  page.value = newPage;
  refreshData();
}

onMounted(() => {
  refreshData();
});

watch(
  () => props.table,
  () => {
    // Reset filters and page on table change
    page.value = 1;
    columnFilters.value = {};
    refreshData();
  },
);
</script>

<style scoped>
th,
td {
  border-color: #e5e7eb;
}
</style>
