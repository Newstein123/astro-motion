import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { SUN_SIZE, SUN_COLOR, SUN_EMISSIVE_INTENSITY } from '../lib/constants'

export function Sun() {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={300} color={SUN_COLOR} />
      <mesh ref={meshRef}>
        <sphereGeometry args={[SUN_SIZE, 32, 32]} />
        <meshStandardMaterial
          color={SUN_COLOR}
          emissive={SUN_COLOR}
          emissiveIntensity={SUN_EMISSIVE_INTENSITY}
          toneMapped={false}
        />
      </mesh>
    </>
  )
}
