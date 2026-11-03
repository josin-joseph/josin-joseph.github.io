import { useEffect, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

function Sign({ door, y = 1.88 }) {
  return <group position={[0, y, 0.2]}>
    <mesh><boxGeometry args={[2.75, 0.48, 0.13]} /><meshStandardMaterial color="#382b20" roughness={0.72} /></mesh>
    <mesh position={[0, 0, 0.075]}><boxGeometry args={[2.62, 0.37, 0.025]} /><meshStandardMaterial color="#694b30" roughness={0.68} /></mesh>
    <Text position={[0, 0.06, 0.1]} fontSize={0.19} letterSpacing={0.1} color="#f0d9a8" anchorX="center" anchorY="middle">{door.label.toUpperCase()}</Text>
    <Text position={[0, -0.12, 0.1]} fontSize={0.048} letterSpacing={0.025} color="#e2c99b" anchorX="center" anchorY="middle">{door.subtitle.toUpperCase()}</Text>
  </group>
}

function BrickFrame() {
  const blocks = []
  const tones = ['#755340', '#805d45', '#694a38']
  for (let row = 0; row < 5; row += 1) for (let col = 0; col < 7; col += 1) {
    const x = -2.7 + col * 0.86 + (row % 2 ? 0.35 : 0)
    const y = -1.26 + row * 0.48
    if (Math.abs(x) < 1.52 && y < 1.38 && y > -1.48) continue
    blocks.push({ x, y, tone: tones[(row + col) % tones.length] })
  }
  return <group>{blocks.map((block, i) => <mesh key={i} position={[block.x, block.y, -0.7]}><boxGeometry args={[0.81, 0.43, 0.12]} /><meshStandardMaterial color={block.tone} roughness={0.94} /></mesh>)}</group>
}

function GarageModel({ refs, door, active, opening }) {
  return <>
    <BrickFrame />
    {[-1.38, 1.38].map((x) => <mesh key={x} position={[x, 0, 0.28]}><boxGeometry args={[0.22, 3.05, 0.28]} /><meshStandardMaterial color="#a49a86" roughness={0.9} /></mesh>)}
    <mesh position={[0, 1.5, 0.28]}><boxGeometry args={[3, 0.2, 0.28]} /><meshStandardMaterial color="#b0a58f" roughness={0.9} /></mesh>
    <mesh position={[0, -1.49, 0.21]}><boxGeometry args={[2.7, 0.04, 0.05]} /><meshStandardMaterial color="#dcaa5e" emissive="#bc772d" emissiveIntensity={active ? 0.8 : 0.15} /></mesh>
    <group ref={refs.shutter} position={[0, -1.32, 0.18]}>
      {Array.from({ length: 15 }, (_, i) => <group key={i} position={[0, 0.07 + i * 0.17, 0]}>
        <RoundedBox args={[2.58, 0.15, 0.11]} radius={0.023} smoothness={2} castShadow><meshStandardMaterial color={i % 3 ? '#4f5a45' : '#59644d'} metalness={0.14} roughness={0.79} /></RoundedBox>
        <mesh position={[0, 0.052, 0.06]}><boxGeometry args={[2.5, 0.01, 0.01]} /><meshStandardMaterial color="#8b9076" metalness={0.25} roughness={0.65} /></mesh>
      </group>)}
      <group ref={refs.latch} position={[0, 0.1, 0.11]}>
        <mesh><boxGeometry args={[0.18, 0.17, 0.05]} /><meshStandardMaterial color="#ac8953" metalness={0.67} roughness={0.38} /></mesh>
        <mesh position={[0, -0.1, 0.04]}><torusGeometry args={[0.05, 0.012, 8, 18]} /><meshStandardMaterial color="#d0aa69" metalness={0.78} roughness={0.32} /></mesh>
      </group>
    </group>
    <Sign door={door} />
  </>
}

function StudioLeaf({ side, refs, active }) {
  const direction = side === 'left' ? 1 : -1
  const groupRef = side === 'left' ? refs.left : refs.right
  const handleRef = side === 'left' ? refs.leftHandle : refs.rightHandle
  return <group ref={groupRef} position={[side === 'left' ? -1.28 : 1.28, 0, 0.32]}>
    <group position={[direction * 0.63, 0, 0]}>
      <RoundedBox args={[1.22, 2.7, 0.13]} radius={0.02} smoothness={2} castShadow><meshStandardMaterial color="#443226" roughness={0.65} /></RoundedBox>
      <mesh position={[0, 0, 0.075]}><boxGeometry args={[1.07, 2.53, 0.02]} /><meshStandardMaterial color="#73543a" roughness={0.6} /></mesh>
      {[-0.48, 0.48].map((x) => <mesh key={x} position={[x, 0, 0.1]}><boxGeometry args={[0.025, 2.45, 0.02]} /><meshStandardMaterial color="#c29a5c" metalness={0.77} roughness={0.34} /></mesh>)}
      <group position={[0, 0.7, 0.12]}>{Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[0, 0.18, 0]} rotation={[0, 0, (i - 3) * 0.22]}><boxGeometry args={[0.02, 0.38, 0.015]} /><meshStandardMaterial color="#dbb775" metalness={0.75} roughness={0.35} /></mesh>)}
        <mesh><torusGeometry args={[0.13, 0.018, 8, 24]} /><meshStandardMaterial color="#d2aa67" metalness={0.82} roughness={0.3} /></mesh>
      </group>
      <group ref={handleRef} position={[direction * -0.14, -0.03, 0.18]}><mesh><sphereGeometry args={[0.055, 16, 10]} /><meshStandardMaterial color="#e0bd7b" metalness={0.83} roughness={0.25} /></mesh><mesh position={[0, -0.12, 0.03]}><torusGeometry args={[0.075, 0.016, 8, 18]} /><meshStandardMaterial color="#cca15e" metalness={0.8} roughness={0.31} /></mesh></group>
      {active && <mesh position={[0, 0, 0.1]}><planeGeometry args={[1, 2.45]} /><meshBasicMaterial color="#f2d38d" transparent opacity={0.025} /></mesh>}
    </group>
  </group>
}

