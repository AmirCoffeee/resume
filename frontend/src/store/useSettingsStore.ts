import { create } from 'zustand'
import type { PublicSettings } from '../types'

interface SettingsState {
  settings: PublicSettings | null
  setSettings: (s: PublicSettings) => void
  applyTheme: (primary: string) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  setSettings: (settings) => {
    set({ settings })
    // Apply CSS custom properties for dynamic theming
    const root = document.documentElement
    root.style.setProperty('--color-primary', settings.primaryColor)
    root.style.setProperty('--color-accent', settings.accentColor)
  },
  applyTheme: (primary) => {
    document.documentElement.style.setProperty('--color-primary', primary)
  },
}))
