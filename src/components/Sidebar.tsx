import React, { useState } from 'react'
import { Home, Search, Library, Plus, Heart, LogIn, LogOut, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { usePlaylistStore } from '../store/playlistStore'
import { CreatePlaylistModal } from './CreatePlaylistModal'

export const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useAuthStore()
  const { playlists, likedSongs } = usePlaylistStore()
  const [showCreateModal, setShowCreateModal] = useState(false)

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <div className="w-64 bg-black p-6 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">TheFree</h1>
          <p className="text-xs text-gray-400">Free Music Streaming</p>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-2 mb-8">
          <button
            onClick={() => navigate('/')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/') 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </button>
          
          <button
            onClick={() => navigate('/search')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/search') 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Search size={20} />
            <span className="font-medium">Search</span>
          </button>
          
          <button
            onClick={() => navigate('/library')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/library') 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Library size={20} />
            <span className="font-medium">Your Library</span>
          </button>
        </nav>

        {/* Library Actions */}
        <div className="space-y-2 mb-8">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Plus size={20} />
            <span className="font-medium">Create Playlist</span>
          </button>
          
          <button 
            onClick={() => navigate('/liked')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/liked') 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Heart size={20} />
            <span className="font-medium">Liked Songs</span>
            {likedSongs.length > 0 && (
              <span className="bg-green-500 text-black text-xs px-2 py-1 rounded-full ml-auto">
                {likedSongs.length}
              </span>
            )}
          </button>
        </div>

        {/* Playlists */}
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-2 text-gray-400">
            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => navigate(`/playlist/${playlist.id}`)}
                className={`w-full text-left px-4 py-2 hover:text-white transition-colors rounded ${
                  location.pathname === `/playlist/${playlist.id}` ? 'text-white bg-gray-800' : ''
                }`}
              >
                <div className="truncate">{playlist.name}</div>
                <div className="text-xs text-gray-500 truncate">{playlist.songs.length} songs</div>
              </button>
            ))}
          </div>
        </div>

        {/* User Section */}
        <div className="border-t border-gray-800 pt-4">
          {user ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 px-4 py-2 text-white">
                <User size={20} />
                <span className="text-sm truncate">{user.email}</span>
              </div>
              <button
                onClick={signOut}
                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openAuthModal'))}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogIn size={20} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      <CreatePlaylistModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />
    </>
  )
}