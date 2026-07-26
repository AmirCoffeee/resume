import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthState {
  token: string | null
  user: User | null
  setToken: (token: string) => void
  setUser: (user: User) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      setToken: (token) => {
        localStorage.setItem('token', token)
        set({ token })
      },
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem('token')
        set({ token: null, user: null })
      },
      isAdmin: () => get().user?.role === 'ADMIN',
    }),
    { name: 'auth-store', partialize: (s) => ({ token: s.token, user: s.user }) }
  )
)
