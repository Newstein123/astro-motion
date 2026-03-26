import { ORBIT_RING_COLOR, ORBIT_RING_OPACITY } from '../lib/constants'

interface OrbitRingProps {
  radius: number
}

export function OrbitRing({ radius }: OrbitRingProps) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.02, radius + 0.02, 128]} />
      <meshBasicMaterial
        color={ORBIT_RING_COLOR}
        transparent
        opacity={ORBIT_RING_OPACITY}
        side={2}
      />
    </mesh>
  )
}