function StudioModel({ refs, door, active }) {
  return <>
    {[[-1.44, 0, 0.18, 3], [1.44, 0, 0.18, 3], [0, 1.5, 3.05, 0.16], [0, -1.5, 3.05, 0.16]].map(([x, y, w, h], i) => <mesh key={i} position={[x, y, 0.42]}><boxGeometry args={[w, h, 0.055]} /><meshStandardMaterial color="#c29a5c" metalness={0.73} roughness={0.37} /></mesh>)}
    <StudioLeaf side="left" refs={refs} active={active} /><StudioLeaf side="right" refs={refs} active={active} />
    <Sign door={door} y={1.88} />
  </>
}

function WorkshopModel({ refs, door, active }) {
  const plankColors = ['#543b28', '#60442c', '#694b30', '#4c3625']
  return <>
    <mesh position={[0, 0, -0.72]}><boxGeometry args={[3.15, 3.18, 0.15]} /><meshStandardMaterial color="#59452f" roughness={0.95} /></mesh>
    <group ref={refs.door} position={[-1.25, 0, 0.34]}>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0.14 + i * 0.275, 0, 0]} castShadow><boxGeometry args={[0.26, 2.75, 0.15]} /><meshStandardMaterial color={plankColors[i % plankColors.length]} roughness={0.9} /></mesh>)}
      {[-0.79, 0.79].map((y) => <mesh key={y} position={[1.24, y, 0.1]}><boxGeometry args={[2.47, 0.13, 0.06]} /><meshStandardMaterial color="#35352e" metalness={0.66} roughness={0.55} /></mesh>)}
      <mesh position={[1.25, 0, 0.12]} rotation={[0, 0, -0.55]}><boxGeometry args={[0.13, 3, 0.06]} /><meshStandardMaterial color="#37362e" metalness={0.64} roughness={0.54} /></mesh>
      {[-1.02, -0.34, 0.34, 1.02].map((y) => <group key={y} position={[0.05, y, 0.14]}><mesh><boxGeometry args={[0.13, 0.22, 0.05]} /><meshStandardMaterial color="#b28c4e" metalness={0.75} roughness={0.35} /></mesh><mesh position={[0, 0, 0.05]}><cylinderGeometry args={[0.032, 0.032, 0.24, 10]} /><meshStandardMaterial color="#d0ac6c" metalness={0.82} roughness={0.3} /></mesh></group>)}
      <group ref={refs.handle} position={[2.33, -0.1, 0.18]}><mesh><sphereGeometry args={[0.055, 14, 10]} /><meshStandardMaterial color="#d5ae69" metalness={0.82} roughness={0.3} /></mesh><mesh position={[0, -0.12, 0.03]}><torusGeometry args={[0.11, 0.02, 8, 20]} /><meshStandardMaterial color="#d5ae69" metalness={0.82} roughness={0.3} /></mesh></group>
      <group ref={refs.latch} position={[2.34, -0.42, 0.17]}><mesh><boxGeometry args={[0.2, 0.055, 0.04]} /><meshStandardMaterial color="#c19b5d" metalness={0.78} roughness={0.32} /></mesh></group>
    </group>
    <Sign door={door} />
    {active && <mesh position={[0, -1.5, 0.45]}><boxGeometry args={[2.5, 0.022, 0.012]} /><meshStandardMaterial color="#f0c170" emissive="#d4933a" emissiveIntensity={0.6} /></mesh>}
  </>
}

