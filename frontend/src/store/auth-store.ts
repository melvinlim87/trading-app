import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'

interface User {
  id: string
  email: string
  name: string
  role: string
  avatarUrl?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          const response = await api.post('/auth/login', { email, password })
          const { user, token } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
          })

          // Set token for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Login failed')
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await api.post('/auth/register', {
            name,
            email,
            password,
          })
          const { user, token } = response.data

          set({
            user,
            token,
            isAuthenticated: true,
          })

          // Set token for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Registration failed')
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })

        // Remove token from API
        delete api.defaults.headers.common['Authorization']
      },

      setUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
