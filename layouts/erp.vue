<template>
  <div class="erp-layout min-h-screen bg-slate-50 text-slate-800 font-sans">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CAPELLA ERP <span class="font-light text-slate-600">6</span>
            </span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex space-x-8 items-center">
            <a href="#features" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium">Features</a>
            <a href="#modules" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium">Modules</a>
            
            <!-- Admin Login Button -->
            <NuxtLink 
              to="/login" 
              class="px-5 py-2 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 active:transform active:scale-95"
            >
              Login
            </NuxtLink>
            
            <LanguageWatcher class="ml-2" />
          </div>

          <!-- Mobile Menu Button (Simple implementation) -->
          <div class="md:hidden flex items-center">
             <NuxtLink to="/login" class="text-sm font-medium text-blue-600">Login</NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 py-12 mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-slate-500">© {{ new Date().getFullYear() }} ERP6 System. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Optional: Add custom font or specific overrides here if needed */
.erp-layout {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>
