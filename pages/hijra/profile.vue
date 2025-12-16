<template>
  <div class="space-y-6">
    <!-- Profile Header -->
    <div class="text-center pt-4">
      <div class="w-24 h-24 mx-auto rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden mb-4 ring-4 ring-white dark:ring-zinc-900 shadow-xl">
          <svg class="h-full w-full text-zinc-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
      </div>
      <h1 class="text-xl font-bold text-zinc-900 dark:text-white">Ahmad Abdullah</h1>
      <p class="text-sm text-zinc-500">ahmad.abdullah@example.com</p>
    </div>

    <!-- Settings List -->
    <div class="bg-white dark:bg-zinc-900 rounded-[2rem] p-2 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        <button class="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <span class="font-semibold text-sm text-zinc-900 dark:text-white">Personal Information</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

         <button class="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/30 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <span class="font-semibold text-sm text-zinc-900 dark:text-white">Cards & Accounts</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

         <button class="w-full flex items-center justify-between p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-colors">
            <div class="flex items-center gap-3">
                 <div class="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-900/30 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <span class="font-semibold text-sm text-zinc-900 dark:text-white">Security</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-zinc-400"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
    </div>

    <!-- Danger Zone -->
     <div class="bg-red-50 dark:bg-red-900/10 rounded-[2rem] p-2 border border-red-100 dark:border-red-900/20 shadow-sm overflow-hidden">
        <button class="w-full flex items-center justify-between p-4 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors text-red-600 dark:text-red-400">
             <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-red-200 dark:bg-red-800/50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                </div>
                <span class="font-bold text-sm">Log Out</span>
            </div>
        </button>
     </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'hijra-parent',
});
</script>