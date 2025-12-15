<script setup lang="ts">
import '@/assets/css/landing.css'

useHead({
  bodyAttrs: {
    class: 'bg-slate-900 text-slate-100 antialiased'
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans selection:bg-emerald-500/30">
    <!-- Navbar -->
    <header class="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center p-0.5">
               <div class="w-full h-full bg-slate-900 rounded-[5px] flex items-center justify-center">
                 <span class="font-bold bg-gradient-to-br from-emerald-400 to-cyan-500 bg-clip-text text-transparent">E</span>
               </div>
            </div>
            <span class="font-bold text-lg tracking-tight">Capella<span class="text-slate-400 font-normal">Procure</span></span>
          </div>

          <!-- Nav Links -->
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#opportunities" class="hover:text-white transition-colors">Opportunities</a>
            <a href="#how-it-works" class="hover:text-white transition-colors">How it Works</a>
            <a href="#showcase" class="hover:text-white transition-colors">Showcase</a>
          </nav>

          <!-- Auth Actions -->
          <div class="flex items-center gap-4">
            <NuxtLink to="/login" class="text-sm font-medium text-slate-300 hover:text-white transition-colors">Vendor Login</NuxtLink>
            <NuxtLink to="/e-procurement/register" class="px-4 py-2 text-sm font-semibold text-slate-900 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors shadow-[0_0_20px_-5px_rgba(52,211,153,0.4)]">
              Register
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow pt-16">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/5 bg-slate-950 py-12">
        <div class="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            &copy; {{ new Date().getFullYear() }} Capella ERP. All rights reserved.
        </div>
    </footer>
  </div>
</template>

<style scoped>
/* Add any layout-specific scoped styles here */
</style>
