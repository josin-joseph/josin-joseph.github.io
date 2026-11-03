import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const route = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.2, 2.35, 0),
  new THREE.Vector3(0.36, 1.25, 0),
  new THREE.Vector3(-0.3, 0.2, 0),
  new THREE.Vector3(0.24, -0.9, 0),
  new THREE.Vector3(-0.14, -2.25, 0),
])

function RailLine({ offset }) {
  const geometry = useMemo(() => {
    const points = route.getPoints(80).map((point) => new THREE.Vector3(point.x + offset, point.y, point.z))
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [offset])
  return <line geometry={geometry}><lineBasicMaterial color="#c29c60" /></line>
}

function Locomotive({ progressRef }) {
  const trainRef = useRef(null)
  useFrame(() => {
    const t = THREE.MathUtils.clamp(progressRef.current, 0, 1)
    const point = route.getPointAt(t)
    const tangent = route.getTangentAt(t)
    if (trainRef.current) {
      trainRef.current.position.copy(point)
      trainRef.current.rotation.z = Math.atan2(tangent.y, tangent.x) - Math.PI / 2
    }
  })
  return <group ref={trainRef}>
    <mesh position={[0, 0.02, 0]}><boxGeometry args={[0.36, 0.49, 0.24]} /><meshStandardMaterial color="#6d3526" metalness={0.34} roughness={0.55} /></mesh>
    <mesh position={[0, 0.22, 0]}><boxGeometry args={[0.24, 0.18, 0.22]} /><meshStandardMaterial color="#b9975e" metalness={0.58} roughness={0.42} /></mesh>
    <mesh position={[0, -0.29, 0]}><cylinderGeometry args={[0.16, 0.16, 0.32, 16]} /><meshStandardMaterial color="#39342d" metalness={0.65} roughness={0.48} /></mesh>
    <mesh position={[0, 0.37, 0]}><cylinderGeometry args={[0.055, 0.08, 0.18, 12]} /><meshStandardMaterial color="#302a23" metalness={0.55} roughness={0.5} /></mesh>
    <mesh position={[0, -0.1, 0.15]}><sphereGeometry args={[0.07, 14, 10]} /><meshStandardMaterial color="#ffdb8d" emissive="#efa647" emissiveIntensity={0.65} /></mesh>
  </group>
}

function TrackScene({ progressRef }) {
  const sleepers = useMemo(() => Array.from({ length: 22 }, (_, i) => route.getPointAt(i / 21)), [])
  return <>
    <color attach="background" args={['#383027']} />
    <ambientLight intensity={0.75} color="#ead5b2" />
    <directionalLight position={[-3, 3, 5]} intensity={1.05} color="#ffe2b1" />
    {sleepers.map((point, i) => <mesh key={i} position={[point.x, point.y, -0.04]} rotation={[0, 0, -Math.atan2(route.getTangentAt(i / 21).x, route.getTangentAt(i / 21).y)]}>
      <boxGeometry args={[0.56, 0.07, 0.06]} /><meshStandardMaterial color="#806342" roughness={0.86} />
    </mesh>)}
    <RailLine offset={-0.18} /><RailLine offset={0.18} />
    <Locomotive progressRef={progressRef} />
  </>
}

export default function TrainTrack({ progressRef }) {
  const [webgl, setWebgl] = useState(() => {
    try { const canvas = document.createElement('canvas'); return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')) }
    catch { return false }
  })
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 680px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 680px)')
    const onChange = (event) => setCompact(event.matches)
    query.addEventListener?.('change', onChange)
    return () => query.removeEventListener?.('change', onChange)
  }, [])
  const plain = !webgl || compact
  return <aside className={`journey-train${webgl ? '' : ' journey-train--fallback'}`} aria-label="Train progress along the journey">
    {!plain
      ? <Canvas dpr={[1, 1.15]} camera={{ position: [0, 0, 7.4], fov: 38 }} onError={() => setWebgl(false)}><TrackScene progressRef={progressRef} /></Canvas>
      : <div className="journey-train__plain" aria-hidden="true"><span className="journey-train__marker" /></div>}
  </aside>
}
