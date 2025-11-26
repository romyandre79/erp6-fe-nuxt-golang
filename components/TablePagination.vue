<template>
  <div class="w-full">
    <!-- Header & Toolbar -->
    <div class="flex flex-col sm:flex-row mb-3">
      <h2 class="text-2xl font-semibold">{{ title }}</h2>

      <!-- Search -->
      <!-- Filter Container -->
      <div v-if="enableSearch" class="mb-4">
        <!-- SIMPLE SEARCH -->
        <div v-if="simpleSearch" class="flex items-center gap-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="border rounded px-3 py-2 text-sm w-full"
            @keyup.enter="fetchData"
          />

          <button class="px-3 py-2 bg-blue-600 text-white rounded" @click="fetchData">Cari</button>
        </div>

        <!-- COMPLEX SEARCH -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="(col, index) in searchColumn" :key="index">
            <input
              v-if="['text', 'number', 'email'].includes(col.type)"
              v-model="searchComplexQuery[col.key]"
              :type="col.type"
              :placeholder="`${$t(col.place.toUpperCase())}...`"
              class="border rounded px-3 py-2 text-sm w-full"
              @keyup.enter="fetchData"
            />
          </div>
        </div>

        <!-- Toolbar Actions -->
        <div v-if="actions && actions.length">
          <button v-for="(action, index) in actions" :key="index" @click="$emit('action', action)">
            <i v-if="action.icon" :class="['mr-1', action.icon]"></i>
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="w-full rounded-xl">
      <table class="w-full">
        <thead class="text-sm uppercase font-semibold">
          <tr>
            <th class="px-4 py-3" v-if="enableCheck && isSelectAll">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="rowsData.length > 0 && rowsData.every((r) => isSelected(r))"
                @change="toggleSelectAll"
              />
            </th>
            <th class="thead px-4 py-3" v-else></th>
            <th class="thead px-4 py-3" v-if="tables?.length > 1 && props.isInput == false"></th>
            <th v-for="col in columns" :key="col.key || col" class="thead px-4 py-3 text-left tracking-wide">
              {{ col.text || col.label }}
            </th>
            <th v-if="rowActions && rowActions.length" class="thead px-4 py-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + (rowActions?.length ? 1 : 0) + 1" class="p-4 text-center">
              <span class="loading loading-spinner loading-md"></span>
            </td>
          </tr>

          <template v-for="(row, rowIndex) in rowsData" :key="rowIndex">
            <!-- Master Row -->
            <tr class="transition-colors duration-200" @click.stop="toggleRowSelection(row)" :checked="isSelected(row)">
              <td class="px-4 py-3" v-if="enableCheck">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :checked="isSelected(row)"
                  @click.stop="toggleRowSelection(row)"
                />
              </td>

              <td class="px-4 py-3" v-if="tables?.length > 1 && props.isInput == false">
                <button @click.stop="toggleExpand(row)">
                  {{ isExpanded(row) ? '-' : '+' }}
                </button>
              </td>

              <td v-for="col in columns" :key="col.key || col" class="px-4 py-3 text-sm cursor-pointer">
                <span v-html="formatCellValue(col, row[col.key || col])"></span>
              </td>

              <td v-if="rowActions && rowActions.length" class="px-4 py-3">
                <button
                  v-for="(action, i) in rowActions"
                  :key="i"
                  :class="['btn btn-xs mr-1', action.class || 'btn-outline']"
                  @click="$emit('row-action', { action, row })"
                >
                  <i v-if="action.icon" :class="['mr-1', action.icon]"></i>
                  {{ action.label }}
                </button>
              </td>
            </tr>

            <!-- Child Row -->
            <tr v-if="isExpanded(row)">
              <td :colspan="columns.length + 2">
                <div class="rounded-lg w-full" v-for="(child, index) in tables">
                  <component :is="renderTable(child)" v-if="index > 0"></component>
                </div>
              </td>
            </tr>
          </template>

          <tr v-if="!loading && rowsData.length === 0">
            <td :colspan="columns.length + (rowActions?.length ? 1 : 0)" class="text-center p-4 text-gray-400">
              No data available
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="enablePaging" class="paging flex justify-center items-center gap-2">
        <span class="text-base-content/70"> Page {{ currentPage }} / {{ totalPages }} </span>

        <select
          v-if="enablePageSize"
          v-model.number="pageSize"
          class="border rounded px-2 py-1 text-sm"
          @change="handlePageSizeChange"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>

        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100"
          :disabled="currentPage === 1 || loading || totalPages === 0"
          @click="firstPage"
        >
          <<
        </button>
        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100"
          :disabled="currentPage === 1 || loading || totalPages === 0"
          @click="prevPage"
        >
          <
        </button>
        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100"
          :disabled="currentPage === totalPages || loading"
          @click="nextPage"
        >
          >
        </button>
        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100"
          :disabled="currentPage === totalPages || loading"
          @click="lastPage"
        >
          >>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useThemeStore } from '~/store/theme';
import { useApi } from '~/composables/useApi';
import TablePagination from '~/components/TablePagination';
import { resolveSoa } from 'dns';

const props = defineProps({
  title: String,
  endPoint: String,
  columns: { type: Array, required: true },
  actions: { type: Array, default: () => [] },
  tables: { type: Array, default: () => [] },
  rowActions: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 5 },
  pageSizeOptions: { type: Array, default: () => [5, 10, 20, 50] },
  enableSearch: { type: Boolean, default: true },
  simpleSearch: { type: Boolean, default: true },
  searchColumn: { type: Array, required: false },
  enablePaging: { type: Boolean, default: true },
  enablePageSize: { type: Boolean, default: true },
  enableCheck: { type: Boolean, default: true },
  method: { type: String, default: 'GET' },
  rowKey: { type: String, default: 'id' },
  selectedKeyData: { type: String, default: '' },
  relationKey: { type: String, default: '' },
  isInput: { type: Boolean, default: false },
  isSelectAll: { type: Boolean, default: false },
});

