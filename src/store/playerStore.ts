import { create } from 'zustand'

export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  image_url: string
  audio_url: string
  created_at?: string
}

interface PlayerState {
  currentSong: Song | null
  isPlaying: boolean
  volume: number
  currentTime: number
  duration: number
  queue: Song[]
  currentIndex: number
  isShuffled: boolean
  isRepeating: boolean
  
  setCurrentSong: (song: Song) => void
  setIsPlaying: (playing: boolean) => void
  setVolume: (volume: number) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setQueue: (songs: Song[], startIndex?: number) => void
  playNext: () => void
  playPrevious: () => void
  togglePlay: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  addToQueue: (song: Song) => void
  removeFromQueue: (index: number) => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  queue: [],
  currentIndex: 0,
  isShuffled: false,
  isRepeating: false,
  
  setCurrentSong: (song) => {
    const { queue } = get()
    const index = queue.findIndex(s => s.id === song.id)
    set({ 
      currentSong: song,
      currentIndex: index >= 0 ? index : 0
    })
  },
  
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setVolume: (volume) => set({ volume }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setDuration: (duration) => set({ duration }),
  
  setQueue: (songs, startIndex = 0) => {
    set({ 
      queue: songs,
      currentIndex: startIndex,
      currentSong: songs[startIndex] || null
    })
  },
  
  playNext: () => {
    const { queue, currentIndex, isRepeating, isShuffled } = get()
    
    if (isRepeating) {
      // Repetir canción actual
      set({ currentTime: 0 })
      return
    }
    
    let nextIndex = currentIndex + 1
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * queue.length)
    }
    
    if (nextIndex < queue.length) {
      set({ 
        currentSong: queue[nextIndex],
        currentIndex: nextIndex,
        currentTime: 0
      })
    } else if (queue.length > 0) {
      // Volver al inicio si llegamos al final
      set({ 
        currentSong: queue[0],
        currentIndex: 0,
        currentTime: 0
      })
    }
  },
  
  playPrevious: () => {
    const { queue, currentIndex } = get()
    
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1
      set({ 
        currentSong: queue[prevIndex],
        currentIndex: prevIndex,
        currentTime: 0
      })
    } else if (queue.length > 0) {
      // Ir al final si estamos al inicio
      const lastIndex = queue.length - 1
      set({ 
        currentSong: queue[lastIndex],
        currentIndex: lastIndex,
        currentTime: 0
      })
    }
  },
  
  togglePlay: () => {
    const { isPlaying } = get()
    set({ isPlaying: !isPlaying })
  },
  
  toggleShuffle: () => {
    const { isShuffled } = get()
    set({ isShuffled: !isShuffled })
  },
  
  toggleRepeat: () => {
    const { isRepeating } = get()
    set({ isRepeating: !isRepeating })
  },
  
  addToQueue: (song) => {
    const { queue } = get()
    set({ queue: [...queue, song] })
  },
  
  removeFromQueue: (index) => {
    const { queue, currentIndex } = get()
    const newQueue = queue.filter((_, i) => i !== index)
    
    let newCurrentIndex = currentIndex
    if (index < currentIndex) {
      newCurrentIndex = currentIndex - 1
    } else if (index === currentIndex && newQueue.length > 0) {
      newCurrentIndex = Math.min(currentIndex, newQueue.length - 1)
    }
    
    set({ 
      queue: newQueue,
      currentIndex: newCurrentIndex,
      currentSong: newQueue[newCurrentIndex] || null
    })
  }
}))