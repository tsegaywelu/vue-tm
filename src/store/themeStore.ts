import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'black'
export type AccentKey = 'blue' | 'indigo' | 'green' | 'purple' | 'rose'

const ACCENT_CLASSES: AccentKey[] = ['blue', 'indigo', 'green', 'purple', 'rose']

export const ACCENT_OPTIONS: { key: AccentKey; color: string; label: string }[] = [
  { key: 'blue',   color: '#2222FF', label: 'Blue' },
  { key: 'indigo', color: '#6366F1', label: 'Indigo' },
  { key: 'green',  color: '#059669', label: 'Green' },
  { key: 'purple', color: '#7C3AED', label: 'Purple' },
  { key: 'rose',   color: '#E11D48', label: 'Rose' },
]

function readStorage<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key)
    return val ? (val as unknown as T) : fallback
  } catch {
    return fallback
  }
}

export const useThemeStore = defineStore('theme', () => {
  const mode = ref<ThemeMode>(readStorage('theme-mode', 'light'))
  const accent = ref<AccentKey>(readStorage('theme-accent', 'blue'))

  function applyToDOM() {
    const html = document.documentElement
    html.classList.toggle('dark', mode.value === 'dark' || mode.value === 'black')
    html.classList.toggle('black', mode.value === 'black')
    ACCENT_CLASSES.forEach(a => html.classList.remove(`accent-${a}`))
    if (accent.value !== 'blue') html.classList.add(`accent-${accent.value}`)
  }

  function setMode(m: ThemeMode) {
    mode.value = m
  }

  function setAccent(a: AccentKey) {
    accent.value = a
  }

  function toggle() {
    mode.value = mode.value === 'light' ? 'dark' : 'light'
  }

  watch(
    [mode, accent],
    () => {
      try {
        localStorage.setItem('theme-mode', mode.value)
        localStorage.setItem('theme-accent', accent.value)
      } catch {}
      applyToDOM()
    },
    { immediate: true },
  )

  return { mode, accent, setMode, setAccent, toggle }
})
