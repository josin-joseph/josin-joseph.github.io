import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef } from 'react'

const BAYER = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
]

function makeDither(image) {
  const scale = Math.min(1, 220 / Math.max(image.naturalWidth, image.naturalHeight))
  const width = Math.max(1, Math.round(image.naturalWidth * scale))
  const height = Math.max(1, Math.round(image.naturalHeight * scale))
  const source = document.createElement('canvas')
  source.width = width
  source.height = height
  const sourceContext = source.getContext('2d', { willReadFrequently: true })
  sourceContext.drawImage(image, 0, 0, width, height)
  const pixels = sourceContext.getImageData(0, 0, width, height)
  const output = sourceContext.createImageData(width, height)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = (y * width + x) * 4
      const luminance = pixels.data[index] * 0.2126 + pixels.data[index + 1] * 0.7152 + pixels.data[index + 2] * 0.0722
      const threshold = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) * 16
      const color = luminance > threshold ? [235, 226, 208] : [48, 39, 31]
      output.data[index] = color[0]
      output.data[index + 1] = color[1]
      output.data[index + 2] = color[2]
      output.data[index + 3] = 255
    }
  }
  sourceContext.putImageData(output, 0, 0)
  return source
}

const DitherVeil = forwardRef(function DitherVeil({ image, enabled = true }, ref) {
  const canvasRef = useRef(null)
  const ditherRef = useRef(null)
  const spotsRef = useRef([])
  const rafRef = useRef(0)
  const drawRef = useRef(() => {})

  useLayoutEffect(() => {
    if (image) ditherRef.current = makeDither(image)
    drawRef.current()
  }, [image])

  useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    let observer
    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.max(1, Math.round(rect.width * ratio))
      canvas.height = Math.max(1, Math.round(rect.height * ratio))
      drawRef.current()
    }
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(resize)
      observer.observe(canvas)
    } else {
      window.addEventListener('resize', resize)
    }
    resize()
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  drawRef.current = () => {
    const canvas = canvasRef.current
    const dither = ditherRef.current
    if (!canvas || !dither) return
    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.imageSmoothingEnabled = false
    let sx = 0
    let sy = 0
    let sw = dither.width
    let sh = dither.height
    const imageRatio = sw / sh
    const frameRatio = canvas.width / canvas.height
    if (imageRatio > frameRatio) {
      sw = sh * frameRatio
      sx = (dither.width - sw) / 2
    } else if (imageRatio < frameRatio) {
      sh = sw / frameRatio
      sy = (dither.height - sh) / 2
    }
    context.drawImage(dither, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)

    const now = performance.now()
    spotsRef.current = spotsRef.current.filter((spot) => now - spot.time < spot.life)
    if (spotsRef.current.length) {
      context.globalCompositeOperation = 'destination-out'
      for (const spot of spotsRef.current) {
        const age = Math.max(0, (now - spot.time) / spot.life)
        const radius = spot.radius * (spot.burst ? 0.55 + age * 0.45 : 1 - age * 0.3)
        const gradient = context.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, radius)
        gradient.addColorStop(0, `rgba(0,0,0,${1 - age * 0.35})`)
        gradient.addColorStop(0.62, `rgba(0,0,0,${0.8 - age * 0.55})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')
        context.fillStyle = gradient
        context.beginPath()
        context.arc(spot.x, spot.y, radius, 0, Math.PI * 2)
        context.fill()
      }
      context.globalCompositeOperation = 'source-over'
    }

    if (spotsRef.current.length && !rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = 0
        drawRef.current()
      })
    }
  }

  useImperativeHandle(ref, () => ({
    revealAt(x, y) {
      if (!enabled) return
      const canvas = canvasRef.current
      if (!canvas) return
      const scaleX = canvas.width / canvas.clientWidth
      const scaleY = canvas.height / canvas.clientHeight
      const last = spotsRef.current.at(-1)
      if (!last || Math.hypot(last.x - x * scaleX, last.y - y * scaleY) > 9) {
        spotsRef.current.push({ x: x * scaleX, y: y * scaleY, time: performance.now(), life: 420, radius: Math.min(canvas.width, canvas.height) * 0.26 })
        spotsRef.current = spotsRef.current.slice(-7)
      }
      drawRef.current()
    },
    burstAt(x, y) {
      if (!enabled) return
      const canvas = canvasRef.current
      if (!canvas) return
      const scaleX = canvas.width / canvas.clientWidth
      const scaleY = canvas.height / canvas.clientHeight
      spotsRef.current.push({ x: x * scaleX, y: y * scaleY, time: performance.now(), life: 620, radius: Math.min(canvas.width, canvas.height) * 0.48, burst: true })
      spotsRef.current = spotsRef.current.slice(-7)
      drawRef.current()
    },
    hide() {
      spotsRef.current = []
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      drawRef.current()
    },
  }), [enabled])

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }, [])

  return <canvas ref={canvasRef} className="portrait-dither" aria-hidden="true" />
})

export default DitherVeil
