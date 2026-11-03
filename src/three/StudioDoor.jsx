import { useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'
import StudioInterior from './StudioInterior.jsx'

const brass = '#c59a58'

function Leaf({ side, groupRef, handleRef, hovered, opening }) {
  const direction = side === 'left' ? 1 : -1
  return <group ref={groupRef} position={[side === 'left' ? -1.31 : 1.31, 0, 0.3]}>
    <group position={[direction * 0.65, 0, 0]}>
      <RoundedBox args={[1.27, 2.72, 0.13]} radius={0.025} smoothness={2} castShadow>
        <meshStandardMaterial color="#403126" roughness={0.66} metalness={0.13} />
      </RoundedBox>
      <mesh position={[0, 0, 0.071]}>
        <boxGeometry args={[1.12, 2.55, 0.025]} /><meshStandardMaterial color="#735338" roughness={0.58} />
      </mesh>
      {[-0.51, 0.51].map((x) => <mesh key={x} position={[x, 0, 0.09]}>
        <boxGeometry args={[0.035, 2.52, 0.018]} /><meshStandardMaterial color={brass} metalness={0.76} roughness={0.34} />
      </mesh>)}
      {[-1.2, 1.2].map((y) => <mesh key={y} position={[0, y, 0.09]}>
        <boxGeometry args={[1.06, 0.035, 0.018]} /><meshStandardMaterial color={brass} metalness={0.76} roughness={0.34} />
      </mesh>)}
      <group position={[0, 0.73, 0.12]}>
        {Array.from({ length: 9 }, (_, i) => <mesh key={i} position={[0, 0.23, 0]} rotation={[0, 0, (i - 4) * 0.19]}>
          <boxGeometry args={[0.025, 0.45, 0.018]} /><meshStandardMaterial color="#d2ac6b" metalness={0.72} roughness={0.36} />
        </mesh>)}
        <mesh><torusGeometry args={[0.15, 0.018, 8, 32]} /><meshStandardMaterial color={brass} metalness={0.82} roughness={0.3} /></mesh>
        <mesh position={[0, 0, 0.01]}><circleGeometry args={[0.09, 32]} /><meshStandardMaterial color="#d1ad70" metalness={0.62} roughness={0.42} /></mesh>
      </group>
      <mesh position={[direction * -0.12, -0.03, 0.15]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 0.28, 16]} /><meshStandardMaterial color={brass} metalness={0.78} roughness={0.3} />
      </mesh>
      <group ref={handleRef} position={[direction * -0.13, -0.04, 0.2]}>
        <mesh><sphereGeometry args={[0.07, 18, 12]} /><meshStandardMaterial color="#e2bd7b" metalness={0.8} roughness={0.24} /></mesh>
        <mesh position={[0, -0.14, 0]}><torusGeometry args={[0.09, 0.018, 8, 20]} /><meshStandardMaterial color={brass} metalness={0.82} roughness={0.3} /></mesh>
      </group>
      {hovered && !opening && <mesh position={[0, 0, 0.105]}>
        <planeGeometry args={[1.08, 2.5]} /><meshBasicMaterial color="#f6d08a" transparent opacity={0.025} />
      </mesh>}
    </group>
  </group>
}

function WallLamp({ position, hovered }) {
  return <group position={position}>
    <mesh><sphereGeometry args={[0.1, 18, 12]} /><meshStandardMaterial color="#f5d38d" emissive="#ffb845" emissiveIntensity={hovered ? 1.9 : 0.55} roughness={0.25} /></mesh>
    <mesh position={[0, -0.13, -0.02]} rotation={[0.28, 0, 0]}><cylinderGeometry args={[0.12, 0.23, 0.16, 20, 1, true]} /><meshStandardMaterial color="#3b3023" metalness={0.46} roughness={0.45} side={THREE.DoubleSide} /></mesh>
    <pointLight position={[0, 0, 0.08]} color="#ffc778" intensity={hovered ? 1.2 : 0.3} distance={2.8} />
  </group>
}

