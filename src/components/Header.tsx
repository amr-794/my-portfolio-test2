import React from 'react'
import { Link } from 'react-router-dom'
export default function Header(){
  return (
    <header className="header">
      <div className="brand">
        <div className="logo">MY</div>
        <div>
          <div style={{fontWeight:800}}>Your Name</div>
          <div style={{fontSize:12,color:'var(--muted)'}}>Developer • Creator</div>
        </div>
      </div>
      <nav className="nav" aria-label="Main navigation">
        <Link to="/">Home</Link>
        <Link to="/audio" style={{marginLeft:12}}>Audio</Link>
        <Link to="/admin" style={{marginLeft:12}}>Admin</Link>
      </nav>
    </header>
  )
}
