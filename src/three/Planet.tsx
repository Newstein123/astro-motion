import { useRef, useState, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group, Mesh } from 'three'
import type { PlanetData } from '../types/planet'
import { getPlanetTexture, getSaturnRingTexture } from './textures'
import { Moon } from './Moon'
import { useSimulation } from '../lib/SimulationContext'

interface PlanetProps {
  data: PlanetData
  onSelect: (planet: PlanetData) => void
}

export function Planet({ data, onSelect }: PlanetProps) {
  const orbitRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const angleRef = useRef(Math.random() * Math.PI * 2)
  const [hovered, setHovered] = useState(false)
  const { paused, speed } = useSimulation()

  const texture = useMemo(() => getPlanetTexture(data.id), [data.id])
  const ringTexture = useMemo(() => data.hasRings ? getSaturnRingTexture() : null, [data.hasRings])

  useFrame((_, delta) => {
    if (!paused) {
      angleRef.current += data.orbitSpeed * delta * speed
    }
    if (orbitRef.current) {
      orbitRef.current.position.x = Math.cos(angleRef.current) * data.orbitRadius
      orbitRef.current.position.z = Math.sin(angleRef.current) * data.orbitRadius
    }
    if (meshRef.current && !paused) {
      meshRef.current.rotation.y += data.rotationSpeed * delta * speed
    }
  })

  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    onSelect(data)
  }, [data, onSelect])

  const handlePointerOver = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  const tilt = data.tilt ?? 0

  return (
    <group ref={orbitRef}>
        <group rotation={[tilt, 0, 0]}>
          <mesh
            ref={meshRef}
            onClick={handleClick}
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
          >
            <sphereGeometry args={[data.size, 64, 64]} />
            {texture ? (
              <meshStandardMaterial
                map={texture}
                emissive={new THREE.Color(data.color)}
                emissiveIntensity={hovered ? 0.5 : 0.08}
                roughness={0.8}
                metalness={0.1}
              />
            ) : (
              <meshStandardMaterial
                color={data.color}
                emissive={data.color}
                emissiveIntensity={hovered ? 0.6 : 0.1}
                roughness={0.7}
              />
            )}
          </mesh>

          {data.hasRings && ringTexture && (
            <mesh rotation={[-Math.PI / 2.2, 0, 0]}>
              <ringGeometry args={[data.size * 1.4, data.size * 2.8, 128]} />
              <meshStandardMaterial
                map={ringTexture}
                transparent
                opacity={0.85}
                side={THREE.DoubleSide}
                emissive={new THREE.Color(data.ringColor ?? '#c4a96a')}
                emissiveIntensity={hovered ? 0.3 : 0.05}
              />
            </mesh>
          )}

          {/* Moons */}
          {data.moonData?.map((moon) => (
            <Moon key={moon.name} data={moon} />
          ))}
        </group>
      </group>
  )
}
