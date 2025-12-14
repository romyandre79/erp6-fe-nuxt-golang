<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <p class="text-zinc-500 dark:text-zinc-400 text-xs font-medium">Assalamualaikum,</p>
        <h1 class="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">Ahmad Abdullah</h1>
      </div>
       <button @click="toggleTheme" class="p-2 rounded-full bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300">
        <span v-if="isDark">🌙</span>
        <span v-else>rw</span>
      </button>
    </div>

    <!-- Balance Card -->
    <div class="relative overflow-hidden w-full h-48 rounded-[2rem] bg-[#00AB84] shadow-2xl shadow-[#00AB84]/30 text-white p-6 flex flex-col justify-between group">
      <!-- Decor -->
      <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
      
      <div>
        <p class="text-white/80 text-sm font-medium mb-1">Total Hijra Balance</p>
        <h2 class="text-3xl font-bold tracking-tight">Rp 1.500.000</h2>
      </div>

      <div class="flex items-center gap-3 mt-4">
        <button class="flex-1 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white py-3 rounded-xl text-sm font-bold transition-all active:scale-95">
          Top Up
        </button>
        <button class="flex-1 bg-black/20 backdrop-blur-md hover:bg-black/30 text-white py-3 rounded-xl text-sm font-bold transition-all active:scale-95">
          Transfer
        </button>
      </div>
    </div>

    <!-- Quick Actions / Children Status -->
    <div>
      <div class="flex items-center justify-between mb-4 px-1">
        <h3 class="text-lg font-bold text-zinc-900 dark:text-white">Children</h3>
        <NuxtLink to="/hijra/children" class="text-xs font-bold text-[#00AB84] uppercase tracking-wide">See All</NuxtLink>
      </div>

      <div class="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 no-scrollbar snap-x">
        <!-- Child 1 -->
        <div class="snap-center shrink-0 w-32 flex flex-col items-center">
            <div class="relative w-16 h-16 mb-2">
                <img src="https://i.pravatar.cc/150?img=5" class="w-full h-full rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-md">
                <div class="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full"></div>
            </div>
            <p class="text-xs font-bold text-zinc-900 dark:text-white">Fatima</p>
            <p class="text-[10px] text-zinc-500">Paid</p>
        </div>
        <!-- Child 2 -->
        <div class="snap-center shrink-0 w-32 flex flex-col items-center">
            <div class="relative w-16 h-16 mb-2">
                <img src="https://i.pravatar.cc/150?img=12" class="w-full h-full rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-md">
                <div class="absolute bottom-0 right-0 w-5 h-5 bg-yellow-500 border-2 border-white dark:border-zinc-950 rounded-full"></div>
            </div>
            <p class="text-xs font-bold text-zinc-900 dark:text-white">Yusuf</p>
            <p class="text-[10px] text-zinc-500">Pending</p>
        </div>
         <!-- Child 3 -->
        <div class="snap-center shrink-0 w-32 flex flex-col items-center">
            <div class="relative w-16 h-16 mb-2">
                <img src="https://i.pravatar.cc/150?img=9" class="w-full h-full rounded-full object-cover ring-2 ring-white dark:ring-zinc-800 shadow-md">
                <div class="absolute bottom-0 right-0 w-5 h-5 bg-red-500 border-2 border-white dark:border-zinc-950 rounded-full"></div>
            </div>
            <p class="text-xs font-bold text-zinc-900 dark:text-white">Aisha</p>
            <p class="text-[10px] text-zinc-500">Overdue</p>
        </div>
      </div>
    </div>

    <!-- Upcoming Payments List -->
    <div class="bg-white dark:bg-zinc-900 rounded-[1.5rem] p-5 shadow-sm border border-zinc-100 dark:border-zinc-800">
      <h3 class="text-lg font-bold text-zinc-900 dark:text-white mb-4">Upcoming Bills</h3>
      
      <div class="space-y-4">
        <!-- Bill Item -->
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-zinc-900 dark:text-white text-sm">Book Fee</h4>
                <p class="text-xs text-zinc-500">Yusuf • Due Tomorrow</p>
            </div>
            <div class="text-right">
                <p class="font-bold text-zinc-900 dark:text-white text-sm">Rp 250.000</p>
                <button class="text-[10px] font-bold text-[#00AB84]">Pay</button>
            </div>
        </div>

        <div class="h-px bg-zinc-100 dark:bg-zinc-800 w-full"></div>

        <!-- Bill Item -->
        <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.4a1.6 1.6 0 0 0-2.22 0l-1.67 1.7a2.1 2.1 0 0 0 .54 3.5l1.69 1.67a2.1 2.1 0 0 0 2.24 0l1.68-1.7a1.6 1.6 0 0 0 0-2.2l-2.26-2.27Z"/><path d="M12 11V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2Z"/><path d="M11.3 16h1.4a2 2 0 0 0 2-2v-1.4a2 2 0 0 0 0-2.8h-1.4a2 2 0 0 0-2 2.8v1.4a2 2 0 0 0 0 2Z"/><path d="M2 22h4.6a2 2 0 0 0 2.2-2.1v-1.7a2 2 0 0 0-2.2-2.2H2"/></svg>
            </div>
            <div class="flex-1">
                <h4 class="font-bold text-zinc-900 dark:text-white text-sm">Uniform Fee</h4>
                <p class="text-xs text-red-500">Aisha • Overdue 12 Days</p>
            </div>
             <div class="text-right">
                <p class="font-bold text-zinc-900 dark:text-white text-sm">Rp 400.000</p>
                <button class="text-[10px] font-bold text-red-500">Pay Now</button>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'hijra-parent',
});

import { ref, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
})

const toggleTheme = () => {
    isDark.value = !isDark.value
    if (isDark.value) {
        document.documentElement.classList.add('dark')
        localStorage.theme = 'dark'
    } else {
        document.documentElement.classList.remove('dark')
        localStorage.theme = 'light'
    }
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>