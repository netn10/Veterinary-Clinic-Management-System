import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(false)

  const toggleTheme = () => {
    isDarkMode.value = !isDarkMode.value
    localStorage.setItem('darkMode', isDarkMode.value.toString())
    updateDocumentClass()
  }

  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      isDarkMode.value = savedTheme === 'true'
    } else {
      // Check system preference
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    updateDocumentClass()
  }

  const updateDocumentClass = () => {
    if (isDarkMode.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const themeClass = computed(() => isDarkMode.value ? 'dark' : 'light')

  return {
    isDarkMode,
    toggleTheme,
    initializeTheme,
    themeClass
  }
})
