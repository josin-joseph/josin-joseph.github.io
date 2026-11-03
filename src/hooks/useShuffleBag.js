import { useCallback, useRef } from 'react'

function shuffle(items) {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[other]] = [result[other], result[index]]
  }
  return result
}

export function createShuffleBag(items, firstId) {
  let bag = []
  let lastId = firstId

  return () => {
    if (!bag.length) {
      bag = shuffle(items.filter((item) => item.id !== lastId))
      if (bag.length > 1 && bag[0].id === lastId) [bag[0], bag[1]] = [bag[1], bag[0]]
    }
    const next = bag.shift()
    lastId = next.id
    return next
  }
}

export default function useShuffleBag(items, firstId) {
  const bag = useRef(null)
  if (!bag.current) bag.current = createShuffleBag(items, firstId)
  return useCallback(() => bag.current(), [])
}
