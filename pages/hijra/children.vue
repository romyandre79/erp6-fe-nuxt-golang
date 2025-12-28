<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="px-1">
      <h1 class="text-2xl font-bold text-zinc-900 dark:text-white">My Children</h1>
      <p class="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Manage school details and payments.</p>
    </div>

    <!-- Children Cards Vertical Stack -->
    <div class="space-y-4">
      <!-- Fatima Card -->
      <div
        class="bg-white dark:bg-zinc-900 rounded-[1.5rem] p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4">
          <span
            class="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          >
            Active
          </span>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <img src="https://i.pravatar.cc/150?img=5" class="w-14 h-14 rounded-2xl object-cover shadow-sm" />
          <div>
            <h3 class="font-bold text-zinc-900 dark:text-white text-lg">Fatima Ahmad</h3>
            <p class="text-xs text-zinc-500">Grade 5 • Al-Falah School</p>
          </div>
        </div>

        <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 flex justify-between items-center mb-3">
          <div>
            <p class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Monthly SPP</p>
            <p class="text-lg font-bold text-zinc-900 dark:text-white">Rp 750.000</p>
          </div>
          <div class="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        <button
          class="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          View Details
        </button>
      </div>

      <!-- Yusuf Card -->
      <div
        class="bg-white dark:bg-zinc-900 rounded-[1.5rem] p-5 border border-zinc-100 dark:border-zinc-800 shadow-sm relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4">
          <span
            class="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          >
            Active
          </span>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <img src="https://i.pravatar.cc/150?img=12" class="w-14 h-14 rounded-2xl object-cover shadow-sm" />
          <div>
            <h3 class="font-bold text-zinc-900 dark:text-white text-lg">Yusuf Ahmad</h3>
            <p class="text-xs text-zinc-500">Grade 2 • Al-Falah School</p>
          </div>
        </div>

        <div class="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-3 flex justify-between items-center mb-3">
          <div>
            <p class="text-[10px] text-zinc-500 uppercase font-bold tracking-wider mb-0.5">Next Bill</p>
            <p class="text-lg font-bold text-zinc-900 dark:text-white">Rp 250.000</p>
          </div>
          <button
            class="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-4 py-1.5 rounded-lg text-xs font-bold"
          >
            Pay
          </button>
        </div>

        <button
          class="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          View Details
        </button>
      </div>

      <!-- Aisha Card -->
      <div
        class="bg-white dark:bg-zinc-900 rounded-[1.5rem] p-5 border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4">
          <span
            class="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          >
            Alert
          </span>
        </div>

        <div class="flex items-center gap-4 mb-4">
          <img src="https://i.pravatar.cc/150?img=9" class="w-14 h-14 rounded-2xl object-cover shadow-sm" />
          <div>
            <h3 class="font-bold text-zinc-900 dark:text-white text-lg">Aisha Ahmad</h3>
            <p class="text-xs text-zinc-500">Grade 1 • Nurul Ilmi</p>
          </div>
        </div>

        <div
          class="bg-red-50 dark:bg-red-900/10 rounded-xl p-3 flex justify-between items-center mb-3 border border-red-100 dark:border-red-900/20"
        >
          <div>
            <p class="text-[10px] text-red-600 dark:text-red-400 uppercase font-bold tracking-wider mb-0.5">
              Overdue Total
            </p>
            <p class="text-lg font-bold text-red-700 dark:text-red-400">Rp 400.000</p>
          </div>
          <button class="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-red-500/30">
            Pay Now
          </button>
        </div>

        <button
          class="w-full py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'hijra-parent',
});
</script>
