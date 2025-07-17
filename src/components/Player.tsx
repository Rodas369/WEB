import React, { useEffect, useRef, useState } from 'react'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat, 
  Shuffle,
  Heart,
  List,
  Maximize2
} from 'lucide-react'
import { usePlayerStore } from '../store/playerStore'
import { usePlaylistStore } from '../store/playlistStore'

export const Player = () => {
  const {
    currentSong,
    isPlaying,
    volume,
    currentTime,
    duration,
    isShuffled,
    isRepeating,
    setIsPlaying,
    setVolume,
    setCurrentTime,
    setDuration,
    playNext,
    playPrevious,
    togglePlay,
    toggleShuffle,
    toggleRepeat
  } = usePlayerStore()

  const { toggleLikedSong, isLiked } = usePlaylistStore()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [showQueue, setShowQueue] = useState(false)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (!audioRef.current || !currentSong) return

    const audio = audioRef.current
    
    if (isPlaying) {
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error('Error playing audio:', error)
          setIsPlaying(false)
        })
      }
    } else {
      audio.pause()
    }
  }, [isPlaying, currentSong, setIsPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const handleEnded = () => {
    playNext()
  }

  const handleError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    console.error('Audio error:', e)
    setTimeout(() => {
      playNext()
    }, 1000)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.7)
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (!currentSong) return null

  const songIsLiked = isLiked(currentSong.id)

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-40">
      <audio
        ref={audioRef}
        src={currentSong.audio_url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleError}
        crossOrigin="anonymous"
        preload="metadata"
      />
      
      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 min-w-0 w-1/4">
          <img
            src={currentSong.image_url}
            alt={currentSong.title}
            className="w-14 h-14 rounded-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300'
            }}
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-medium truncate">{currentSong.title}</h3>
            <p className="text-gray-400 text-sm truncate">{currentSong.artist}</p>
          </div>
          <button 
            onClick={() => toggleLikedSong(currentSong)}
            className={`transition-colors ${
              songIsLiked 
                ? 'text-green-500 hover:text-green-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart size={20} className={songIsLiked ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Player Controls */}
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <button 
              onClick={toggleShuffle}
              className={`transition-colors ${
                isShuffled 
                  ? 'text-green-500 hover:text-green-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Shuffle size={16} />
            </button>
            <button
              onClick={playPrevious}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipBack size={20} />
            </button>
            <button
              onClick={togglePlay}
              className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors hover:scale-105"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={playNext}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SkipForward size={20} />
            </button>
            <button 
              onClick={toggleRepeat}
              className={`transition-colors ${
                isRepeating 
                  ? 'text-green-500 hover:text-green-400' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Repeat size={16} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 bg-gray-600 rounded-full h-1 relative">
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div 
                className="bg-green-500 h-full rounded-full transition-all duration-100"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume and Additional Controls */}
        <div className="flex items-center space-x-4 w-1/4 justify-end">
          <button
            onClick={() => setShowQueue(!showQueue)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <List size={20} />
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMute}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
            />
          </div>
          
          <button className="text-gray-400 hover:text-white transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}