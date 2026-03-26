import { Starfield } from './Starfield'
import { SolarSystem } from './SolarSystem'
import { CameraController } from './CameraController'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import type { PlanetData } from '../types/planet'

interface SceneProps {
  onSelectPlanet: (planet: PlanetData) => void
  selectedPlanet: PlanetData | null
}

export function Scene({ onSelectPlanet, selectedPlanet }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.15} />
      <Starfield />
      <SolarSystem onSelectPlanet={onSelectPlanet} />
      <CameraController selectedPlanet={selectedPlanet} />
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}
