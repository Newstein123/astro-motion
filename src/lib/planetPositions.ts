// Shared mutable store for planet world positions — written by Planet, read by CameraController
const positions: Record<string, { x: number; z: number }> = {}

export function setPlanetPosition(id: string, x: number, z: number) {
  positions[id] = { x, z }
}

export function getPlanetPosition(id: string): { x: number; z: number } | undefined {
  return positions[id]
}
