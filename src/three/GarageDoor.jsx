import { useEffect, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import GarageInterior from './GarageInterior.jsx'

function Masonry() {
  const bricks = useMemo(() => {
    const rows = []
    for (let row = 0; row < 9; row += 1) {
      const y = -1.64 + row * 0.39
      const offset = row % 2 ? 0.34 : 0
      for (let col = 0; col < 13; col += 1) {
        const x = -3.78 + col * 0.64 + offset
        const aroundOpening = Math.abs(x) < 1.82 && y < 1.54 && y > -1.48
        const aroundSign = Math.abs(x) < 1.95 && y > 1.78 && y < 2.65
        if (aroundOpening || aroundSign) continue
        rows.push({ x, y, z: -0.6 + (col % 3) * 0.003, tone: (row * 3 + col * 5) % 4 })
      }
    }
    return rows
  }, [])
  const colors = ['#765442', '#815d47', '#6e4d3d', '#8a6249']
  return <group>
    <mesh position={[0, 0.47, -0.82]} receiveShadow>
      <boxGeometry args={[8.4, 5.4, 0.28]} /><meshStandardMaterial color="#5a483b" roughness={0.94} />
    </mesh>
    {bricks.map((brick, i) => <mesh key={i} position={[brick.x, brick.y, brick.z]} castShadow receiveShadow>
      <boxGeometry args={[0.6, 0.34, 0.16]} /><meshStandardMaterial color={colors[brick.tone]} roughness={0.94} />
    </mesh>)}
  </group>
}

function Lamp({ hovered, pivotRef, lightRef }) {
  return <group ref={pivotRef} position={[0, 2.48, 0.28]}>
    <mesh position={[0, 0.12, 0]}>
      <cylinderGeometry args={[0.025, 0.025, 0.24, 12]} /><meshStandardMaterial color="#30271f" metalness={0.4} roughness={0.58} />
    </mesh>
    <mesh position={[0, -0.045, 0]}>
      <cylinderGeometry args={[0.14, 0.27, 0.16, 24, 1, true]} /><meshStandardMaterial color="#30271f" metalness={0.46} roughness={0.5} side={THREE.DoubleSide} />
    </mesh>
    <mesh position={[0, -0.135, 0]}>
      <sphereGeometry args={[0.095, 18, 12]} /><meshStandardMaterial color="#ffd389" emissive="#f3a740" emissiveIntensity={hovered ? 1.3 : 0.45} roughness={0.25} />
    </mesh>
    <pointLight ref={lightRef} position={[0, -0.2, 0.1]} color="#ffc16c" intensity={hovered ? 1.3 : 0.38} distance={4.8} decay={2} />
  </group>
}

function Shutter({ shutterRef, latchRef, onHover, opening, hovered }) {
  const slats = Array.from({ length: 16 }, (_, i) => i)
  return <group
    ref={shutterRef}
    position={[0, -1.32, 0.17]}
    onPointerOver={(event) => { event.stopPropagation(); onHover(true); document.body.style.cursor = 'pointer' }}
    onPointerOut={() => { onHover(false); document.body.style.cursor = '' }}
  >
    {slats.map((i) => <group key={i} position={[0, 0.075 + i * 0.155, 0]}>
      <RoundedBox args={[3.2, 0.145, 0.105]} radius={0.025} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color={i % 4 === 0 ? '#58644d' : '#4e5a45'} roughness={0.78} metalness={0.17} />
      </RoundedBox>
      <mesh position={[0, -0.048, 0.058]}>
        <boxGeometry args={[3.13, 0.012, 0.01]} /><meshStandardMaterial color="#29352c" roughness={0.75} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.052, 0.057]}>
        <boxGeometry args={[3.13, 0.009, 0.009]} /><meshStandardMaterial color="#929276" roughness={0.72} metalness={0.22} />
      </mesh>
    </group>)}
    <group ref={latchRef} position={[0, 0.12, 0.11]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.18, 0.055]} /><meshStandardMaterial color="#8b744b" metalness={0.65} roughness={0.38} />
      </mesh>
      <mesh position={[0, -0.08, 0.04]}>
        <torusGeometry args={[0.052, 0.012, 8, 20]} /><meshStandardMaterial color="#c19a5e" metalness={0.76} roughness={0.34} />
      </mesh>
      <mesh position={[0, -0.04, 0.045]}>
        <boxGeometry args={[0.035, 0.13, 0.025]} /><meshStandardMaterial color="#c19a5e" metalness={0.72} roughness={0.36} />
      </mesh>
    </group>
    {hovered && <mesh position={[0, -0.015, 0.065]}>
      <boxGeometry args={[3.12, 0.016, 0.008]} /><meshBasicMaterial color="#f7c36c" transparent opacity={0.48} />
    </mesh>}
  </group>
}

