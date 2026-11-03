import { useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import WorkshopInterior from './WorkshopInterior.jsx'

function TimberLeaf({ doorRef, handleRef, latchRef, hovered, opening }) {
  const plankColors = ['#513a28', '#59402b', '#60462e', '#4b3626', '#674a30']
  return <group ref={doorRef} position={[-1.33, 0, 0.32]}>
    {Array.from({ length: 10 }, (_, i) => {
      const x = 0.13 + i * 0.257
      return <group key={i} position={[x, 0, 0]}>
        <RoundedBox args={[0.25, 2.72 + (i % 3 - 1) * 0.018, 0.15]} radius={0.012} smoothness={2} castShadow receiveShadow>
          <meshStandardMaterial color={plankColors[i % plankColors.length]} roughness={0.9} metalness={0.025} />
        </RoundedBox>
        {[-0.08, -0.025, 0.045, 0.095].map((gx, j) => <mesh key={j} position={[gx, 0, 0.079]}>
          <boxGeometry args={[0.006, 2.55 - j * 0.08, 0.003]} /><meshStandardMaterial color={j % 2 ? '#77583b' : '#3c2c20'} roughness={0.92} />
        </mesh>)}
      </group>
    })}
    {[-0.79, 0.8].map((y) => <mesh key={y} position={[1.27, y, 0.105]} castShadow>
      <boxGeometry args={[2.59, 0.14, 0.075]} /><meshStandardMaterial color="#39382f" metalness={0.68} roughness={0.57} />
    </mesh>)}
    <mesh position={[1.28, 0, 0.112]} rotation={[0, 0, -0.55]} castShadow>
      <boxGeometry args={[0.15, 3.05, 0.08]} /><meshStandardMaterial color="#37362e" metalness={0.58} roughness={0.58} />
    </mesh>
    {/* Hinge barrels and strap plates */}
    {[-1.04, -0.36, 0.36, 1.04].map((y) => <group key={y} position={[0.035, y, 0.13]}>
      <mesh><boxGeometry args={[0.16, 0.26, 0.05]} /><meshStandardMaterial color="#a47d42" metalness={0.68} roughness={0.42} /></mesh>
      <mesh position={[0, 0, 0.05]}><cylinderGeometry args={[0.035, 0.035, 0.3, 12]} /><meshStandardMaterial color="#c19b5d" metalness={0.8} roughness={0.32} /></mesh>
    </group>)}
    <group ref={handleRef} position={[2.35, -0.08, 0.17]}>
      <mesh position={[0, 0.1, 0]}><boxGeometry args={[0.16, 0.18, 0.055]} /><meshStandardMaterial color="#97733e" metalness={0.74} roughness={0.36} /></mesh>
      <mesh position={[0, -0.13, 0.055]}><torusGeometry args={[0.12, 0.022, 10, 24]} /><meshStandardMaterial color="#d2ae6c" metalness={0.84} roughness={0.28} /></mesh>
    </group>
    <group ref={latchRef} position={[2.39, -0.41, 0.17]}>
      <mesh><boxGeometry args={[0.22, 0.09, 0.05]} /><meshStandardMaterial color="#b18b4c" metalness={0.76} roughness={0.36} /></mesh>
      <mesh position={[0, 0.1, 0.025]}><boxGeometry args={[0.05, 0.16, 0.035]} /><meshStandardMaterial color="#cfaa68" metalness={0.78} roughness={0.34} /></mesh>
    </group>
    {hovered && !opening && <mesh position={[1.25, -1.39, 0.1]}><boxGeometry args={[2.54, 0.018, 0.008]} /><meshBasicMaterial color="#ffcc76" transparent opacity={0.58} /></mesh>}
  </group>
}

function Lantern({ pivotRef, lightRef, hovered }) {
  return <group ref={pivotRef} position={[0, 2.52, 0.33]}>
    <mesh position={[0, 0.17, 0]}><cylinderGeometry args={[0.018, 0.018, 0.32, 10]} /><meshStandardMaterial color="#302a20" metalness={0.62} roughness={0.45} /></mesh>
    <mesh position={[0, -0.02, 0]}><cylinderGeometry args={[0.13, 0.22, 0.16, 18, 1, true]} /><meshStandardMaterial color="#374232" metalness={0.45} roughness={0.48} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, -0.12, 0]}><sphereGeometry args={[0.09, 16, 10]} /><meshStandardMaterial color="#ffe0a0" emissive="#ffb84d" emissiveIntensity={hovered ? 1.5 : 0.4} roughness={0.3} /></mesh>
    <pointLight ref={lightRef} position={[0, -0.16, 0.08]} intensity={hovered ? 1.35 : 0.26} color="#ffc777" distance={4.8} />
  </group>
}

