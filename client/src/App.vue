<template>
  <div id="app" :class="themeClass">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <h1 @click="goHome" class="clickable-title">Veterinary Clinic Management</h1>
          <button @click="toggleTheme" class="theme-toggle" :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'">
            <span v-if="isDarkMode">☀</span>
            <span v-else>☾</span>
          </button>
        </div>
      </div>
    </header>
    
    <main class="container">
      <router-view />
    </main>
    
    <Toast />
  </div>
</template>

<script>
import { useThemeStore } from './stores/theme'
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Toast from './components/Toast.vue'

export default {
  name: 'App',
  components: {
    Toast
  },
  setup() {
    const themeStore = useThemeStore()
    const router = useRouter()

    onMounted(() => {
      themeStore.initializeTheme()
    })

    const goHome = () => {
      router.push('/')
    }

    return {
      isDarkMode: computed(() => themeStore.isDarkMode),
      themeClass: computed(() => themeStore.themeClass),
      toggleTheme: themeStore.toggleTheme,
      goHome
    }
  }
}
</script>
