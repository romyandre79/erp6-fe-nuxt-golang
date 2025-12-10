<template>
  <div class="w-full">
    <!-- Header & Toolbar -->
    <div class="flex flex-col mb-3">
      <h2 class="font-semibold">{{ title }}</h2>

      <!-- Search -->
      <!-- Filter Container -->
      <div v-if="enableSearch" class="mt-2">
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
    <div class="w-full rounded-xl overflow-x-auto">
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
      <TableControls
        v-model:pageSize="pageSize"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :loading="loading"
        :enablePaging="enablePaging"
        :enablePageSize="enablePageSize"
        :pageSizeOptions="pageSizeOptions"
        @page-size-change="handlePageSizeChange(fetchData)"
        @first-page="firstPage(fetchData)"
        @prev-page="prevPage(fetchData)"
        @next-page="nextPage(fetchData)"
        @last-page="lastPage(fetchData)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, h } from 'vue';
import { useApi } from '#imports';
import { TablePagination } from '#components';
import { useTableLogic } from '../composables/useTableLogic';
import TableControls from './TableControls.vue';

const props = defineProps({
  title: String,
  endPoint: String,
  columns: { type: Array, required: true },
  actions: { type: Array, default: () => [] },
  tables: { type: Array, default: () => [] },
  modals: { type: Array, default: () => [] },
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
const Api = useApi();

const {
  currentPage,
  totalPages,
  searchQuery,
  searchComplexQuery,
  pageSize,
  totalRecords,
  rowsData,
  loading,
  selectedKeys,
  toggleRowSelection,
  isSelected,
  toggleSelectAll,
  expandedKey,
  toggleExpand,
  isExpanded,
  formatCellValue,
  handlePageSizeChange,
  firstPage,
  nextPage,
  prevPage,
  lastPage,
} = useTableLogic(props, emit);

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
      res = await Api.post('/api/admin/execute-flow', dataForm);
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

let selectedRows = ref<any[]>([]);

function renderTable(component: any) {
  if (!component) return null;
  const key = component.key || component.text || `table0`;

  let columns: any;
  let searchs: any;

  function getData() {
    for (const element of component.children) {
      if (element.type === 'columns') {
        columns = element;
      } else if (element.type === 'search') {
        searchs = element;
      }
    }
  }

  getData();

  return h('div', { key: key }, [
    h(TablePagination, {
      columns:
        columns?.children.map((col: any, i: number) => ({
          label: col.props.text || `Column ${i + 1}`,
          key: col.props.key || `col${i + 1}`,
          type: col.type || 'text',
        })) ?? [],
      searchColumn:
        searchs?.children.map((col: any, i: number) => ({
          key: col.props.key || `col${i + 1}`,
          type: col.type || 'text',
          place: col.props.place || 'search ...',
        })) ?? [],
      method: 'POST',
      endPoint: component.props.source,
      simpleSearch: false,
      class: component.props.class || 'mb-4',
      rowKey: component.props.primary,
      enableSearch: true,
      relationKey: component.props.relationkey,
      selectionKeyData: selectedRows.value,
      isInput: props.isInput,
      isSelectAll: !props.isInput,
      selectedKeyData:
        component.props.relationkey != '' && selectedRows.value.length > 0
          ? selectedRows.value[0][component.props.relationkey]
          : '',
      onSelectionChange: (selRows: any) => {
        selectedRows.value = selRows;
      },
    }),
  ]);
}

onMounted(() => {
  fetchData();
});

defineExpose({ refreshTable: fetchData });
</script>
