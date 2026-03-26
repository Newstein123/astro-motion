import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Mesh } from 'three'
import { SUN_SIZE, SUN_COLOR, SUN_EMISSIVE_INTENSITY } from '../lib/constants'
import { sunData } from '../data/planets'
import type { PlanetData } from '../types/planet'

interface SunProps {
  onSelect: (planet: PlanetData) => void
}

export function Sun({ onSelect }: SunProps) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  const handleClick = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    onSelect(sunData)
  }, [onSelect])

  const handlePointerOver = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }, [])

  return (
    <>
      <pointLight position={[0, 0, 0]} intensity={300} color={SUN_COLOR} />
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[SUN_SIZE, 32, 32]} />
        <meshStandardMaterial
          color={SUN_COLOR}
          emissive={SUN_COLOR}
          emissiveIntensity={hovered ? SUN_EMISSIVE_INTENSITY * 1.3 : SUN_EMISSIVE_INTENSITY}
          toneMapped={false}
        />
      </mesh>
    </>
  )
}