export default function GarageDoor({ cameraRef, shutterRef, latchRef, interiorLightRef, hovered, setHovered, opening, lampPivotRef, lampLightRef }) {
  const { camera, clock } = useThree()
  useEffect(() => {
    camera.lookAt(0, 0.6, 0)
    cameraRef.current = camera
  }, [camera, cameraRef])
  useFrame((_, delta) => {
    if (lampPivotRef.current) lampPivotRef.current.rotation.z = THREE.MathUtils.damp(lampPivotRef.current.rotation.z, hovered ? Math.sin(clock.elapsedTime * 4) * 0.045 : Math.sin(clock.elapsedTime * 0.9) * 0.018, 2.5, delta)
    if (lampLightRef.current) lampLightRef.current.intensity = THREE.MathUtils.damp(lampLightRef.current.intensity, hovered ? 1.45 : 0.38, 5, delta)
    if (shutterRef.current && !opening) shutterRef.current.rotation.z = THREE.MathUtils.damp(shutterRef.current.rotation.z, hovered ? Math.sin(clock.elapsedTime * 25) * 0.002 : 0, 6, delta)
  })
  return <>
    <color attach="background" args={['#292722']} />
    <ambientLight intensity={0.52} color="#e7d2ad" />
    <directionalLight position={[-3, 5, 5]} intensity={1.05} color="#f3dfbd" castShadow />
    <Masonry />
    <GarageInterior lightRef={interiorLightRef} />
    {/* Masonry jambs and the concrete lintel sit in front of the shutter path. */}
    <mesh position={[-1.76, 0.05, 0.35]} castShadow>
      <boxGeometry args={[0.32, 3.18, 0.38]} /><meshStandardMaterial color="#aaa08d" roughness={0.91} />
    </mesh>
    <mesh position={[1.76, 0.05, 0.35]} castShadow>
      <boxGeometry args={[0.32, 3.18, 0.38]} /><meshStandardMaterial color="#9a907e" roughness={0.91} />
    </mesh>
    <mesh position={[0, 1.55, 0.39]} castShadow>
      <boxGeometry args={[3.82, 0.36, 0.48]} /><meshStandardMaterial color="#b3aa98" roughness={0.88} />
    </mesh>
    <mesh position={[0, 1.34, 0.17]}>
      <cylinderGeometry args={[0.06, 0.06, 3.28, 24]} /><meshStandardMaterial color="#38352c" metalness={0.35} roughness={0.6} />
    </mesh>
    <Shutter shutterRef={shutterRef} latchRef={latchRef} onHover={setHovered} opening={opening} hovered={hovered} />
    {/* Warm painted sign above the lintel. */}
    <mesh position={[0, 2.02, 0.28]} castShadow>
      <boxGeometry args={[3.5, 0.61, 0.14]} /><meshStandardMaterial color="#382d22" roughness={0.72} />
    </mesh>
    <mesh position={[0, 2.02, 0.36]}>
      <boxGeometry args={[3.34, 0.48, 0.025]} /><meshStandardMaterial color="#76553a" roughness={0.74} />
    </mesh>
    <Text position={[0, 2.08, 0.39]} fontSize={0.25} letterSpacing={0.18} color="#f0ddae" anchorX="center" anchorY="middle">GARAGE</Text>
    <Text position={[0, 1.88, 0.39]} fontSize={0.078} letterSpacing={0.09} color="#e2c99d" anchorX="center" anchorY="middle">PROJECTS &amp; CASE STUDIES</Text>
    <Lamp hovered={hovered} pivotRef={lampPivotRef} lightRef={lampLightRef} />
    <mesh position={[0, -1.355, 0.39]}>
      <boxGeometry args={[2.6, 0.018, 0.015]} /><meshStandardMaterial color="#e6ae59" emissive="#ce832a" emissiveIntensity={hovered ? 0.8 : 0.18} />
    </mesh>
    <mesh position={[0, -1.4, -0.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 8]} /><meshStandardMaterial color="#514b40" roughness={0.96} />
    </mesh>
  </>
}

export function GarageDoorFallback({ opening }) {
  return <div className={`garage-fallback${opening ? ' is-opening' : ''}`} aria-hidden="true">
    <div className="garage-fallback__wall" />
    <div className="garage-fallback__sign"><strong>GARAGE</strong><small>PROJECTS &amp; CASE STUDIES</small></div>
    <div className="garage-fallback__lamp"><i /></div>
    <div className="garage-fallback__opening"><div className="garage-fallback__inside"><span>WORK ORDERS</span><b>✦</b></div><div className="garage-fallback__shutter">{Array.from({ length: 12 }, (_, i) => <i key={i} />)}</div></div>
  </div>
}

export function GarageDoorCanvas(props) {
  return <Canvas shadows dpr={window.innerWidth < 700 ? [1, 1.2] : [1, 1.45]} camera={{ position: [0, 0.8, 8.2], fov: 36 }}>
    <GarageDoor {...props} />
  </Canvas>
}
