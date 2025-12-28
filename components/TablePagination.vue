<template>
  <div class="w-full">
    <!-- Header & Toolbar -->
    <div class="flex flex-col sm:flex-row mb-3 justify-between items-start sm:items-center gap-2">
      <h2 class="text-2xl font-semibold">{{ title }}</h2>

      <!-- Column Chooser Dropdown -->
      <div class="flex gap-2">
        <!-- Export Button -->
        <button
          v-if="enableExport"
          class="btn btn-sm btn-ghost gap-1"
          @click="exportToCSV(columns, (title || 'export') + '.csv')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export
        </button>

        <div v-if="enableColumnChooser" class="relative">
          <button class="btn btn-sm btn-ghost gap-1" @click="showColumnChooser = !showColumnChooser">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
            Columns
          </button>
          <div
            v-if="showColumnChooser"
            class="absolute right-0 top-full mt-1 bg-base-100 border rounded-lg shadow-xl z-[9999] min-w-56 p-2"
            style="background: white"
          >
            <div class="text-xs font-semibold text-base-content/60 mb-2 px-2">Show/Hide & Freeze Columns</div>
            <div class="max-h-64 overflow-y-auto">
              <div
                v-for="col in columns"
                :key="'chooser-' + (col.key || col)"
                class="flex items-center gap-2 px-2 py-1 hover:bg-base-200 rounded"
              >
                <input
                  type="checkbox"
                  class="checkbox checkbox-xs"
                  :checked="isColumnVisible(col.key || col)"
                  @change="toggleColumnVisibility(col.key || col)"
                />
                <span class="text-sm flex-1">{{ col.text || col.label || col.key || col }}</span>
                <button
                  v-if="enableFrozenColumns"
                  class="btn btn-xs btn-ghost px-1"
                  :class="isColumnFrozen(col.key || col) ? 'text-primary' : 'text-base-content/40'"
                  @click="toggleFreezeColumn(col.key || col)"
                  :title="isColumnFrozen(col.key || col) ? 'Unfreeze' : 'Freeze'"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div class="border-t mt-2 pt-2 flex gap-1">
              <button
                class="btn btn-xs btn-ghost flex-1"
                @click="
                  showAllColumns();
                  showColumnChooser = false;
                "
              >
                Show All
              </button>
              <button v-if="enableFrozenColumns" class="btn btn-xs btn-ghost flex-1" @click="unfreezeAllColumns()">
                Unfreeze All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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

    <!-- Grouping Panel -->
    <div
      v-if="enableGrouping"
      class="mb-2 p-3 border-2 border-dashed rounded-lg flex items-center gap-2 flex-wrap min-h-[50px] transition-colors"
      :class="isDraggingOver ? 'border-primary bg-primary/5' : 'border-base-300 bg-base-100'"
      @dragover.prevent="isDraggingOver = true"
      @dragleave="isDraggingOver = false"
      @drop="handleDropOnPanel"
    >
      <div
        v-if="groupByColumns.length === 0"
        class="text-base-content/50 text-sm italic w-full text-center pointer-events-none select-none"
      >
        Drag a column header here to group
      </div>
      <div
        v-for="colKey in groupByColumns"
        :key="colKey"
        class="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20 cursor-move hover:bg-primary/20 transition-colors"
        draggable="true"
        @dragstart="handleDragStart($event, colKey, 'panel')"
      >
        <span class="font-medium text-sm select-none">{{ resolveColumnLabel(colKey) }}</span>
        <button class="btn btn-ghost btn-xs btn-circle h-5 w-5 min-h-0" @click="removeGroup(colKey)">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="w-full rounded-xl overflow-x-auto">
      <TableControls
        v-model:pageSize="pageSize"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :loading="loading"
        :enablePaging="enablePaging"
        :enablePageSize="enablePageSize"
        :pageSizeOptions="pageSizeOptions"
        :totalRecords="totalRecords"
        @page-size-change="handlePageSizeChange(fetchData)"
        @first-page="firstPage(fetchData)"
        @prev-page="prevPage(fetchData)"
        @next-page="nextPage(fetchData)"
        @last-page="lastPage(fetchData)"
      />

      <table class="w-full">
        <thead class="text-sm uppercase font-semibold" @dragover.prevent @drop="handleDropOnHeader">
          <!-- Header Row -->
          <tr>
            <th v-if="enableRowReorder" class="px-2 py-3 w-8"></th>
            <th class="px-4 py-3" v-if="enableCheck && isSelectAll">
              <input
                type="checkbox"
                class="checkbox checkbox-sm"
                :checked="rowsData.length > 0 && rowsData.every((r) => isSelected(r))"
                @change="toggleSelectAll"
              />
            </th>
            <th class="thead px-4 py-3" v-else></th>
            <th class="thead px-4 py-3" v-if="isExpand == true"></th>
            <th
              v-for="col in visibleColumns"
              :key="col.key || col"
              class="thead px-4 py-3 text-left tracking-wide cursor-pointer select-none hover:bg-base-200 transition-colors relative group"
              :class="{ 'text-right': ['number', 'currency'].includes(col.type) }"
              :style="
                columnWidths[col.key || col]
                  ? { width: columnWidths[col.key || col] + 'px', minWidth: columnWidths[col.key || col] + 'px' }
                  : {}
              "
              @click="toggleSort(col.key || col, fetchData)"
              :draggable="enableGrouping"
              @dragstart="handleDragStart($event, col.key || col)"
            >
              <div class="flex items-center gap-1">
                <span>{{ col.text || col.label }}</span>
                <span v-if="sortBy === (col.key || col)" class="text-primary">
                  {{ sortDir === 'asc' ? '▲' : '▼' }}
                </span>
                <span v-else class="text-base-content/30">⇅</span>
              </div>
              <!-- Resize Handle -->
              <div
                v-if="enableColumnResize"
                class="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50"
                @mousedown.stop="startResize($event, col.key || col)"
              ></div>
            </th>
            <th v-if="(rowActions && rowActions.length) || enableInlineEdit" class="thead px-4 py-3 text-left">
              Actions
            </th>
          </tr>
          <!-- Filter Row -->
          <tr v-if="enableColumnFilter" class="bg-base-200/50">
            <th class="px-2 py-2" v-if="enableRowReorder"></th>
            <th class="px-2 py-2" v-if="enableCheck"></th>
            <th class="px-2 py-2" v-if="isExpand == true"></th>
            <th v-for="col in visibleColumns" :key="'filter-' + (col.key || col)" class="px-2 py-2">
              <input
                v-if="col.filterable !== false"
                type="text"
                :placeholder="`Filter...`"
                class="input input-xs input-bordered w-full"
                :value="columnFilters[col.key || col] || ''"
                @input="(e) => applyColumnFilter(col.key || col, (e.target as HTMLInputElement).value, fetchData)"
                @keyup.enter="fetchData"
              />
            </th>
            <th v-if="(rowActions && rowActions.length) || enableInlineEdit" class="px-2 py-2"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td :colspan="visibleColumns.length + (rowActions?.length ? 1 : 0) + 1" class="p-4 text-center">
              <span class="loading loading-spinner loading-md"></span>
            </td>
          </tr>

          <template v-if="!loading">
            <template
              v-for="(item, index) in flattenedRows"
              :key="item.type === 'group' ? item.groupKey : item.row[props.rowKey] || index"
            >
              <!-- GROUP HEADER ROW -->
              <tr
                v-if="item.type === 'group'"
                class="bg-base-200 cursor-pointer hover:bg-base-300 transition-colors font-medium border-l-4 border-l-primary"
                @click="toggleGroupExpand(item.groupKey)"
              >
                <td :colspan="visibleColumns.length + (rowActions?.length ? 1 : 0) + 2" class="px-4 py-2">
                  <div class="flex items-center gap-2" :style="{ paddingLeft: item.level * 20 + 'px' }">
                    <button class="btn btn-xs btn-square btn-ghost">
                      {{ item.expanded ? '▼' : '▶' }}
                    </button>
                    <span class="opacity-70 text-sm">{{ resolveColumnLabel(item.columnKey) }}:</span>
                    <span class="font-bold">{{ item.value || '(Empty)' }}</span>
                    <span class="badge badge-sm badge-outline">{{ item.count }}</span>
                  </div>
                </td>
              </tr>

              <!-- DATA ROW -->
              <tr
                v-else
                class="transition-colors duration-200"
                @click.stop="toggleRowSelection(item.row)"
                :checked="isSelected(item.row)"
                :draggable="enableRowReorder"
                @dragstart="onRowDragStart($event, index)"
                @drop="onRowDrop($event, index)"
                @dragover.prevent
                :class="{ 'opacity-50': draggedRowIndex === index }"
              >
                <td v-if="enableRowReorder" class="px-2 py-3 cursor-move text-base-content/50 text-center" @click.stop>
                  <span class="text-xl leading-none">☰</span>
                </td>
                <td class="px-4 py-3" v-if="props.enableCheck">
                  <input
                    v-if="props.isSelectAll"
                    type="checkbox"
                    class="checkbox checkbox-sm"
                    :checked="isSelected(item.row)"
                    @click.stop="toggleRowSelection(item.row)"
                  />
                </td>

                <td class="px-4 py-3" v-if="props.isExpand == true">
                  <button @click.stop="toggleExpand(item.row)">
                    {{ isExpanded(item.row) ? '^' : '>' }}
                  </button>
                </td>

                <td
                  v-for="col in visibleColumns"
                  :key="col.key || col"
                  class="px-4 py-3 text-sm cursor-pointer"
                  :class="{ 'text-right': ['number', 'currency'].includes(col.type) }"
                >
                  <template v-if="enableInlineEdit && isEditing(item.row)">
                    <input
                      type="text"
                      class="input input-xs input-bordered w-full"
                      v-model="editForm[col.key || col]"
                      @click.stop
                    />
                  </template>
                  <template v-else>
                    <span v-html="formatCellValue(col, item.row[col.key || col])"></span>
                  </template>
                </td>

                <td v-if="(rowActions && rowActions.length) || enableInlineEdit" class="px-4 py-3">
                  <div class="flex items-center gap-1" v-if="enableInlineEdit && isEditing(item.row)">
                    <button class="btn btn-xs btn-success btn-square" @click.stop="saveEdit()" title="Save">✓</button>
                    <button class="btn btn-xs btn-error btn-square" @click.stop="cancelEdit()" title="Cancel">✗</button>
                  </div>
                  <div class="flex items-center gap-1" v-else>
                    <button
                      v-if="enableInlineEdit"
                      class="btn btn-xs btn-ghost btn-square"
                      @click.stop="startEdit(item.row)"
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      v-for="(action, i) in rowActions"
                      :key="i"
                      :class="['btn btn-xs mr-1', action.class || 'btn-outline']"
                      @click="$emit('row-action', { action, row: item.row })"
                    >
                      <i v-if="action.icon" :class="['mr-1', action.icon]"></i>
                      {{ action.label }}
                    </button>
                  </div>
                </td>
              </tr>

              <!-- CHILD ROW (For Expand View) -->
              <tr v-if="item.type === 'data' && isExpanded(item.row) && isExpand == true">
                <td :colspan="visibleColumns.length + 2">
                  <div class="rounded-lg w-full" v-for="(child, index) in tables">
                    <component :is="renderTable(child)" v-if="index > 0"></component>
                  </div>
                </td>
              </tr>
            </template>
          </template>

          <tr v-if="!loading && flattenedRows.length === 0">
            <td :colspan="visibleColumns.length + (rowActions?.length ? 1 : 0)" class="text-center p-4 text-gray-400">
              No data available
            </td>
          </tr>
        </tbody>

        <!-- Summary Footer Row -->
        <tfoot v-if="enableSummaryRow && rowsData.length > 0">
          <tr class="bg-base-200 font-semibold text-sm">
            <td class="px-4 py-2" v-if="enableRowReorder"></td>
            <td class="px-4 py-2" v-if="enableCheck"></td>
            <td class="px-4 py-2" v-if="isExpand"></td>
            <td v-for="col in visibleColumns" :key="'summary-' + (col.key || col)" class="px-4 py-2">
              <template v-if="col.summary">
                <span class="text-primary">
                  {{
                    col.summary === 'count'
                      ? calculateCount()
                      : getSummaryValue(col.key || col, col.summary).toLocaleString()
                  }}
                </span>
                <span class="text-xs text-base-content/60 ml-1">{{ col.summary }}</span>
              </template>
            </td>
            <td v-if="(rowActions && rowActions.length) || enableInlineEdit" class="px-4 py-2"></td>
          </tr>
        </tfoot>
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
        :totalRecords="totalRecords"
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
import { ref, onMounted, h, watch, computed } from 'vue';
import { useApi } from '#imports';
import { TableDetailPagination } from '#components';
import { useTableLogic } from '../composables/useTableLogic';
import { useTablePreferences } from '../composables/useTablePreferences';
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
  pageSizeOptions: { type: Array, default: () => [5, 10, 20, 50, 100, 1000] },
  enableSearch: { type: Boolean, default: true },
  simpleSearch: { type: Boolean, default: true },
  searchColumn: { type: Array, required: false },
  enablePaging: { type: Boolean, default: true },
  enablePageSize: { type: Boolean, default: true },
  enableCheck: { type: Boolean, default: true },
  enableColumnFilter: { type: Boolean, default: true },
  enableColumnChooser: { type: Boolean, default: true },
  enableColumnResize: { type: Boolean, default: true },
  enableFrozenColumns: { type: Boolean, default: true },
  enableExport: { type: Boolean, default: true },
  enableGrouping: { type: Boolean, default: true },
  enableSummaryRow: { type: Boolean, default: false },
  enableInlineEdit: { type: Boolean, default: false },
  enableRowReorder: { type: Boolean, default: false },
  method: { type: String, default: 'GET' },
  rowKey: { type: String, default: 'id' },
  relationKey: { type: String, default: 'id' },
  isInput: { type: Boolean, default: false },
  isSelectAll: { type: Boolean, default: false },
  isExpand: { type: Boolean, default: false },
  isDetail: { type: Boolean, default: false },
  selectedKeyData: { type: String, default: '' },
});

