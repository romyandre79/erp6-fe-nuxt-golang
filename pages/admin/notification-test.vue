<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Notification Test Page</h1>
    
    <div class="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">
      <h2 class="font-semibold mb-2">WebSocket Status</h2>
      <p>Connected: <span :class="store.connected ? 'text-green-600' : 'text-red-600'">{{ store.connected ? 'Yes' : 'No' }}</span></p>
      <p>Unread Count: {{ store.unreadCount }}</p>
      <button @click="store.connect()" class="btn btn-sm btn-primary mt-2">Reconnect WS</button>
    </div>

    <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded">
      <h2 class="font-semibold mb-2">Fetch Notifications</h2>
      <button @click="fetchNotifications" class="btn btn-sm btn-secondary">Fetch Unread</button>
      <pre class="mt-2 text-xs">{{ JSON.stringify(store.notifications, null, 2) }}</pre>
    </div>

    <div class="mb-6">
      <SendMessage />
    </div>

    <div class="p-4 bg-yellow-50 dark:bg-yellow-900 rounded">
      <h2 class="font-semibold mb-2">Console Logs</h2>
      <p class="text-sm">Check browser console (F12) for WebSocket connection logs</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/store/notification'
import SendMessage from '~/components/SendMessage.vue'

definePageMeta({
  middleware: ['auth'],
  layout: 'auth'
})

const store = useNotificationStore()

const fetchNotifications = async () => {
  await store.fetchUnread()
  console.log('Fetched notifications:', store.notifications)
}
</script>
