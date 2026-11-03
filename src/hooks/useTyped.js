import { useEffect, useState } from 'react'

export default function useTyped(value, active, reducedMotion, speed = 34) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (reducedMotion) {
      setText(value)
      return undefined
    }
    if (!active) {
      setText('')
      return undefined
    }

    let index = 0
    setText('')
    const timer = window.setInterval(() => {
      index += 1
      setText(value.slice(0, index))
      if (index >= value.length) window.clearInterval(timer)
    }, speed)
    return () => window.clearInterval(timer)
  }, [value, active, reducedMotion, speed])

  return text
}
