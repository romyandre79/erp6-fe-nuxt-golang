<template>
  <div class="min-h-screen bg-zinc-100 flex items-center justify-center p-0 sm:p-4 font-sans">
    <!-- Mobile Frame Container -->
    <div class="w-full max-w-md bg-white dark:bg-zinc-950 min-h-screen sm:min-h-[850px] sm:h-[850px] sm:rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col border-[8px] border-zinc-900 dark:border-zinc-800 box-border ring-1 ring-white/10">
      
      <!-- Status Bar Area (Decorative) -->
      <div class="h-12 bg-white dark:bg-zinc-950 flex items-center justify-between px-6 shrink-0 z-50">
         <span class="text-xs font-semibold text-zinc-900 dark:text-white">9:41</span>
         <div class="flex items-center gap-1.5">
           <div class="w-4 h-4 text-zinc-900 dark:text-white"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></div>
           <div class="w-4 h-4 text-zinc-900 dark:text-white"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg></div>
         </div>
      </div>

      <!-- Main Content Area with Scroll -->
      <div class="flex-1 overflow-y-auto no-scrollbar relative bg-gray-50 dark:bg-zinc-950">
        <!-- Background Gradients inside the screen -->
        <div class="fixed inset-0 pointer-events-none z-0">
           <div class="absolute top-[-10%] left-[-20%] w-[80%] h-[40%] bg-[#00AB84] rounded-full blur-[100px] opacity-10 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen animate-blob"></div>
           <div class="absolute top-[20%] right-[-20%] w-[80%] h-[40%] bg-[#FBBF24] rounded-full blur-[100px] opacity-10 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000"></div>
        </div>

        <div class="relative z-10 p-5 pb-24">
            <slot />
        </div>
      </div>

      <!-- Bottom Navigation Bar -->
      <div class="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-lg border-t border-zinc-100 dark:border-zinc-800 p-2 pb-6 sm:pb-2 shrink-0 z-50">
        <nav class="flex justify-around items-center">
          <NuxtLink to="/hijra/parent" active-class="text-[#00AB84]" class="flex flex-col items-center justify-center w-16 h-14 gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors group">
            <div class="p-1 rounded-xl group-[.router-link-active]:bg-[#00AB84]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <span class="text-[10px] font-medium">Home</span>
          </NuxtLink>

          <NuxtLink to="/hijra/children" active-class="text-[#00AB84]" class="flex flex-col items-center justify-center w-16 h-14 gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors group">
             <div class="p-1 rounded-xl group-[.router-link-active]:bg-[#00AB84]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span class="text-[10px] font-medium">Children</span>
          </NuxtLink>

          <!-- Floating Action Button Style for Payment -->
          <NuxtLink to="/hijra/payment" active-class="text-white bg-[#00AB84] shadow-lg shadow-[#00AB84]/30 scale-110 translate-y-[-5px]" class="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-lg -mt-8 border-4 border-white dark:border-zinc-950 transition-all duration-300">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
          </NuxtLink>

          <NuxtLink to="/hijra/history" active-class="text-[#00AB84]" class="flex flex-col items-center justify-center w-16 h-14 gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors group">
             <div class="p-1 rounded-xl group-[.router-link-active]:bg-[#00AB84]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/></svg>
            </div>
            <span class="text-[10px] font-medium">History</span>
          </NuxtLink>

          <NuxtLink to="/hijra/profile" active-class="text-[#00AB84]" class="flex flex-col items-center justify-center w-16 h-14 gap-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors group">
             <div class="p-1 rounded-xl group-[.router-link-active]:bg-[#00AB84]/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span class="text-[10px] font-medium">Profile</span>
          </NuxtLink>
        </nav>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// No complex script needed for the layout logic itself, just styling
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
