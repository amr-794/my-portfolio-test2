import React, { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa'

type Track = {
  id: string,
  title: string,
  src: string,
  meta?: string
}

function getState(){
  try{ const raw = localStorage.getItem('audioState'); return raw?JSON.parse(raw):{tracks:[],index:0} }catch{ return {tracks:[],index:0} }
}

export default function Player(){
  const [state,setState] = useState(getState())
  const [playing,setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement|null>(null)

  useEffect(()=>{
    const onStorage = ()=> setState(getState())
    window.addEventListener('storage',onStorage)
    return ()=> window.removeEventListener('storage',onStorage)
  },[])

  useEffect(()=>{
    if(!audioRef.current) audioRef.current = new Audio()
    const current = state.tracks[state.index]
    if(current){
      audioRef.current.src = current.src
      if(playing) audioRef.current.play().catch(()=>{})
    }
  },[state.index])

  useEffect(()=>{
    if(!audioRef.current) return
    if(playing) audioRef.current.play().catch(()=>setPlaying(false))
    else audioRef.current.pause()
  },[playing])

  useEffect(()=>{
    const a = audioRef.current
    if(!a) return
    const onEnd = ()=> {
      if(state.index < state.tracks.length -1){
        const ns = {...state, index: state.index +1}
        localStorage.setItem('audioState', JSON.stringify(ns))
        setState(ns)
      } else { setPlaying(false) }
    }
    a.addEventListener('ended', onEnd)
    return ()=> a.removeEventListener('ended', onEnd)
  },[state])

  const playPause = ()=> setPlaying(p=>!p)
  const next = ()=>{
    if(state.index < state.tracks.length-1){
      const ns = {...state, index: state.index+1}
      localStorage.setItem('audioState', JSON.stringify(ns))
      setState(ns)
      setPlaying(true)
    }
  }
  const prev = ()=>{
    if(state.index > 0){
      const ns = {...state, index: state.index-1}
      localStorage.setItem('audioState', JSON.stringify(ns))
      setState(ns)
      setPlaying(true)
    }
  }

  const current = state.tracks[state.index]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      <div style={{textAlign:'center',color:'var(--muted)',fontSize:13}}>{current ? `الآن تشغيل: ${current.title}` : 'لا يوجد تسجيل مشغل'}</div>
      <div className="player" role="region" aria-label="Audio player">
        <button onClick={prev} aria-label="previous"><FaStepBackward/></button>
        <button onClick={playPause} aria-label="play-pause">{playing ? <FaPause/> : <FaPlay/>}</button>
        <button onClick={next} aria-label="next"><FaStepForward/></button>
        <div style={{flex:1,textAlign:'center'}}>
          <div className="title">{current ? current.title : '—'}</div>
        </div>
      </div>
    </div>
  )
}
