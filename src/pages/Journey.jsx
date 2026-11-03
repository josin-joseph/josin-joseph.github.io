import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, ArrowUpRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StationCard from '../components/StationCard.jsx'
import TypeFilter from '../components/TypeFilter.jsx'
import TrainTrack from '../three/TrainTrack.jsx'
import useReducedMotion from '../hooks/useReducedMotion.js'
import { journey, journeyTypes } from '../data/journey.js'

gsap.registerPlugin(ScrollTrigger)

export default function Journey() {
  const [type, setType] = useState('all')
  const [currentId, setCurrentId] = useState('')
  const timelineRef = useRef(null)
  const progressRef = useRef(0)
  const reducedMotion = useReducedMotion()
  const entries = useMemo(() => type === 'all' ? journey : journey.filter((item) => item.type === type), [type])
  const currentIndex = entries.findIndex((entry) => entry.id === currentId)

  useEffect(() => {
    progressRef.current = 0
    setCurrentId(entries[0]?.id ?? '')
    if (reducedMotion || !timelineRef.current || entries.length < 2) return undefined
    const trigger = ScrollTrigger.create({
      trigger: timelineRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.25,
      onUpdate: (self) => {
        progressRef.current = self.progress
        const trainElement = document.querySelector('.journey-train')
        if (trainElement) {
          trainElement.style.setProperty('--train-x', `${12 + Math.max(0, trainElement.clientWidth - 36) * self.progress}px`)
          trainElement.style.setProperty('--train-y', `${12 + Math.max(0, trainElement.clientHeight - 36) * self.progress}px`)
        }
        const index = Math.min(entries.length - 1, Math.floor(self.progress * entries.length))
        setCurrentId((current) => current === entries[index].id ? current : entries[index].id)
      },
    })
    ScrollTrigger.refresh()
    return () => { trigger.kill(); ScrollTrigger.refresh() }
  }, [entries, reducedMotion])

  return <main className="journey-page">
    <header className="journey-topline"><Link className="back-to-doors" to="/home#doors"><ArrowLeft size={15} aria-hidden="true" /> BACK TO THE DOORS</Link><span>THE RAILWAY · A JOURNEY SO FAR</span></header>
    <section className="journey-intro">
      <p className="eyebrow">STATIONS ALONG THE WAY</p>
      <h1>Every stop adds a little perspective.</h1>
      <p>Education, experience, community and recognitions in one place. Where dates or details weren’t in the source notes, they’re left visible for an update instead of guessed.</p>
    </section>
    <TypeFilter types={journeyTypes} selected={type} onSelect={setType} />
    <section className="journey-layout" aria-label="Journey timeline">
      <TrainTrack progressRef={progressRef} />
      <div className="journey-timeline" ref={timelineRef}>
        <div className="journey-timeline__rail" aria-hidden="true" />
        {entries.map((station, index) => <StationCard key={station.id} station={station} index={index} active={currentId === station.id} />)}
      </div>
    </section>
    <section className="journey-endnote">
      <span>{currentIndex >= 0 ? `CURRENT STOP · ${String(currentIndex + 1).padStart(2, '0')} / ${String(entries.length).padStart(2, '0')}` : 'JOURNEY IN PROGRESS'}</span>
      <p>Some station dates, places and specific outcomes still need to be added from your records.</p>
      <div className="journey-endnote__links"><Link to="/contact">POST OFFICE <Mail size={14} aria-hidden="true" /></Link><Link to="/home#doors">RETURN TO THE DOORS <ArrowUpRight size={14} aria-hidden="true" /></Link></div>
    </section>
    <footer className="journey-footer"><span>JOSIN JOSEPH · THE RAILWAY</span><span>{entries.length} STATION{entries.length === 1 ? '' : 'S'}</span></footer>
  </main>
}
