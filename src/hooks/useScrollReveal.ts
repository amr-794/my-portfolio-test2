import { useEffect } from 'react'
export default function useScrollReveal(){
  useEffect(()=>{
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting) e.target.classList.add('visible')
      })
    },{threshold:0.15})
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el))
    return ()=> obs.disconnect()
  },[])
}
