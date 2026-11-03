let context
let rumbleOscillator
let rumbleGain
const SOUND_KEY = 'portfolio-sound-on'
const SOUND_EVENT = 'portfolio-sound-change'

export function getSoundOn() {
  try { return localStorage.getItem(SOUND_KEY) === '1' } catch { return false }
}

export function setSoundOn(value) {
  const enabled = Boolean(value)
  try { localStorage.setItem(SOUND_KEY, enabled ? '1' : '0') } catch { /* Sound still works for this visit if storage is unavailable. */ }
  window.dispatchEvent(new CustomEvent(SOUND_EVENT, { detail: enabled }))
  return enabled
}

export function subscribeSound(listener) {
  const onChange = (event) => listener(Boolean(event.detail))
  window.addEventListener(SOUND_EVENT, onChange)
  return () => window.removeEventListener(SOUND_EVENT, onChange)
}

function getContext() {
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return null
  context ??= new AudioContext()
  if (context.state === 'suspended') context.resume()
  return context
}

function tone(frequency, duration, type = 'sine', volume = 0.035, endFrequency = frequency) {
  const audio = getContext()
  if (!audio) return
  const oscillator = audio.createOscillator()
  const gain = audio.createGain()
  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, audio.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), audio.currentTime + duration)
  gain.gain.setValueAtTime(volume, audio.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + duration)
  oscillator.connect(gain).connect(audio.destination)
  oscillator.start()
  oscillator.stop(audio.currentTime + duration)
}

export const sounds = {
  startRumble: () => {
    const audio = getContext()
    if (!audio || rumbleOscillator) return
    rumbleOscillator = audio.createOscillator()
    rumbleGain = audio.createGain()
    rumbleOscillator.type = 'sawtooth'
    rumbleOscillator.frequency.value = 44
    rumbleGain.gain.value = 0.008
    rumbleOscillator.connect(rumbleGain).connect(audio.destination)
    rumbleOscillator.start()
  },
  stopRumble: () => {
    if (!rumbleOscillator) return
    rumbleGain.gain.setTargetAtTime(0, context.currentTime, 0.035)
    rumbleOscillator.stop(context.currentTime + 0.14)
    rumbleOscillator = undefined
    rumbleGain = undefined
  },
  tick: () => tone(920, 0.035, 'square', 0.012, 650),
  click: () => tone(500, 0.08, 'triangle', 0.025, 240),
  rustle: () => tone(260, 0.2, 'sawtooth', 0.012, 110),
  stamp: () => tone(110, 0.24, 'triangle', 0.08, 48),
}
