import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    connectionError: false,
    errorMessage: 'Unable to connect to the server',
    isChatOpen: false,
    isNotificationOpen: false,
  }),
  actions: {
    setConnectionError(status: boolean, message?: string) {
      this.connectionError = status;
      if (message) {
        this.errorMessage = message;
      }
    },
    toggleChat() {
      this.isChatOpen = !this.isChatOpen;
      if (this.isChatOpen) this.isNotificationOpen = false;
    },
    toggleNotification() {
      this.isNotificationOpen = !this.isNotificationOpen;
      if (this.isNotificationOpen) this.isChatOpen = false;
    },
    closeAll() {
      this.isChatOpen = false;
      this.isNotificationOpen = false;
    }
  },
});
