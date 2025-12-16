<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="px-1">
      <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">Quick Pay</h1>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Select bills to pay immediately.</p>
    </div>

    <!-- Amount Selection (Mockup) -->
    <div class="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 text-center shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50">
        <p class="text-zinc-500 text-sm font-medium mb-2">Total Payable Amount</p>
        <h2 class="text-4xl font-bold text-zinc-900 dark:text-white tracking-tight mb-6">Rp 650.000</h2>
        
        <div class="flex gap-3 justify-center mb-6">
            <span class="px-3 py-1 bg-[#00AB84]/10 text-[#00AB84] rounded-lg text-xs font-bold">2 items selected</span>
        </div>

        <button class="w-full py-4 bg-[#00AB84] hover:bg-[#009b76] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#00AB84]/30 transition-transform active:scale-95">
            Pay with Hijra Balance
        </button>
    </div>

    <!-- Bill Selection -->
    <div class="space-y-3">
        <p class="text-sm font-bold text-zinc-900 dark:text-white px-1">Outstanding Bills</p>
        
        <!-- Bill Item (Selected) -->
        <div class="bg-white dark:bg-zinc-900 border-2 border-[#00AB84] dark:border-[#00AB84] rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
             <div class="absolute right-0 top-0 w-8 h-8 bg-[#00AB84] rounded-bl-xl flex items-center justify-center text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
             </div>

            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                </div>
                <div>
                   <h4 class="font-bold text-zinc-900 dark:text-white text-sm">Book Fee</h4>
                   <p class="text-[10px] text-zinc-500">Yusuf • Al-Falah School</p>
                </div>
            </div>
            <p class="font-bold text-zinc-900 dark:text-white">Rp 250.000</p>
        </div>

         <!-- Bill Item (Selected) -->
        <div class="bg-white dark:bg-zinc-900 border-2 border-[#00AB84] dark:border-[#00AB84] rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
            <div class="absolute right-0 top-0 w-8 h-8 bg-[#00AB84] rounded-bl-xl flex items-center justify-center text-white">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
             </div>
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.38 3.4a1.6 1.6 0 0 0-2.22 0l-1.67 1.7a2.1 2.1 0 0 0 .54 3.5l1.69 1.67a2.1 2.1 0 0 0 2.24 0l1.68-1.7a1.6 1.6 0 0 0 0-2.2l-2.26-2.27Z"/><path d="M12 11V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2Z"/><path d="M11.3 16h1.4a2 2 0 0 0 2-2v-1.4a2 2 0 0 0 0-2.8h-1.4a2 2 0 0 0-2 2.8v1.4a2 2 0 0 0 0 2Z"/><path d="M2 22h4.6a2 2 0 0 0 2.2-2.1v-1.7a2 2 0 0 0-2.2-2.2H2"/></svg>
                </div>
                <div>
                   <h4 class="font-bold text-zinc-900 dark:text-white text-sm">Uniform Fee</h4>
                   <p class="text-[10px] text-zinc-500">Aisha • Nurul Ilmi</p>
                </div>
            </div>
            <p class="font-bold text-zinc-900 dark:text-white">Rp 400.000</p>
        </div>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'hijra-parent',
});
</script>