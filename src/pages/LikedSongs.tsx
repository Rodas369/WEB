import React from 'react'
import { Heart, Play, Clock } from 'lucide-react'
import { usePlayerStore } from '../store/playerStore'
import { usePlaylistStore } from '../store/playlistStore'

export const LikedSongs = () => {
  const { setQueue, setCurrentSong, setIsPlaying, currentSong, isPlaying } = usePlayerStore()
  const { likedSongs, toggleLikedSong } = usePlaylistStore()

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      setQueue(likedSongs, 0)
      setCurrentSong(likedSongs[0])
      setIsPlaying(true)
    }
  }

  const handlePlaySong = (index: number) => {
    setQueue(likedSongs, index)
    setCurrentSong(likedSongs[index])
    setIsPlaying(true)
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-purple-600 to-purple-800 p-8">
        <div className="flex items-end space-x-6">
          <div className="bg-gradient-to-br from-purple-400 to-blue-600 p-16 rounded-lg shadow-2xl">
            <Heart className="text-white fill-current" size={80} />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wide">Playlist</p>
            <h1 className="text-5xl font-bold mb-4">Liked Songs</h1>
            <p className="text-gray-200">
              {likedSongs.length} song{likedSongs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gradient-to-b from-purple-800/20 to-black p-6">
        <div className="flex items-center space-x-6">
          <button
            onClick={handlePlayAll}
            disabled={likedSongs.length === 0}
            className="bg-green-500 text-black p-4 rounded-full hover:bg-green-400 transition-colors hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={24} />
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Heart size={32} className="fill-current text-green-500" />
          </button>
        </div>
      </div>

      {/* Song List */}
      <div className="p-6">
        {likedSongs.length > 0 ? (
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-800">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Title</div>
              <div className="col-span-3">Album</div>
              <div className="col-span-2 flex justify-end">
                <Clock size={16} />
              </div>
            </div>

            {/* Songs */}
            {likedSongs.map((song, index) => {
              const isCurrentSong = currentSong?.id === song.id
              return (
                <div
                  key={song.id}
                  onClick={() => handlePlaySong(index)}
                  className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer group ${
                    isCurrentSong ? 'bg-gray-800' : ''
                  }`}
                >
                  <div className="col-span-1 flex items-center">
                    <span className={`text-sm ${isCurrentSong ? 'text-green-500' : 'text-gray-400 group-hover:hidden'}`}>
                      {index + 1}
                    </span>
                    <Play 
                      size={16} 
                      className={`hidden group-hover:block text-white ${isCurrentSong ? 'text-green-500' : ''}`} 
                    />
                  </div>
                  
                  <div className="col-span-6 flex items-center space-x-3">
                    <img
                      src={song.image_url}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className={`font-medium ${isCurrentSong ? 'text-green-500' : 'text-white'}`}>
                        {song.title}
                      </p>
                      <p className="text-gray-400 text-sm">{song.artist}</p>
                    </div>
                  </div>
                  
                  <div className="col-span-3 flex items-center">
                    <p className="text-gray-400 text-sm truncate">{song.album}</p>
                  </div>
                  
                  <div className="col-span-2 flex items-center justify-end space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLikedSong(song)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-green-500 hover:text-green-400 transition-all"
                    >
                      <Heart size={16} className="fill-current" />
                    </button>
                    <span className="text-gray-400 text-sm">
                      {formatDuration(song.duration)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold mb-2">No liked songs yet</h3>
            <p className="text-gray-400 mb-6">Songs you like will appear here</p>
            <button className="bg-green-500 text-black px-6 py-3 rounded-full hover:bg-green-400 transition-colors">
              Find something you like
            </button>
          </div>
        )}
      </div>
    </div>
  )
}