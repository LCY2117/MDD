import { defineStore } from 'pinia'
import { ref } from 'vue'

type Theme = 'light' | 'dark' | 'system'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'system')

  function init() {
    applyTheme(theme.value)
  }

  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem('theme', t)
    applyTheme(t)
  }

  function toggleTheme() {
    const next = theme.value === 'light' ? 'dark' : 'light'
    setTheme(next)
  }

  function applyTheme(t: Theme) {
    const root = document.documentElement
    if (t === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    } else {
      root.classList.toggle('dark', t === 'dark')
    }
  }

  return { theme, init, setTheme, toggleTheme }
})
