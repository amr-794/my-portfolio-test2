import React, { useEffect, useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import Modal from '../components/Modal'
import { FaInfoCircle, FaPlay } from 'react-icons/fa'

export default function Audio(){
  useScrollReveal()
  const [data,setData] = useState<{lists:any[], embeds:any[]}>({lists:[],embeds:[]})
  const [infoOpen,setInfoOpen] = useState(false)
  const [selected,setSelected] = useState<any|null>(null)

  useEffect(()=>{
    try{
      const raw = localStorage.getItem('siteData')
      if(raw) setData(JSON.parse(raw))
    }catch{}
  },[])

  const playTrack = (t:any)=>{
    const state = {tracks:[t], index:0}
    localStorage.setItem('audioState', JSON.stringify(state))
    window.dispatchEvent(new Event('storage'))
  }

  const openInfo = (t:any)=> { setSelected(t); setInfoOpen(true) }

  return (
    <div>
      <section className="section reveal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>صفحة الصوتيات</h2>
          <div>
            <img src="/src/assets/logo-audio.svg" alt="logo" style={{height:48}}/>
          </div>
        </div>
        <p className="lead">قوائمك والتسجيلات هنا. اضغط تشغيل أو معلومات.</p>
      </section>

      <section className="section reveal">
        <h3>قوائم التشغيل</h3>
        {data.lists && data.lists.length ? data.lists.map((lst:any)=>(
          <div key={lst.id} className="card" style={{marginTop:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <strong>{lst.title}</strong>
                <div style={{color:'var(--muted)',fontSize:13}}>{lst.description}</div>
              </div>
            </div>
            <div style={{marginTop:10}}>
              {lst.tracks && lst.tracks.length ? lst.tracks.map((t:any)=>(
                <div key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0'}}>
                  <div>
                    <div style={{fontWeight:700}}>{t.title}</div>
                    <div style={{color:'var(--muted)',fontSize:13}}>{t.meta}</div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="cta" onClick={()=>playTrack(t)} title="Play"><FaPlay/></button>
                    <button className="cta" onClick={()=>openInfo(t)} title="Info"><FaInfoCircle/></button>
                  </div>
                </div>
              )) : <div style={{color:'var(--muted)'}}>لا توجد تسجيلات في هذه القائمة</div>}
            </div>
          </div>
        )) : <div className="card" style={{marginTop:12,color:'var(--muted)'}}>لا توجد قوائم مضافة بعد — استخدم صفحة الأدمن لإضافة قوائم وتسجيلات.</div>}
      </section>

      <Modal open={infoOpen} onClose={()=>setInfoOpen(false)} title={selected?.title}>
        <div>
          <p style={{color:'var(--muted)'}}>التفاصيل: {selected?.meta}</p>
          <p style={{color:'var(--muted)'}}>مصدر: {selected?.src?.startsWith('data:') ? 'تمّ رفعه محلياً' : selected?.src}</p>
        </div>
      </Modal>
    </div>
  )
}
