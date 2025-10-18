import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: []
  }),

  actions: {
    addToast(message, type = 'success', duration = 3000) {
      const id = Date.now() + Math.random()
      const toast = {
        id,
        message,
        type,
        visible: true
      };

      this.toasts.push(toast)

      // Auto remove after duration
      setTimeout(() => {
        this.removeToast(id)
      }, duration)
    },

    removeToast(id) {
      const index = this.toasts.findIndex((t) => t.id === id)
      if (index !== -1) {
        this.toasts.splice(index, 1)
      }
    },

    success(message, duration) {
      this.addToast(message, 'success', duration)
    },

    error(message, duration) {
      this.addToast(message, 'error', duration)
    },

    info(message, duration) {
      this.addToast(message, 'info', duration)
    },
  }
});
