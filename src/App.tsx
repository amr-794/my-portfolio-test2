import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Audio from './pages/Audio'
import Admin from './pages/Admin'
import Header from './components/Header'
import Footer from './components/Footer'
import Player from './components/Player'
export default function App(){
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/audio" element={<Audio />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
      <Player />
    </div>
  )
}
