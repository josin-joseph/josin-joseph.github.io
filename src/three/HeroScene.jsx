import { useEffect, useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Dust } from '../Scene.jsx'
import PortraitFrame from './PortraitFrame.jsx'

export default function HeroScene({ reducedMotion, onReady }) {
  const [webgl, setWebgl] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [portrait, setPortrait] = useState(null)

  useEffect(() => {
    const image = new Image()
    image.onload = () => setPortrait('/portrait.jpg')
    image.onerror = () => setPortrait(null)
    image.src = '/portrait.jpg'
    const probe = document.createElement('canvas')
    setWebgl(Boolean(probe.getContext('webgl2') || probe.getContext('webgl')))
  }, [])
  const markReady = () => {
    setRendered(true)
    onReady?.()
  }

  return (
    <div className={`hero-portrait${portrait ? ' hero-portrait--has-photo' : ' hero-portrait--placeholder'}${rendered ? ' hero-portrait--rendered' : ''}`} role="img" aria-label={portrait ? 'Portrait of Josin Joseph in a vintage film frame' : 'Vintage film frame with a portrait placeholder'}>
      <div className="portrait-fallback" aria-hidden="true">
        {portrait ? <img src={portrait} alt="" /> : <div className="portrait-silhouette"><span>JJ</span><small>PORTRAIT TO BE ADDED</small></div>}
        <div className="portrait-fallback__rail portrait-fallback__rail--left">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
        <div className="portrait-fallback__rail portrait-fallback__rail--right">{Array.from({ length: 9 }, (_, i) => <i key={i} />)}</div>
        <div className="portrait-fallback__caption">JOSIN JOSEPH · FRAME 01</div>
      </div>
      {webgl && <Canvas className="hero-portrait__canvas" shadows dpr={window.innerWidth < 700 ? [1, 1.15] : [1, 1.5]} camera={{ position: [0, 0, 6.1], fov: 35 }} gl={{ alpha: true, antialias: true }} onCreated={markReady}>
        <Suspense fallback={null}>
          <PortraitFrame src={portrait} reducedMotion={reducedMotion} hasPortrait={Boolean(portrait)} />
          <Dust />
        </Suspense>
      </Canvas>}
    </div>
  )
}
