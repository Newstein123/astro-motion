export interface MoonData {
  name: string
  size: number
  orbitRadius: number
  orbitSpeed: number
  color: string
}

export interface PlanetData {
  id: string
  name: string
  description: string
  type: string
  distanceFromSun: string
  diameter: string
  orbitalPeriod: string
  gravity: string
  moons: number
  temperature: string
  funFact: string
  orbitRadius: number
  size: number
  orbitSpeed: number
  rotationSpeed: number
  color: string
  hasRings?: boolean
  ringColor?: string
  tilt?: number
  moonData?: MoonData[]
}