const emit = defineEmits(['action', 'row-action', 'fetch-params', 'selection-change']);
const Api = useApi();
const route = useRoute();

// Table preferences persistence
const tableId = computed(() => props.endPoint || 'default_table');
const { loadPreferences, savePreferences } = useTablePreferences(tableId.value);

const {
  currentPage,
  totalPages,
  searchQuery,
  searchComplexQuery,
  pageSize,
  totalRecords,
  rowsData,
  loading,
  // Sorting
  sortBy,
  sortDir,
  toggleSort,
  clearSort,
  // Column filters
  columnFilters,
  applyColumnFilter,
  clearColumnFilters,
  // Column visibility
  hiddenColumns,
  toggleColumnVisibility,
  isColumnVisible,
  showAllColumns,
  // Column widths
  columnWidths,
  setColumnWidth,
  // Frozen columns
  frozenColumns,
  toggleFreezeColumn,
  isColumnFrozen,
  unfreezeAllColumns,
  // Row grouping
  groupByColumns,
  expandedGroups,
  addGroup,
  removeGroup,
  clearGrouping,
  toggleGroupExpand,
  isGroupExpanded,
  flattenedRows,
  // Summary aggregation
  calculateSum,
  calculateCount,
  getSummaryValue,
  // Inline Editing
  editingKey,
  editForm,
  isEditing,
  startEdit,
  cancelEdit,
  saveEdit,
  reorderRows,
  // Export
  exportToCSV,
  // Selection
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

// UI state
const showGroupMenu = ref(false);

// Drag & Drop Grouping
const isDraggingOver = ref(false);

const handleDragStart = (event: DragEvent, columnKey: string, source: 'header' | 'panel' = 'header') => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', columnKey);
    event.dataTransfer.setData('source', source);
    event.dataTransfer.effectAllowed = 'move';
  }
};

