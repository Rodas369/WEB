import { create } from 'zustand'
import { Song } from './playerStore'

export interface Playlist {
  id: string
  name: string
  description: string
  image_url: string
  songs: Song[]
  created_at: string
}

interface PlaylistState {
  playlists: Playlist[]
  likedSongs: Song[]
  recentlyPlayed: Song[]
  
  createPlaylist: (name: string, description?: string) => void
  deletePlaylist: (id: string) => void
  addSongToPlaylist: (playlistId: string, song: Song) => void
  removeSongFromPlaylist: (playlistId: string, songId: string) => void
  toggleLikedSong: (song: Song) => void
  addToRecentlyPlayed: (song: Song) => void
  isLiked: (songId: string) => boolean
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [
    {
      id: '1',
      name: 'My Favorites',
      description: 'Your favorite songs',
      image_url: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: [],
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Workout Mix',
      description: 'High energy tracks for your workout',
      image_url: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: [],
      created_at: new Date().toISOString()
    }
  ],
  likedSongs: [],
  recentlyPlayed: [],
  
  createPlaylist: (name, description = '') => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      image_url: 'https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=300',
      songs: [],
      created_at: new Date().toISOString()
    }
    
    set(state => ({
      playlists: [...state.playlists, newPlaylist]
    }))
  },
  
  deletePlaylist: (id) => {
    set(state => ({
      playlists: state.playlists.filter(p => p.id !== id)
    }))
  },
  
  addSongToPlaylist: (playlistId, song) => {
    set(state => ({
      playlists: state.playlists.map(playlist => 
        playlist.id === playlistId
          ? { ...playlist, songs: [...playlist.songs, song] }
          : playlist
      )
    }))
  },
  
  removeSongFromPlaylist: (playlistId, songId) => {
    set(state => ({
      playlists: state.playlists.map(playlist => 
        playlist.id === playlistId
          ? { ...playlist, songs: playlist.songs.filter(s => s.id !== songId) }
          : playlist
      )
    }))
  },
  
  toggleLikedSong: (song) => {
    const { likedSongs } = get()
    const isAlreadyLiked = likedSongs.some(s => s.id === song.id)
    
    if (isAlreadyLiked) {
      set(state => ({
        likedSongs: state.likedSongs.filter(s => s.id !== song.id)
      }))
    } else {
      set(state => ({
        likedSongs: [...state.likedSongs, song]
      }))
    }
  },
  
  addToRecentlyPlayed: (song) => {
    set(state => {
      const filtered = state.recentlyPlayed.filter(s => s.id !== song.id)
      return {
        recentlyPlayed: [song, ...filtered].slice(0, 50) // Mantener solo las últimas 50
      }
    })
  },
  
  isLiked: (songId) => {
    const { likedSongs } = get()
    return likedSongs.some(s => s.id === songId)
  }
}))