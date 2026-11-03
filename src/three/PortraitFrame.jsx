import { useEffect, useMemo, useRef, useState } from 'react'
import { ContactShadows, RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function makePortraitPlaceholder() {
  const canvas = document.createElement('canvas')
  canvas.width = 600
  canvas.height = 750
  const context = canvas.getContext('2d')
  const background = context.createLinearGradient(0, 0, 600, 750)
  background.addColorStop(0, '#b8a98d')
  background.addColorStop(0.52, '#766752')
  background.addColorStop(1, '#3c3328')
  context.fillStyle = background
  context.fillRect(0, 0, 600, 750)
  const glow = context.createRadialGradient(300, 240, 30, 300, 300, 430)
  glow.addColorStop(0, 'rgba(248,231,198,.44)')
  glow.addColorStop(1, 'rgba(248,231,198,0)')
  context.fillStyle = glow
  context.fillRect(0, 0, 600, 750)
  context.fillStyle = '#362d24'
  context.beginPath()
  context.ellipse(300, 245, 104, 136, 0, 0, Math.PI * 2)
  context.fill()
  context.beginPath()
  context.moveTo(92, 750)
  context.bezierCurveTo(107, 520, 185, 418, 300, 416)
  context.bezierCurveTo(415, 418, 493, 520, 508, 750)
  context.closePath()
  context.fill()
  for (let i = 0; i < 2600; i += 1) {
    const value = Math.floor(Math.random() * 255)
    context.fillStyle = `rgba(${value},${value},${value},${Math.random() * 0.035})`
    context.fillRect(Math.random() * 600, Math.random() * 750, 1, 1)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function usePhotoTexture(src) {
  const fallbackTexture = useMemo(makePortraitPlaceholder, [])
  const [texture, setTexture] = useState(fallbackTexture)
  useEffect(() => {
    if (!src) return undefined
    let active = true
    const image = new Image()
    image.onload = () => {
      if (!active) return
      const loaded = new THREE.Texture(image)
      loaded.colorSpace = THREE.SRGBColorSpace
      loaded.anisotropy = 8
      loaded.needsUpdate = true
      setTexture(loaded)
    }
    image.onerror = () => { if (active) setTexture(fallbackTexture) }
    image.src = src
    return () => { active = false; image.onload = null; image.onerror = null }
  }, [src, fallbackTexture])
  return texture
}

export default function PortraitFrame({ src, reducedMotion, hasPortrait }) {
  const frame = useRef()
  const photo = usePhotoTexture(src)

  useFrame((state, delta) => {
    if (!frame.current) return
    const mobile = state.size.width < 620
    const idle = state.clock.elapsedTime
    const targetX = reducedMotion ? 0 : mobile ? Math.sin(idle * 0.32) * 0.035 : -state.pointer.y * 0.14
    const targetY = reducedMotion ? 0 : mobile ? Math.sin(idle * 0.24) * 0.045 : state.pointer.x * 0.16
    frame.current.rotation.x = THREE.MathUtils.damp(frame.current.rotation.x, targetX, 4, delta)
    frame.current.rotation.y = THREE.MathUtils.damp(frame.current.rotation.y, targetY, 4, delta)
    frame.current.position.y = Math.sin(idle * 0.55) * (reducedMotion ? 0 : 0.035)
  })

  return (
    <>
      <ambientLight intensity={1.15} color="#fff1dc" />
      <directionalLight position={[-3, 4, 5]} intensity={2.1} castShadow />
      <pointLight position={[3, 1, 2]} intensity={0.8} color="#c89d61" />
      <group ref={frame} rotation={[0.02, 0, -0.035]}>
        <RoundedBox args={[2.86, 3.66, 0.14]} radius={0.055} smoothness={4} castShadow receiveShadow>
          <meshStandardMaterial color="#30271f" roughness={0.72} metalness={0.08} />
        </RoundedBox>
        <RoundedBox args={[2.6, 3.4, 0.045]} radius={0.035} smoothness={3} position={[0, 0, 0.095]}>
          <meshStandardMaterial color="#e6dbc7" roughness={0.95} />
        </RoundedBox>
        <mesh position={[0, 0, 0.13]}>
          <planeGeometry args={[2.34, 2.94]} />
          <meshStandardMaterial map={photo} color="#ffffff" roughness={0.9} metalness={0} transparent alphaTest={0.015} />
        </mesh>
        {[-1.335, 1.335].map((x) => (
          <group key={x}>
            {Array.from({ length: 9 }, (_, i) => (
              <RoundedBox key={i} args={[0.105, 0.072, 0.025]} radius={0.018} smoothness={2} position={[x, 1.47 - i * 0.365, 0.12]}>
                <meshStandardMaterial color="#cabcaa" roughness={0.86} />
              </RoundedBox>
            ))}
          </group>
        ))}
        <Text position={[0, -1.61, 0.125]} fontSize={0.075} letterSpacing={0.18} color="#d6c5a7" anchorX="center">
          JOSIN JOSEPH  ·  FRAME 01
        </Text>
        {!hasPortrait && <Text position={[0, -1.34, 0.14]} fontSize={0.09} letterSpacing={0.1} color="#f0e5d2" anchorX="center">
          PORTRAIT TO BE ADDED
        </Text>}
      </group>
      <ContactShadows position={[0, -2.05, -0.22]} opacity={0.38} scale={5.4} blur={2.8} far={4} />
    </>
  )
}
