import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Home(){
  useScrollReveal()
  return (
    <div>
      <div className="animated-bg" />
      <section className="section hero reveal">
        <div className="hero-left">
          <motion.h1 className="h1" initial={{x:-20,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:0.1}}>مرحبا — أنا Your Name</motion.h1>
          <p className="lead">مطور واجهات، أعمل على إنشاء تجارب ويب سلسة وتفاعلية.</p>
          <Link to="/audio" className="cta">الذهاب لصوتياتي</Link>
        </div>
        <div style={{width:320}}>
          <motion.div className="card" initial={{scale:0.98}} whileHover={{scale:1.02}} transition={{type:'spring',stiffness:120}}>
            <img src="/src/assets/profile-placeholder.svg" alt="profile" style={{width:'100%',borderRadius:10}} />
            <div style={{paddingTop:10,color:'var(--muted)',fontSize:13}}>Full-stack & audio creator</div>
          </motion.div>
        </div>
      </section>

      <section className="section reveal">
        <h2>مميزات الموقع</h2>
        <div className="grid">
          <div className="card">
            <strong>تجربة استماع متقدمة</strong>
            <p className="project-desc">قوائم تشغيل، تشغيل متتابع، ودعم التضمين من أرشيف الإنترنت.</p>
          </div>
          <div className="card">
            <strong>لوحة تحكم متكاملة</strong>
            <p className="project-desc">إدارة التسجيلات، القوائم، والشعار بسهولة من صفحة الأدمن.</p>
          </div>
          <div className="card">
            <strong>حركات ورسوم متحركة</strong>
            <p className="project-desc">تأثيرات سلسة أثناء التمرير ونوافذ منبثقة أنيقة.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
