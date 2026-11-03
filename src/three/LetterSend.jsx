import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function LetterSend({ active, reducedMotion, onComplete }) {
  const scene = useRef(null)
  useEffect(() => {
    if (!active || !scene.current) return undefined
    if (reducedMotion) { onComplete?.(); return undefined }
    const root = scene.current
    const timeline = gsap.timeline({ onComplete })
    timeline.fromTo(root.querySelector('.letter-send__fold'), { scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, duration: 0.28, ease: 'power2.inOut' })
      .fromTo(root.querySelector('.letter-send__stamp'), { y: -32, rotation: -18, scale: 1.2 }, { y: 0, rotation: 0, scale: 1, duration: 0.22, ease: 'power3.in' })
      .to(root.querySelector('.letter-send__stamp'), { y: -2, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.out' })
      .to(root.querySelector('.letter-send__envelope'), { x: 118, y: -8, rotation: 8, opacity: 0, duration: 0.42, ease: 'power2.in' }, '+=0.16')
    return () => timeline.kill()
  }, [active, reducedMotion, onComplete])

  return <div ref={scene} className={`letter-send${active ? ' is-active' : ''}`} aria-hidden="true">
    <div className="letter-send__envelope"><div className="letter-send__paper"><div className="letter-send__fold" /><i /><i /><i /></div><span className="letter-send__stamp">POSTED</span></div>
  </div>
}
