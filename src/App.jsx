import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import Intro from './Intro.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import NotFound from './pages/NotFound.jsx'

const Home = lazy(() => import('./Home.jsx'))
const Projects = lazy(() => import('./pages/Projects.jsx'))
const CaseStudy = lazy(() => import('./pages/CaseStudy.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Skills = lazy(() => import('./pages/Skills.jsx'))
const Journey = lazy(() => import('./pages/Journey.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))

function PageTurn() {
  const sheet = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const onMid = useRef(null)
  const previousPath = useRef(location.pathname)
  const loaderNavigation = useRef(false)
  const [turning, setTurning] = useState(false)
  const [heroReady, setHeroReady] = useState(() => window.location.pathname === '/home')

  useEffect(() => {
    if (!location.hash) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const frame = requestAnimationFrame(() => {
      const target = document.querySelector(decodeURIComponent(location.hash))
      target?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
      if (target && !target.matches('a, button, input, select, textarea, [tabindex]')) {
        target.setAttribute('tabindex', '-1')
        target.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [location.hash, location.pathname])

  useEffect(() => {
    if (!turning) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sheetEl = sheet.current
    const tl = gsap.timeline({ onComplete: () => { setTurning(false); setHeroReady(true) } })
    tl.set(sheetEl, { display: 'block', opacity: 1, scaleX: 0, transformOrigin: 'left center' })
      .to(sheetEl, { scaleX: 1, duration: reduced ? 0.16 : 0.62, ease: reduced ? 'none' : 'power3.inOut' })
      .call(() => onMid.current?.())
      .set(sheetEl, { transformOrigin: 'right center' })
      .to(sheetEl, { scaleX: 0, duration: reduced ? 0.16 : 0.62, ease: reduced ? 'none' : 'power3.inOut' })
      .set(sheetEl, { display: 'none' })
    return () => tl.kill()
  }, [turning])

  useEffect(() => {
    if (previousPath.current === location.pathname) return undefined
    previousPath.current = location.pathname
    if (loaderNavigation.current) { loaderNavigation.current = false; return undefined }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sheetEl = sheet.current
    const tl = gsap.timeline()
    tl.set(sheetEl, { display: 'block', opacity: 1, scaleX: 0, transformOrigin: 'left center' })
      .to(sheetEl, { scaleX: 1, duration: reduced ? 0.08 : 0.18, ease: reduced ? 'none' : 'power2.inOut' })
      .set(sheetEl, { transformOrigin: 'right center' })
      .to(sheetEl, { scaleX: 0, duration: reduced ? 0.08 : 0.18, ease: reduced ? 'none' : 'power2.inOut' })
      .set(sheetEl, { display: 'none' })
    return () => tl.kill()
  }, [location.pathname])

  const enter = (to = '/home') => {
    if (turning || location.pathname === to) return
    sessionStorage.setItem('intro-seen', '1')
    setHeroReady(false)
    onMid.current = () => { loaderNavigation.current = true; navigate(to) }
    setTurning(true)
  }

  useEffect(() => {
    if (location.pathname === '/home' && !turning) setHeroReady(true)
  }, [location.pathname, turning])

  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Intro onEnter={() => enter('/home')} />} />
        <Route path="/home" element={<Suspense fallback={<div className="route-loading">Opening the next page…</div>}><Home animate={heroReady} /></Suspense>} />
        <Route path="/projects" element={<Suspense fallback={<div className="route-loading">Opening the work orders…</div>}><Projects /></Suspense>} />
        <Route path="/projects/:slug" element={<Suspense fallback={<div className="route-loading">Opening the report…</div>}><CaseStudy /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={<div className="route-loading">Opening the Studio…</div>}><About /></Suspense>} />
        <Route path="/skills" element={<Suspense fallback={<div className="route-loading">Opening the Workshop…</div>}><Skills /></Suspense>} />
        <Route path="/journey" element={<Suspense fallback={<div className="route-loading">The train is arriving…</div>}><Journey /></Suspense>} />
        <Route path="/contact" element={<Suspense fallback={<div className="route-loading">Delivering your mail…</div>}><Contact /></Suspense>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div ref={sheet} className="page-turn" aria-hidden="true" />
    </>
  )
}

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    const navigationType = performance.getEntriesByType('navigation')[0]?.type
    const replay = new URLSearchParams(location.search).has('replay')
    if (location.pathname === '/' && !replay && navigationType !== 'back_forward' && sessionStorage.getItem('intro-seen')) {
      navigate('/home', { replace: true })
    }
  // This is intentionally a one-time check for a new page visit. Back navigation stays at the loader.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const path = location.pathname
    const details = path === '/home' ? ['Josin Joseph — Portfolio', 'Projects, story, skills and experience of Josin Joseph.']
      : path.startsWith('/projects/') ? ['Project Case Study — Josin Joseph', 'Project notes, approach and outcomes from Josin Joseph.']
        : path === '/projects' ? ['The Garage — Projects by Josin Joseph', 'Selected machine learning, AI and software projects.']
          : path === '/about' ? ['The Studio — About Josin Joseph', 'The story, values and interests behind the work.']
            : path === '/skills' ? ['The Workshop — Skills and Tools', 'Skills, tools and areas of contribution.']
              : path === '/journey' ? ['The Railway — Experience and Education', 'Education, experience, leadership and milestones.']
                : path === '/contact' ? ['The Post Office — Contact Josin Joseph', 'Get in touch with Josin Joseph.']
                  : path === '/' ? ['Josin Joseph — A Portfolio in Progress', 'A portfolio of projects, learning and ideas.']
                    : ['Page Not Found — Josin Joseph', 'This page missed its stop. Return to the portfolio doors.']
    document.title = details[0]
    document.querySelector('meta[name="description"]')?.setAttribute('content', details[1])
    if (path.startsWith('/projects/')) {
      let current = true
      import('./data/projects.js').then(({ projects }) => {
        const project = projects.find((item) => `/projects/${item.slug}` === path)
        if (current && project) {
          document.title = `${project.title} — Josin Joseph`
          document.querySelector('meta[name="description"]')?.setAttribute('content', project.summary)
        }
      })
      return () => { current = false }
    }
  }, [location.pathname])
  return <PageTurn />
}