const handleDropOnPanel = (event: DragEvent) => {
  isDraggingOver.value = false;
  const columnKey = event.dataTransfer?.getData('text/plain');
  const source = event.dataTransfer?.getData('source');
  if (columnKey && source === 'header') {
    addGroup(columnKey);
  }
};

const handleDropOnHeader = (event: DragEvent) => {
  const columnKey = event.dataTransfer?.getData('text/plain');
  const source = event.dataTransfer?.getData('source');
  if (columnKey && source === 'panel') {
    removeGroup(columnKey);
  }
};

const resolveColumnLabel = (key: string) => {
  const col = (props.columns as any[]).find((c) => (c.key || c) === key);
  return col ? col.text || col.label || col.key || col : key;
};

// Row Reordering State
const draggedRowIndex = ref<number | null>(null);

const onRowDragStart = (event: DragEvent, index: number) => {
  if (props.enableRowReorder) {
    draggedRowIndex.value = index;
    event.dataTransfer!.effectAllowed = 'move';
    // Optional: set drag image
  }
};

const onRowDrop = (event: DragEvent, dropIndex: number) => {
  if (props.enableRowReorder && draggedRowIndex.value !== null && draggedRowIndex.value !== dropIndex) {
    reorderRows(draggedRowIndex.value, dropIndex);
    draggedRowIndex.value = null;
  }
};

