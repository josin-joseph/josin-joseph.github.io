import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { portraits } from '../data/portraits.js'
import usePreloadImages from '../hooks/usePreloadImages.js'
import useReducedMotion from '../hooks/useReducedMotion.js'
import useShuffleBag from '../hooks/useShuffleBag.js'
import { Dust } from '../Scene.jsx'
import DitherVeil from './DitherVeil.jsx'

function supportsWebGL() {
  try {
    const probe = document.createElement('canvas')
    return Boolean(probe.getContext('webgl2') || probe.getContext('webgl'))
  } catch {
    return false
  }
}

export default function RandomPortrait() {
  const reducedMotion = useReducedMotion()
  const { images, ready } = usePreloadImages(portraits)
  const [webgl, setWebgl] = useState(false)
  const [current, setCurrent] = useState(portraits[0])
  const photoBox = useRef(null)
  const veil = useRef(null)
  const lastChange = useRef(0)
  const nextPhoto = useShuffleBag(portraits, portraits[0].id)
  const image = images[current.id]
  const index = portraits.findIndex((photo) => photo.id === current.id) + 1
  const effectEnabled = webgl && !reducedMotion

  useEffect(() => {
    setWebgl(supportsWebGL())
  }, [])

  const changePhoto = useCallback(() => {
    if (!ready) return false
    const now = performance.now()
    if (now - lastChange.current < 850) return false
    lastChange.current = now
    setCurrent(nextPhoto())
    return true
  }, [nextPhoto, ready])

  const coordinates = (event) => {
    const rect = photoBox.current?.getBoundingClientRect()
    if (!rect) return null
    return { x: event.clientX - rect.left, y: event.clientY - rect.top }
  }

  const handleEnter = (event) => {
    if (!effectEnabled) return
    changePhoto()
    const point = coordinates(event)
    if (point) veil.current?.revealAt(point.x, point.y)
  }

  const handleMove = (event) => {
    if (!effectEnabled) return
    const point = coordinates(event)
    if (point) veil.current?.revealAt(point.x, point.y)
  }

  const handleDown = (event) => {
    if (!effectEnabled) return
    changePhoto()
    const point = coordinates(event)
    if (point) veil.current?.burstAt(point.x, point.y)
  }

  const handleLeave = () => veil.current?.hide()

  return (
    <div className="hero-portrait">
      <div className="portrait-fallback" onPointerEnter={handleEnter} onPointerMove={handleMove} onPointerLeave={handleLeave} onPointerDown={handleDown}>
        <div ref={photoBox} className={`portrait-photo${image ? ' is-ready' : ''}`}>
          {image
            ? <img src={current.src} alt={current.alt} draggable="false" />
            : <div className="portrait-loading" aria-hidden="true">LOADING FRAME…</div>}
          {effectEnabled && image && <DitherVeil ref={veil} image={image} />}
        </div>
        <div className="portrait-fallback__rail portrait-fallback__rail--left">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
        <div className="portrait-fallback__rail portrait-fallback__rail--right">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
        <div className="portrait-fallback__caption">JOSIN JOSEPH · FRAME {String(index).padStart(2, '0')}</div>
      </div>
      {webgl && !reducedMotion && <Canvas className="hero-portrait__dust" frameloop="always" dpr={window.innerWidth < 700 ? [1, 1.15] : [1, 1.5]} camera={{ position: [0, 0, 6.1], fov: 35 }} gl={{ alpha: true, antialias: true }}>
        <Dust />
      </Canvas>}
      <div className="portrait-controls">
        <button type="button" onClick={changePhoto} disabled={!ready} aria-label="Change photo">CHANGE PHOTO <span aria-hidden="true">↻</span></button>
        <span className="sr-only" aria-live="polite" aria-atomic="true">{current.alt}</span>
      </div>
    </div>
  )
}
