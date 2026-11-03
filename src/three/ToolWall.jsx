import { useState } from 'react'
import { Canvas } from '@react-three/fiber'

function ToolMark({ id, active }) {
  const metal = <meshStandardMaterial color={active ? '#e3bc78' : '#a18458'} metalness={0.66} roughness={0.4} emissive={active ? '#815322' : '#000000'} emissiveIntensity={0.35} />
  if (id === 'ml') return <group>
    <mesh><torusGeometry args={[0.25, 0.055, 8, 24]} />{metal}</mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.25, 0.055, 8, 24]} />{metal}</mesh>
    <mesh><sphereGeometry args={[0.1, 18, 12]} /><meshStandardMaterial color="#9e4e32" metalness={0.35} roughness={0.5} /></mesh>
  </group>
  if (id === 'data') return <group rotation={[0.2, 0.1, -0.3]}>
    <mesh><torusGeometry args={[0.23, 0.045, 8, 24]} />{metal}</mesh>
    <mesh position={[0.25, -0.25, 0]} rotation={[0, 0, -0.76]}><cylinderGeometry args={[0.045, 0.045, 0.42, 12]} />{metal}</mesh>
  </group>
  if (id === 'web') return <group>
    <mesh><boxGeometry args={[0.58, 0.37, 0.08]} />{metal}</mesh>
    <mesh position={[0, -0.24, 0]}><boxGeometry args={[0.72, 0.05, 0.08]} />{metal}</mesh>
  </group>
  return <group rotation={[0, 0, -0.45]}>
    <mesh><cylinderGeometry args={[0.06, 0.06, 0.62, 12]} />{metal}</mesh>
    <mesh position={[0, 0.27, 0]}><boxGeometry args={[0.34, 0.12, 0.12]} />{metal}</mesh>
  </group>
}

function WallHook({ item, index, activeId, onSelect }) {
  const x = (index - 1.5) * 1.72
  const active = item.id === activeId
  return <group position={[x, 0.12, 0.5]} onClick={(event) => { event.stopPropagation(); onSelect(item.id) }} onPointerOver={() => { document.body.style.cursor = 'pointer' }} onPointerOut={() => { document.body.style.cursor = '' }}>
    <mesh position={[0, -0.23, -0.02]}><boxGeometry args={[1.4, 1.3, 0.12]} /><meshStandardMaterial color={active ? '#6d5436' : '#4c3d2d'} roughness={0.83} /></mesh>
    <mesh position={[0, 0.68, 0]}><cylinderGeometry args={[0.035, 0.035, 0.42, 12]} /><meshStandardMaterial color="#b4935e" metalness={0.6} roughness={0.42} /></mesh>
    <group position={[0, 0.1 + (active ? 0.09 : 0), 0.18]}><ToolMark id={item.id} active={active} /></group>
    <mesh position={[0, -0.66, 0.08]}><boxGeometry args={[1.16, 0.26, 0.03]} /><meshStandardMaterial color="#c8b38e" roughness={0.8} /></mesh>
  </group>
}

function WallScene({ groups, activeId, onSelect }) {
  return <>
    <color attach="background" args={['#373027']} />
    <ambientLight intensity={0.65} color="#e7d8b9" />
    <directionalLight position={[-2, 4, 5]} intensity={1.1} color="#ffdca5" />
    <mesh position={[0, 0, -0.28]}><boxGeometry args={[8, 3.5, 0.2]} /><meshStandardMaterial color="#78583b" roughness={0.9} /></mesh>
    {Array.from({ length: 11 }, (_, i) => <mesh key={i} position={[-3.2 + i * 0.64, 0, -0.15]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.035, 0.012, 6, 12]} /><meshStandardMaterial color="#2d271e" roughness={0.9} /></mesh>)}
    {groups.map((item, index) => <WallHook key={item.id} item={item} index={index} activeId={activeId} onSelect={onSelect} />)}
  </>
}

export default function ToolWall({ groups, activeId, onSelect }) {
  const [webgl, setWebgl] = useState(() => {
    try { const canvas = document.createElement('canvas'); return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl')) }
    catch { return false }
  })
  return <section className="tool-wall" aria-label="Interactive workshop pegboard">
    {webgl
      ? <Canvas shadows dpr={[1, 1.25]} camera={{ position: [0, 1.5, 7.4], fov: 38 }} onError={() => setWebgl(false)}>
        <WallScene groups={groups} activeId={activeId} onSelect={onSelect} />
      </Canvas>
      : <div className="tool-wall__fallback" aria-hidden="true">{groups.map((group, index) => <span key={group.id} className={`tool-wall__fallback-mark tool-wall__fallback-mark--${index}`}>{['✿', '⌕', '▣', '⌁'][index]}<small>{group.name}</small></span>)}</div>}
  </section>
}
