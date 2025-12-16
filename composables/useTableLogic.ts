import { ref, watch, computed } from 'vue';

export function useTableLogic(props: any, emit: any) {
  // States
  const currentPage = ref(1);
  const totalPages = ref(1);
  const searchQuery = ref('');
  const searchComplexQuery = ref<Record<string, string>>({});
  const pageSize = ref(props.pageSize || 5);
  const totalRecords = ref(0);
  const rowsData = ref<any[]>([]);
  const loading = ref(false);

  // Sorting
  const sortBy = ref<string>('');
  const sortDir = ref<'asc' | 'desc'>('asc');

  // Column filters (for auto-filter row)
  const columnFilters = ref<Record<string, string>>({});

  // Column visibility (for column chooser)
  const hiddenColumns = ref<Set<string>>(new Set());

  // Column widths (for column resizing)
  const columnWidths = ref<Record<string, number>>({});

  // Frozen columns (sticky left columns)
  const frozenColumns = ref<Set<string>>(new Set());

  // Toggle column visibility
  const toggleColumnVisibility = (columnKey: string) => {
    if (hiddenColumns.value.has(columnKey)) {
      hiddenColumns.value.delete(columnKey);
    } else {
      hiddenColumns.value.add(columnKey);
    }
    // Trigger reactivity
    hiddenColumns.value = new Set(hiddenColumns.value);
  };

  // Check if column is visible (and not grouped)
  const isColumnVisible = (columnKey: string) => 
    !hiddenColumns.value.has(columnKey) && !groupByColumns.value.includes(columnKey);

  // Set column width
  const setColumnWidth = (columnKey: string, width: number) => {
    columnWidths.value[columnKey] = width;
  };

  // Reset column widths
  const resetColumnWidths = () => {
    columnWidths.value = {};
  };

  // Show all columns
  const showAllColumns = () => {
    hiddenColumns.value = new Set();
  };

  // Toggle freeze column
  const toggleFreezeColumn = (columnKey: string) => {
    if (frozenColumns.value.has(columnKey)) {
      frozenColumns.value.delete(columnKey);
    } else {
      frozenColumns.value.add(columnKey);
    }
    frozenColumns.value = new Set(frozenColumns.value);
  };

  // Check if column is frozen
  const isColumnFrozen = (columnKey: string) => frozenColumns.value.has(columnKey);

  // Unfreeze all columns
  const unfreezeAllColumns = () => {
    frozenColumns.value = new Set();
  };

  // Row grouping
  const groupByColumns = ref<string[]>([]);
  const expandedGroups = ref<Set<string>>(new Set());

  // Add group
  const addGroup = (columnKey: string) => {
    if (!groupByColumns.value.includes(columnKey)) {
      groupByColumns.value.push(columnKey);
      expandedGroups.value = new Set(); // Reset expansion on structure change
    }
  };

  // Remove group
  const removeGroup = (columnKey: string) => {
    groupByColumns.value = groupByColumns.value.filter(k => k !== columnKey);
    expandedGroups.value = new Set();
  };

  const clearGrouping = () => {
    groupByColumns.value = [];
    expandedGroups.value = new Set();
  };

  const toggleGroupExpand = (groupKey: string) => {
    if (expandedGroups.value.has(groupKey)) expandedGroups.value.delete(groupKey);
    else expandedGroups.value.add(groupKey);
    expandedGroups.value = new Set(expandedGroups.value);
  };

  const isGroupExpanded = (groupKey: string) => expandedGroups.value.has(groupKey);

  // Computed Flattened Rows for Display
  const flattenedRows = computed(() => {
    if (groupByColumns.value.length === 0) {
      return rowsData.value.map(row => ({ type: 'data', row, level: 0 }));
    }

    const processLevel = (data: any[], depth: number, parentKey: string): any[] => {
      if (depth >= groupByColumns.value.length) {
        return data.map(row => ({ type: 'data', row, level: depth }));
      }

      const column = groupByColumns.value[depth];
      const grouped: Record<string, any[]> = {};
      data.forEach(row => {
        const val = String(row[column] ?? 'N/A');
        if (!grouped[val]) grouped[val] = [];
        grouped[val].push(row);
      });

      let result: any[] = [];
      Object.keys(grouped).sort().forEach(val => {
        const groupKey = parentKey ? `${parentKey}|${val}` : val;
        const isExp = expandedGroups.value.has(groupKey);
        result.push({
          type: 'group',
          key: val,
          columnKey: column,
          level: depth,
          expanded: isExp,
          count: grouped[val].length,
          groupKey: groupKey,
          value: val // Add explicit value
        });

        if (isExp) {
          result = result.concat(processLevel(grouped[val], depth + 1, groupKey));
        }
      });
      return result;
    };

    return processLevel(rowsData.value, 0, '');
  });

  // Aggregation functions for summary row
  const calculateSum = (columnKey: string): number => {
    return rowsData.value.reduce((sum, row) => {
      const val = parseFloat(row[columnKey]) || 0;
      return sum + val;
    }, 0);
  };

  const calculateAvg = (columnKey: string): number => {
    if (rowsData.value.length === 0) return 0;
    return calculateSum(columnKey) / rowsData.value.length;
  };

  const calculateMin = (columnKey: string): number => {
    if (rowsData.value.length === 0) return 0;
    const values = rowsData.value.map(row => parseFloat(row[columnKey]) || 0);
    return Math.min(...values);
  };

  const calculateMax = (columnKey: string): number => {
    if (rowsData.value.length === 0) return 0;
    const values = rowsData.value.map(row => parseFloat(row[columnKey]) || 0);
    return Math.max(...values);
  };

  const calculateCount = (): number => rowsData.value.length;

  // Get summary value based on aggregation type
  const getSummaryValue = (columnKey: string, aggregationType: 'sum' | 'avg' | 'min' | 'max' | 'count'): number => {
    switch (aggregationType) {
      case 'sum': return calculateSum(columnKey);
      case 'avg': return calculateAvg(columnKey);
      case 'min': return calculateMin(columnKey);
      case 'max': return calculateMax(columnKey);
      case 'count': return calculateCount();
      default: return 0;
    }
  };



  // Inline Editing
  const editingKey = ref<string | null>(null);
  const editForm = ref<Record<string, any>>({});

  const isEditing = (row: any) => {
    return editingKey.value === row[props.rowKey];
  };

  const startEdit = (row: any) => {
    editingKey.value = row[props.rowKey];
    editForm.value = { ...row }; // Shallow copy
  };

  const cancelEdit = () => {
    editingKey.value = null;
    editForm.value = {};
  };

  const saveEdit = () => {
    emit('row-action', { action: { name: 'update', label: 'Update' }, row: editForm.value });
    cancelEdit();
  };

  // Row Reordering
  const reorderRows = (fromIndex: number, toIndex: number) => {
    const newRows = [...rowsData.value];
    const item = newRows.splice(fromIndex, 1)[0];
    newRows.splice(toIndex, 0, item);
    rowsData.value = newRows;
    emit('row-action', { action: { name: 'reorder', label: 'Reorder' }, fromIndex, toIndex, newOrder: newRows });
  };

  // Export data to CSV
  const exportToCSV = (columns: any[], filename: string = 'export.csv') => {
    if (rowsData.value.length === 0) return;
    
    const visibleCols = columns.filter(col => !hiddenColumns.value.has(col.key || col));
    const headers = visibleCols.map(col => col.text || col.label || col.key || col);
    
    const csvRows = [
      headers.join(','),
      ...rowsData.value.map(row => 
        visibleCols.map(col => {
          const value = row[col.key || col];
          // Escape quotes and wrap in quotes if contains comma
          const strVal = String(value ?? '').replace(/"/g, '""');
          return strVal.includes(',') || strVal.includes('"') ? `"${strVal}"` : strVal;
        }).join(',')
      )
    ];
    
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // Toggle sort on column click
  const toggleSort = (columnKey: string, fetchData?: () => void) => {
    if (sortBy.value === columnKey) {
      // Toggle direction
      sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
    } else {
      // New column, default to ascending
      sortBy.value = columnKey;
      sortDir.value = 'asc';
    }
    // Reset to first page when sorting changes
    currentPage.value = 1;
    if (fetchData) fetchData();
  };

  // Clear sorting
  const clearSort = (fetchData?: () => void) => {
    sortBy.value = '';
    sortDir.value = 'asc';
    currentPage.value = 1;
    if (fetchData) fetchData();
  };

  // Apply column filter
  const applyColumnFilter = (columnKey: string, value: string, fetchData?: () => void) => {
    columnFilters.value[columnKey] = value;
    currentPage.value = 1;
    if (fetchData) fetchData();
  };

  // Clear all column filters
  const clearColumnFilters = (fetchData?: () => void) => {
    columnFilters.value = {};
    currentPage.value = 1;
    if (fetchData) fetchData();
  };

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

  // Pagination Controls
  const handlePageSizeChange = (fetchData: () => void) => {
    currentPage.value = 1;
    fetchData();
  };
  const firstPage = (fetchData: () => void) => {
    if (currentPage.value > 0) {
      currentPage.value = 1;
      fetchData();
    }
  };
  const nextPage = (fetchData: () => void) => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
      fetchData();
    }
  };
  const prevPage = (fetchData: () => void) => {
    if (currentPage.value > 1) {
      currentPage.value--;
      fetchData();
    }
  };
  const lastPage = (fetchData: () => void) => {
    if (totalPages.value > 0) {
      currentPage.value = totalPages.value;
      fetchData();
    }
  };

  return {
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
    resetColumnWidths,
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
    calculateAvg,
    calculateMin,
    calculateMax,
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
  };
}

