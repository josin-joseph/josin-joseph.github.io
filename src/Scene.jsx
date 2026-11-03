import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer, Text } from '@react-three/drei'
import * as THREE from 'three'
import { sounds } from './sound.js'

export const MAST = 'THE JOURNEY JOSIN'
export const HEAD = 'JOSIN\nJOSEPH'

function useType(full, delay, speed, go) {
  const [length, setLength] = useState(0)
  useEffect(() => {
    if (!go) return undefined
    let index = 0
    let timer
    const start = window.setTimeout(function step() {
      index += 1
      setLength(index)
      if (index < full.length) timer = window.setTimeout(step, speed)
    }, delay)
    return () => {
      window.clearTimeout(start)
      window.clearTimeout(timer)
    }
  }, [full, delay, speed, go])
  return full.slice(0, length)
}

function Hand({ hand, length, width, color }) {
  return (
    <group ref={hand} position={[0, 0.15, 0]}>
      <mesh position={[0, 0, length / 2]}>
        <boxGeometry args={[width, 0.012, length]} />
        <meshStandardMaterial color={color} metalness={0.25} roughness={0.52} />
      </mesh>
    </group>
  )
}

function PocketWatchChain() {
  const links = useMemo(() => {
    const points = [
      [1.22, -0.38, 0.34], [1.57, -0.58, 0.31], [1.78, -1.04, 0.29],
      [1.72, -1.62, 0.28], [1.34, -2.12, 0.25], [0.72, -2.38, 0.22],
      [0.03, -2.34, 0.20], [-0.56, -2.08, 0.20], [-0.82, -1.72, 0.21],
      [-0.63, -1.49, 0.23], [-0.30, -1.61, 0.24], [-0.35, -1.94, 0.24],
      [-0.05, -2.20, 0.22], [0.48, -2.31, 0.21], [0.98, -2.15, 0.23],
    ].map(([x, y, z]) => new THREE.Vector3(x, y, z))
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
    const alignX = new THREE.Vector3(1, 0, 0)
    const twistAxis = new THREE.Vector3()
    return Array.from({ length: 76 }, (_, i) => {
      const t = i / 75
      const tangent = curve.getTangentAt(t).normalize()
      const quaternion = new THREE.Quaternion().setFromUnitVectors(alignX, tangent)
      twistAxis.copy(tangent)
      quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(twistAxis, i % 2 ? Math.PI / 2 : 0))
      return { position: curve.getPointAt(t), quaternion }
    })
  }, [])
  const gold = useMemo(() => new THREE.MeshStandardMaterial({ color: '#a47c45', metalness: 0.86, roughness: 0.24 }), [])
  const linkGeometry = useMemo(() => new THREE.TorusGeometry(0.041, 0.012, 8, 18), [])
  return (
    <group>
      {links.map((link, i) => (
        <mesh key={i} geometry={linkGeometry} material={gold} position={link.position} quaternion={link.quaternion} castShadow />
      ))}
    </group>
  )
}

