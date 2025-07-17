import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Only create Supabase client if we have valid credentials
export const supabase = supabaseUrl && supabaseKey && supabaseUrl !== 'https://your-project.supabase.co' && supabaseKey !== 'your-anon-key-here'
  ? createClient(supabaseUrl, supabaseKey)
  : null

export type Database = {
  public: {
    Tables: {
      songs: {
        Row: {
          id: string
          title: string
          artist: string
          album: string
          duration: number
          image_url: string
          audio_url: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          artist: string
          album: string
          duration: number
          image_url: string
          audio_url: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          artist?: string
          album?: string
          duration?: number
          image_url?: string
          audio_url?: string
          created_at?: string
        }
      }
      playlists: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          user_id?: string
          created_at?: string
        }
      }
      playlist_songs: {
        Row: {
          id: string
          playlist_id: string
          song_id: string
          created_at: string
        }
        Insert: {
          id?: string
          playlist_id: string
          song_id: string
          created_at?: string
        }
        Update: {
          id?: string
          playlist_id?: string
          song_id?: string
          created_at?: string
        }
      }
    }
  }
}