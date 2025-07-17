import React, { useEffect, useState } from 'react'
import { SongCard } from '../components/SongCard'
import { Song, usePlayerStore } from '../store/playerStore'
import { usePlaylistStore } from '../store/playlistStore'
import { musicApi } from '../services/musicApi'

export const Home = () => {
  const [popularSongs, setPopularSongs] = useState<Song[]>([])
  const [newReleases, setNewReleases] = useState<Song[]>([])
  const [loading, setLoading] = useState(true)
  const { setQueue, setCurrentSong, setIsPlaying } = usePlayerStore()
  const { recentlyPlayed } = usePlaylistStore()

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      
      // Cargar música popular
      const popularTracks = await musicApi.getPopularTracks(12)
      const popularSongs = popularTracks.map(track => musicApi.convertToSong(track))
      setPopularSongs(popularSongs)

      // Cargar nuevos lanzamientos
      const newTracks = await musicApi.getNewReleases(12)
      const newSongs = newTracks.map(track => musicApi.convertToSong(track))
      setNewReleases(newSongs)

    } catch (error) {
      console.error('Error loading home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaySong = (song: Song, songList: Song[]) => {
    const songIndex = songList.findIndex(s => s.id === song.id)
    setQueue(songList, songIndex)
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white text-lg">Loading amazing music...</div>
      </div>
    )
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">{getGreeting()}</h1>
      
      {/* Recently Played */}
      {recentlyPlayed.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recently played</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
            {recentlyPlayed.slice(0, 6).map((song) => (
              <SongCard 
                key={song.id} 
                song={song} 
                onClick={() => handlePlaySong(song, recentlyPlayed)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Popular Right Now */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Popular right now</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {popularSongs.map((song) => (
            <SongCard 
              key={song.id} 
              song={song} 
              onClick={() => handlePlaySong(song, popularSongs)}
            />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">New releases</h2>
          <button className="text-gray-400 hover:text-white text-sm font-medium">
            Show all
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
          {newReleases.map((song) => (
            <SongCard 
              key={song.id} 
              song={song} 
              onClick={() => handlePlaySong(song, newReleases)}
            />
          ))}
        </div>
      </section>

      {/* Quick Access Genres */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Browse by genre</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[
            { name: 'Pop', color: 'from-pink-500 to-rose-500', image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300' },
            { name: 'Rock', color: 'from-red-500 to-orange-500', image: 'https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=300' },
            { name: 'Electronic', color: 'from-blue-500 to-cyan-500', image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300' },
            { name: 'Jazz', color: 'from-purple-500 to-indigo-500', image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300' },
            { name: 'Classical', color: 'from-green-500 to-teal-500', image: 'https://images.pexels.com/photos/1699030/pexels-photo-1699030.jpeg?auto=compress&cs=tinysrgb&w=300' }
          ].map((genre) => (
            <div
              key={genre.name}
              className={`bg-gradient-to-br ${genre.color} p-4 rounded-lg cursor-pointer hover:scale-105 transition-transform relative overflow-hidden h-32`}
            >
              <h3 className="text-white font-bold text-lg mb-2">{genre.name}</h3>
              <img
                src={genre.image}
                alt={genre.name}
                className="absolute bottom-0 right-0 w-16 h-16 object-cover rounded transform rotate-12 translate-x-2 translate-y-2"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}