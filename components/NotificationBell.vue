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
    <button @click="toggle" class="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <i class="fa fa-bell text-gray-600 dark:text-gray-300 transform text-lg"></i>
      <span v-if="unreadCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4">
        {{ unreadCount }}
      </span>
    </button>

    <!-- Dropdown -->
    <div v-if="isOpen" class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-50 border border-gray-200 dark:border-gray-700">
      <div class="py-2 px-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</h3>
        <button v-if="unreadCount > 0" @click="isOpen = false" class="text-xs text-blue-500 hover:text-blue-600">Close</button>
      </div>
      
      <div class="max-h-64 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 text-sm">
          No notifications
        </div>
        <div 
          v-for="n in notifications" 
          :key="n.usertodoid"
          @click="markRead(n.usertodoid)"
          :class="['p-3 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700', n.isread ? 'opacity-60' : 'bg-blue-50 dark:bg-blue-900/20']"
        >
          <div class="flex justify-between items-start mb-1">
            <span class="font-medium text-sm text-gray-800 dark:text-gray-200">{{ n.menuname }}</span>
            <span class="text-xs text-gray-400">{{ new Date(n.tododate).toLocaleDateString() }}</span>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{{ n.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
