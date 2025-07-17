import React, { useState } from 'react'
import { Music, Heart, Plus, Clock, Trash2 } from 'lucide-react'
import { SongCard } from '../components/SongCard'
import { Song, usePlayerStore } from '../store/playerStore'
import { usePlaylistStore } from '../store/playlistStore'

export const Library = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'playlists' | 'artists'>('all')
  const { setQueue, setCurrentSong, setIsPlaying } = usePlayerStore()
  const { playlists, likedSongs, recentlyPlayed, deletePlaylist } = usePlaylistStore()

  const handlePlaySong = (song: Song, songList: Song[]) => {
    const songIndex = songList.findIndex(s => s.id === song.id)
    setQueue(songList, songIndex)
    setCurrentSong(song)
    setIsPlaying(true)
  }

  const handlePlayPlaylist = (playlistSongs: Song[]) => {
    if (playlistSongs.length > 0) {
      setQueue(playlistSongs, 0)
      setCurrentSong(playlistSongs[0])
      setIsPlaying(true)
    }
  }

  const handleDeletePlaylist = (playlistId: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      deletePlaylist(playlistId)
    }
  }

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Library</h1>
        <button className="flex items-center space-x-2 bg-green-500 text-black px-4 py-2 rounded-full hover:bg-green-400 transition-colors">
          <Plus size={16} />
          <span>Create</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-8">
        {[
          { id: 'all', label: 'All' },
          { id: 'playlists', label: 'Playlists' },
          { id: 'artists', label: 'Artists' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* Liked Songs */}
        <div 
          onClick={() => handlePlayPlaylist(likedSongs)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Heart className="text-white fill-current" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Liked Songs</h3>
              <p className="text-sm text-gray-200">{likedSongs.length} songs</p>
            </div>
          </div>
        </div>
        
        {/* Recently Played */}
        <div 
          onClick={() => handlePlayPlaylist(recentlyPlayed)}
          className="bg-gradient-to-r from-green-600 to-teal-600 p-6 rounded-lg cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Clock className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Recently Played</h3>
              <p className="text-sm text-gray-200">{recentlyPlayed.length} songs</p>
            </div>
          </div>
        </div>

        {/* All Songs */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 p-6 rounded-lg cursor-pointer hover:scale-105 transition-transform">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <Music className="text-white" size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">All Songs</h3>
              <p className="text-sm text-gray-200">Your music collection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Playlists Section */}
      {(activeTab === 'all' || activeTab === 'playlists') && playlists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Playlists</h2>
          <div className="space-y-4">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group">
                <img
                  src={playlist.image_url}
                  alt={playlist.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold truncate">{playlist.name}</h3>
                  <p className="text-gray-400 text-sm truncate">{playlist.description}</p>
                  <p className="text-gray-500 text-xs">{playlist.songs.length} songs</p>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePlayPlaylist(playlist.songs)}
                    className="bg-green-500 text-black p-2 rounded-full hover:bg-green-400 transition-colors"
                    disabled={playlist.songs.length === 0}
                  >
                    <Music size={16} />
                  </button>
                  <button
                    onClick={() => handleDeletePlaylist(playlist.id)}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Added Songs */}
      {likedSongs.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Recently Liked</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
            {likedSongs.slice(0, 12).map((song) => (
              <SongCard 
                key={song.id} 
                song={song} 
                onClick={() => handlePlaySong(song, likedSongs)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {playlists.length === 0 && likedSongs.length === 0 && (
        <div className="text-center py-12">
          <Music className="mx-auto mb-4 text-gray-400" size={64} />
          <h3 className="text-xl font-semibold mb-2">Your library is empty</h3>
          <p className="text-gray-400 mb-6">Start by liking some songs or creating a playlist</p>
          <button className="bg-green-500 text-black px-6 py-3 rounded-full hover:bg-green-400 transition-colors">
            Browse Music
          </button>
        </div>
      )}
    </div>
  )
}