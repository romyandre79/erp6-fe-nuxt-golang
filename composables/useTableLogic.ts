import { ref, watch, computed } from 'vue';
import { useApi } from '#imports';

export function useTableLogic(props: any, emit: any) {
  const Api = useApi();

  // States
  const currentPage = ref(1);
  const totalPages = ref(1);
  const searchQuery = ref('');
  const searchComplexQuery = ref<Record<string, string>>({});
  const pageSize = ref(props.pageSize || 5);
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
    { deep: true }
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
        value || 0
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
