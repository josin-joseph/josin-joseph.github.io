import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import ContactForm from '../components/ContactForm.jsx'
import PostalSlip from '../components/PostalSlip.jsx'
import { contact } from '../data/contact.js'

const PostOfficeScene = lazy(() => import('../three/PostOfficeScene.jsx'))

function ScenePlaceholder() {
  return <div className="post-office-illustration" aria-hidden="true"><div className="post-office-illustration__slots"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="post-office-illustration__desk"><span>MAIL SLOT</span><b>POSTED</b></div></div>
}

export default function Contact() {
  const sceneGate = useRef(null)
  const [loadScene, setLoadScene] = useState(false)
  useEffect(() => {
    const node = sceneGate.current
    if (!node) return undefined
    if (!('IntersectionObserver' in window)) { setLoadScene(true); return undefined }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setLoadScene(true)
        observer.disconnect()
      }
    }, { rootMargin: '180px' })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return <main className="contact-page">
    <header className="contact-topline"><Link className="back-to-doors" to="/home#post-office"><ArrowLeft size={15} aria-hidden="true" /> BACK TO THE POST OFFICE</Link><span>THE LAST STOP · CONTACT</span></header>
    <section className="contact-intro" id="contact-intro">
      <p className="eyebrow">DELIVERED WITH CARE</p>
      <h1>Leave a note at the counter.</h1>
      <p>{contact.intro}</p>
    </section>
    <div className="contact-layout">
      <PostalSlip />
      <ContactForm />
    </div>
    <section className="contact-scene-section" ref={sceneGate} aria-label="Post office counter illustration">
      <div><p className="eyebrow">THE POST OFFICE</p><h2>A letter finds its way.</h2><p>Every note is welcome. The form above stays usable whether or not this little counter is rendered.</p></div>
      {loadScene
        ? <Suspense fallback={<ScenePlaceholder />}><PostOfficeScene /></Suspense>
        : <ScenePlaceholder />}
    </section>
    <footer className="contact-footer"><span>JOSIN JOSEPH · POST OFFICE</span><Link to="/home#doors">RETURN TO THE DOORS <ArrowUpRight size={14} aria-hidden="true" /></Link></footer>
    <a className="contact-email-float" href={`mailto:${contact.email}`}><Mail size={15} aria-hidden="true" /> EMAIL DIRECTLY</a>
  </main>
}
