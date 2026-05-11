import { useStorage } from '@vueuse/core'
import { computed, watch } from 'vue'
import { useSettingsStore } from '@/store'

const STORAGE_KEY = 'user-theme-preference'

export function useTheme() {
  const settingsStore = useSettingsStore()

  const isDark = useStorage(STORAGE_KEY, false)

  // 同步 html.dark 类（使用 classList.toggle 而非 setAttribute，避免覆盖 html 元素上的其他 class）
  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val)
  }, { immediate: true })

  const toggleDark = () => {
    isDark.value = !isDark.value
  }

  const currentTheme = computed(() => settingsStore.preferences.theme)

  const setTheme = (theme: string) => {
    if (theme === 'dark') {
      isDark.value = true
    } else {
      isDark.value = false
    }
    settingsStore.setTheme(theme)
  }

  // 同步 isDark 变化到 settingsStore
  watch(isDark, (val) => {
    settingsStore.setTheme(val ? 'dark' : 'default')
  })

  return {
    isDark,
    toggleDark,
    setTheme,
    currentTheme
  }
}