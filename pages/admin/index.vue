<template>
  <div class="p-6 space-y-10">
    <!-- ===================== -->
    <!-- 🌟 CARD STATS SECTION -->
    <!-- ===================== -->
    <section>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(card, i) in cards"
          :key="i"
          class="p-5 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300"
        >
        <CardStat
      :title="card.title"
      :value=card.value
      :icon="card.icon"
      :trend="card.trend"
      :subtitle="card.subtitle"
    />
          
        </div>
      </div>
    </section>

    <section>
<highchart :options="chartOptions" /> 
   </section>

    <!-- ===================== -->
    <!-- 📋 SIMPLE TABLE -->
    <!-- ===================== -->
    <section>
      <TableData 
      title = "Simple Table"
      :headers="['Name', 'Email', 'Role']"
      :rows="users"
      
      />

    </section>

    <!-- ===================== -->
    <!-- 📄 PAGINATION TABLE -->
    <!-- ===================== -->
    <section>
      <TablePagination 
      title="Table with Pagination"
      :headers="['ID','Name']"
:rows="paginatedData"
      />
      
    </section>

    <!-- ===================== -->
    <!-- 🔄 INFINITE SCROLL TABLE -->
    <!-- ===================== -->
    <section>
      <TableInfinite 
      title="Table Infinite"
      :headers="['ID','ITEM']"
      :rows="infiniteItems"
      :batchSize=5
      />      
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import CardStat from '~/components/CardStats.vue'
import TableData from '~/components/TableData.vue'
import TablePagination from '~/components/TablePagination.vue'
import TableInfinite from '~/components/TableInfinite.vue'

definePageMeta({
  layout: 'auth',                
  middleware: ['auth'] 
})

/* === CARD STATS === */
const cards = ref([
  { title: 'Users', value: '1,245', icon: 'fa fa-users', trend: 12 },
  { title: 'Revenue', value: '$23.4K', icon: 'fa fa-dollar-sign', trend: 8 },
  { title: 'Orders', value: '342', icon: 'fa fa-shopping-cart', trend: -5 },
  { title: 'Feedback', value: '97%', icon: 'fa fa-comments', trend: 3 }
])

/* === SIMPLE TABLE === */
const users = ref([
  { name: 'Alice', email: 'alice@example.com', role: 'Admin' },
  { name: 'Bob', email: 'bob@example.com', role: 'User' },
  { name: 'Charlie', email: 'charlie@example.com', role: 'Editor' }
])

/* === PAGINATION TABLE === */
const allItems = ref(Array.from({ length: 35 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` })))
const currentPage = ref(1)
const perPage = 5
const totalPages = computed(() => Math.ceil(allItems.value.length / perPage))
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return allItems.value.slice(start, start + perPage)
})

/* === INFINITE SCROLL === */
const infiniteItems = ref([])
const loadingMore = ref(false)
const scrollContainer = ref(null)
let totalCount = 100
let loadedCount = 0

const loadMore = () => {
  if (loadingMore.value) return
  loadingMore.value = true
  setTimeout(() => {
    const newItems = Array.from({ length: 10 }, (_, i) => ({
      id: loadedCount + i + 1,
      name: `Product ${loadedCount + i + 1}`
    }))
    infiniteItems.value.push(...newItems)
    loadedCount += 10
    loadingMore.value = false
  }, 600)
}

 const chartOptions = ref({
      chart: {
        type: 'line'
      },
      title: {
        text: 'My Awesome Chart'
      },
      series: [{
        data: [1, 2, 3, 4, 5]
      }]
    });
onMounted(() => loadMore())
</script>
