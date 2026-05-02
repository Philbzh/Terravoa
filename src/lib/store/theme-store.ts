import { create } from 'zustand'

const STORAGE_KEY = 'tv-theme'

type ThemeStore = {
  isDark: boolean
  /** Called once by ThemeProvider on mount — initialises from localStorage / OS */
  init: () => void
  setDark: (dark: boolean) => void
  toggle: () => void
}

function applyClass(dark: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  isDark: false,

  init() {
    const saved = localStorage.getItem(STORAGE_KEY)
    const dark =
      saved !== null
        ? saved === 'dark'
        : window.matchMedia('(prefers-color-scheme: dark)').matches

    applyClass(dark)
    set({ isDark: dark })

    // Keep in sync with OS changes (only when user hasn't overridden)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyClass(e.matches)
        set({ isDark: e.matches })
      }
    })
  },

  setDark(dark) {
    applyClass(dark)
    set({ isDark: dark })
  },

  toggle() {
    const next = !get().isDark
    applyClass(next)
    set({ isDark: next })
  },
}))
