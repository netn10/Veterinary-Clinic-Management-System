<template>
  <div class="toast-container">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast-${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <div class="toast-icon">
          <span v-if="toast.type === 'success'">✓</span>
          <span v-else-if="toast.type === 'error'">✕</span>
          <span v-else>ⓘ</span>
        </div>
        <div class="toast-message">{{ toast.message }}</div>
        <button class="toast-close" @click.stop="removeToast(toast.id)">
          &times;
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script>
import { useToastStore } from '../stores/toast'
import { computed } from 'vue'

export default {
  name: 'Toast',
  setup() {
    const toastStore = useToastStore()

    return {
      toasts: computed(() => toastStore.toasts),
      removeToast: toastStore.removeToast
    }
  }
}
</script>

