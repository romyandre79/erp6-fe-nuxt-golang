import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    connectionError: false,
    errorMessage: 'Unable to connect to the server',
  }),
  actions: {
    setConnectionError(status: boolean, message?: string) {
      this.connectionError = status;
      if (message) {
        this.errorMessage = message;
      }
    },
  },
});
