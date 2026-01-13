<template>
  <div class="campaign-layout min-h-screen bg-slate-50 text-slate-800 font-sans">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center gap-2">
            <NuxtLink to="/campaign" class="flex items-center gap-2">
              <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CAMPAIGN
              </span>
            </NuxtLink>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden md:flex space-x-8 items-center">
            <a href="#email-marketing" class="text-slate-600 hover:text-blue-600 transition-colors duration-200 font-medium">Email Marketing</a>
            <a href="#whatsapp-marketing" class="text-slate-600 hover:text-green-600 transition-colors duration-200 font-medium">WhatsApp</a>
            <a href="#pricing" class="text-slate-600 hover:text-indigo-600 transition-colors duration-200 font-medium">Pricing</a>
            
            <NuxtLink 
              to="/login" 
              class="px-5 py-2 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all duration-200 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 active:transform active:scale-95"
            >
              Login
            </NuxtLink>
            
            <LanguageWatcher class="ml-2" />
          </div>

          <!-- Mobile Menu Button (Simple implementation) -->
          <div class="md:hidden flex items-center gap-4">
             <LanguageWatcher />
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
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div class="col-span-1 md:col-span-2">
             <span class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block mb-4">
                CAMPAIGN
              </span>
            <p class="text-slate-500 max-w-xs">
              The ultimate platform for unified Email and WhatsApp marketing automation. Reach your customers where they are.
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Product</h4>
            <ul class="space-y-2">
              <li><a href="#email-marketing" class="text-slate-500 hover:text-blue-600">Email Marketing</a></li>
              <li><a href="#whatsapp-marketing" class="text-slate-500 hover:text-blue-600">WhatsApp Marketing</a></li>
              <li><a href="#pricing" class="text-slate-500 hover:text-blue-600">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-slate-500 hover:text-blue-600">Privacy Policy</a></li>
              <li><a href="#" class="text-slate-500 hover:text-blue-600">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-slate-100 pt-8 text-center">
          <p class="text-slate-400 text-sm">© {{ new Date().getFullYear() }} Corp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.campaign-layout {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}
</style>