// Column chooser state
const showColumnChooser = ref(false);

// Computed visible columns
const visibleColumns = computed(() => (props.columns as any[]).filter((col) => isColumnVisible(col.key || col)));

// Grouped Data

// Column resize state
let resizingColumn = '';
let startX = 0;
let startWidth = 0;

function startResize(event: MouseEvent, columnKey: string) {
  resizingColumn = columnKey;
  startX = event.pageX;
  const th = (event.target as HTMLElement).parentElement;
  startWidth = th?.offsetWidth || 100;

  document.addEventListener('mousemove', doResize);
  document.addEventListener('mouseup', stopResize);
}

function doResize(event: MouseEvent) {
  if (!resizingColumn) return;
  const diff = event.pageX - startX;
  const newWidth = Math.max(50, startWidth + diff);
  setColumnWidth(resizingColumn, newWidth);
}

function stopResize() {
  if (resizingColumn) {
    savePreferences({ columnWidths: columnWidths.value });
  }
  resizingColumn = '';
  document.removeEventListener('mousemove', doResize);
  document.removeEventListener('mouseup', stopResize);
}

const internalRelationKey = ref(props.relationKey);
const internalSelectedKeyData = ref(props.selectedKeyData);
const internalIsDetail = ref(props.isDetail);

function setData(primary: string, selectedData: string) {
  internalRelationKey.value = primary;
  internalSelectedKeyData.value = selectedData;
  fetchData();
}

