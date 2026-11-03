import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Search, Volume2, VolumeX, X } from 'lucide-react'
import { getSoundOn, setSoundOn, sounds, subscribeSound } from '../sound.js'
import useSearchHotkeys from '../search/useSearchHotkeys.js'
import { setSearchOpen, useSearchOpen } from '../search/searchStore.js'

const SearchOverlay = lazy(() => import('../search/SearchOverlay.jsx'))
const links = [
  { label: 'Garage', to: '/projects', match: '/projects' },
  { label: 'Studio', to: '/about', match: '/about' },
  { label: 'Workshop', to: '/skills', match: '/skills' },
  { label: 'Railway', to: '/journey', match: '/journey' },
  { label: 'Post Office', to: '/contact', match: '/contact' },
]

export default function SiteHeader() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [soundOn, setSoundPreference] = useState(getSoundOn)
  const searchOpen = useSearchOpen()
  useSearchHotkeys(location.pathname !== '/')
  useEffect(() => subscribeSound(setSoundPreference), [])
  if (location.pathname === '/') return null
  const active = (to) => location.pathname === to || location.pathname.startsWith(`${to}/`)
  return <>
    <header className="site-header">
      <Link className="site-header__mark" to="/home" aria-label="Josin Joseph — Home"><span>JJ</span><small>JOSIN JOSEPH</small></Link>
      <nav className={`site-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        <Link className="site-nav__home" to="/home#doors" onClick={() => setMenuOpen(false)}>THE DOORS</Link>
        {links.map((link) => <Link key={link.to} to={link.to} aria-current={active(link.match) ? 'page' : undefined} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}
      </nav>
      <div className="site-header__actions">
        <button type="button" className="site-header__icon" onClick={() => setSearchOpen(true)} aria-label="Search the portfolio" title="Search ( / )"><Search size={17} /><kbd>/</kbd></button>
        <button type="button" className="site-header__sound" onClick={() => { if (soundOn) sounds.click(); setSoundOn(!soundOn) }} aria-pressed={soundOn} aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}>{soundOn ? <Volume2 size={15} /> : <VolumeX size={15} />}<span>SOUND {soundOn ? 'ON' : 'OFF'}</span></button>
        <button type="button" className="site-header__menu" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
      </div>
    </header>
    {searchOpen && <Suspense fallback={null}><SearchOverlay onClose={() => setSearchOpen(false)} /></Suspense>}
  </>
}
