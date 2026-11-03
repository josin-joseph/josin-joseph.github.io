import { useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import CarriageInterior from './CarriageInterior.jsx'

function Panel({ panelRef, handleRef, latchRef, hovered, opening }) {
  const wood = '#65452d'
  const trim = '#9d7745'
  const parts = [
    { p: [0, 1.06, 0], s: [2.72, 0.62, 0.18] },
    { p: [0, -1.04, 0], s: [2.72, 0.7, 0.18] },
    { p: [-1.16, 0.02, 0], s: [0.4, 1.62, 0.18] },
    { p: [1.16, 0.02, 0], s: [0.4, 1.62, 0.18] },
  ]
  return <group ref={panelRef} position={[0, 0, 0.35]}>
    {parts.map((part, i) => <mesh key={i} position={part.p} castShadow receiveShadow>
      <boxGeometry args={part.s} /><meshStandardMaterial color={i % 2 ? '#60422c' : wood} roughness={0.76} metalness={0.04} />
    </mesh>)}
    {/* Varnished plank grain on the solid panel sections */}
    {[-1.31, -0.96, -0.72, 0.72, 0.96, 1.31].map((x, i) => <mesh key={i} position={[x, 0, 0.096]}>
      <boxGeometry args={[0.012, 1.56, 0.006]} /><meshStandardMaterial color={i % 2 ? '#8a6844' : '#493423'} roughness={0.82} />
    </mesh>)}
    <mesh position={[0, 0.02, -0.23]}><planeGeometry args={[1.45, 1.55]} /><meshStandardMaterial color="#b7c5b7" emissive="#6b7e68" emissiveIntensity={0.19} roughness={0.52} /></mesh>
    <mesh position={[0, 0.02, -0.2]}><planeGeometry args={[1.35, 1.44]} /><meshBasicMaterial color="#7f9a72" transparent opacity={0.12} /></mesh>
    {/* Thick varnished window surround */}
    {[
      [0, 0.85, 1.75, 0.11], [0, -0.81, 1.75, 0.11],
      [-0.82, 0.02, 0.11, 1.58], [0.82, 0.02, 0.11, 1.58],
    ].map(([x, y, w, h], i) => <mesh key={i} position={[x, y, 0.11]}><boxGeometry args={[w, h, 0.08]} /><meshStandardMaterial color={i % 2 ? trim : '#765537'} metalness={0.36} roughness={0.52} /></mesh>)}
    <mesh position={[0, 0.02, 0.13]}><boxGeometry args={[0.075, 1.46, 0.07]} /><meshStandardMaterial color="#745636" roughness={0.64} /></mesh>
    <mesh position={[0, 0.02, 0.14]}><boxGeometry args={[1.38, 0.06, 0.07]} /><meshStandardMaterial color="#745636" roughness={0.64} /></mesh>
    {/* Brass carriage rails */}
    {[-1.48, 1.48].map((y) => <mesh key={y} position={[0, y, 0.11]}><boxGeometry args={[2.9, 0.065, 0.095]} /><meshStandardMaterial color="#bd995b" metalness={0.78} roughness={0.34} /></mesh>)}
    <group ref={handleRef} position={[0.93, -0.22, 0.2]}>
      <mesh position={[0, 0.08, 0]}><boxGeometry args={[0.15, 0.2, 0.055]} /><meshStandardMaterial color="#a57c40" metalness={0.76} roughness={0.35} /></mesh>
      <mesh position={[0, -0.08, 0.045]}><torusGeometry args={[0.1, 0.02, 9, 20]} /><meshStandardMaterial color="#dab571" metalness={0.84} roughness={0.28} /></mesh>
    </group>
    <group ref={latchRef} position={[0.93, -0.52, 0.19]}>
      <mesh><boxGeometry args={[0.2, 0.06, 0.04]} /><meshStandardMaterial color="#c49a55" metalness={0.8} roughness={0.32} /></mesh>
      <mesh position={[0, 0.08, 0.02]}><boxGeometry args={[0.04, 0.12, 0.025]} /><meshStandardMaterial color="#c49a55" metalness={0.78} roughness={0.35} /></mesh>
    </group>
    {hovered && !opening && <mesh position={[0, -1.4, 0.13]}><boxGeometry args={[2.62, 0.018, 0.009]} /><meshBasicMaterial color="#ffe0a0" transparent opacity={0.5} /></mesh>}
  </group>
}

function RailwayScene({ refs, hovered, opening }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.lookAt(0, 0.4, 0)
    refs.camera.current = camera
  }, [camera, refs])
  useFrame((_, delta) => {
    if (refs.panel.current && !opening) refs.panel.current.position.x = THREE.MathUtils.damp(refs.panel.current.position.x, hovered ? 0.035 : 0, 5, delta)
    if (refs.lamp.current) refs.lamp.current.intensity = THREE.MathUtils.damp(refs.lamp.current.intensity, opening ? 2.2 : hovered ? 0.9 : 0.42, 4, delta)
    if (refs.rate.current !== undefined && !opening) refs.rate.current = THREE.MathUtils.damp(refs.rate.current, hovered ? 1.7 : 0.6, 2, delta)
  })
  return <>
    <color attach="background" args={['#2c2924']} />
    <ambientLight intensity={0.5} color="#e8d4b4" />
    <directionalLight position={[-3, 5, 5]} intensity={0.98} color="#f5dfb8" castShadow />
    <CarriageInterior lightRef={refs.lamp} rateRef={refs.rate} />
    {/* Pocket and outer carriage trim */}
    <mesh position={[-1.62, 0, 0.44]} castShadow><boxGeometry args={[0.2, 3.08, 0.38]} /><meshStandardMaterial color="#795638" roughness={0.83} /></mesh>
    <mesh position={[1.62, 0, 0.44]} castShadow><boxGeometry args={[0.2, 3.08, 0.38]} /><meshStandardMaterial color="#765435" roughness={0.84} /></mesh>
    <mesh position={[0, 1.55, 0.43]} castShadow><boxGeometry args={[3.38, 0.2, 0.38]} /><meshStandardMaterial color="#8a6540" roughness={0.84} /></mesh>
    <mesh position={[0, -1.55, 0.43]} castShadow><boxGeometry args={[3.38, 0.2, 0.38]} /><meshStandardMaterial color="#765435" roughness={0.86} /></mesh>
    <Panel panelRef={refs.panel} handleRef={refs.handle} latchRef={refs.latch} hovered={hovered} opening={opening} />
    <mesh position={[0, 1.91, 0.26]} castShadow><boxGeometry args={[3.18, 0.52, 0.14]} /><meshStandardMaterial color="#382b20" roughness={0.72} /></mesh>
    <mesh position={[0, 1.91, 0.35]}><boxGeometry args={[3.02, 0.4, 0.024]} /><meshStandardMaterial color="#674b30" roughness={0.68} /></mesh>
    <Text position={[0, 2.01, 0.38]} fontSize={0.22} letterSpacing={0.19} color="#f0d9a8" anchorX="center" anchorY="middle">JOURNEY</Text>
    <Text position={[0, 1.83, 0.38]} fontSize={0.06} letterSpacing={0.045} color="#e2c99b" anchorX="center" anchorY="middle">EXPERIENCE · EDUCATION · MILESTONES</Text>
    <mesh position={[0, -1.45, -0.1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[11, 8]} /><meshStandardMaterial color="#544b3d" roughness={0.94} /></mesh>
  </>
}

export function RailwayDoorCanvas(props) {
  return <Canvas shadows dpr={window.innerWidth < 700 ? [1, 1.12] : [1, 1.35]} camera={{ position: [0, 0.72, 7.8], fov: 36 }}><RailwayScene {...props} /></Canvas>
}

export function RailwayDoorFallback({ opening }) {
  return <div className={`railway-door-fallback${opening ? ' is-opening' : ''}`} aria-hidden="true">
    <div className="railway-door-fallback__sign"><b>JOURNEY</b><small>EXPERIENCE · EDUCATION · MILESTONES</small></div>
    <div className="railway-door-fallback__view"><div className="railway-door-fallback__hills" /><i className="railway-door-fallback__lamp" /><span>THE NEXT STATION</span></div>
    <div className="railway-door-fallback__panel"><div className="railway-door-fallback__window"><i /></div><b>◯</b></div>
  </div>
}
