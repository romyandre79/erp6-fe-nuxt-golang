<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useNotificationStore } from '~/store/notification'
import { storeToRefs } from 'pinia'

const store = useNotificationStore()
const { unreadCount, notifications } = storeToRefs(store)
const isOpen = ref(false)

const toggle = () => (isOpen.value = !isOpen.value)

const markRead = async (id: number) => {
  await store.markAsRead(id)
}
</script>

<template>
  <div class="relative">
    <!-- Bell Button -->
    <button 
      @click="toggle" 
      class="navbar-icon relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group"
    >
      <i class="fa-solid fa-bell text-lg group-hover:scale-110 transition-colors"></i>
      
      <!-- Badge -->
      <span 
        v-if="unreadCount > 0" 
        class="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/30 animate-pulse"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <transition name="dropdown">
      <div 
        v-if="isOpen" 
        class="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/30 overflow-hidden z-50 border border-slate-200/80 dark:border-gray-800"
      >
        <!-- Header -->
        <div class="px-4 py-3 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-800 dark:to-gray-900 border-b border-slate-200 dark:border-gray-800 flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
              <i class="fa-solid fa-bell transition-colors text-xs"></i>
            </div>
            <h3 class="text-sm font-semibold text-gray-800 dark:text-white">Notifications</h3>
          </div>
          <button 
            @click="isOpen = false" 
            class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <i class="fa-solid fa-times text-xs"></i>
          </button>
        </div>
        
        <!-- Content -->
        <div class="max-h-72 overflow-y-auto custom-scrollbar">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <div class="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
              <i class="fa-solid fa-inbox text-slate-400 dark:text-gray-500"></i>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">No notifications yet</p>
          </div>
          
          <div 
            v-for="n in notifications" 
            :key="n.usertodoid"
            @click="markRead(n.usertodoid)"
            :class="[
              'p-3 border-b border-slate-100 dark:border-gray-800 cursor-pointer transition-all duration-200',
              'hover:bg-slate-50 dark:hover:bg-gray-800',
              n.isread ? 'opacity-60' : 'bg-indigo-50/50 dark:bg-indigo-900/10'
            ]"
          >
            <div class="flex gap-3">
              <div :class="[
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                n.isread ? 'bg-slate-100 dark:bg-gray-800' : 'bg-indigo-100 dark:bg-indigo-900/40'
              ]">
                <i :class="[
                  'fa-solid fa-circle-info text-xs',
                  n.isread ? 'text-gray-400' : 'text-indigo-500'
                ]"></i>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start mb-0.5">
                  <span class="font-medium text-sm text-gray-800 dark:text-white truncate">{{ n.menuname }}</span>
                  <span class="text-[10px] text-gray-400 dark:text-gray-500 ml-2 flex-shrink-0">{{ new Date(n.tododate).toLocaleDateString() }}</span>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{{ n.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease-out;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.95);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 10px;
}
</style>
