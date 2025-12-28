import { defineStore } from 'pinia';
import { useUserStore } from '~/store/user';
import { useChatStore } from '~/store/chat';
import { useToast } from '#imports';
// import { useAuth } from '~/composables/useAuth'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    notifications: [] as any[],
    ws: null as WebSocket | null,
    connected: false,
    reconnectInterval: 1000,
  }),

  getters: {
    unreadCount: (state) => state.notifications.filter((n) => n.isread === 0).length,
  },

  actions: {
    async fetchUnread() {
      const api = useApi();
      const { data } = await api.get(`/api/admin/notifications/unread`);
      if (data.value && data.value.status === 'success') {
        this.notifications = data.value.data || [];
      }
    },

    async markAsRead(id: number) {
      const api = useApi();
      await api.post(`/api/admin/notifications/${id}/read`);
      // Optimistic update
      const n = this.notifications.find((x) => x.usertodoid === id);
      if (n) n.isread = 1;
    },

    async connect() {
      if (process.server) return;

      const userStore = useUserStore();
      const token = userStore.token || localStorage.getItem('token');
      if (!token) return;

      // Use runtime config to get API base
      const config = useRuntimeConfig();
      let apiBase = config.public.apiBase as string;

      // Remove protocol (http:// or https://) to get host
      let host = apiBase.replace(/^https?:\/\//, '');

      // Determine request protocol (ws:// or wss://) based on page protocol
      // If apiBase is https, force wss
      const isSecure = window.location.protocol === 'https:' || apiBase.startsWith('https://');
      const protocol = isSecure ? 'wss:' : 'ws:';

      const url = `${protocol}//${host}/api/ws/notifications?token=${token}`;

      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.connected = true;
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'notification') {
            this.notifications.unshift(payload.data);
            // Optional: Show toast

            const toast = useToast();
            toast.add({
              title: payload.data.menuname,
              description: payload.data.description,
              icon: 'i-heroicons-bell',
              color: 'primary',
            });
          } else if (payload.type === 'chat') {
            // Forward to Chat Store
            // We need to dynamically import to avoid circular dependency potentially, or just use useChatStore if safe
            // Let's assume standard import works (pinia handles it well usually)
            // but to be safe inside a callback:
            const chatStore = useNuxtApp().$pinia.state.value.chat ? useChatStore() : useChatStore();

            // Payload data usually contains { text: "...", timestamp: "..." } structure or full Chat model
            // The backend sends: { type: "chat", data: chatLog_Struct }
            chatStore.addMessage(payload.data);

            // Try to find sender name
            const senderId = payload.senderid;
            const sender = chatStore.activeUsers.find((u: any) => u.useraccessid === senderId);
            const senderName = sender ? sender.realname : `User ${senderId}`;

            // Also Show Toast for chat? User said "Chat show to chat", but maybe a notification is nice if not open?
            // "notification different" implies keep them separate.
            const toast = useToast();
            toast.add({
              title: `Message from ${senderName}`,
              description: payload.data.message,
              icon: 'i-heroicons-chat-bubble-left-right',
              color: 'primary',
            });
          }
        } catch (e) {
          console.error('WS Parse error', e);
        }
      };

      this.ws.onclose = () => {
        this.connected = false;
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.ws.onerror = (err) => {
        console.error('WS Error', err);
        this.ws?.close();
      };
    },

    async sendMessage(userId: number, title: string, message: string, docno: string = '') {
      const { data, error } = await useFetch('/api/admin/notifications/send', {
        method: 'POST',
        body: {
          receiverid: userId,
          title,
          message,
          docno,
        },
      });
      if (error.value) throw error.value;
      return data.value;
    },
  },
});
