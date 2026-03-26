import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import type { MoonData } from '../types/planet'
import { useSimulation } from '../lib/SimulationContext'

interface MoonProps {
  data: MoonData
}

export function Moon({ data }: MoonProps) {
  const meshRef = useRef<Mesh>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const { paused, speed } = useSimulation()

  useFrame((_, delta) => {
    if (!paused) {
      angleRef.current += data.orbitSpeed * delta * speed
    }
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angleRef.current) * data.orbitRadius
      meshRef.current.position.z = Math.sin(angleRef.current) * data.orbitRadius
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[data.size, 24, 24]} />
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={0.05}
        roughness={0.9}
      />
    </mesh>
  )
}
