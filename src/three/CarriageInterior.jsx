import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function Hills({ color, y, scale, rateRef, z, speed }) {
  const first = useRef(null)
  const second = useRef(null)
  useFrame((_, delta) => {
    const step = delta * speed * (rateRef.current ?? 1)
    for (const ref of [first, second]) {
      if (!ref.current) continue
      ref.current.position.x -= step
      if (ref.current.position.x < -4.4) ref.current.position.x += 8.8
    }
  })
  return <>
    {[first, second].map((ref, idx) => <group key={idx} ref={ref} position={[idx * 4.4, y, z]}>
      <mesh position={[-1.1, 0, 0]} scale={[2.1, scale, 0.18]}><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
      <mesh position={[1.35, -0.06, 0.01]} scale={[2.2, scale * 0.74, 0.18]}><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color={color} roughness={0.9} /></mesh>
    </group>)}
  </>
}

function Trees({ rateRef }) {
  const first = useRef(null)
  const second = useRef(null)
  useFrame((_, delta) => {
    for (const ref of [first, second]) {
      if (!ref.current) continue
      ref.current.position.x -= delta * 0.8 * (rateRef.current ?? 1)
      if (ref.current.position.x < -4.2) ref.current.position.x += 8.4
    }
  })
  return [first, second].map((ref, idx) => <group key={idx} ref={ref} position={[idx * 4.2, -0.24, 0.12]}>
    {[-1.7, -0.85, 0.05, 0.95, 1.75].map((x, i) => <group key={i} position={[x, 0, 0]}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.025, 0.04, 0.5, 8]} /><meshStandardMaterial color="#54432f" roughness={0.9} /></mesh>
      <mesh position={[0, 0.52, 0]}><coneGeometry args={[0.23, 0.66, 8]} /><meshStandardMaterial color={i % 2 ? '#526044' : '#66714b'} roughness={0.92} /></mesh>
    </group>)}
  </group>)
}

function CarriageLamp({ lightRef }) {
  const lamp = useRef(null)
  useFrame((state) => { if (lamp.current) lamp.current.intensity = 0.42 + Math.sin(state.clock.elapsedTime * 9) * 0.045 })
  return <group position={[0, 1.16, -0.82]}>
    <mesh position={[0, 0.14, 0]}><cylinderGeometry args={[0.018, 0.018, 0.3, 8]} /><meshStandardMaterial color="#5a4932" metalness={0.5} roughness={0.5} /></mesh>
    <mesh position={[0, -0.03, 0]}><sphereGeometry args={[0.12, 14, 10]} /><meshStandardMaterial color="#ffd88f" emissive="#ffae4c" emissiveIntensity={0.7} /></mesh>
    <pointLight ref={(node) => { lamp.current = node; lightRef.current = node }} position={[0, -0.05, 0.08]} color="#ffce7b" intensity={0.42} distance={4.8} />
  </group>
}

export default function CarriageInterior({ lightRef, rateRef }) {
  return <group>
    <mesh position={[0, 0.12, -1.04]}><planeGeometry args={[5.8, 4.1]} /><meshStandardMaterial color="#614a33" roughness={0.92} /></mesh>
    <mesh position={[0, -1.46, -0.05]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[6.5, 4.3]} /><meshStandardMaterial color="#574a39" roughness={0.9} /></mesh>
    {/* Large landscape window behind the sliding carriage panel */}
    <mesh position={[0, 0.26, -0.9]}><planeGeometry args={[2.9, 1.9]} /><meshStandardMaterial color="#e8c17d" emissive="#9c6832" emissiveIntensity={0.22} roughness={0.6} /></mesh>
    <group position={[0, 0.26, -0.84]}>
      <Hills color="#677255" y={-0.2} scale={0.72} rateRef={rateRef} z={0.03} speed={0.12} />
      <Hills color="#8a7958" y={-0.39} scale={0.43} rateRef={rateRef} z={0.08} speed={0.28} />
      <Trees rateRef={rateRef} />
    </group>
    {/* Bench seats and luggage shelf */}
    {[-1, 1].map((x) => <group key={x} position={[x, -0.76, -0.28]}>
      <mesh position={[0, 0.17, 0]}><boxGeometry args={[1.2, 0.3, 0.68]} /><meshStandardMaterial color="#753e2d" roughness={0.78} /></mesh>
      <mesh position={[0, 0.55, -0.24]}><boxGeometry args={[1.2, 0.65, 0.16]} /><meshStandardMaterial color="#80503a" roughness={0.8} /></mesh>
      {[-0.45, 0.45].map((leg) => <mesh key={leg} position={[leg, -0.12, 0]}><boxGeometry args={[0.08, 0.38, 0.08]} /><meshStandardMaterial color="#493626" roughness={0.85} /></mesh>)}
    </group>)}
    <mesh position={[0, 1.03, -0.58]}><boxGeometry args={[3.2, 0.08, 0.38]} /><meshStandardMaterial color="#694b30" roughness={0.8} /></mesh>
    {[-1.25, -0.55, 0.25, 1.05].map((x) => <mesh key={x} position={[x, 0.77, -0.54]}><boxGeometry args={[0.055, 0.48, 0.06]} /><meshStandardMaterial color="#957347" metalness={0.4} roughness={0.6} /></mesh>)}
    <CarriageLamp lightRef={lightRef} />
  </group>
}
