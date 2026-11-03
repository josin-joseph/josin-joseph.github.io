import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import AboutPanel from '../components/AboutPanel.jsx'

function Hotspot({ position, kind, active, onSelect, onHover }) {
  const finish = (event) => { event.stopPropagation(); onSelect(kind.id) }
  const hover = (event, value) => { event.stopPropagation(); onHover(value ? kind.id : '') }
  const material = (color, emissive = '#000000') => <meshStandardMaterial color={color} roughness={0.58} metalness={0.28} emissive={emissive} emissiveIntensity={active ? 0.75 : 0.08} />
  return <group position={position} onClick={finish} onPointerOver={(event) => hover(event, true)} onPointerOut={(event) => hover(event, false)}>
    {kind.id === 'typewriter' && <>
      <mesh position={[0, 0.19, 0]} castShadow><boxGeometry args={[0.58, 0.3, 0.4]} />{material('#33312c', '#b58c4e')}</mesh>
      <mesh position={[0, 0.39, -0.08]} rotation={[-0.3, 0, 0]}><boxGeometry args={[0.45, 0.035, 0.26]} />{material('#e1d5bd')}</mesh>
      {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[-0.18 + (i % 3) * 0.18, 0.38, -0.16 + Math.floor(i / 3) * 0.12]}><cylinderGeometry args={[0.028, 0.028, 0.015, 12]} />{material('#c4a267')}</mesh>)}
    </>}
    {kind.id === 'lamp' && <>
      <mesh position={[0, 0.38, 0]}><cylinderGeometry args={[0.035, 0.045, 0.72, 16]} />{material('#443322')}</mesh>
      <mesh position={[0, 0.78, 0]}><sphereGeometry args={[0.12, 16, 12]} />{material('#f2c574', '#ffb640')}</mesh>
      <mesh position={[0, 0.91, 0]}><coneGeometry args={[0.23, 0.21, 20, 1, true]} />{material('#493725')}</mesh>
      <pointLight position={[0, 0.7, 0.08]} color="#ffc56b" intensity={active ? 1.2 : 0.24} distance={2.8} />
    </>}
    {kind.id === 'easel' && <>
      <mesh position={[0, 0.45, 0]}><boxGeometry args={[0.48, 0.54, 0.07]} />{material('#b18b54')}</mesh>
      <mesh position={[0, 0.45, 0.05]}><planeGeometry args={[0.38, 0.44]} />{material('#b39a76', active ? '#d9ac63' : '#000000')}</mesh>
      {[-0.16, 0.16].map((x) => <mesh key={x} position={[x, -0.08, -0.02]} rotation={[0, 0, x < 0 ? -0.1 : 0.1]}><boxGeometry args={[0.035, 0.78, 0.035]} />{material('#65462e')}</mesh>)}
    </>}
    <mesh position={[0, -0.12, 0]}><cylinderGeometry args={[0.28, 0.31, 0.08, 32]} />{material(active ? '#c59a58' : '#725338')}</mesh>
  </group>
}

function DeskScene({ hotspots, active, setActive, setHovered }) {
  return <>
    <color attach="background" args={['#3a3027']} />
    <ambientLight intensity={0.75} color="#e7d1ad" />
    <directionalLight position={[-3, 5, 4]} intensity={1.15} color="#ffe0ae" castShadow />
    <mesh position={[0, -0.18, 0]} castShadow receiveShadow><boxGeometry args={[5.6, 0.28, 2.3]} /><meshStandardMaterial color="#704c32" roughness={0.7} /></mesh>
    {hotspots.map((kind, i) => <Hotspot key={kind.id} kind={kind} position={[-1.65 + i * 1.65, 0.15, 0]} active={active === kind.id} onSelect={setActive} onHover={setHovered} />)}
  </>
}

export default function StudioDesk({ hotspots }) {
  const [activeId, setActiveId] = useState('')
  const [hoveredId, setHoveredId] = useState('')
  const active = hotspots.find((item) => item.id === activeId || item.id === hoveredId)
  const [webgl, setWebgl] = useState(() => {
    try { return Boolean(document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl')) }
    catch { return false }
  })
  return <section className="studio-desk" aria-labelledby="studio-desk-title">
    <div className="studio-desk__heading"><p className="eyebrow">A LITTLE ROOM TO EXPLORE</p><h2 id="studio-desk-title">Notes from the desk.</h2><p>The objects are a second way into the same story. The written sections above remain complete on their own.</p></div>
    <div className="studio-desk__scene">
      {webgl
        ? <Canvas shadows dpr={[1, 1.25]} camera={{ position: [0, 2.6, 6.2], fov: 38 }} onError={() => setWebgl(false)}><DeskScene hotspots={hotspots} active={activeId || hoveredId} setActive={setActiveId} setHovered={setHoveredId} /></Canvas>
        : <div className="studio-desk__poster"><img src="/portrait.jpg" alt="Josin Joseph seated in a leather armchair" /><span>JOSIN JOSEPH · STUDIO PORTRAIT</span></div>}
      <div className="studio-desk__controls" role="group" aria-label="Studio desk story notes">
        {hotspots.map((item) => <button key={item.id} type="button" aria-pressed={activeId === item.id} onFocus={() => setHoveredId(item.id)} onBlur={() => setHoveredId('')} onClick={() => setActiveId(activeId === item.id ? '' : item.id)}>{item.label}</button>)}
      </div>
    </div>
    <AboutPanel panel={active} />
  </section>
}
