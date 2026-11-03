import { useCallback, useEffect, useRef, useState } from 'react'
import { GarageDoorFallback } from '../three/GarageDoor.jsx'
import { StudioDoorFallback } from '../three/StudioDoor.jsx'
import { WorkshopDoorFallback } from '../three/WorkshopDoor.jsx'
import { RailwayDoorFallback } from '../three/RailwayDoor.jsx'
import DoorsScene, { createDoorRefs } from '../three/DoorsScene.jsx'
import DoorLink from './DoorLink.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { doors } from '../data/doors.js'

const fallbacks = {
  garage: GarageDoorFallback,
  studio: StudioDoorFallback,
  workshop: WorkshopDoorFallback,
  railway: RailwayDoorFallback,
}

export default function DoorsPlaceholder() {
  const [hoveredId, setHoveredId] = useState(null)
  const [openingId, setOpeningId] = useState(null)
  const [webgl, setWebgl] = useState(false)
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 680px)').matches)
  const [canvasNear, setCanvasNear] = useState(false)
  const [canvasVisible, setCanvasVisible] = useState(false)
  const sceneWrap = useRef(null)
  const openingLock = useRef(null)
  const reducedMotion = useReducedMotion()
  const refsById = useRef(null)
  if (!refsById.current) refsById.current = createDoorRefs()

  useEffect(() => {
    const probe = document.createElement('canvas')
    setWebgl(Boolean(probe.getContext('webgl2') || probe.getContext('webgl')))
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 680px)')
    const onChange = (event) => setCompact(event.matches)
    query.addEventListener?.('change', onChange)
    return () => query.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    const node = sceneWrap.current
    if (!node) return undefined
    if (!('IntersectionObserver' in window)) { setCanvasNear(true); setCanvasVisible(true); return undefined }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setCanvasNear(true)
      setCanvasVisible(entry.isIntersecting && entry.intersectionRatio > 0)
    }, { rootMargin: '320px 0px', threshold: [0, 0.05] })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const returnDoor = sessionStorage.getItem('doors-return-to')
    if (!returnDoor) return undefined
    const frame = requestAnimationFrame(() => {
      document.getElementById('doors')?.scrollIntoView({ behavior: 'auto', block: 'start' })
      document.getElementById(`door-link-${returnDoor}`)?.focus({ preventScroll: true })
      sessionStorage.removeItem('doors-return-to')
    })
    return () => cancelAnimationFrame(frame)
  }, [])

  const beginOpening = useCallback((id) => {
    if (openingLock.current) return false
    openingLock.current = id
    setOpeningId(id)
    try { sessionStorage.setItem('doors-return-to', id) } catch { /* Navigation still works without storage. */ }
    return true
  }, [])

  return <section className="doors-preview" id="doors" aria-labelledby="doors-title">
    <div className="doors-preview__heading">
      <p className="eyebrow">THE NEXT PART OF THE STORY</p>
      <h2 id="doors-title">Choose a door.</h2>
      <p>Each door opens a different room.</p>
    </div>
    <div className={`doors-grid${openingId ? ' has-opening-door' : ''}`}>
      <div className={`doors-artwork${webgl ? ' has-webgl' : ' no-webgl'}`} ref={sceneWrap}>
        {webgl && canvasNear
          ? <DoorsScene hoveredId={hoveredId} openingId={openingId} visible={canvasVisible} refsById={refsById.current} compact={compact} />
          : !webgl && <div className="doors-artwork__fallbacks" aria-hidden="true">
            {doors.map((door) => { const Fallback = fallbacks[door.id]; return <div className={`doors-artwork__fallback doors-artwork__fallback--${door.id}`} key={door.id}><Fallback opening={openingId === door.id} /></div> })}
          </div>}
        <div className="doors-hit-grid">
          {doors.map((door) => <DoorLink key={door.id} door={door} refs={refsById.current[door.id]} hoveredId={hoveredId} openingId={openingId} onHover={setHoveredId} onOpenStart={beginOpening} />)}
        </div>
      </div>
      <div className="doors-name-grid" aria-label="Choose a destination">
        {doors.map((door) => <div className={`doors-name${hoveredId === door.id ? ' is-highlighted' : ''}${openingId === door.id ? ' is-selected' : ''}`} key={door.id}>
          <span className="doors-name__number">0{door.order}</span>
          <h3>{door.label}</h3>
          <p id={`door-subtitle-${door.id}`}>{door.subtitle}</p>
          <span className="doors-name__hint">{openingId === door.id ? 'OPENING THE DOOR' : reducedMotion ? 'TAP OR PRESS ENTER' : 'HOVER, FOCUS OR SELECT'}</span>
        </div>)}
      </div>
    </div>
    <p className="doors-hint">The Post Office is just below if you’d like to get in touch.</p>
  </section>
}
