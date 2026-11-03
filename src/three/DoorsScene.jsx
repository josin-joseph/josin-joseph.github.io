import { useMemo, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import DoorSlot from './DoorSlot.jsx'
import { doors } from '../data/doors.js'

export function createDoorRefs() {
  return Object.fromEntries(doors.map((door) => {
    const refs = Object.fromEntries([
      'camera', 'shutter', 'latch', 'interiorLight', 'lamp', 'left', 'right', 'leftHandle', 'rightHandle', 'door', 'handle', 'panel', 'spill', 'scenery',
    ].map((name) => [name, { current: null }]))
    refs.rate = { current: 0.35 }
    return [door.id, refs]
  }))
}

function CameraRig({ compact }) {
  const { camera, size } = useThree()
  useEffect(() => {
    if (compact) {
      camera.position.set(0, 0.1, 8.5)
      camera.fov = 48
    } else {
      camera.position.set(0, 0.1, 5.8)
      camera.fov = 38
    }
    camera.lookAt(0, 0.1, 0)
    camera.updateProjectionMatrix()
  }, [camera, compact, size.width])
  return null
}

function SceneContents({ hoveredId, openingId, refsById, compact }) {
  const { size } = useThree()
  const positions = useMemo(() => {
    if (compact) return {
      garage: [-1.28, 1.72, 0], studio: [1.28, 1.72, 0],
      workshop: [-1.28, -1.76, 0], railway: [1.28, -1.76, 0],
    }
    const viewHeight = 2 * 5.8 * Math.tan(THREE.MathUtils.degToRad(38 / 2))
    const viewWidth = viewHeight * size.width / size.height
    const spacing = THREE.MathUtils.clamp((viewWidth - 2.8) / 3, 2.05, 3.2)
    return Object.fromEntries(doors.map((door, index) => [door.id, [(index - 1.5) * spacing, 0, 0]]))
  }, [compact, size.height, size.width])
  return <>
    <color attach="background" args={['#302a22']} />
    <ambientLight intensity={0.56} color="#ead8b7" />
    <directionalLight position={[-3, 5, 7]} intensity={1.05} color="#f7e2bc" castShadow />
    {doors.map((door) => <DoorSlot key={door.id} door={door} position={positions[door.id]} refs={refsById[door.id]} hovered={hoveredId === door.id} openingId={openingId} dimmed={Boolean(hoveredId && hoveredId !== door.id) || Boolean(openingId && openingId !== door.id)} />)}
    <mesh position={[0, -3.28, -0.35]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[20, 8]} /><meshStandardMaterial color="#4c4438" roughness={0.94} /></mesh>
    <CameraRig compact={compact} />
  </>
}

export default function DoorsScene({ hoveredId, openingId, visible, refsById, compact }) {
  return <Canvas className="doors-shared-canvas" shadows dpr={window.innerWidth < 700 ? [1, 1.15] : [1, 1.35]} camera={{ position: [0, 0.1, 5.8], fov: 38 }} frameloop={visible ? 'always' : 'never'}>
    <SceneContents hoveredId={hoveredId} openingId={openingId} refsById={refsById} compact={compact} />
  </Canvas>
}
