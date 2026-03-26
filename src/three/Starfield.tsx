import { Stars } from '@react-three/drei'
import { STAR_COUNT } from '../lib/constants'

export function Starfield() {
  return (
    <Stars
      radius={200}
      depth={100}
      count={STAR_COUNT}
      factor={4}
      saturation={0}
      fade
      speed={0.5}
    />
  )
}
