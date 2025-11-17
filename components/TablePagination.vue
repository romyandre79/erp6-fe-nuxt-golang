<template>
  <div class="w-full">
    <!-- Header & Toolbar -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
      <h2 class="text-2xl font-semibold">{{ title }}</h2>

      <div class="flex items-center gap-2">
        <!-- Search -->
        <div v-if="enableSearch && simpleSearch == true">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
            class="border rounded px-2 py-1 text-sm"
            @keyup.enter="fetchData"
          />
          </div>
        <div v-if="simpleSearch == false" v-for="(col,index) in searchColumn">
<input v-if="col.type == 'text' || col.type == 'number' || col.type == 'email'"
            v-model="searchComplexQuery[col.key]"
            :type="`${col.type}`"
            :placeholder="`${$t(col.place.toUpperCase())}...`"
            class="border rounded px-2 py-1 text-sm"
            @keyup.enter="fetchData"
          />
        </div>

        <!-- Toolbar Actions -->
        <div v-if="actions && actions.length">
          <button
            v-for="(action, index) in actions"
            :key="index"
            :class="['btn btn-sm', action.class || 'btn-primary']"
            @click="$emit('action', action)"
          >
            <i v-if="action.icon" :class="['mr-1', action.icon]"></i>
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div
      :class="[
        'overflow-x-auto rounded-xl border shadow-sm transition-colors duration-300',
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      ]"
    >
      <table class="table w-full">
        <thead
          :class="[
            'text-sm uppercase font-semibold',
            isDark ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-700'
          ]"
        >
          <tr>
             <!-- Checkbox select all -->
    <th class="px-4 py-3">
  <input
    type="checkbox"
    class="checkbox checkbox-sm"
    :checked="rowsData.length > 0 && rowsData.every(r => isSelected(r))"
    @change="toggleSelectAll"
  />
</th>
            <th
              v-for="col in columns"
              :key="col.key || col"
              class="px-4 py-3 text-left tracking-wide"
            >
              {{ col.label || col }}
            </th>
            <th v-if="rowActions && rowActions.length" class="px-4 py-3 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td :colspan="columns.length + (rowActions?.length ? 1 : 0)" class="p-4 text-center">
              <span class="loading loading-spinner loading-md"></span>
            </td>
          </tr>

          <tr
            v-for="(row, index) in rowsData"
            :key="index"
            v-else
            :class="[
              'transition-colors duration-200',
              isDark ? 'hover:bg-gray-700/60 text-gray-100' : 'hover:bg-gray-100 text-gray-800'
            ]"
          >
          <td class="px-4 py-3">
  <input
    type="checkbox"
    class="checkbox checkbox-sm"
    :checked="isSelected(row)"
    @click.stop="toggleRowSelection(row)"
  />
</td>
            <td
              v-for="col in columns"
              :key="col.key || col"
              class="px-4 py-3 text-sm"
            >
              <span v-html="formatCellValue(col, row[col.key || col])"></span>
            </td>

            <!-- Row Actions -->
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

          <tr v-if="!loading && rowsData.length === 0">
            <td
              :colspan="columns.length + (rowActions?.length ? 1 : 0)"
              class="text-center p-4 text-gray-400"
            >
              No data available
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="enablePaging" class="flex justify-center items-center mt-4 gap-2">
        <span class="text-base-content/70">
          Page {{ currentPage }} / {{ totalPages }}
        </span>

        <!-- Page size selector -->
        <select
          v-if="enablePageSize"
          v-model.number="pageSize"
          class="border rounded px-2 py-1 text-sm dark:text-gray-800 dark:bg-white "
          @change="handlePageSizeChange"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>

        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100 cursor-pointer disabled:opacity-50 disabled:cursor-default"
          :disabled="currentPage === 1 || loading || totalPages == 0"
          @click="firstPage"
        >
        <<
        </button>
        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100 cursor-pointer disabled:opacity-50 disabled:cursor-default"
          :disabled="currentPage === 1 || loading || totalPages == 0"
          @click="prevPage"
        >
          <
        </button>
        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100 cursor-pointer disabled:opacity-50 disabled:cursor-default"
          :disabled="currentPage === totalPages || loading"
          @click="nextPage"
        >
          >
        </button>
        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100 cursor-pointer disabled:opacity-50 disabled:cursor-default"
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
import { computed, ref, watch, onMounted } from 'vue'
import { useThemeStore } from '~/store/theme'
import { useApi } from '~/composables/useApi'

