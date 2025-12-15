<script setup lang="ts">
const sidebarOpen = ref(true);
const route = useRoute();

const menuItems = [
  { name: 'Dashboard', path: '/customer', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'My Orders', path: '/customer/orders', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
  { name: 'Invoices', path: '/customer/invoices', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { name: 'Payments', path: '/customer/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
];

const isAuthPage = computed(() => {
  return ['/customer/login', '/customer/register'].includes(route.path);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex font-inter">
    <!-- Auth Layout -->
    <div v-if="isAuthPage" class="w-full">
      <slot />
    </div>

    <!-- Main Application Layout -->
    <template v-else>
      <!-- Sidebar -->
      <aside 
        class="bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-20 transition-all duration-300 transform"
        :class="sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:translate-x-0 lg:w-20'"
      >
        <div class="h-16 flex items-center justify-center border-b border-gray-100">
           <nuxt-link to="/" class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
            <span v-if="sidebarOpen" class="font-bold text-gray-800 text-lg">Customer</span>
           </nuxt-link>
        </div>

        <nav class="p-4 space-y-1">
          <nuxt-link 
            v-for="item in menuItems" 
            :key="item.path" 
            :to="item.path"
            class="flex items-center px-4 py-3 rounded-lg transition-colors group relative"
            :class="route.path === item.path ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'"
          >
            <svg class="w-5 h-5" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
            </svg>
            <span v-if="sidebarOpen" class="font-medium">{{ item.name }}</span>
            
            <!-- Tooltip for collapsed state -->
            <div v-if="!sidebarOpen" class="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
              {{ item.name }}
            </div>
          </nuxt-link>
        </nav>

        <div class="absolute bottom-0 w-full p-4 border-t border-gray-100">
            <button class="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                <svg class="w-5 h-5" :class="sidebarOpen ? 'mr-3' : 'mx-auto'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span v-if="sidebarOpen">Logout</span>
            </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div 
        class="flex-1 flex flex-col min-h-screen transition-all duration-300"
        :class="sidebarOpen ? 'ml-64' : 'ml-0 lg:ml-20'"
      >
        <!-- Header -->
        <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <button @click="sidebarOpen = !sidebarOpen" class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="flex items-center gap-4">
            <div class="flex items-center gap-3">
                <div class="text-right hidden sm:block">
                    <div class="text-sm font-semibold text-gray-900">John Doe</div>
                    <div class="text-xs text-gray-500">Acme Corp</div>
                </div>
                <div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 overflow-hidden">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 p-6">
          <slot />
        </main>
      </div>
    </template>
  </div>
</template>

<style scoped>
.font-inter {
  font-family: 'Inter', sans-serif;
}
</style>
