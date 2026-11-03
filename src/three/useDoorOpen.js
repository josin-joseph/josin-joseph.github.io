import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function useDoorOpen({ route, navigate, reducedMotion, refs, buildTimeline, onOpenStart }) {
  const locked = useRef(false)
  const timeline = useRef(null)
  const fallbackTimer = useRef(null)
  const [opening, setOpening] = useState(false)

  const open = useCallback(() => {
    if (locked.current || (onOpenStart && !onOpenStart())) return
    locked.current = true
    setOpening(true)

    if (reducedMotion) {
      navigate(route)
      return
    }

    const { camera, shutter, latch, interiorLight, lampLight } = refs
    if (!camera.current || !shutter.current || !latch.current) {
      // The CSS prototype is the no-WebGL version of the same door sequence.
      fallbackTimer.current = window.setTimeout(() => navigate(route), 1500)
      return
    }

    const tl = gsap.timeline({ onComplete: () => navigate(route) })
    timeline.current = tl
    if (buildTimeline) {
      buildTimeline(tl, refs)
      return
    }
    tl.to(latch.current.rotation, { z: -0.58, duration: 0.2, ease: 'power1.inOut' })
      .to(shutter.current.position, { y: 1.78, duration: 1.2, ease: 'power2.inOut' })
      .to(camera.current.position, { z: 6.0, duration: 1.35, ease: 'power2.inOut' }, '<')
      .to(interiorLight.current, { intensity: 2.4, duration: 1.08, ease: 'power1.out' }, '<0.12')
      .to(lampLight.current, { intensity: 1.8, duration: 0.5, ease: 'power1.out' }, '<')
      .to({}, { duration: 0.3 })
  }, [navigate, reducedMotion, refs, route, buildTimeline, onOpenStart])

  useEffect(() => () => {
    timeline.current?.kill()
    window.clearTimeout(fallbackTimer.current)
  }, [])

  return { open, opening }
}
