import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { getSoundOn, setSoundOn as saveSoundOn, sounds, subscribeSound } from './sound.js'

const Stage = lazy(() => import('./Scene.jsx'))

const MIN_MS = 2800
const MAX_MS = 9000
const TASKS = ['fonts', 'scene', 'text', 'home']
const MESSAGES = ['Setting the type…', 'Preparing the paper…', 'Winding the watch…', 'Almost ready…']

export default function Intro({ onEnter }) {
  const [tasks, setTasks] = useState({ fonts: false, scene: false, text: false, home: false })
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [soundOn, setSoundOn] = useState(getSoundOn)
  const [watchOpen, setWatchOpen] = useState(false)
  const [turning, setTurning] = useState(false)
  const startedAt = useRef(performance.now())
  const tickAt = useRef(0)
  const done = useCallback((task) => setTasks((current) => current[task] ? current : { ...current, [task]: true }), [])
  const markText = useCallback(() => done('text'), [done])

  useEffect(() => subscribeSound(setSoundOn), [])

  useEffect(() => {
    const fonts = document.fonts
    Promise.all([
      fonts.load('600 24px "Playfair Display"'),
      fonts.load('400 16px "Special Elite"'),
      fonts.load('400 14px "DM Mono"'),
      fonts.ready,
    ]).then(() => done('fonts')).catch(() => done('fonts'))
    import('./routes.js').then(({ loadHome }) => loadHome()).then(() => done('home')).catch(() => done('home'))
    const safety = window.setTimeout(() => setTasks({ fonts: true, scene: true, text: true, home: true }), MAX_MS)
    return () => window.clearTimeout(safety)
  }, [done])

  useEffect(() => {
    const probe = document.createElement('canvas')
    const available = probe.getContext('webgl2') || probe.getContext('webgl')
    if (!available) {
      done('scene')
      done('text')
    }
  }, [done])

  useEffect(() => {
    let frame
    const animate = (now) => {
      if (now - tickAt.current > 42) {
        tickAt.current = now
        const real = TASKS.filter((task) => tasks[task]).length / TASKS.length * 100
        const elapsed = Math.min(100, ((now - startedAt.current) / MIN_MS) * 100)
        const goal = Math.min(real, elapsed)
        setProgress((current) => {
          const next = Math.min(goal, current + Math.max(0.45, (goal - current) * 0.09))
          return goal === 100 && next > 99.5 ? 100 : next
        })
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [tasks])

  useEffect(() => {
    if (progress < 100 || ready) return
    setReady(true)
    if (soundOn) sounds.stamp()
  }, [progress, ready, soundOn])

  useEffect(() => {
    if (!soundOn || ready) {
      sounds.stopRumble()
      return
    }
    sounds.startRumble()
    return () => {
      sounds.stopRumble()
    }
  }, [soundOn, ready])

  const skip = () => {
    sessionStorage.setItem('intro-seen', '1')
    if (soundOn) sounds.click()
    onEnter()
  }

  const enter = () => {
    if (!ready || turning) return
    sessionStorage.setItem('intro-seen', '1')
    if (soundOn) sounds.rustle()
    setTurning(true)
    onEnter()
  }

  return <main className={`intro ${turning ? 'is-turning' : ''}`}>
    <div className="paper-grain" aria-hidden="true" />
    <header className="masthead">
      <span>AN INDEPENDENT PORTFOLIO</span><span>VOL. 01 · 2026</span>
    </header>
    <section className="scene-wrap" aria-label="A vintage newspaper and pocket watch">
      <div className="scene-note scene-note--left"><span>✳</span><br />A SMALL<br />INTRODUCTION<br />TO MY WORLD</div>
      <Suspense fallback={<div className="scene-fallback" aria-hidden="true" />}><Stage onCreated={() => { done('scene'); setWatchOpen(true) }} onText={markText} opened={watchOpen} onToggle={() => { setWatchOpen((value) => !value); if (soundOn) sounds.click() }} soundOn={soundOn} go={tasks.scene} /></Suspense>
      <div className="scene-note scene-note--right">TIME TO MAKE<br />SOMETHING<br />MATTER <span>✳</span></div>
    </section>
    <section className="loader-panel" aria-live="polite">
      <div className="loader-topline"><span>{ready ? 'INTRODUCTION COMPLETE' : 'PREPARING YOUR VISIT'}</span><span>{Math.floor(progress).toString().padStart(2, '0')}%</span></div>
      <div className="progress-track" role="progressbar" aria-label="Portfolio loading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.floor(progress)}><span style={{ width: `${progress}%` }} /></div>
      <div className="loader-bottomline"><span>{ready ? 'Everything is in place.' : MESSAGES[Math.min(3, Math.floor(progress / 25))]}</span><div className="loader-actions">
        <button className="quiet-button" type="button" onClick={() => { if (soundOn) sounds.click(); saveSoundOn(!soundOn) }} aria-pressed={soundOn} aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}>{soundOn ? <Volume2 size={14} /> : <VolumeX size={14} />} SOUND {soundOn ? 'ON' : 'OFF'}</button>
        {!ready && <button className="quiet-button" type="button" onClick={skip}>SKIP INTRO ↗</button>}
      </div></div>
    </section>
    <div className={`approved-stamp ${ready ? 'approved-stamp--visible' : ''}`} aria-hidden="true"><span>APPROVED</span><small>FOR THE NEXT CHAPTER</small></div>
    <button type="button" className="enter-button" onClick={enter} disabled={!ready || turning}>{turning ? 'TURNING THE PAGE…' : 'ENTER THE PORTFOLIO'} <span>↗</span></button>
    <footer className="intro-footer"><span>DESIGNED WITH CURIOSITY</span><span>SCROLL LESS · EXPLORE MORE</span></footer>
  </main>
}
