import React, { useState, useEffect } from 'react'
import { Search as SearchIcon, Mic } from 'lucide-react'
import { SongCard } from '../components/SongCard'
import { Song, usePlayerStore } from '../store/playerStore'
import { musicApi } from '../services/musicApi'

export const Search = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Song[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const { setQueue, setCurrentSong, setIsPlaying } = usePlayerStore()

  useEffect(() => {
    // Cargar búsquedas recientes del localStorage
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchSongs()
      }, 500) // Debounce de 500ms

      return () => clearTimeout(timeoutId)
    } else {
      setSearchResults([])
    }
  }, [searchTerm])

  const searchSongs = async () => {
    if (!searchTerm.trim()) return
    
    setLoading(true)
    try {
      const tracks = await musicApi.searchTracks(searchTerm, 20)
      const songs = tracks.map(track => musicApi.convertToSong(track))
      setSearchResults(songs)

      // Guardar en búsquedas recientes
      const newRecentSearches = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
      setRecentSearches(newRecentSearches)
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches))

    } catch (error) {
      console.error('Error searching songs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaySong = (song: Song) => {
    const songIndex = searchResults.findIndex(s => s.id === song.id)
    setQueue(searchResults, songIndex)
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const handleRecentSearch = (term: string) => {
    setSearchTerm(term)
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recentSearches')
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-8">Search</h1>
      
      {/* Search Bar */}
      <div className="relative mb-8 max-w-md">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 text-white pl-10 pr-12 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-gray-700 transition-colors"
        />
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
          <Mic size={20} />
        </button>
      </div>

      {/* Recent Searches */}
      {!searchTerm && recentSearches.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent searches</h2>
            <button 
              onClick={clearRecentSearches}
              className="text-gray-400 hover:text-white text-sm"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((term, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearch(term)}
                className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Browse Categories */}
      {!searchTerm && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Browse all</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[
              { name: 'Pop', color: 'from-pink-500 to-rose-500' },
              { name: 'Hip-Hop', color: 'from-yellow-500 to-orange-500' },
              { name: 'Rock', color: 'from-red-500 to-pink-500' },
              { name: 'Electronic', color: 'from-blue-500 to-cyan-500' },
              { name: 'Jazz', color: 'from-purple-500 to-indigo-500' },
              { name: 'Classical', color: 'from-green-500 to-teal-500' },
              { name: 'Country', color: 'from-amber-500 to-yellow-500' },
              { name: 'R&B', color: 'from-violet-500 to-purple-500' },
              { name: 'Indie', color: 'from-emerald-500 to-green-500' },
              { name: 'Folk', color: 'from-orange-500 to-red-500' }
            ].map((category) => (
              <button
                key={category.name}
                onClick={() => setSearchTerm(category.name)}
                className={`bg-gradient-to-br ${category.color} p-6 rounded-lg hover:scale-105 transition-transform h-24 flex items-end`}
              >
                <h3 className="text-white font-bold text-lg">{category.name}</h3>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-400">Searching for "{searchTerm}"...</div>
        </div>
      )}

      {/* Search Results */}
      {!loading && searchResults.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">
            Results for "{searchTerm}" ({searchResults.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
            {searchResults.map((song) => (
              <SongCard 
                key={song.id} 
                song={song} 
                onClick={() => handlePlaySong(song)}
              />
            ))}
          </div>
        </section>
      )}

      {/* No Results */}
      {!loading && searchTerm && searchResults.length === 0 && (
        <div className="text-center py-12">
          <SearchIcon className="mx-auto mb-4 text-gray-400" size={64} />
          <p className="text-gray-400 text-lg mb-2">No results found for "{searchTerm}"</p>
          <p className="text-gray-500 text-sm">Try searching for something else or check your spelling</p>
        </div>
      )}
    </div>
  )
}