function StudioDoorScene({ refs, hovered, opening, setHovered }) {
  const { camera } = useThree()
  useEffect(() => {
    camera.lookAt(0, 0.45, 0)
    refs.camera.current = camera
  }, [camera, refs])
  useFrame((_, delta) => {
    if (!opening) {
      if (refs.left.current) refs.left.current.rotation.y = THREE.MathUtils.damp(refs.left.current.rotation.y, hovered ? -0.035 : 0, 5, delta)
      if (refs.right.current) refs.right.current.rotation.y = THREE.MathUtils.damp(refs.right.current.rotation.y, hovered ? 0.035 : 0, 5, delta)
    }
    if (refs.spill.current) refs.spill.current.scale.x = THREE.MathUtils.damp(refs.spill.current.scale.x, opening ? 1 : hovered ? 0.28 : 0.08, 5, delta)
  })
  return <>
    <color attach="background" args={['#302820']} />
    <ambientLight intensity={0.53} color="#f2dfbf" />
    <directionalLight position={[-3, 4, 5]} intensity={1.05} color="#ffe5bc" castShadow />
    <mesh position={[0, 0.32, -0.85]} receiveShadow><boxGeometry args={[5.8, 4.8, 0.2]} /><meshStandardMaterial color="#554031" roughness={0.94} /></mesh>
    <StudioInterior lightRef={refs.interiorLight} spillRef={refs.spill} />
    {/* Stepped deco frame */}
    {[
      [0, 1.58, 3.3, 0.13], [0, -1.58, 3.3, 0.13],
      [-1.64, 0, 0.13, 3.26], [1.64, 0, 0.13, 3.26],
      [0, 1.48, 3.12, 0.045], [0, -1.48, 3.12, 0.045],
      [-1.53, 0, 0.045, 2.96], [1.53, 0, 0.045, 2.96],
    ].map(([x, y, w, h], i) => <mesh key={i} position={[x, y, 0.48]}><boxGeometry args={[w, h, 0.06]} /><meshStandardMaterial color={i < 4 ? '#c7a163' : '#eed39b'} metalness={0.72} roughness={0.38} /></mesh>)}
    <Leaf side="left" groupRef={refs.left} handleRef={refs.leftHandle} hovered={hovered} opening={opening} />
    <Leaf side="right" groupRef={refs.right} handleRef={refs.rightHandle} hovered={hovered} opening={opening} />
    <mesh position={[0, 1.88, 0.25]} castShadow><boxGeometry args={[2.85, 0.55, 0.16]} /><meshStandardMaterial color="#392b20" roughness={0.7} /></mesh>
    <mesh position={[0, 1.88, 0.34]}><boxGeometry args={[2.7, 0.42, 0.025]} /><meshStandardMaterial color="#785435" roughness={0.63} /></mesh>
    <Text position={[0, 1.97, 0.37]} fontSize={0.23} letterSpacing={0.22} color="#f1d9a4" anchorX="center" anchorY="middle">STUDIO</Text>
    <Text position={[0, 1.79, 0.37]} fontSize={0.065} letterSpacing={0.07} color="#e5cda0" anchorX="center" anchorY="middle">ABOUT · VALUES · STORY</Text>
    <WallLamp position={[-1.83, 1.32, 0.42]} hovered={hovered} />
    <WallLamp position={[1.83, 1.32, 0.42]} hovered={hovered} />
    <mesh position={[0, -1.55, 0.63]}><boxGeometry args={[0.04, 0.012, 0.02]} /><meshStandardMaterial color="#ffe1a3" emissive="#ffa72f" emissiveIntensity={hovered ? 1.4 : 0.24} /></mesh>
    <mesh position={[0, -1.51, -0.15]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[10, 8]} /><meshStandardMaterial color="#594d3e" roughness={0.93} /></mesh>
  </>
}

export function StudioDoorCanvas(props) {
  return <Canvas shadows dpr={window.innerWidth < 700 ? [1, 1.2] : [1, 1.4]} camera={{ position: [0, 0.75, 7.2], fov: 37 }}>
    <StudioDoorScene {...props} />
  </Canvas>
}

export function StudioDoorFallback({ opening }) {
  return <div className={`studio-fallback${opening ? ' is-opening' : ''}`} aria-hidden="true">
    <div className="studio-fallback__sign"><b>STUDIO</b><small>ABOUT · VALUES · STORY</small></div>
    <div className="studio-fallback__frame"><div className="studio-fallback__inside"><img src="/portrait.jpg" alt="" /><span>JOSIN JOSEPH</span></div><div className="studio-fallback__leaf studio-fallback__leaf--left"><i>✷</i></div><div className="studio-fallback__leaf studio-fallback__leaf--right"><i>✷</i></div></div>
  </div>
}
