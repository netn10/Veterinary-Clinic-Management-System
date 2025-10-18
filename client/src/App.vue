<template>
  <div id="app" :class="themeClass">
    <!-- Skip link for accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <header class="header" role="banner">
      <div class="container">
        <div class="header-content">
          <h1>
            <a @click="goHome" class="clickable-title header-logo" role="button" tabindex="0" @keydown.enter="goHome">
              <img src="/dog-icon.svg" alt="Veterinary Clinic Logo" class="logo-icon" />
              Veterinary Clinic Management
            </a>
          </h1>
          <button 
            @click="toggleTheme" 
            class="theme-toggle" 
            :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
            :aria-label="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <span v-if="isDarkMode" aria-hidden="true">☀</span>
            <span v-else aria-hidden="true">☾</span>
          </button>
        </div>
      </div>
    </header>
    
    <main id="main-content" class="container" role="main">
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
