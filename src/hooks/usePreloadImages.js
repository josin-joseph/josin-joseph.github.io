import { useEffect, useState } from 'react'

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = async () => {
      try { await image.decode?.() } catch { /* onload already confirms the image is usable */ }
      resolve(image)
    }
    image.onerror = () => reject(new Error(`Could not load portrait: ${src}`))
    image.src = src
    if (image.complete && image.naturalWidth) image.onload()
  })
}

export default function usePreloadImages(photos) {
  const [images, setImages] = useState({})
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    const [first, ...remaining] = photos

    async function preload() {
      try {
        const firstImage = await loadImage(first.src)
        if (!active) return
        setImages({ [first.id]: firstImage })

        const decoded = await Promise.all(remaining.map(async (photo) => [photo.id, await loadImage(photo.src)]))
        if (!active) return
        setImages({ [first.id]: firstImage, ...Object.fromEntries(decoded) })
        setReady(true)
      } catch {
        // Keep the first decoded image available if a secondary photo cannot load.
        if (active) setReady(true)
      }
    }

    preload()
    return () => { active = false }
  }, [photos])

  return { images, ready }
}