const emit = defineEmits(['action', 'row-action', 'fetch-params', 'selection-change']);
const themeStore = useThemeStore();
const isDark = computed(() => themeStore.theme === 'dark');
const Api = useApi();

// States
const currentPage = ref(1);
const totalPages = ref(1);
const searchQuery = ref('');
const searchComplexQuery = ref<Record<string, string>>({});
const pageSize = ref(props.pageSize);
const totalRecords = ref(0);
const rowsData = ref<any[]>([]);
const loading = ref(false);

// Selection
const selectedKeys = ref<any[]>([]);
const toggleRowSelection = (row: any) => {
  const key = row[props.rowKey];
  const index = selectedKeys.value.indexOf(key);
  if (props.isInput) {
    selectedKeys.value = [];
  }
  if (index === -1) selectedKeys.value.push(key);
  else selectedKeys.value.splice(index, 1);
};
const isSelected = (row: any) => selectedKeys.value.includes(row[props.rowKey]);
const toggleSelectAll = () => {
  const currentPageKeys = rowsData.value.map((r) => r[props.rowKey]);
  const allSelected = currentPageKeys.every((k) => selectedKeys.value.includes(k));
  selectedKeys.value = allSelected
    ? selectedKeys.value.filter((k) => !currentPageKeys.includes(k))
    : Array.from(new Set([...selectedKeys.value, ...currentPageKeys]));
};
watch(
  selectedKeys,
  (val) => {
    const selectedRows = rowsData.value.filter((r) => val.includes(r[props.rowKey]));
    emit('selection-change', selectedRows);
  },
  { deep: true },
);

// Expanded
const expandedKey = ref<any | null>(null);
const toggleExpand = (row: any) => {
  const key = row[props.rowKey];
  expandedKey.value = expandedKey.value === key ? null : key;
};
const isExpanded = (row: any) => {
  return row && expandedKey.value === row[props.rowKey];
};

// Formatter
const formatCellValue = (col: any, value: any) => {
  if (['boolean', 'bool', 'checkbox'].includes(col.type))
    return value
      ? '<input type="checkbox" checked disabled class="checkbox checkbox-sm"/>'
      : '<input type="checkbox" disabled class="checkbox checkbox-sm"/>';
  if (col.type === 'currency')
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 2 }).format(
      value || 0,
    );
  if (col.type === 'number') return new Intl.NumberFormat('id-ID').format(value || 0);
  return value ?? '';
};

// Fetch data
async function fetchData() {
  loading.value = true;
  try {
    let res;
    if (props.method.toUpperCase() === 'POST') {
      const dataForm = new FormData();
      dataForm.append('flowname', props.endPoint || '');
      dataForm.append('menu', 'admin');
      dataForm.append('search', 'true');
      dataForm.append('page', currentPage.value);
      dataForm.append('rows', pageSize.value);
      for (const col of props.columns) {
        dataForm.append(col.key, searchComplexQuery.value[col.key] || '');
      }
      if (props.selectedKeyData) {
        dataForm.append(props.relationKey, props.selectedKeyData);
      }
      res = await Api.post('/admin/execute-flow', dataForm);
    } else {
      const params = { page: currentPage.value, limit: pageSize.value, search: searchQuery.value };
      emit('fetch-params', params);
      const query = new URLSearchParams(params as any).toString();
      res = await Api.get(`${props.endPoint}?${query}`);
    }

    if (res.code === 200 && res.data?.data) {
      currentPage.value = Number(res.data.page);
      rowsData.value = res.data.data || [];
      totalRecords.value = Number(res.data.total) || Number(rowsData.value.length);
      totalPages.value = Number(res.data.meta?.totalPages) || Math.ceil(totalRecords.value / pageSize.value);
    } else {
      currentPage.value = 0;
      rowsData.value = [];
      totalPages.value = 0;
      totalRecords.value = 0;
    }
  } catch (e) {
    console.error(e);
    rowsData.value = [];
  } finally {
    loading.value = false;
  }
}

function renderTable(component: any) {
  if (!component) return null;
  const key = component.key || component.text || `table0`;

  return h('div', { key: key }, [
    h(TablePagination, {
      columns:
        component.columns?.map((col: any, i: number) => ({
          label: col.text || `Column ${i + 1}`,
          key: col.key || `col${i + 1}`,
          type: col.type || 'text',
        })) ?? [],
      searchColumn:
        component.search?.map((col: any, i: number) => ({
          key: col.key || `col${i + 1}`,
          type: col.type || 'text',
          place: col.place || 'search ...',
        })) ?? [],
      method: 'POST',
      endPoint: component.source,
      simpleSearch: false,
      title: component.text || '',
      class: component.class || 'mb-4',
      rowKey: component.primary,
      enableCheck: false,
      relationKey: component.relationkey,
      selectedKeyData: expandedKey.value,
    }),
  ]);
}

onMounted(() => {
  fetchData();
});

const handlePageSizeChange = () => {
  currentPage.value = 1;
  fetchData();
};
const firstPage = () => {
  if (currentPage.value > 0) {
    currentPage.value = 1;
    fetchData();
  }
};
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchData();
  }
};
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchData();
  }
};
const lastPage = () => {
  if (totalPages.value > 0) {
    currentPage.value = totalPages.value;
    fetchData();
  }
};

defineExpose({ refreshTable: fetchData });
</script>