function setDataIsDetail(val: boolean) {
  internalIsDetail.value = val;
}

// Fetch data
async function fetchData() {
  loading.value = true;
  try {
    let res;
    if (props.method.toUpperCase() === 'POST') {
      const dataForm = new FormData();
      dataForm.append('flowname', props.endPoint || '');
      dataForm.append('menu', route.params.slug);
      dataForm.append('search', 'true');
      dataForm.append('page', currentPage.value);
      dataForm.append('rows', pageSize.value);
      // Sorting params
      if (sortBy.value) {
        dataForm.append('sortby', sortBy.value);
        dataForm.append('sortdir', sortDir.value);
      }
      for (const col of props.columns) {
        // Use column filter value if exists, otherwise use complex search query
        const filterVal = columnFilters.value[col.key] || searchComplexQuery.value[col.key] || '';
        dataForm.append(col.key, filterVal);
      }
      if (internalRelationKey.value) {
        dataForm.append(internalRelationKey.value, internalSelectedKeyData.value);
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
    h(TableDetailPagination, {
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
      title: component.props.text,
      relationKey: component.props.relationkey,
      selectionKeyData: selectedRows.value,
      isInput: true,
      enableCheck: false,
      isSelectAll: false,
      selectedKeyData: component.props.relationkey != '' && expandedKey.value != null ? expandedKey.value : '',
      onSelectionChange: (selRows: any) => {
        selectedRows.value = selRows;
      },
    }),
  ]);
}

onMounted(() => {
  // Load saved preferences
  const prefs = loadPreferences();
  if (prefs.sortBy) sortBy.value = prefs.sortBy;
  if (prefs.sortDir) sortDir.value = prefs.sortDir;
  if (prefs.pageSize) pageSize.value = prefs.pageSize;
  if (prefs.columnFilters) columnFilters.value = prefs.columnFilters;
  if (prefs.hiddenColumns) hiddenColumns.value = new Set(prefs.hiddenColumns);
  if (prefs.columnWidths) columnWidths.value = prefs.columnWidths;
  if (prefs.frozenColumns) frozenColumns.value = new Set(prefs.frozenColumns);
  if (prefs.groupByColumns) groupByColumns.value = prefs.groupByColumns;
  if (prefs.expandedGroups) expandedGroups.value = new Set(prefs.expandedGroups);

  fetchData();
});

// Auto-save preferences when they change
watch([sortBy, sortDir], () => {
  savePreferences({ sortBy: sortBy.value, sortDir: sortDir.value });
});

watch(pageSize, () => {
  savePreferences({ pageSize: pageSize.value });
});

watch(
  columnFilters,
  () => {
    savePreferences({ columnFilters: columnFilters.value });
  },
  { deep: true },
);

watch(
  hiddenColumns,
  () => {
    savePreferences({ hiddenColumns: Array.from(hiddenColumns.value) });
  },
  { deep: true },
);

watch(
  frozenColumns,
  (val) => {
    savePreferences({ frozenColumns: Array.from(val) });
  },
  { deep: true },
);

watch(
  groupByColumns,
  (val) => {
    savePreferences({ groupByColumns: val });
  },
  { deep: true },
);

watch(
  expandedGroups,
  (val) => {
    savePreferences({ expandedGroups: Array.from(val) });
  },
  { deep: true },
);

defineExpose({
  refreshTable: fetchData,
  setData,
  setDataIsDetail,
});
</script>
