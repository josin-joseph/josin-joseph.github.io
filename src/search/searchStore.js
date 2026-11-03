import { useSyncExternalStore } from 'react'

let open = false
const listeners = new Set()
function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) }
function snapshot() { return open }
export function setSearchOpen(next) { open = Boolean(next); listeners.forEach((listener) => listener()) }
export function useSearchOpen() { return useSyncExternalStore(subscribe, snapshot, () => false) }
