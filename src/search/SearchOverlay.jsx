import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { searchIndex } from './buildIndex.js'
import { scoreRecords } from './scoreRecords.js'
import { setSearchOpen } from './searchStore.js'

const groups = ['Garage', 'Studio', 'Workshop', 'Railway', 'Post Office']

export default function SearchOverlay({ onClose }) {
  const inputRef = useRef(null)
  const panelRef = useRef(null)
  const opener = useRef(document.activeElement)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [prompt, setPrompt] = useState('')
  const navigate = useNavigate()
  const results = useMemo(() => scoreRecords(query, searchIndex), [query])
  const groupsInResults = groups.map((room) => [room, results.filter((result) => result.room === room)]).filter(([, items]) => items.length)

  useEffect(() => {
    inputRef.current?.focus()
    const full = 'Type to search…'
    let index = 0
    const timer = window.setInterval(() => {
      index += 1; setPrompt(full.slice(0, index))
      if (index >= full.length) window.clearInterval(timer)
    }, 38)
    return () => window.clearInterval(timer)
  }, [])
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); requestAnimationFrame(() => opener.current?.focus?.()) }
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = [...panelRef.current.querySelectorAll('button, input, [href]')].filter((item) => !item.disabled)
        if (!focusable.length) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKeyDown) }
  }, [onClose])
  useEffect(() => {
    setActive(0)
  }, [query])
  useEffect(() => {
    const result = results[active]
    if (!result) return
    document.getElementById(`search-result-${result.id.replace(/[^a-z0-9-]/gi, '-')}`)?.scrollIntoView({ block: 'nearest' })
  }, [active, results])

  const close = () => { setSearchOpen(false); onClose(); requestAnimationFrame(() => opener.current?.focus?.()) }
  const choose = (result) => { close(); navigate(result.route) }
  const onInputKeyDown = (event) => {
    if (event.key === 'ArrowDown' && results.length) { event.preventDefault(); setActive((value) => (value + 1) % results.length) }
    if (event.key === 'ArrowUp' && results.length) { event.preventDefault(); setActive((value) => (value - 1 + results.length) % results.length) }
    if (event.key === 'Enter' && results[active]) { event.preventDefault(); choose(results[active]) }
  }
  let flattened = 0
  return <div className="search-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}>
    <section className="search-paper" role="dialog" aria-modal="true" aria-labelledby="search-title" ref={panelRef}>
      <div className="search-paper__top"><span>THE INDEX · JOSIN JOSEPH</span><button type="button" className="search-close" onClick={close} aria-label="Close search"><X size={18} /></button></div>
      <h2 id="search-title">Find a page or idea.</h2>
      <label className="search-prompt" htmlFor="site-search"><span>{prompt || ' '}</span><i aria-hidden="true" /></label>
      <input ref={inputRef} id="site-search" className="search-input" role="combobox" aria-autocomplete="list" aria-expanded="true" aria-controls="search-results" aria-activedescendant={results[active] ? `search-result-${results[active].id.replace(/[^a-z0-9-]/gi, '-')}` : undefined} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={onInputKeyDown} placeholder="Try “XGBoost”, “intern” or “CITYMIND”…" />
      <p className="search-shortcuts">↑ ↓ MOVE <span>↵ OPEN</span> <span>ESC CLOSE</span></p>
      <div className="search-results" id="search-results" role="listbox" aria-label="Search results">
        {!query.trim() && <p className="search-empty">Search projects, skills, milestones, the Studio and contact details.</p>}
        {query.trim() && !results.length && <p className="search-empty">No matches in the files yet. Try another word.</p>}
        {groupsInResults.map(([room, items]) => <div className="search-group" key={room}>
          <h3>{room}</h3>
          {items.map((result) => {
            const index = flattened++
            const id = `search-result-${result.id.replace(/[^a-z0-9-]/gi, '-')}`
            return <button type="button" role="option" aria-selected={active === index} className={`search-result${active === index ? ' is-active' : ''}`} id={id} key={result.id} onMouseEnter={() => setActive(index)} onClick={() => choose(result)}>
              <span><strong>{result.title}</strong><small>{result.type} · {room}</small></span><span className="search-result__snippet">{result.text.slice(0, 105)}{result.text.length > 105 ? '…' : ''}</span>
            </button>
          })}
        </div>)}
      </div>
      <div className="search-paper__foot"><span>FIVE ROOMS · ONE INDEX</span><span aria-live="polite">{query.trim() ? `${results.length} result${results.length === 1 ? '' : 's'}` : 'READY WHEN YOU ARE'}</span></div>
    </section>
  </div>
}
