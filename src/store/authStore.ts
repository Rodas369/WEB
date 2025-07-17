import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  initialize: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,

  signIn: async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase not configured' }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      set({ user: data.user })
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  signUp: async (email: string, password: string) => {
    if (!supabase) {
      return { error: 'Supabase not configured' }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      set({ user: data.user })
      return {}
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  },

  signOut: async () => {
    if (!supabase) return

    try {
      await supabase.auth.signOut()
      set({ user: null })
    } catch (error) {
      console.error('Error signing out:', error)
    }
  },

  initialize: async () => {
    if (!supabase) {
      set({ loading: false })
      return
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, loading: false })

      supabase.auth.onAuthStateChange((event, session) => {
        set({ user: session?.user || null })
      })
    } catch (error) {
      console.error('Error initializing auth:', error)
      set({ loading: false })
    }
  },
}))