function RailwayModel({ refs, door, active }) {
  return <>
    <mesh position={[0, 0, -0.68]}><boxGeometry args={[3.2, 3.18, 0.14]} /><meshStandardMaterial color="#614832" roughness={0.92} /></mesh>
    {[-1.42, 1.42].map((x) => <mesh key={x} position={[x, 0, 0.4]}><boxGeometry args={[0.16, 3, 0.3]} /><meshStandardMaterial color="#8a6440" roughness={0.84} /></mesh>)}
    <group ref={refs.panel} position={[0, 0, 0.3]}>
      <mesh position={[0, 1.05, 0]}><boxGeometry args={[2.72, 0.65, 0.16]} /><meshStandardMaterial color="#69482d" roughness={0.77} /></mesh>
      <mesh position={[0, -1.03, 0]}><boxGeometry args={[2.72, 0.7, 0.16]} /><meshStandardMaterial color="#60412a" roughness={0.8} /></mesh>
      {[-1.15, 1.15].map((x) => <mesh key={x} position={[x, 0.02, 0]}><boxGeometry args={[0.42, 1.58, 0.16]} /><meshStandardMaterial color="#705032" roughness={0.76} /></mesh>)}
      <mesh position={[0, 0.02, -0.25]}><planeGeometry args={[1.34, 1.43]} /><meshStandardMaterial color="#a8b993" emissive="#708260" emissiveIntensity={0.26} roughness={0.6} /></mesh>
      {[-0.69, 0.69].map((x) => <mesh key={x} position={[x, 0.02, 0.12]}><boxGeometry args={[0.1, 1.58, 0.07]} /><meshStandardMaterial color="#b89253" metalness={0.65} roughness={0.42} /></mesh>)}
      {[-0.76, 0.8].map((y) => <mesh key={y} position={[0, y, 0.12]}><boxGeometry args={[1.45, 0.1, 0.07]} /><meshStandardMaterial color="#b89253" metalness={0.65} roughness={0.42} /></mesh>)}
      <group ref={refs.handle} position={[0.93, -0.18, 0.18]}><mesh><boxGeometry args={[0.13, 0.16, 0.05]} /><meshStandardMaterial color="#b58f52" metalness={0.78} roughness={0.34} /></mesh></group>
      <group ref={refs.latch} position={[0.93, -0.42, 0.18]}><mesh><boxGeometry args={[0.18, 0.05, 0.04]} /><meshStandardMaterial color="#c59f60" metalness={0.78} roughness={0.34} /></mesh></group>
    </group>
    <mesh position={[0, -1.48, 0.51]}><boxGeometry args={[2.6, 0.045, 0.07]} /><meshStandardMaterial color="#c49b5a" metalness={0.76} roughness={0.36} /></mesh>
    <Sign door={door} />
    {active && <pointLight position={[0, 0, 0.45]} color="#ffce7d" intensity={0.45} distance={3.2} />}
  </>
}

