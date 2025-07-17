import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Player } from './components/Player'
import { AuthModal } from './components/AuthModal'
import { Home } from './pages/Home'
import { Search } from './pages/Search'
import { Library } from './pages/Library'
import { LikedSongs } from './pages/LikedSongs'
import { useAuthStore } from './store/authStore'

function App() {
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { initialize, loading } = useAuthStore()

  useEffect(() => {
    initialize()

    const handleOpenAuthModal = () => setShowAuthModal(true)
    window.addEventListener('openAuthModal', handleOpenAuthModal)

    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal)
    }
  }, [initialize])

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-green-500 text-4xl font-bold mb-4">TheFree</div>
          <div className="text-white text-xl">Loading your music experience...</div>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="h-screen bg-black flex flex-col">
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-black">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/library" element={<Library />} />
              <Route path="/liked" element={<LikedSongs />} />
            </Routes>
          </main>
        </div>
        <Player />
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </div>
    </Router>
  )
}

export default App