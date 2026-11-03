import { useEffect } from 'react'
import { setSearchOpen } from './searchStore.js'

export default function useSearchHotkeys(enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined
    const onKeyDown = (event) => {
      const target = event.target
      const typing = target instanceof HTMLElement && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName))
      if ((event.key === 'k' || event.key === 'K') && (event.ctrlKey || event.metaKey)) {
        event.preventDefault(); setSearchOpen(true)
      } else if (event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey) {
        event.preventDefault(); setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enabled])
}
