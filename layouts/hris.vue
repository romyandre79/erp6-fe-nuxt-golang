<script setup lang="ts">
import '@/assets/css/landing.css';

useHead({
  bodyAttrs: {
    class: 'bg-slate-900 text-slate-100 antialiased',
  },
});
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans selection:bg-indigo-500/30">
    <!-- Navbar -->
    <header class="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center p-0.5"
            >
              <div class="w-full h-full bg-slate-900 rounded-[5px] flex items-center justify-center">
                <span class="font-bold bg-gradient-to-br from-indigo-400 to-violet-400 bg-clip-text text-transparent"
                  >H</span
                >
              </div>
            </div>
            <span class="font-bold text-lg tracking-tight"
              >Capella<span class="text-slate-400 font-normal">HRIS</span></span
            >
          </div>

          <!-- Nav Links -->
          <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <NuxtLink to="/hris" class="hover:text-white transition-colors">Home</NuxtLink>
            <a href="#features" class="hover:text-white transition-colors">Features</a>
            <a href="#about" class="hover:text-white transition-colors">About</a>
          </nav>

          <!-- Auth Actions -->
          <div class="flex items-center gap-4">
            <NuxtLink
              to="/login"
              class="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] border border-indigo-500/50"
            >
              Login
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
        &copy; {{ new Date().getFullYear() }} Capella HRIS. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Add any layout-specific scoped styles here */
</style>