function PocketWatch({ opened, onToggle, soundOn }) {
  const group = useRef()
  const lid = useRef()
  const hourHand = useRef()
  const minuteHand = useRef()
  const secondHand = useRef()
  const lastSecond = useRef(-1)
  const { pointer } = useThree()
  const gold = { color: '#a47c45', metalness: 0.85, roughness: 0.28 }

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * 0.25, 3, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * 0.2, 3, delta)
    lid.current.rotation.z = THREE.MathUtils.damp(lid.current.rotation.z, opened ? 2.5 : 0, 5, delta)

    const now = new Date()
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000
    const wholeSecond = Math.floor(seconds)
    const easedSecond = wholeSecond + (1 - Math.pow(1 - Math.min((seconds - wholeSecond) / 0.2, 1), 3))
    const minutes = now.getMinutes() + seconds / 60
    const hours = (now.getHours() % 12) + minutes / 60
    const fullTurn = Math.PI * 2
    hourHand.current.rotation.y = Math.PI - (hours / 12) * fullTurn
    minuteHand.current.rotation.y = Math.PI - (minutes / 60) * fullTurn
    secondHand.current.rotation.y = Math.PI - (easedSecond / 60) * fullTurn
    if (wholeSecond !== lastSecond.current) {
      lastSecond.current = wholeSecond
      if (soundOn) sounds.tick()
    }
  })

  return (
    <group
      ref={group}
      position={[1.22, -1.18, 0.36]}
      onClick={(event) => { event.stopPropagation(); onToggle() }}
      onPointerOver={() => { document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = '' }}
    >
      <group rotation={[Math.PI / 2, 0, 0]} scale={0.77}>
        {/* Bezel, warm metal chapter ring and enamel face */}
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.78, 0.78, 0.14, 96]} />
          <meshStandardMaterial {...gold} />
        </mesh>
        <mesh position={[0, 0.078, 0]}>
          <cylinderGeometry args={[0.69, 0.69, 0.035, 96]} />
          <meshStandardMaterial color="#e5c98c" metalness={0.65} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.105, 0]}>
          <cylinderGeometry args={[0.61, 0.61, 0.025, 96]} />
          <meshStandardMaterial color="#f4ead8" roughness={0.78} />
        </mesh>
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i / 60) * Math.PI * 2
          const major = i % 5 === 0
          return (
            <mesh key={i} position={[Math.sin(angle) * 0.55, 0.125, -Math.cos(angle) * 0.55]} rotation={[0, Math.PI - angle, 0]}>
              <boxGeometry args={[major ? 0.022 : 0.009, 0.009, major ? 0.07 : 0.035]} />
              <meshStandardMaterial color={major ? '#4b3824' : '#8a7456'} />
            </mesh>
          )
        })}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2
          return (
            <mesh key={`hour-${i}`} position={[Math.sin(angle) * 0.44, 0.13, -Math.cos(angle) * 0.44]} rotation={[0, Math.PI - angle, 0]}>
              <boxGeometry args={[0.045, 0.012, 0.11]} />
              <meshStandardMaterial color="#35291d" />
            </mesh>
          )
        })}
        {['XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'].map((numeral, i) => {
          const angle = (i / 12) * Math.PI * 2
          return (
            <Text key={`numeral-${numeral}`} position={[Math.sin(angle) * 0.34, 0.149, -Math.cos(angle) * 0.34]} rotation={[-Math.PI / 2, 0, -angle]} fontSize={i % 3 === 0 ? 0.102 : 0.082} color="#3d3023" anchorX="center" anchorY="middle">
              {numeral}
            </Text>
          )
        })}
        {/* Small date aperture, like the watch in the supplied photo. */}
        <mesh position={[0.39, 0.145, 0]}>
          <boxGeometry args={[0.17, 0.018, 0.12]} />
          <meshStandardMaterial color="#b9a57f" metalness={0.35} roughness={0.6} />
        </mesh>
        <mesh position={[0.39, 0.157, 0]}>
          <boxGeometry args={[0.13, 0.008, 0.085]} />
          <meshStandardMaterial color="#f4ead8" roughness={0.78} />
        </mesh>
        <Text position={[0.39, 0.164, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.055} color="#35291d" anchorX="center" anchorY="middle">24</Text>
        <Hand hand={hourHand} length={0.29} width={0.042} color="#382b1f" />
        <Hand hand={minuteHand} length={0.44} width={0.026} color="#382b1f" />
        <Hand hand={secondHand} length={0.48} width={0.012} color="#8f2d22" />
        <mesh position={[0, 0.18, 0]}>
          <sphereGeometry args={[0.045, 24, 24]} />
          <meshStandardMaterial {...gold} />
        </mesh>
        {/* Crown and winding bow */}
        <mesh position={[0, 0, -0.84]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.2, 32]} />
          <meshStandardMaterial {...gold} />
        </mesh>
        <mesh position={[0, 0, -1.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.15, 0.035, 16, 40]} />
          <meshStandardMaterial {...gold} />
        </mesh>
        {/* Hinged cover swings away from the face */}
        <group ref={lid} position={[-0.68, 0.12, 0]}>
          <mesh position={[0.68, 0, 0]} castShadow>
            <cylinderGeometry args={[0.72, 0.72, 0.075, 96]} />
            <meshStandardMaterial {...gold} />
          </mesh>
          <mesh position={[0.68, 0.045, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 0.025, 96]} />
            <meshStandardMaterial color="#e5c98c" metalness={0.55} roughness={0.3} />
          </mesh>
          <mesh position={[0.68, 0.061, 0]}>
            <torusGeometry args={[0.57, 0.018, 12, 96]} />
            <meshStandardMaterial color="#785a36" metalness={0.75} roughness={0.35} />
          </mesh>
          {/* Fine inner case engraving catches the light when the lid opens. */}
          <mesh position={[0.68, -0.047, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.51, 0.008, 8, 96]} />
            <meshStandardMaterial color="#75552f" metalness={0.8} roughness={0.34} />
          </mesh>
          <mesh position={[0.68, -0.049, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.43, 0.005, 8, 96]} />
            <meshStandardMaterial color="#c69d5d" metalness={0.82} roughness={0.28} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function Paper({ onText, opened, onToggle, soundOn, go }) {
  const paper = useRef()
  const mast = useType(MAST, 250, 45, go)
  const headline = useType(HEAD, 750, 55, go)
  const { pointer } = useThree()
  const ink = '#30271f'
  const softInk = '#6e5a43'
  const paperTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const context = canvas.getContext('2d')
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, 512, 512)
    for (let i = 0; i < 9000; i += 1) {
      const shade = Math.floor(106 + Math.random() * 110)
      const alpha = 0.025 + Math.random() * 0.075
      context.fillStyle = `rgba(${shade},${shade - 9},${shade - 22},${alpha})`
      context.fillRect(Math.random() * 512, Math.random() * 512, 1 + Math.random() * 2, 1)
    }
    for (let i = 0; i < 260; i += 1) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      context.strokeStyle = `rgba(118,93,57,${0.025 + Math.random() * 0.05})`
      context.beginPath()
      context.moveTo(x, y)
      context.lineTo(x + 2 + Math.random() * 9, y + (Math.random() - 0.5) * 1.4)
      context.stroke()
    }
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    return texture
  }, [])

  useFrame((state, delta) => {
    if (!paper.current) return
    paper.current.rotation.y = THREE.MathUtils.damp(paper.current.rotation.y, pointer.x * 0.08, 2.4, delta)
    paper.current.rotation.x = THREE.MathUtils.damp(paper.current.rotation.x, -pointer.y * 0.06, 2.4, delta)
    paper.current.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.025
  })

  return (
    <>
      <hemisphereLight args={['#fff4e0', '#8a7456', 0.9]} />
      <directionalLight position={[-3, 5, 5]} intensity={1.8} castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[2.5, 1.5, 3]} intensity={0.8} color="#e8c58e" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[-4, 4, 5]} scale={[7, 4, 1]} color="#fff1d6" />
        <Lightformer form="rect" intensity={1.2} position={[4, 1, 4]} scale={[3, 5, 1]} color="#ffd9a0" />
        <Lightformer form="rect" intensity={0.8} position={[0, -4, 3]} scale={[8, 2, 1]} color="#b79d78" />
      </Environment>
      <group ref={paper}>
        {/* Uneven stacked sheets create the soft, printed-paper edge from the reference. */}
        <mesh position={[0.08, -0.06, -0.42]} rotation={[0, 0, -0.018]} castShadow>
          <boxGeometry args={[4.4, 5.7, 0.05]} />
          <meshStandardMaterial color="#d3c5ab" roughness={1} />
        </mesh>
        <mesh position={[-0.06, -0.03, -0.3]} rotation={[0, 0, 0.012]} castShadow>
          <boxGeometry args={[4.4, 5.7, 0.05]} />
          <meshStandardMaterial color="#ddd0b8" roughness={1} />
        </mesh>
        <mesh position={[0, 0, -0.15]} receiveShadow castShadow>
          <boxGeometry args={[4.4, 5.7, 0.12]} />
          <meshStandardMaterial color="#e9dfcc" map={paperTexture} roughness={0.98} />
        </mesh>
        <Text position={[0, 2.38, -0.07]} fontSize={0.17} letterSpacing={0.12} color="#5b4a35" anchorX="center" onSync={onText}>
          {mast}
        </Text>
        <mesh position={[0, 2.14, -0.065]}>
          <boxGeometry args={[3.85, 0.018, 0.01]} /><meshStandardMaterial color="#4b3b2b" />
        </mesh>
        <mesh position={[0, 2.08, -0.065]}>
          <boxGeometry args={[3.85, 0.006, 0.01]} /><meshStandardMaterial color="#4b3b2b" />
        </mesh>
        <Text position={[0, 1.86, -0.06]} fontSize={0.092} color={softInk} anchorX="center">
          VOL. 01  ·  SPECIAL EDITION  ·  2026
        </Text>
        <Text position={[0, 1.67, -0.06]} fontSize={0.36} maxWidth={3.7} lineHeight={1.08} textAlign="center" color={ink} anchorX="center" anchorY="top">
          {headline}
        </Text>
        <Text position={[0, 0.1, -0.06]} fontSize={0.09} maxWidth={3.2} textAlign="center" lineHeight={1.4} color="#6a5945" anchorX="center">
          A collection of ideas, experiments, projects and things still becoming.
        </Text>
        <mesh position={[0, -0.12, -0.055]}>
          <boxGeometry args={[3.55, 0.009, 0.01]} /><meshStandardMaterial color="#8d7758" />
        </mesh>
        <Text position={[-1.05, -0.28, -0.06]} fontSize={0.075} maxWidth={0.95} textAlign="left" lineHeight={1.45} color="#51402e" anchorX="left" anchorY="top">
          An independent collection of selected work, observations and ideas still taking shape.
        </Text>
        <Text position={[0, -0.28, -0.06]} fontSize={0.075} maxWidth={0.95} textAlign="left" lineHeight={1.45} color="#51402e" anchorX="left" anchorY="top">
          Each project begins with a question, then grows through research, sketches and making.
        </Text>
        <Text position={[1.04, -0.28, -0.06]} fontSize={0.075} maxWidth={0.95} textAlign="left" lineHeight={1.45} color="#51402e" anchorX="left" anchorY="top">
          Notes from the process sit alongside finished work, leaving room for the next chapter.
        </Text>
        <Text position={[0, -2.35, -0.06]} fontSize={0.085} color={softInk} anchorX="center">
          JOSIN JOSEPH  ·  SELECTED WORK & NOTES
        </Text>
        <PocketWatchChain />
        <PocketWatch opened={opened} onToggle={onToggle} soundOn={soundOn} />
        {/* A small clipped edition slip adds a second paper surface and scale. */}
        <group position={[-1.32, -1.35, 0.08]} rotation={[0, 0, 0.08]}>
          <mesh castShadow>
            <boxGeometry args={[1.25, 0.8, 0.035]} /><meshStandardMaterial color="#f2e8d5" roughness={1} />
          </mesh>
          <Text position={[0, 0.2, 0.025]} fontSize={0.095} color="#453522" anchorX="center">FIELD NOTES</Text>
          <Text position={[0, -0.02, 0.025]} fontSize={0.07} color={softInk} anchorX="center">Ideas in progress</Text>
          <Text position={[0, -0.18, 0.025]} fontSize={0.06} color={softInk} anchorX="center">Personal edition</Text>
          <mesh position={[0, 0.34, 0.035]}>
            <boxGeometry args={[0.4, 0.08, 0.02]} /><meshStandardMaterial color="#b49b73" roughness={0.8} />
          </mesh>
        </group>
      </group>
      <mesh position={[-2.25, 1.8, 0.5]} rotation={[0.2, 0.3, 0.4]}>
        <planeGeometry args={[0.35, 0.18]} />
        <meshStandardMaterial color="#d2bd9a" side={THREE.DoubleSide} roughness={1} />
      </mesh>
      <ContactShadows position={[0, -3.2, -0.5]} opacity={0.42} scale={9} blur={2.5} far={5} />
    </>
  )
}

export function Dust() {
  const points = useRef()
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const count = window.innerWidth < 700 ? 40 : 90
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3)
    for (let i = 0; i < count; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 11
      values[i * 3 + 1] = (Math.random() - 0.5) * 8
      values[i * 3 + 2] = (Math.random() - 0.5) * 3
    }
    return values
  }, [count])
  useFrame((state, delta) => {
    if (!points.current || reducedMotion) return
    points.current.rotation.y += delta * 0.015
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.15
  })
  return (
    <points ref={points}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#9d896b" size={0.025} transparent opacity={0.42} sizeAttenuation depthWrite={false} />
    </points>
  )
}

function Stage({ onCreated, onText, opened, onToggle, soundOn, go }) {
  return (
    <Canvas
      shadows
      dpr={window.innerWidth < 700 ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0.2, 10.5], fov: 34 }}
      onCreated={onCreated}
      fallback={<div className="scene-fallback" />}
    >
      <color attach="background" args={['#eee8dc']} />
      <Paper go={go} onText={onText} opened={opened} onToggle={onToggle} soundOn={soundOn} />
      <Dust />
    </Canvas>
  )
}

export default Stage
