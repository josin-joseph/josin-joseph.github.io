import { useState } from 'react'
import { Canvas } from '@react-three/fiber'

function Pigeonholes() {
  return <group position={[0, 0.76, -0.72]}>
    <mesh><boxGeometry args={[3.6, 1.48, 0.18]} /><meshStandardMaterial color="#59432f" roughness={0.83} /></mesh>
    {[-1.2, 0, 1.2].map((x) => <mesh key={`v-${x}`} position={[x, 0, 0.11]}><boxGeometry args={[0.045, 1.36, 0.05]} /><meshStandardMaterial color="#a47f4d" metalness={0.5} roughness={0.5} /></mesh>)}
    {[-0.23, 0.25].map((y) => <mesh key={`h-${y}`} position={[0, y, 0.12]}><boxGeometry args={[3.42, 0.045, 0.05]} /><meshStandardMaterial color="#a47f4d" metalness={0.5} roughness={0.5} /></mesh>)}
    {Array.from({ length: 6 }, (_, i) => <mesh key={`letter-${i}`} position={[-1.57 + (i % 3) * 1.2, -0.45 + Math.floor(i / 3) * 0.48, 0.16]} rotation={[0, 0, (i % 2 ? 1 : -1) * 0.04]}>
      <boxGeometry args={[0.36, 0.4, 0.025]} /><meshStandardMaterial color={i % 2 ? '#d7c6a5' : '#a88656'} roughness={0.9} />
    </mesh>)}
  </group>
}

function Clock() {
  return <group position={[1.55, 1.82, 0.04]}>
    <mesh><cylinderGeometry args={[0.38, 0.38, 0.11, 32]} /><meshStandardMaterial color="#b38b4f" metalness={0.68} roughness={0.4} /></mesh>
    <mesh position={[0, 0, 0.065]}><circleGeometry args={[0.31, 32]} /><meshStandardMaterial color="#e7d8b8" roughness={0.8} /></mesh>
    <mesh position={[0, 0.07, 0.08]}><boxGeometry args={[0.018, 0.17, 0.01]} /><meshStandardMaterial color="#51402e" /></mesh>
    <mesh position={[0.07, 0, 0.081]} rotation={[0, 0, -0.7]}><boxGeometry args={[0.16, 0.015, 0.01]} /><meshStandardMaterial color="#51402e" /></mesh>
  </group>
}

function Counter() {
  return <group position={[0, -0.44, 0.15]}>
    <mesh position={[0, 0.08, 0]} castShadow><boxGeometry args={[4.4, 0.22, 1.5]} /><meshStandardMaterial color="#765335" roughness={0.78} /></mesh>
    <mesh position={[0, -0.58, -0.12]}><boxGeometry args={[4.1, 1.14, 0.2]} /><meshStandardMaterial color="#583d28" roughness={0.86} /></mesh>
    <mesh position={[0, -0.52, 0.0]}><boxGeometry args={[1.1, 0.2, 0.03]} /><meshStandardMaterial color="#30261d" roughness={0.7} /></mesh>
    <mesh position={[0, -0.52, 0.025]}><boxGeometry args={[0.78, 0.035, 0.02]} /><meshStandardMaterial color="#c4a168" metalness={0.62} roughness={0.44} /></mesh>
    <mesh position={[-0.92, 0.23, 0.1]} rotation={[0.06, 0, 0.04]}><boxGeometry args={[0.66, 0.04, 0.46]} /><meshStandardMaterial color="#ded0b5" roughness={0.9} /></mesh>
    <mesh position={[1.05, 0.32, 0.08]}><cylinderGeometry args={[0.14, 0.18, 0.4, 16]} /><meshStandardMaterial color="#87633a" roughness={0.75} /></mesh>
    <mesh position={[1.05, 0.56, 0.08]}><cylinderGeometry args={[0.19, 0.19, 0.08, 16]} /><meshStandardMaterial color="#bb9558" metalness={0.55} roughness={0.44} /></mesh>
    <mesh position={[1.05, 0.63, 0.08]}><boxGeometry args={[0.035, 0.12, 0.035]} /><meshStandardMaterial color="#c8a467" metalness={0.62} roughness={0.4} /></mesh>
  </group>
}

function Scene() {
  return <>
    <color attach="background" args={['#342b22']} />
    <ambientLight intensity={0.72} color="#ecd7b4" />
    <directionalLight position={[-3, 4, 5]} intensity={1.2} color="#ffe0ad" castShadow />
    <mesh position={[0, 0.18, -1.02]}><boxGeometry args={[5.7, 4.2, 0.18]} /><meshStandardMaterial color="#6c5035" roughness={0.94} /></mesh>
    <Pigeonholes />
    <Clock />
    <Counter />
    <mesh position={[0, -1.42, -0.04]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[8, 6]} /><meshStandardMaterial color="#514639" roughness={0.95} /></mesh>
  </>
}

function StaticCounter() {
  return <div className="post-office-illustration" aria-hidden="true"><div className="post-office-illustration__slots"><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="post-office-illustration__desk"><span>MAIL SLOT</span><b>POSTED</b></div></div>
}

export default function PostOfficeScene() {
  const [webgl, setWebgl] = useState(() => {
    try { const canvas = document.createElement('canvas'); return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')) }
    catch { return false }
  })
  return webgl
    ? <div className="post-office-scene"><Canvas shadows dpr={[1, 1.2]} camera={{ position: [0, 0.45, 7.2], fov: 38 }} onError={() => setWebgl(false)}><Scene /></Canvas></div>
    : <StaticCounter />
}
