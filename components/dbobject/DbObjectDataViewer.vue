<template>
  <div class="flex flex-col h-[80vh] w-[80vw]">
    <!-- Header -->
    <div class="flex justify-between items-center p-4 border-b">
      <h3 class="font-semibold text-lg">Data Viewer: {{ tableName }}</h3>
      <div class="flex gap-2">
        <button
          @click="refreshData"
          class="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          :disabled="loading"
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

      <div v-if="!loading && rows.length === 0 && !error" class="text-center text-gray-500 mt-10">
        No data found.
      </div>

      <table v-if="rows.length > 0" class="w-full text-sm text-left border-collapse">
        <thead class="bg-gray-100 text-gray-700 uppercase font-semibold sticky top-0 z-10 shadow-sm">
          <tr>
            <th class="p-3 border-b border-r w-10 text-center text-gray-400">#</th>
            <th
              v-for="col in columns"
              :key="col"
              class="p-3 border-b border-r min-w-[150px] whitespace-nowrap"
            >
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in rows" :key="idx" class="hover:bg-gray-50 group">
            <td class="p-2 border-b border-r text-center text-gray-400 select-none bg-gray-50 group-hover:bg-gray-100">
              {{ idx + 1 }}
            </td>
            <td v-for="col in columns" :key="col" class="p-2 border-b border-r align-top font-mono text-gray-800">
               <div class="max-h-[100px] overflow-y-auto whitespace-pre-wrap break-words" :title="row[col]">
                 {{ formatValue(row[col]) }}
               </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- Footer -->
    <div class="p-2 border-t text-xs text-gray-500 flex justify-between">
      <span>{{ rows.length }} row(s) fetched.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';

const props = defineProps<{
  table: any;
}>();

const emit = defineEmits(['close']);

const loading = ref(false);
const rows = ref<any[]>([]);
const error = ref('');
const api = useApi();

const tableName = computed(() => props.table?.name || '');

const columns = computed(() => {
  if (rows.value.length === 0) return [];
  return Object.keys(rows.value[0]);
});

function formatValue(val: any) {
  if (val === null) return 'NULL';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

async function refreshData() {
  if (!props.table) return;
  
  loading.value = true;
  error.value = '';
  rows.value = [];
  
  try {
    let res;
    if (props.table.flow) {
        // Use custom flow
        const dataForm = new FormData();
        dataForm.append('flowname', props.table.flow);
        dataForm.append('menu', 'admin');
        dataForm.append('search', 'true');
        
        res = await api.post('/api/admin/execute-flow', dataForm);
    } else {
        // Default SELECT behavior
        res = await api.post('/api/admin/db/select', {
          table: props.table.name,
          limit: 100
        });
    }
    
    const data = res?.data?.data || res?.data || [];
    
    if (Array.isArray(data)) {
      rows.value = data;
    } else if (data.rows && Array.isArray(data.rows)) {
      rows.value = data.rows;
    } else {
      console.warn('Unexpected data format:', data);
      error.value = 'Unexpected data format received from server.';
    }
  } catch (err: any) {
    console.error('Fetch data error:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to fetch data';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  refreshData();
});

watch(() => props.table, () => {
    refreshData();
});
</script>

<style scoped>
th, td {
    border-color: #e5e7eb;
}
</style>
