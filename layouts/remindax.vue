<template>
  <div class="remindax-layout min-h-screen bg-slate-50 text-slate-800 font-sans">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-2">
            <span class="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              REMINDAX
            </span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex space-x-8 items-center">
            <a href="#features" class="text-slate-600 hover:text-orange-600 transition-colors duration-200 font-medium">Features</a>
            <a href="#modules" class="text-slate-600 hover:text-orange-600 transition-colors duration-200 font-medium">Modules</a>
            <a href="#pricing" class="text-slate-600 hover:text-orange-600 transition-colors duration-200 font-medium">Pricing</a>
            
            <!-- Link to login as requested -->
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
             <NuxtLink to="/login" class="text-sm font-medium text-orange-600">Login</NuxtLink>
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
        <p class="text-slate-500">© {{ new Date().getFullYear() }} Remindax. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.remindax-layout {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>
