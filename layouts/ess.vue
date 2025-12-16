<template>
  <div class="min-h-screen bg-gray-50 flex font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-slate-900 text-white hidden md:flex flex-col flex-shrink-0 transition-all duration-300 shadow-xl z-20">
      <div class="h-16 flex items-center px-6 bg-slate-950 border-b border-slate-800">
         <h1 class="text-lg font-bold tracking-wider text-blue-400">ESS PORTAL</h1>
      </div>
      
      <div class="p-4 border-b border-slate-800 flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold">JD</div>
          <div>
              <div class="text-sm font-medium">John Doe</div>
              <div class="text-xs text-slate-400">ID: 100293</div>
          </div>
      </div>

      <nav class="flex-1 mt-6 px-3 space-y-1">
        <NuxtLink to="/ess/dashboard" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group" active-class="bg-blue-600 text-white shadow-lg shadow-blue-900/50">
           <!-- Dashboard Icon -->
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
           <span class="font-medium">Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/ess/profile" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group" active-class="bg-blue-600 text-white shadow-lg shadow-blue-900/50">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
           <span class="font-medium">My Profile</span>
        </NuxtLink>
         <NuxtLink to="/ess/leave" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group" active-class="bg-blue-600 text-white shadow-lg shadow-blue-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
           <span class="font-medium">Leave Request</span>
        </NuxtLink>
         <NuxtLink to="/ess/sick" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all group" active-class="bg-blue-600 text-white shadow-lg shadow-blue-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
           <span class="font-medium">Sick Report</span>
        </NuxtLink>
      </nav>
      
      <div class="p-4 border-t border-slate-800">
         <NuxtLink to="/ess" class="flex items-center space-x-3 px-3 py-2 text-slate-400 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log Out</span>
         </NuxtLink>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0 bg-slate-50">
        <!-- Mobile Header -->
        <header class="bg-white shadow-sm h-16 flex items-center justify-between px-6 md:hidden z-10">
             <div class="font-bold text-slate-800">ESS PORTAL</div>
             <button class="text-slate-600">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
               </svg>
             </button>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-8 relative">
            <div class="max-w-7xl mx-auto">
               <slot />
            </div>
        </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import '@/assets/css/landing.css'

// Mobile menu logic can be added here
</script>
