import { useEffect, useRef } from 'react'
import { Github, Linkedin, MoveDown, ArrowDownRight, Download } from 'lucide-react'
import { gsap } from 'gsap'
import HeroScene from '../three/HeroScene.jsx'
import FilmOverlay from '../components/FilmOverlay.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import useTyped from '../hooks/useTyped.js'

const TAGLINE = 'Curious by nature. Building with purpose.'
const RESUME_PATH = '/Josin-Joseph-Resume.pdf'
const SOCIAL_LINKS = {
  github: 'https://github.com/josin-joseph',
  linkedin: 'https://www.linkedin.com/in/josinjoseph01',
}

export default function Hero({ animate }) {
  const section = useRef(null)
  const reducedMotion = useReducedMotion()
  const typed = useTyped(TAGLINE, animate, reducedMotion)

  useEffect(() => {
    if (!animate || reducedMotion || !section.current) return undefined
    const context = gsap.context(() => {
      gsap.fromTo('[data-reveal]',
        { autoAlpha: 0, y: 18 },
        { autoAlpha: 1, y: 0, duration: 0.68, stagger: 0.1, ease: 'power2.out', delay: 0.08 },
      )
      gsap.fromTo('.hero-portrait',
        { autoAlpha: 0, y: 22, rotateY: 7, scale: 0.96 },
        { autoAlpha: 1, y: 0, rotateY: 0, scale: 1, duration: 1.05, ease: 'power3.out', delay: 0.16 },
      )
    }, section)
    return () => context.revert()
  }, [animate, reducedMotion])

  const scrollToDoors = () => {
    document.getElementById('doors')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section ref={section} className={`hero${animate ? ' is-entering' : ''}${reducedMotion ? ' is-reduced' : ''}`} aria-labelledby="hero-title">
      <div className="hero-backdrop" aria-hidden="true" />
      <div className="hero-copy">
        <p className="hero-kicker" data-reveal><span className="hero-kicker__rule" />A DEVELOPER’S JOURNEY</p>
        <h1 id="hero-title" data-reveal><span>Josin</span><span>Joseph<span className="hero-period">.</span></span></h1>
        <p className="hero-role" data-reveal>AI &amp; Data Science Engineer</p>
        <p className="hero-supporting" data-reveal>Building intelligent tools from data, models, and real-world problems.</p>
        <p className="hero-location" data-reveal><span aria-hidden="true">✳</span> Kasaragod, Kerala, India</p>
        <p className="hero-tagline" data-reveal aria-label={TAGLINE}><span>{typed}</span><span className="typing-caret" aria-hidden="true">▌</span></p>
        <div className="hero-actions" data-reveal>
          <button type="button" className="hero-button hero-button--primary" onClick={scrollToDoors}>ENTER THE DOORS <ArrowDownRight size={16} aria-hidden="true" /></button>
          <a className="hero-button hero-button--secondary" href={RESUME_PATH} download><Download size={15} aria-hidden="true" /> DOWNLOAD RESUME</a>
        </div>
        <div className="hero-socials" data-reveal aria-label="Social profiles">
          {SOCIAL_LINKS.github
            ? <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={17} /></a>
            : <span aria-disabled="true" title="GitHub profile link will be added"><Github size={17} /><span className="sr-only">GitHub profile link not added yet</span></span>}
          {SOCIAL_LINKS.linkedin
            ? <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={17} /></a>
            : <span aria-disabled="true" title="LinkedIn profile link will be added"><Linkedin size={17} /><span className="sr-only">LinkedIn profile link not added yet</span></span>}
        </div>
      </div>
      <div className="hero-visual" data-reveal>
        <div className="hero-visual__index"><span>PERSONAL ARCHIVE</span><span>NO. 01 / 04</span></div>
        <HeroScene reducedMotion={reducedMotion} />
        <p className="hero-visual__caption"><span>FIG. 01</span> THE MAKER, IN MOTION</p>
      </div>
      <button type="button" className="scroll-cue" onClick={scrollToDoors} aria-label="Scroll to the four doors">
        <span>SCROLL TO ENTER</span><MoveDown size={15} aria-hidden="true" />
      </button>
      <FilmOverlay />
    </section>
  )
}
