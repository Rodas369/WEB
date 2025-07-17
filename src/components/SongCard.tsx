import React, { useState } from 'react'
import { Play, Pause, Heart, Plus, MoreHorizontal } from 'lucide-react'
import { Song } from '../store/playerStore'
import { usePlayerStore } from '../store/playerStore'
import { usePlaylistStore } from '../store/playlistStore'

interface SongCardProps {
  song: Song
  showPlayButton?: boolean
  onClick?: () => void
}

export const SongCard: React.FC<SongCardProps> = ({ 
  song, 
  showPlayButton = true,
  onClick 
}) => {
  const { currentSong, isPlaying, setCurrentSong, setIsPlaying, addToQueue } = usePlayerStore()
  const { toggleLikedSong, isLiked, addToRecentlyPlayed } = usePlaylistStore()
  const [showMenu, setShowMenu] = useState(false)
  const isCurrentSong = currentSong?.id === song.id
  const songIsLiked = isLiked(song.id)

  const handlePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCurrentSong) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentSong(song)
      setIsPlaying(true)
      addToRecentlyPlayed(song)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLikedSong(song)
  }

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToQueue(song)
    setShowMenu(false)
  }

  return (
    <div 
      onClick={onClick}
      className="group bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all duration-200 cursor-pointer relative"
    >
      <div className="relative mb-4">
        <img
          src={song.image_url}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'
          }}
        />
        
        {/* Play Button */}
        {showPlayButton && (
          <button
            onClick={handlePlay}
            className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200 hover:scale-105"
          >
            {isCurrentSong && isPlaying ? (
              <Pause size={20} />
            ) : (
              <Play size={20} />
            )}
          </button>
        )}

        {/* Menu Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        >
          <MoreHorizontal size={16} />
        </button>

        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute top-10 right-2 bg-gray-800 rounded-lg shadow-lg py-2 z-10 min-w-[150px]">
            <button
              onClick={handleAddToQueue}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>Add to Queue</span>
            </button>
            <button
              onClick={handleLike}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 flex items-center space-x-2"
            >
              <Heart size={16} className={songIsLiked ? 'fill-green-500 text-green-500' : ''} />
              <span>{songIsLiked ? 'Remove from Liked' : 'Add to Liked'}</span>
            </button>
          </div>
        )}
      </div>
      
      <h3 className="text-white font-semibold truncate mb-1">{song.title}</h3>
      <p className="text-gray-400 text-sm truncate">{song.artist}</p>
      
      {/* Like indicator */}
      {songIsLiked && (
        <Heart 
          size={16} 
          className="absolute top-2 left-2 fill-green-500 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
        />
      )}
    </div>
  )
}