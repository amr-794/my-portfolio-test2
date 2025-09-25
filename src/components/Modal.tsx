import React from 'react'
import { motion } from 'framer-motion'

type Props = {open:boolean,onClose:()=>void,title?:string,children?:React.ReactNode}
export default function Modal({open,onClose,title,children}:Props){
  if(!open) return null
  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <motion.div className="modal" onMouseDown={e=>e.stopPropagation()} initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
          <h3>{title}</h3>
          <button aria-label="close" className="close-btn" onClick={onClose}>×</button>
        </div>
        <div>{children}</div>
      </motion.div>
    </div>
  )
}
