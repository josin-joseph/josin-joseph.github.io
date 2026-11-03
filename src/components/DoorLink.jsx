import { useCallback, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useDoorOpen from '../three/useDoorOpen.js'
import useReducedMotion from '../hooks/useReducedMotion.js'

export default function DoorLink({ door, refs, hoveredId, openingId, onHover, onOpenStart }) {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotion()
  const preloaded = useRef(false)
  const opening = openingId === door.id
  const busy = Boolean(openingId && openingId !== door.id)
  const preload = useCallback(() => {
    if (preloaded.current) return
    preloaded.current = true
    door.preload?.().catch(() => { preloaded.current = false })
  }, [door])
  const play = useCallback((timeline, sceneRefs) => door.play(timeline, sceneRefs), [door])
  const begin = useCallback(() => onOpenStart(door.id), [door.id, onOpenStart])
  const { open } = useDoorOpen({ route: door.route, navigate, reducedMotion, refs, buildTimeline: play, onOpenStart: begin })

  return <div className={`door-link-cell${hoveredId === door.id ? ' is-hovered' : ''}${opening ? ' is-opening' : ''}${busy ? ' is-dimmed' : ''}`} onMouseEnter={() => { onHover(door.id); preload() }} onMouseLeave={() => onHover(null)} onFocusCapture={() => { onHover(door.id); preload() }} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) onHover(null) }}>
    <button id={`door-link-${door.id}`} className="door-link-button" type="button" onClick={open} disabled={busy} aria-label={`Open the ${door.label}: ${door.subtitle}`} aria-describedby={`door-subtitle-${door.id}`}>
      <span className="sr-only">Open the {door.label}: {door.subtitle}</span>
      <span className="door-link-callout" aria-hidden="true">{opening ? 'OPENING…' : `ENTER ${door.label.toUpperCase()}`} <ArrowUpRight size={13} /></span>
    </button>
  </div>
}
