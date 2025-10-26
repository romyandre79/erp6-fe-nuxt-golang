// ~/store/theme.ts
import { defineStore } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import { useCookie } from '#app'
import { useColorMode } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const mode = useColorMode()
  const themeCookie = useCookie<string>('theme', { default: () => 'light' })
  const theme = ref(themeCookie.value)

  const setTheme = (newTheme: string) => {
    theme.value = newTheme
    themeCookie.value = newTheme
    mode.value = newTheme // sinkron ke useColorMode (Tailwind)
    if (process.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
    }
  }

  onMounted(() => {
    setTheme(theme.value)
  })

  watch(theme, (val) => setTheme(val))

  return { theme, setTheme }
})