function Interior({ id, refs, rate }) {
  useFrame((state) => {
    if (id === 'railway' && rate.current > 0 && refs.scenery.current) refs.scenery.current.position.x = Math.sin(state.clock.elapsedTime * rate.current) * 0.17
  })
  return <group position={[0, 0, -0.32]}>
    <mesh position={[0, 0, -0.56]}><planeGeometry args={[2.55, 2.65]} /><meshStandardMaterial color={id === 'studio' ? '#805b3d' : id === 'railway' ? '#9eaa84' : '#72563a'} roughness={0.92} /></mesh>
    {id === 'garage' && <group position={[0, -0.55, -0.1]}><mesh><boxGeometry args={[1.42, 0.34, 0.6]} /><meshStandardMaterial color="#78553b" roughness={0.65} /></mesh><mesh position={[0, 0.24, -0.02]}><boxGeometry args={[0.72, 0.3, 0.45]} /><meshStandardMaterial color="#b69666" roughness={0.6} /></mesh></group>}
    {id === 'studio' && <group position={[-0.55, -0.2, -0.08]}><mesh><boxGeometry args={[0.64, 0.92, 0.06]} /><meshStandardMaterial color="#bd965a" metalness={0.46} roughness={0.4} /></mesh><mesh position={[0, 0, 0.04]}><planeGeometry args={[0.52, 0.78]} /><meshStandardMaterial color="#d0b38a" roughness={0.8} /></mesh><mesh position={[0.85, -0.5, 0]}><boxGeometry args={[0.9, 0.1, 0.4]} /><meshStandardMaterial color="#68472e" roughness={0.7} /></mesh></group>}
    {id === 'workshop' && <group position={[0, -0.45, -0.06]}><mesh><boxGeometry args={[2, 0.12, 0.52]} /><meshStandardMaterial color="#825c38" roughness={0.78} /></mesh>{[-0.65, -0.1, 0.5, 0.85].map((x) => <mesh key={x} position={[x, 0.42, 0]}><cylinderGeometry args={[0.025, 0.025, 0.72, 8]} /><meshStandardMaterial color="#ddc99f" metalness={0.55} roughness={0.5} /></mesh>)}</group>}
    {id === 'railway' && <group ref={refs.scenery} position={[0, 0.28, -0.1]}><mesh position={[-0.5, 0, 0]} scale={[1.2, 0.55, 0.1]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#687958" roughness={0.9} /></mesh><mesh position={[0.7, -0.18, 0.02]} scale={[0.95, 0.38, 0.1]}><sphereGeometry args={[1, 16, 10]} /><meshStandardMaterial color="#8a7957" roughness={0.92} /></mesh></group>}
  </group>
}

export default function DoorSlot({ door, position, refs, hovered, openingId, dimmed }) {
  const { camera } = useThree()
  const [interiorMounted, setInteriorMounted] = useState(false)
  const opening = openingId === door.id
  const active = hovered || opening
  useEffect(() => { refs.camera.current = camera }, [camera, refs])
  useEffect(() => {
    if (active) { setInteriorMounted(true); return undefined }
    const timer = window.setTimeout(() => setInteriorMounted(false), 900)
    return () => window.clearTimeout(timer)
  }, [active])
  useFrame((_, delta) => {
    if (refs.lamp.current) refs.lamp.current.intensity = THREE.MathUtils.damp(refs.lamp.current.intensity, opening ? 1.15 : active ? 1.05 : dimmed ? 0.12 : 0.34, 5, delta)
    if (refs.interiorLight.current && !opening) refs.interiorLight.current.intensity = THREE.MathUtils.damp(refs.interiorLight.current.intensity, active ? 0.48 : 0.12, 4, delta)
    if (refs.spill.current && !opening) refs.spill.current.scale.x = THREE.MathUtils.damp(refs.spill.current.scale.x, active ? 0.22 : 0.05, 4, delta)
    if (door.id === 'railway' && refs.rate.current !== undefined && !opening) refs.rate.current = THREE.MathUtils.damp(refs.rate.current, active ? 1.35 : 0.35, 2, delta)
    if (door.id === 'workshop' && refs.door.current && !opening) refs.door.current.rotation.y = THREE.MathUtils.damp(refs.door.current.rotation.y, active ? -0.026 : 0, 4, delta)
    if (door.id === 'studio' && !opening) {
      if (refs.left.current) refs.left.current.rotation.y = THREE.MathUtils.damp(refs.left.current.rotation.y, active ? -0.026 : 0, 4, delta)
      if (refs.right.current) refs.right.current.rotation.y = THREE.MathUtils.damp(refs.right.current.rotation.y, active ? 0.026 : 0, 4, delta)
    }
    if (door.id === 'railway' && refs.panel.current && !opening) refs.panel.current.position.x = THREE.MathUtils.damp(refs.panel.current.position.x, active ? 0.025 : 0, 5, delta)
    if (door.id === 'garage' && refs.shutter.current && !opening) refs.shutter.current.rotation.z = THREE.MathUtils.damp(refs.shutter.current.rotation.z, active ? Math.sin(Date.now() * 0.02) * 0.002 : 0, 5, delta)
  })
  const content = door.id === 'garage'
    ? <GarageModel refs={refs} door={door} active={active} opening={opening} />
    : door.id === 'studio'
      ? <StudioModel refs={refs} door={door} active={active} />
      : door.id === 'workshop'
        ? <WorkshopModel refs={refs} door={door} active={active} />
        : <RailwayModel refs={refs} door={door} active={active} />
  return <group position={position}>
    {interiorMounted && <Interior id={door.id} refs={refs} rate={refs.rate} />}
    {content}
    <pointLight ref={refs.interiorLight} position={[0, 0.18, 0.78]} color="#ffd38b" intensity={0.18} distance={4} />
    <mesh ref={refs.spill} position={[0, -1.46, 0.36]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.055, 1.8]} /><meshBasicMaterial color="#ffdc9c" transparent opacity={0.1} side={THREE.DoubleSide} /></mesh>
    <pointLight ref={refs.lamp} position={[0, 1.25, 0.72]} color={door.accent} intensity={0.34} distance={4} />
  </group>
}