function WorkshopScene({ refs, hovered, opening }) {
  const { camera, clock } = useThree()
  useEffect(() => {
    camera.lookAt(0, 0.55, 0)
    refs.camera.current = camera
  }, [camera, refs])
  useFrame((_, delta) => {
    if (refs.lantern.current) refs.lantern.current.rotation.z = THREE.MathUtils.damp(refs.lantern.current.rotation.z, Math.sin(clock.elapsedTime * 1.1) * (hovered ? 0.035 : 0.014), 2.2, delta)
    if (refs.lamp.current) refs.lamp.current.intensity = THREE.MathUtils.damp(refs.lamp.current.intensity, hovered || opening ? 1.35 : 0.26, 4, delta)
    if (refs.hangingLight.current) refs.hangingLight.current.intensity = THREE.MathUtils.damp(refs.hangingLight.current.intensity, hovered ? 1.35 : opening ? 1.45 : 0.26, 4, delta)
    if (refs.spill.current) refs.spill.current.scale.x = THREE.MathUtils.damp(refs.spill.current.scale.x, opening ? 1.1 : hovered ? 0.2 : 0.04, 5, delta)
    if (refs.door.current && !opening) refs.door.current.rotation.y = THREE.MathUtils.damp(refs.door.current.rotation.y, hovered ? -0.026 : 0, 4, delta)
  })
  return <>
    <color attach="background" args={['#29251f']} />
    <ambientLight intensity={0.47} color="#e6d2ad" />
    <directionalLight position={[-3, 5, 6]} intensity={0.96} color="#f5dcad" castShadow />
    <mesh position={[0, 0.35, -0.86]} receiveShadow><boxGeometry args={[8.5, 5.4, 0.25]} /><meshStandardMaterial color="#594a37" roughness={0.95} /></mesh>
    <WorkshopInterior lightRef={refs.lamp} spillRef={refs.spill} />
    {/* Thick timber jambs and the lintel */}
    <mesh position={[-1.42, 0, 0.43]} castShadow><boxGeometry args={[0.2, 3.08, 0.36]} /><meshStandardMaterial color="#88623b" roughness={0.88} /></mesh>
    <mesh position={[1.42, 0, 0.43]} castShadow><boxGeometry args={[0.2, 3.08, 0.36]} /><meshStandardMaterial color="#785637" roughness={0.9} /></mesh>
    <mesh position={[0, 1.57, 0.44]} castShadow><boxGeometry args={[3.03, 0.19, 0.37]} /><meshStandardMaterial color="#967047" roughness={0.86} /></mesh>
    <TimberLeaf doorRef={refs.door} handleRef={refs.handle} latchRef={refs.latch} hovered={hovered} opening={opening} />
    <mesh position={[0, 1.92, 0.26]} castShadow><boxGeometry args={[3.1, 0.55, 0.15]} /><meshStandardMaterial color="#352b20" roughness={0.72} /></mesh>
    <mesh position={[0, 1.92, 0.35]}><boxGeometry args={[2.94, 0.43, 0.025]} /><meshStandardMaterial color="#654a2e" roughness={0.7} /></mesh>
    <Text position={[0, 2.02, 0.38]} fontSize={0.21} letterSpacing={0.16} color="#eddaaf" anchorX="center" anchorY="middle">WORKSHOP</Text>
    <Text position={[0, 1.84, 0.38]} fontSize={0.061} letterSpacing={0.05} color="#dbc39a" anchorX="center" anchorY="middle">SKILLS · TOOLS · SERVICES</Text>
    <Lantern pivotRef={refs.lantern} lightRef={refs.hangingLight} hovered={hovered} />
    <mesh position={[0, -1.52, 0.65]}><boxGeometry args={[2.8, 0.022, 0.012]} /><meshStandardMaterial color="#e2b45c" emissive="#c78a34" emissiveIntensity={hovered ? 0.8 : 0.16} /></mesh>
    <mesh position={[0, -1.47, -0.2]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[12, 8]} /><meshStandardMaterial color="#51493d" roughness={0.94} /></mesh>
  </>
}

export function WorkshopDoorCanvas(props) {
  return <Canvas shadows dpr={window.innerWidth < 700 ? [1, 1.15] : [1, 1.35]} camera={{ position: [0, 0.72, 7.8], fov: 36 }}><WorkshopScene {...props} /></Canvas>
}

export function WorkshopDoorFallback({ opening }) {
  return <div className={`workshop-door-fallback${opening ? ' is-opening' : ''}`} aria-hidden="true">
    <div className="workshop-door-fallback__sign"><b>WORKSHOP</b><small>SKILLS · TOOLS · SERVICES</small></div>
    <div className="workshop-door-fallback__room"><div className="workshop-door-fallback__pegboard">⌁　⚒　⌕　⌁</div><div className="workshop-door-fallback__bench" /></div>
    <div className="workshop-door-fallback__leaf"><i /><i /><b>◯</b></div>
  </div>
}
