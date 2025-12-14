<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="px-1">
      <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">History</h1>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Past transactions and invoices.</p>
    </div>

    <!-- Month Divider -->
    <div class="space-y-4">
        <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-widest px-2">August 2024</h3>
        
        <!-- History Item -->
        <div class="bg-white dark:bg-zinc-900 p-4 rounded-2xl flex items-center justify-between border border-zinc-50 dark:border-zinc-800 shadow-sm">
            <div class="flex items-center gap-4">
                 <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                 </div>
                 <div>
                    <h4 class="font-bold text-zinc-900 dark:text-white text-sm">SPP Payment</h4>
                    <p class="text-[10px] text-zinc-500">Fatima • 12 Aug, 10:30 AM</p>
                 </div>
            </div>
            <p class="font-bold text-zinc-900 dark:text-white">- Rp 750.000</p>
        </div>

         <!-- History Item -->
        <div class="bg-white dark:bg-zinc-900 p-4 rounded-2xl flex items-center justify-between border border-zinc-50 dark:border-zinc-800 shadow-sm">
            <div class="flex items-center gap-4">
                 <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
                 </div>
                 <div>
                    <h4 class="font-bold text-zinc-900 dark:text-white text-sm">Top Up Balance</h4>
                    <p class="text-[10px] text-zinc-500">Bank Transfer • 10 Aug, 09:15 AM</p>
                 </div>
            </div>
            <p class="font-bold text-green-600 dark:text-green-400">+ Rp 2.000.000</p>
        </div>
    </div>

    <!-- Month Divider -->
    <div class="space-y-4 pt-4">
        <h3 class="text-xs font-bold text-zinc-400 uppercase tracking-widest px-2">July 2024</h3>
        
        <!-- History Item -->
        <div class="bg-white dark:bg-zinc-900 p-4 rounded-2xl flex items-center justify-between border border-zinc-50 dark:border-zinc-800 shadow-sm">
            <div class="flex items-center gap-4">
                 <div class="w-10 h-10 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                 </div>
                 <div>
                    <h4 class="font-bold text-zinc-900 dark:text-white text-sm">SPP Payment</h4>
                    <p class="text-[10px] text-zinc-500">Fatima • 15 Jul, 14:20 PM</p>
                 </div>
            </div>
            <p class="font-bold text-zinc-900 dark:text-white">- Rp 750.000</p>
        </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'hijra-parent',
});
</script>