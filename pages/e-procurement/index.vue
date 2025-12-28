<template>
  <div class="eprocurement-page space-y-8">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">E-Procurement</h1>
        <p class="text-sm text-gray-500">Manage vendors, tenders, and contracts efficiently.</p>
      </div>
      <button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        Create Tender
      </button>
    </div>

    <!-- Active Tenders Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="tender in activeTenders" :key="tender.id" class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
        <div class="flex justify-between items-start mb-4">
          <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">{{ tender.category }}</span>
          <span class="text-xs text-gray-400">{{ tender.deadline }}</span>
        </div>
        <h3 class="font-bold text-gray-900 mb-1">{{ tender.title }}</h3>
        <p class="text-sm text-gray-500 mb-4">{{ tender.company }}</p>
        
        <div class="flex items-center justify-between pt-4 border-t border-gray-50">
          <div class="text-sm font-semibold text-gray-900">{{ tender.budget }}</div>
          <button class="text-blue-600 text-sm font-medium hover:underline">View Details</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'e-procurement'
})

const activeTenders = [
  {
    id: 1,
    title: 'IT Infrastructure Upgrade',
    company: 'TechGlobal Corp',
    category: 'Technology',
    budget: '$500k - $1M',
    deadline: '2 days left',
    status: 'Open'
  },
  {
    id: 2,
    title: 'Fleet Vehicle Maintenance',
    company: 'Logistics Pro',
    category: 'Services',
    budget: '$200k',
    deadline: '5 days left',
    status: 'Open'
  },
  {
    id: 3,
    title: 'Office Supplies Bulk Order',
    company: 'Retail Giant',
    category: 'Goods',
    budget: '$50k',
    deadline: 'Closing Soon',
    status: 'Urgent'
  }
]
</script>
