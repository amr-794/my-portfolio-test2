import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import useScrollReveal from '../hooks/useScrollReveal'

type Track = { id:string,title:string,src:string,meta?:string }
type List = { id:string,title:string,description?:string,tracks:Track[] }
type Embed = { id:string,title:string,src:string }

const initialData = { lists: [] as List[], embeds: [] as Embed[], logos: {main:'',audio:''} }

export default function Admin(){
  useScrollReveal()
  const [data,setData] = useState(initialData)
  const [message,setMessage] = useState('')
  useEffect(()=> {
    const raw = localStorage.getItem('siteData')
    if(raw) setData(JSON.parse(raw))
  },[])

  useEffect(()=> {
    localStorage.setItem('siteData', JSON.stringify(data))
  },[data])

  const addList = ()=>{
    const title = prompt('اسم القائمة:')
    if(!title) return
    const lst = { id: uuidv4(), title, description:'', tracks: [] }
    setData(s=> ({...s, lists: [...s.lists, lst]}))
    setMessage('تم إضافة قائمة')
  }

  const addTrackToList = async (listId:string)=>{
    const title = prompt('عنوان التسجيل:')
    if(!title) return
    const sourceType = prompt('نوع الرفع: اكتب "local" للرفع من جهازك أو "embed" للتضمين')
    if(!sourceType) return
    let src = ''
    if(sourceType === 'local'){
      const fileInput = document.createElement('input')
      fileInput.type='file'
      fileInput.accept='audio/*'
      fileInput.onchange = async ()=>{
        const f = fileInput.files && fileInput.files[0]
        if(!f) return
        const reader = new FileReader()
        reader.onload = (e)=>{
          src = e.target?.result as string
          const tr = { id: uuidv4(), title, src, meta: new Date().toLocaleString() }
          setData(s=> ({...s, lists: s.lists.map(L=> L.id===listId ? {...L, tracks:[...L.tracks, tr]} : L)}))
          setMessage('تم رفع التسجيل محلياً')
        }
        reader.readAsDataURL(f)
      }
      fileInput.click()
      return
    } else {
      if(data.embeds.length === 0){
        const add = confirm('لا توجد تضمينات. هل تريد إضافة تضمين جديد الآن؟')
        if(add){
          const titleE = prompt('عنوان التضمين:')
          const srcE = prompt('رابط التضمين (مثال https://archive.org/download/.../file.mp3):')
          if(titleE && srcE){
            const emb = { id: uuidv4(), title: titleE, src: srcE }
            setData(s=> ({...s, embeds: [...s.embeds, emb]}))
            setMessage('تم إضافة تضمين')
            const tr = { id: uuidv4(), title, src: srcE, meta: 'تضمين' }
            setData(s=> ({...s, lists: s.lists.map(L=> L.id===listId ? {...L, tracks:[...L.tracks, tr]} : L)}))
            setMessage('تم إضافة التسجيل بالتضمين')
            return
          } else return
        } else return
      } else {
        const pick = prompt('اختر رقم التضمين: ' + data.embeds.map((e,i)=>`${i+1}) ${e.title}`).join('\n'))
        const idx = Number(pick)-1
        if(isNaN(idx) || !data.embeds[idx]) return
        const emb = data.embeds[idx]
        const tr = { id: uuidv4(), title, src: emb.src, meta: emb.title }
        setData(s=> ({...s, lists: s.lists.map(L=> L.id===listId ? {...L, tracks:[...L.tracks, tr]} : L)}))
        setMessage('تم إضافة التسجيل بالتضمين المحدد')
        return
      }
    }
  }

  const addEmbed = ()=>{
    const title = prompt('عنوان التضمين:')
    const src = prompt('رابط الملف الصوتي (رابط مباشر mp3/ogg...)')
    if(!title || !src) return
    const emb = { id: uuidv4(), title, src }
    setData(s=> ({...s, embeds: [...s.embeds, emb]}))
    setMessage('تم إضافة التضمين')
  }

  const removeTrack = (listId:string, trackId:string)=>{
    setData(s=> ({...s, lists: s.lists.map(L=> L.id===listId ? {...L, tracks: L.tracks.filter(t=> t.id!==trackId)} : L)}))
  }
  const removeList = (id:string)=> setData(s=> ({...s, lists: s.lists.filter(l=> l.id!==id)}))
  const removeEmbed = (id:string)=> setData(s=> ({...s, embeds: s.embeds.filter(e=> e.id!==id)}))

  const setLogo = (which:'main'|'audio')=>{
    const input = document.createElement('input'); input.type='file'; input.accept='image/*'
    input.onchange = ()=>{
      const f = input.files && input.files[0]; if(!f) return
      const reader = new FileReader()
      reader.onload = (e)=>{
        const src = e.target?.result as string
        setData(s=> ({...s, logos: {...s.logos, [which]: src}}))
        setMessage('تم تحديث الشعار')
      }
      reader.readAsDataURL(f)
    }
    input.click()
  }

  const publishToPlayer = (listId:string)=>{
    const L = data.lists.find(l=> l.id===listId)
    if(!L) return
    const tracks = L.tracks.map(t=> ({id:t.id,title:t.title,src:t.src,meta:t.meta}))
    const state = {tracks, index:0}
    localStorage.setItem('audioState', JSON.stringify(state))
    window.dispatchEvent(new Event('storage'))
    setMessage('تم نشر القائمة إلى المشغل')
  }

  return (
    <div>
      <section className="section reveal">
        <h2>لوحة الإدارة</h2>
        <p className="lead">يمكنك إدارة القوائم، التضمينات، والشعارات هنا. البيانات محفوظة في LocalStorage (ستعمل على Netlify بدون خادم).</p>
        <div style={{display:'flex',gap:8,marginTop:10}}>
          <button className="btn" onClick={addList}>+ أضف قائمة</button>
          <button className="btn" onClick={addEmbed}>+ أضف تضمين (رابط خارجي)</button>
        </div>
        <div style={{marginTop:12,color:'var(--muted)'}}>{message}</div>
      </section>

      <section className="section reveal">
        <h3>القوائم الحالية</h3>
        {data.lists.length===0 && <div className="card" style={{color:'var(--muted)'}}>لا توجد قوائم بعد</div>}
        {data.lists.map(lst=>(
          <div key={lst.id} className="card" style={{marginTop:10}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <strong>{lst.title}</strong>
                <div style={{color:'var(--muted)'}}>{lst.description}</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button className="btn" onClick={()=>addTrackToList(lst.id)}>أضف تسجيل</button>
                <button className="btn" onClick={()=>publishToPlayer(lst.id)}>نشر للمشغل</button>
                <button className="btn" onClick={()=>removeList(lst.id)}>حذف القائمة</button>
              </div>
            </div>
            <div style={{marginTop:10}}>
              {lst.tracks.map(t=>(
                <div key={t.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'8px 0'}}>
                  <div>
                    <div style={{fontWeight:700}}>{t.title}</div>
                    <div style={{color:'var(--muted)',fontSize:13}}>{t.meta}</div>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn" onClick={()=>removeTrack(lst.id,t.id)}>حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section className="section reveal">
        <h3>التضمينات</h3>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          {data.embeds.map(e=>(
            <div key={e.id} className="card" style={{minWidth:220}}>
              <div style={{fontWeight:700}}>{e.title}</div>
              <div style={{color:'var(--muted)',fontSize:13,wordBreak:'break-all'}}>{e.src}</div>
              <div style={{marginTop:8,display:'flex',gap:8}}>
                <button className="btn" onClick={()=>removeEmbed(e.id)}>حذف</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal">
        <h3>الشعارات</h3>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <div>
            <img src={data.logos.audio || '/src/assets/logo-audio.svg'} alt="audio logo" style={{height:64}}/>
            <div style={{color:'var(--muted)'}}>شعار صفحة الصوتيات</div>
            <button className="btn" onClick={()=>setLogo('audio')} style={{marginTop:8}}>تغيير الشعار</button>
          </div>
          <div>
            <img src={data.logos.main || '/src/assets/profile-placeholder.svg'} alt="main logo" style={{height:64}}/>
            <div style={{color:'var(--muted)'}}>شعار الصفحة الرئيسية</div>
            <button className="btn" onClick={()=>setLogo('main')} style={{marginTop:8}}>تغيير الشعار</button>
          </div>
        </div>
      </section>
    </div>
  )
}
