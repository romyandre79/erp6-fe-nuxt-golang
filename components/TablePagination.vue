<template>
  <div class="w-full">
    <!-- Header & Toolbar -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-2">
      <h2 class="text-2xl font-semibold">{{ title }}</h2>

      <div class="flex items-center gap-2">
        <!-- Search -->
        <div v-if="enableSearch">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search..."
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
            <td
              v-for="col in columns"
              :key="col.key || col"
              class="px-4 py-3 text-sm"
            >
              {{ row[col.key || col] }}
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
          class="border rounded px-2 py-1 text-sm"
          @change="handlePageSizeChange"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>

        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100 disabled:opacity-50"
          :disabled="currentPage === 1 || loading"
          @click="prevPage"
        >
          Prev
        </button>
        <button
          class="px-3 py-1 rounded-lg border hover:bg-base-100 disabled:opacity-50"
          :disabled="currentPage === totalPages || loading"
          @click="nextPage"
        >
          Next
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
  enablePaging: { type: Boolean, default: true },
  enablePageSize: { type: Boolean, default: true },
})

const emit = defineEmits(['action', 'row-action', 'fetch-params'])

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.theme === 'dark')

const Api = useApi()

// states
const currentPage = ref(1)
const totalPages = ref(1)
const searchQuery = ref('')
const pageSize = ref(props.pageSize)
const totalRecords = ref(0)
const rowsData = ref<any[]>([])
const loading = ref(false)

// Fetch data
const fetchData = async () => {
  loading.value = true

  try {
    let res
    const params = {
      page: currentPage.value,
      limit: pageSize.value,
      search: searchQuery.value
    }

    emit('fetch-params', params) // bisa override di parent

    let url = props.endPoint + "?page=" + currentPage.value + "&limit=" + pageSize.value + "&search="+searchQuery.value  

    res = await Api.get(url)

    if (res.code === 200) {
      rowsData.value = res.data.data || []
      totalRecords.value = res.data.total || res.data.data?.length || 0
      currentPage.value = res.data.meta.page
      totalPages.value = res.data.meta.totalPages
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

watch([searchQuery], () => {
  currentPage.value = 1
  fetchData()
})

const handlePageSizeChange = () => {
  currentPage.value = 1
  fetchData()
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
</script>
