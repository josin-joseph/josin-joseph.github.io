import { Text } from '@react-three/drei'

export default function GarageInterior({ lightRef }) {
  return (
    <group>
      <mesh position={[0, 0.05, -0.88]} receiveShadow>
        <boxGeometry args={[3.35, 2.65, 0.16]} />
        <meshStandardMaterial color="#302920" roughness={0.95} />
      </mesh>
      <mesh position={[0, -1.31, -0.25]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.2, 2.7]} />
        <meshStandardMaterial color="#655c4e" roughness={0.92} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 1.1, 0.55]} color="#f5b65e" intensity={0.22} distance={7} decay={2} />
      {/* A workbench and tools sit in the darker back of the garage. */}
      <group position={[-0.92, -0.6, -0.34]}>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[1.2, 0.12, 0.42]} /><meshStandardMaterial color="#80603a" roughness={0.82} />
        </mesh>
        {[-0.49, 0.49].map((x) => <mesh key={x} position={[x, -0.1, 0]} castShadow>
          <boxGeometry args={[0.09, 0.62, 0.32]} /><meshStandardMaterial color="#51402c" roughness={0.88} />
        </mesh>)}
        <mesh position={[-0.22, 0.39, 0.03]} rotation={[0, 0, -0.14]}>
          <boxGeometry args={[0.28, 0.16, 0.04]} /><meshStandardMaterial color="#a47c45" metalness={0.55} roughness={0.4} />
        </mesh>
      </group>
      {/* A restrained vintage-car silhouette, partly hidden by the closed shutter. */}
      <group position={[0.52, -1.03, -0.11]}>
        <mesh position={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[1.54, 0.36, 0.64]} /><meshStandardMaterial color="#6b3326" metalness={0.32} roughness={0.48} />
        </mesh>
        <mesh position={[-0.02, 0.51, -0.015]} castShadow>
          <boxGeometry args={[0.82, 0.34, 0.52]} /><meshStandardMaterial color="#583025" metalness={0.2} roughness={0.48} />
        </mesh>
        <mesh position={[-0.02, 0.53, 0.255]}>
          <planeGeometry args={[0.62, 0.23]} /><meshStandardMaterial color="#826c50" metalness={0.22} roughness={0.5} />
        </mesh>
        {[-0.49, 0.49].map((x) => <group key={x} position={[x, 0, 0.02]}>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.19, 0.19, 0.13, 24]} /><meshStandardMaterial color="#241f1b" roughness={0.85} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.085, 0.085, 0.14, 20]} /><meshStandardMaterial color="#a47c45" metalness={0.76} roughness={0.35} />
          </mesh>
        </group>)}
        {[-0.58, 0.58].map((x) => <mesh key={`lamp-${x}`} position={[x, 0.28, 0.33]}>
          <sphereGeometry args={[0.075, 16, 16]} /><meshStandardMaterial color="#f2c879" emissive="#e99837" emissiveIntensity={0.4} />
        </mesh>)}
      </group>
      {/* Small work-order plates make the interior feel like a working space. */}
      {[
        { x: 1.06, y: 0.82, text: 'AI / ML' },
        { x: 1.06, y: 0.35, text: 'VISION' },
        { x: 1.06, y: -0.12, text: 'SEARCH' },
      ].map((plate) => <group key={plate.text} position={[plate.x, plate.y, -0.72]}>
        <mesh>
          <boxGeometry args={[0.62, 0.31, 0.035]} /><meshStandardMaterial color="#9a794a" metalness={0.38} roughness={0.58} />
        </mesh>
        <Text position={[0, 0, 0.022]} fontSize={0.095} color="#29231c" anchorX="center" anchorY="middle" letterSpacing={0.06}>{plate.text}</Text>
      </group>)}
    </group>
  )
}
