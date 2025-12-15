<script setup lang="ts">
definePageMeta({
  layout: 'e-procurement'
})

const tenders = ref([
  {
    id: 1,
    title: 'IT Infrastructure Upgrade',
    company: 'TechGlobal Corp',
    category: 'Technology',
    budget: '$500k - $1M',
    deadline: '2 days left',
    status: 'Open',
    posted: '2023-10-25'
  },
  {
    id: 2,
    title: 'Fleet Vehicle Maintenance',
    company: 'Logistics Pro',
    category: 'Services',
    budget: '$200k',
    deadline: '5 days left',
    status: 'Open',
     posted: '2023-10-24'
  },
  {
    id: 3,
    title: 'Office Supplies Bulk Order',
    company: 'Retail Giant',
    category: 'Goods',
    budget: '$50k',
    deadline: 'Closing Soon',
    status: 'Urgent',
     posted: '2023-10-20'
  },
    {
    id: 4,
    title: 'Marketing Campaign Services',
    company: 'BrandNew Inc',
    category: 'Marketing',
    budget: '$150k - $300k',
    deadline: '1 week left',
    status: 'Open',
     posted: '2023-10-28'
  },
    {
    id: 5,
    title: 'Security Software License',
    company: 'SecureNet',
    category: 'Technology',
    budget: '$80k',
    deadline: '2 weeks left',
    status: 'Open',
     posted: '2023-10-27'
  }
])

const categories = ['All', 'Technology', 'Services', 'Goods', 'Marketing', 'Construction']
const selectedCategory = ref('All')
const searchQuery = ref('')
const selectedStatus = ref('All')

const filteredTenders = computed(() => {
  return tenders.value.filter(tender => {
    const matchesCategory = selectedCategory.value === 'All' || tender.category === selectedCategory.value
    const matchesSearch = tender.title.toLowerCase().includes(searchQuery.value.toLowerCase()) || 
                          tender.company.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'All' || tender.status === selectedStatus.value
    return matchesCategory && matchesSearch && matchesStatus
  })
})
</script>

<template>
  <div class="min-h-screen bg-slate-900 pt-24 pb-12 px-4">
    <div class="max-w-7xl mx-auto">
      
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Browse Tenders</h1>
          <p class="text-slate-400">Discover new business opportunities matched to your expertise.</p>
        </div>
        <button class="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-white/5 font-medium transition-colors flex items-center gap-2">
            <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
            Get Alerts
        </button>
      </div>

      <div class="flex flex-col lg:flex-row gap-8">
        
        <!-- Sidebar Filters -->
        <div class="w-full lg:w-64 flex-shrink-0 space-y-8">
          
          <!-- Search -->
          <div class="bg-slate-800/50 rounded-xl p-5 border border-white/5">
             <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Search</h3>
             <div class="relative">
               <input v-model="searchQuery" type="text" class="w-full bg-slate-900 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors" placeholder="Keywords..." />
               <svg class="w-4 h-4 text-slate-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
          </div>

          <!-- Categories -->
          <div class="bg-slate-800/50 rounded-xl p-5 border border-white/5">
            <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Category</h3>
            <div class="space-y-2">
              <label v-for="cat in categories" :key="cat" class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" :value="cat" v-model="selectedCategory" class="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500/50 focus:ring-offset-0">
                <span class="text-slate-400 group-hover:text-white text-sm transition-colors">{{ cat }}</span>
              </label>
            </div>
          </div>

           <!-- Status -->
          <div class="bg-slate-800/50 rounded-xl p-5 border border-white/5">
            <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Status</h3>
            <div class="space-y-2">
               <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" value="All" v-model="selectedStatus" class="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500/50 focus:ring-offset-0">
                <span class="text-slate-400 group-hover:text-white text-sm transition-colors">Any Status</span>
              </label>
              <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" value="Open" v-model="selectedStatus" class="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500/50 focus:ring-offset-0">
                <span class="text-slate-400 group-hover:text-white text-sm transition-colors">Open</span>
              </label>
               <label class="flex items-center gap-3 cursor-pointer group">
                <input type="radio" value="Urgent" v-model="selectedStatus" class="w-4 h-4 text-emerald-500 bg-slate-900 border-slate-600 focus:ring-emerald-500/50 focus:ring-offset-0">
                <span class="text-slate-400 group-hover:text-white text-sm transition-colors">Urgent / Closing Soon</span>
              </label>
            </div>
          </div>

        </div>

        <!-- Results List -->
        <div class="flex-grow space-y-4">
          <div v-if="filteredTenders.length === 0" class="text-center py-20 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
            <p class="text-slate-500">No tenders found matching your criteria.</p>
          </div>

          <div v-for="tender in filteredTenders" :key="tender.id" class="group bg-slate-800/50 hover:bg-slate-800 p-6 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all hover:shadow-lg hover:shadow-emerald-900/10 flex flex-col md:flex-row gap-6">
            <div class="flex-grow">
               <div class="flex items-start gap-4 mb-2">
                 <span class="px-2.5 py-0.5 bg-slate-700/50 rounded text-xs font-semibold text-slate-300 border border-white/5">{{ tender.category }}</span>
                 <span v-if="tender.status === 'Urgent'" class="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 rounded text-xs font-semibold border border-amber-500/20">Urgent</span>
               </div>
               <h3 class="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                 <NuxtLink :to="`/e-procurement/tenders/${tender.id}`">{{ tender.title }}</NuxtLink>
               </h3>
               <p class="text-slate-400 text-sm mb-4">{{ tender.company }} • Posted {{ tender.posted }}</p>
               
               <div class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                 <div class="flex items-center text-slate-500">
                   <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   {{ tender.budget }}
                 </div>
                 <div class="flex items-center text-slate-500">
                   <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                   {{ tender.deadline }}
                 </div>
               </div>
            </div>
            
            <div class="flex flex-col justify-center shrink-0">
               <NuxtLink :to="`/e-procurement/tenders/${tender.id}`" class="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-lg text-center transition-colors">
                 View Details
               </NuxtLink>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