const props = defineProps({
  title: String,
  endPoint: String,
  columns: { type: Array, required: true },
  actions: { type: Array, default: () => [] },
  rowActions: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 5 },
  pageSizeOptions: { type: Array, default: () => [5, 10, 20, 50] },
  enableSearch: { type: Boolean, default: true },
  simpleSearch: { type: Boolean, default: true },
  searchColumn: { type: Array, required: false },
  enablePaging: { type: Boolean, default: true },
  enablePageSize: { type: Boolean, default: true },
  method: { type: String, default: 'GET' }, // NEW — bisa GET / POST
  rowKey: { type: String, default: 'id' },
})

const emit = defineEmits(['action', 'row-action', 'fetch-params', 'selection-change'])

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.theme === 'dark')

const Api = useApi()

// States
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
const searchComplexQuery = ref<Record<string, string>>({})
const pageSize = ref(props.pageSize)
const totalRecords = ref(0)
const rowsData = ref<any[]>([])
const loading = ref(false)

// Formatter
const formatCellValue = (col: any, value: any) => {
  if (col.type === 'boolean' || col.type === 'bool') {
    return value
      ? '<input type="checkbox" checked disabled class="checkbox checkbox-sm" />'
      : '<input type="checkbox" disabled class="checkbox checkbox-sm" />'
  }

  if (col.type === 'currency') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2
    }).format(value || 0)
  }

  if (col.type === 'number') {
    return new Intl.NumberFormat('id-ID').format(value || 0)
  }

  return value ?? ''
}


// Fetch data
const fetchData = async () => {
  loading.value = true
  try {
    let res
    if (props.method.toUpperCase() === 'POST') {
      const dataForm = new FormData()
      // --- POST request ---
      dataForm.append('flowname', props.endPoint || '')
      dataForm.append('menu', 'admin')
      dataForm.append('search', 'true')
      dataForm.append('page', currentPage.value || 1)
      dataForm.append('rows', pageSize.value || 5)
      for (let index = 0; index < props.columns.length; index++) {
        const element = props.columns[index];
        dataForm.append(element.key, searchComplexQuery.value[element.key] || '')
      }

      res = await Api.post("/admin/execute-flow", dataForm)
    } else {
      const params = {
        page: currentPage.value,
        limit: pageSize.value,
        search: searchQuery.value,
      }

      emit('fetch-params', params)
      // --- GET request ---
      const queryString = new URLSearchParams(params as any).toString()
      res = await Api.get(`${props.endPoint}?${queryString}`)
    }

    if (res.code === 200) {
      rowsData.value = res.data.data || []
      totalRecords.value = res.data.total || res.data.data?.length || 0
      currentPage.value = res.data.meta?.page || res.data.page || 0
      totalPages.value = res.data.meta?.totalPages || Math.ceil(totalRecords.value / res.data.rows) || 0
    } else {
      rowsData.value = []
      totalRecords.value = 0
    }
  } catch (err) {
    console.error(err)
    rowsData.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

watch([searchQuery, () => props.formData], () => {
  currentPage.value = 1
  fetchData()
}, { deep: true })

const handlePageSizeChange = () => {
  currentPage.value = 1
  fetchData()
}

const firstPage = () => {
  if (currentPage.value > 0) {
    currentPage.value = 1
    fetchData()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchData()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchData()
  }
}

const lastPage = () => {
  if (totalPages.value > 0) {
    currentPage.value = totalPages.value
    fetchData()
  }
}

const selectedKeys = ref<any[]>([]) // hanya simpan ID/Key

const toggleRowSelection = (row: any) => {
  const key = row[props.rowKey]
  const index = selectedKeys.value.indexOf(key)
  if (index === -1) selectedKeys.value.push(key)
  else selectedKeys.value.splice(index, 1)
}

const isSelected = (row: any) => selectedKeys.value.includes(row[props.rowKey])

const toggleSelectAll = () => {
  const currentPageKeys = rowsData.value.map(r => r[props.rowKey])
  const allSelected = currentPageKeys.every(key => selectedKeys.value.includes(key))
  
  if (allSelected) {
    // hapus semua key halaman ini
    selectedKeys.value = selectedKeys.value.filter(k => !currentPageKeys.includes(k))
  } else {
    // tambahkan key halaman ini
    const merged = new Set([...selectedKeys.value, ...currentPageKeys])
    selectedKeys.value = Array.from(merged)
  }
}

watch(selectedKeys, (val) => {
  // emit ke parent (opsional)
  const selectedRows = rowsData.value.filter(r => val.includes(r[props.rowKey]))
  emit('selection-change', selectedRows)
},
{ deep: true })

defineExpose({
  refreshTable: fetchData
})
</script>
