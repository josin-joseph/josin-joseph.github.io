import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

function Easel() {
  const portrait = useTexture('/portrait.jpg')
  portrait.colorSpace = THREE.SRGBColorSpace
  return <group position={[-0.74, -0.28, -0.55]}>
    <mesh position={[0, 0.94, 0]} castShadow>
      <boxGeometry args={[0.88, 1.14, 0.075]} /><meshStandardMaterial color="#9b7445" metalness={0.48} roughness={0.43} />
    </mesh>
    <mesh position={[0, 0.94, 0.05]}>
      <planeGeometry args={[0.76, 1.01]} /><meshBasicMaterial map={portrait} toneMapped={false} />
    </mesh>
    {[-0.28, 0.28].map((x) => <mesh key={x} position={[x, -0.14, -0.06]} rotation={[0, 0, x < 0 ? -0.1 : 0.1]}>
      <boxGeometry args={[0.055, 1.58, 0.055]} /><meshStandardMaterial color="#543a29" roughness={0.78} />
    </mesh>)}
  </group>
}

function Typewriter() {
  return <group position={[0.78, -0.75, -0.15]}>
    <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[0.98, 0.4, 0.62]} /><meshStandardMaterial color="#30302b" metalness={0.45} roughness={0.5} /></mesh>
    <mesh position={[0, 0.56, -0.13]} rotation={[-0.3, 0, 0]}><boxGeometry args={[0.7, 0.04, 0.42]} /><meshStandardMaterial color="#d5c9ad" roughness={0.85} /></mesh>
    {Array.from({ length: 15 }, (_, i) => <mesh key={i} position={[-0.34 + (i % 5) * 0.17, 0.54, -0.28 + Math.floor(i / 5) * 0.15]}>
      <cylinderGeometry args={[0.034, 0.034, 0.018, 12]} /><meshStandardMaterial color="#bca87e" metalness={0.3} roughness={0.65} />
    </mesh>)}
  </group>
}

export default function StudioInterior({ lightRef, spillRef }) {
  return <group>
    <mesh position={[0, 0.05, -1.12]}>
      <planeGeometry args={[3.24, 3.1]} /><meshStandardMaterial color="#754d35" roughness={0.97} />
    </mesh>
    <mesh position={[0, -1.48, -0.1]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5.4, 3.4]} /><meshStandardMaterial color="#6b5942" roughness={0.88} />
    </mesh>
    <spotLight ref={lightRef} position={[0, 2.65, 0.1]} angle={0.48} penumbra={0.55} intensity={0.18} distance={7} color="#ffce82" castShadow />
    <Easel />
    <mesh position={[0.77, -0.95, -0.18]} castShadow>
      <boxGeometry args={[1.45, 0.14, 0.82]} /><meshStandardMaterial color="#5c3e2b" roughness={0.74} />
    </mesh>
    {[-0.48, 0.48].map((x) => <mesh key={x} position={[0.77 + x, -1.24, -0.18]}>
      <boxGeometry args={[0.07, 0.5, 0.07]} /><meshStandardMaterial color="#4a3426" roughness={0.77} />
    </mesh>)}
    <Typewriter />
    <mesh ref={spillRef} position={[0, -1.455, 0.36]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.06, 1.9]} /><meshBasicMaterial color="#ffdc9c" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  </group>
}
