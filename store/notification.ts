import { defineStore } from 'pinia'
import { useUserStore } from '~/store/user'
// import { useAuth } from '~/composables/useAuth'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as any[],
    ws: null as WebSocket | null,
    connected: false,
    reconnectInterval: 1000
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter(n => n.isread === 0).length
  },

  actions: {
    async fetchUnread() {
      const api = useApi()
      const { data } = await api.get(`/api/admin/notifications/unread`)
      if (data.value && data.value.status === 'success') {
        this.notifications = data.value.data || []
      }
    },

    async markAsRead(id: number) {
      const api = useApi()
      await api.post(`/api/admin/notifications/${id}/read`)
      // Optimistic update
      const n = this.notifications.find(x => x.usertodoid === id)
      if (n) n.isread = 1
    },

    async connect() {
      if (process.server) return
      
      const userStore = useUserStore()
      const token = userStore.token || localStorage.getItem('token')
      if (!token) return

      // Use correct protocol (ws or wss)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const host = 'localhost:8888' // Backend host. Ideally from config/env
      // If frontend/backend on same domain/proxy, usage window.location.host
      // But user has go run . (port usually 8888) and bun run dev (port 3000)
      
      const url = `${protocol}//${host}/api/ws/notifications?token=${token}`
      
      console.log('Connecting WS:', url)
      this.ws = new WebSocket(url)

      this.ws.onopen = () => {
        console.log('WS Connected')
        this.connected = true
      }

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data)
          if (payload.type === 'notification') {
            this.notifications.unshift(payload.data)
            // Optional: Show toast
            const { $toast } = useNuxtApp()
            if ($toast) $toast.add({ title: payload.data.menuname, description: payload.data.description })
          }
        } catch (e) {
          console.error('WS Parse error', e)
        }
      }

      this.ws.onclose = () => {
        this.connected = false
        setTimeout(() => this.connect(), this.reconnectInterval)
      }
      
      this.ws.onerror = (err) => {
        console.error('WS Error', err)
        this.ws?.close()
      }
    },

    async sendMessage(userId: number, title: string, message: string, docno: string = '') {
      const { data, error } = await useFetch('/api/admin/notifications/send', {
        method: 'POST',
        body: {
            receiverid: userId,
            title,
            message,
            docno
        }
      })
      if (error.value) throw error.value
      return data.value
    }
  }
})
