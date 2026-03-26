import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSimulation } from '../lib/SimulationContext'

const ASTEROID_COUNT = 1500
const INNER_RADIUS = 25
const OUTER_RADIUS = 30
const BELT_HEIGHT = 1.2

export function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const { paused, speed } = useSimulation()

  const asteroids = useMemo(() => {
    const data: { angle: number; radius: number; y: number; speed: number; scale: number }[] = []
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = INNER_RADIUS + Math.random() * (OUTER_RADIUS - INNER_RADIUS)
      const y = (Math.random() - 0.5) * BELT_HEIGHT
      const s = 0.02 + Math.random() * 0.04
      const scale = 0.02 + Math.random() * 0.08
      data.push({ angle, radius, y, speed: s, scale })
    }
    return data
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    for (let i = 0; i < ASTEROID_COUNT; i++) {
      const a = asteroids[i]
      if (!paused) {
        a.angle += a.speed * delta * speed
      }
      dummy.position.set(
        Math.cos(a.angle) * a.radius,
        a.y,
        Math.sin(a.angle) * a.radius,
      )
      dummy.scale.setScalar(a.scale)
      dummy.rotation.set(a.angle * 3, a.angle * 2, 0)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ASTEROID_COUNT]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#8a7e6b"
        roughness={0.9}
        emissive="#8a7e6b"
        emissiveIntensity={0.05}
      />
    </instancedMesh>
  )
}
