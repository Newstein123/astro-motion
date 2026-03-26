import { Sun } from './Sun'
import { Planet } from './Planet'
import { OrbitRing } from './OrbitRing'
import { AsteroidBelt } from './AsteroidBelt'
import { Comets } from './Comets'
import { planets } from '../data/planets'
import type { PlanetData } from '../types/planet'

interface SolarSystemProps {
  onSelectPlanet: (planet: PlanetData) => void
}

export function SolarSystem({ onSelectPlanet }: SolarSystemProps) {
  return (
    <group>
      <Sun onSelect={onSelectPlanet} />
      {planets.map((planet) => (
        <group key={planet.id}>
          <OrbitRing radius={planet.orbitRadius} />
          <Planet data={planet} onSelect={onSelectPlanet} />
        </group>
      ))}
      <AsteroidBelt />
      <Comets />
    </group>
  )
}
