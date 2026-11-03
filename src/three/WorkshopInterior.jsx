import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Dust } from '../Scene.jsx'

function ToolShapes() {
  return <group>
    {[-0.95, -0.3, 0.4, 1.05].map((x, i) => <group key={x} position={[x, 0.48 + (i % 2) * 0.12, -0.18]}>
      <mesh position={[0, 0.2, 0]}><cylinderGeometry args={[0.025, 0.025, 0.48, 10]} /><meshStandardMaterial color="#d0bd9a" metalness={0.6} roughness={0.42} /></mesh>
      <mesh position={[0, 0.47, 0]}><torusGeometry args={[0.085 + (i % 2) * 0.02, 0.018, 6, 16]} /><meshStandardMaterial color="#d0bd9a" metalness={0.64} roughness={0.42} /></mesh>
    </group>)}
  </group>
}

function Lamp({ lightRef }) {
  const swing = useRef(null)
  useFrame((state, delta) => { if (swing.current) swing.current.rotation.z += (Math.sin(state.clock.elapsedTime * 1.2) * 0.035 - swing.current.rotation.z) * delta * 1.8 })
  return <group ref={swing} position={[0.35, 1.55, -0.48]}>
    <mesh position={[0, 0.35, 0]}><cylinderGeometry args={[0.018, 0.018, 0.7, 10]} /><meshStandardMaterial color="#403529" metalness={0.45} roughness={0.5} /></mesh>
    <mesh position={[0, 0.02, 0]} rotation={[Math.PI, 0, 0]}><cylinderGeometry args={[0.18, 0.32, 0.22, 24, 1, true]} /><meshStandardMaterial color="#334032" metalness={0.36} roughness={0.5} side={2} /></mesh>
    <mesh position={[0, -0.11, 0]}><sphereGeometry args={[0.1, 16, 10]} /><meshStandardMaterial color="#ffe0a0" emissive="#f6b84c" emissiveIntensity={0.7} /></mesh>
    <pointLight ref={lightRef} position={[0, -0.12, 0.08]} color="#ffcb76" intensity={0.18} distance={5} />
  </group>
}

export default function WorkshopInterior({ lightRef, spillRef }) {
  return <group>
    <mesh position={[0, 0.1, -1.18]}><planeGeometry args={[3.1, 3.3]} /><meshStandardMaterial color="#70543a" roughness={0.95} /></mesh>
    <mesh position={[0, -1.46, -0.2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[5, 3.8]} /><meshStandardMaterial color="#635744" roughness={0.96} /></mesh>
    <mesh position={[0, 0.35, -0.82]}><boxGeometry args={[2.65, 1.14, 0.08]} /><meshStandardMaterial color="#725034" roughness={0.88} /></mesh>
    <ToolShapes />
    <mesh position={[0.05, -0.58, -0.52]} castShadow><boxGeometry args={[3.3, 0.16, 0.92]} /><meshStandardMaterial color="#825936" roughness={0.78} /></mesh>
    {[-1.34, 1.44].map((x) => <mesh key={x} position={[x, -1.02, -0.52]}><boxGeometry args={[0.13, 0.8, 0.78]} /><meshStandardMaterial color="#60442e" roughness={0.82} /></mesh>)}
    <mesh position={[-1.12, -0.42, -0.1]} rotation={[0.06, 0, -0.45]}><boxGeometry args={[0.5, 0.06, 0.35]} /><meshStandardMaterial color="#ad8c59" roughness={0.8} /></mesh>
    <mesh position={[1.15, -0.34, -0.19]}><cylinderGeometry args={[0.13, 0.16, 0.28, 16]} /><meshStandardMaterial color="#8b744b" roughness={0.72} /></mesh>
    <Lamp lightRef={lightRef} />
    <mesh ref={spillRef} position={[0, -1.445, 0.4]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.05, 2.4]} /><meshBasicMaterial color="#ffda9a" transparent opacity={0.07} side={2} /></mesh>
    <group position={[0, 0.1, -0.38]} scale={0.26}><Dust /></group>
  </group>
}
