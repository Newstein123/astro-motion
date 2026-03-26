import * as THREE from 'three'

type TextureConfig = {
  baseColor: [number, number, number]
  layers: Array<{
    color: [number, number, number]
    scale: number
    opacity: number
    type: 'noise' | 'bands' | 'spots' | 'clouds'
  }>
}

const textureConfigs: Record<string, TextureConfig> = {
  mercury: {
    baseColor: [140, 115, 95],
    layers: [
      { color: [120, 100, 80], scale: 8, opacity: 0.5, type: 'noise' },
      { color: [90, 75, 60], scale: 20, opacity: 0.3, type: 'spots' },
    ],
  },
  venus: {
    baseColor: [220, 195, 150],
    layers: [
      { color: [200, 170, 110], scale: 4, opacity: 0.4, type: 'clouds' },
      { color: [235, 210, 170], scale: 6, opacity: 0.3, type: 'bands' },
    ],
  },
  earth: {
    baseColor: [30, 60, 140],
    layers: [
      { color: [40, 120, 50], scale: 6, opacity: 0.6, type: 'noise' },
      { color: [35, 100, 45], scale: 10, opacity: 0.4, type: 'spots' },
      { color: [220, 220, 240], scale: 5, opacity: 0.25, type: 'clouds' },
    ],
  },
  mars: {
    baseColor: [180, 70, 20],
    layers: [
      { color: [150, 55, 15], scale: 8, opacity: 0.4, type: 'noise' },
      { color: [200, 130, 80], scale: 12, opacity: 0.3, type: 'spots' },
      { color: [220, 200, 180], scale: 3, opacity: 0.15, type: 'bands' },
    ],
  },
  jupiter: {
    baseColor: [190, 140, 80],
    layers: [
      { color: [160, 100, 50], scale: 2, opacity: 0.6, type: 'bands' },
      { color: [210, 170, 110], scale: 3, opacity: 0.4, type: 'bands' },
      { color: [180, 60, 30], scale: 15, opacity: 0.5, type: 'spots' },
    ],
  },
  saturn: {
    baseColor: [220, 200, 150],
    layers: [
      { color: [200, 180, 120], scale: 2, opacity: 0.5, type: 'bands' },
      { color: [235, 215, 170], scale: 3, opacity: 0.3, type: 'bands' },
    ],
  },
  uranus: {
    baseColor: [130, 200, 210],
    layers: [
      { color: [100, 180, 190], scale: 3, opacity: 0.3, type: 'bands' },
      { color: [150, 220, 220], scale: 5, opacity: 0.2, type: 'clouds' },
    ],
  },
  neptune: {
    baseColor: [50, 80, 220],
    layers: [
      { color: [30, 60, 180], scale: 3, opacity: 0.5, type: 'bands' },
      { color: [70, 110, 240], scale: 4, opacity: 0.3, type: 'bands' },
      { color: [100, 140, 255], scale: 8, opacity: 0.3, type: 'spots' },
    ],
  },
}

function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function generateTexture(config: TextureConfig, size: number = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size / 2
  const ctx = canvas.getContext('2d')!

  // Fill base color
  const [br, bg, bb] = config.baseColor
  ctx.fillStyle = `rgb(${br},${bg},${bb})`
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  for (const layer of config.layers) {
    const [lr, lg, lb] = layer.color

    if (layer.type === 'bands') {
      const bandCount = layer.scale
      const bandHeight = canvas.height / bandCount
      for (let i = 0; i < bandCount; i++) {
        const alpha = layer.opacity * (i % 2 === 0 ? 1 : 0.5)
        ctx.fillStyle = `rgba(${lr},${lg},${lb},${alpha})`
        ctx.fillRect(0, i * bandHeight, canvas.width, bandHeight * 0.6)
      }
    }

    if (layer.type === 'noise') {
      const rand = seededRandom(lr * 1000 + lg * 100 + lb)
      const cellSize = Math.max(2, Math.floor(size / (layer.scale * 8)))
      for (let x = 0; x < canvas.width; x += cellSize) {
        for (let y = 0; y < canvas.height; y += cellSize) {
          if (rand() > 0.5) {
            const variation = Math.floor(rand() * 40) - 20
            ctx.fillStyle = `rgba(${lr + variation},${lg + variation},${lb + variation},${layer.opacity * rand()})`
            ctx.fillRect(x, y, cellSize, cellSize)
          }
        }
      }
    }

    if (layer.type === 'spots') {
      const rand = seededRandom(lr * 100 + lg * 10 + lb)
      const count = layer.scale
      for (let i = 0; i < count; i++) {
        const x = rand() * canvas.width
        const y = rand() * canvas.height
        const r = rand() * (size / 10) + size / 30
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        gradient.addColorStop(0, `rgba(${lr},${lg},${lb},${layer.opacity})`)
        gradient.addColorStop(1, `rgba(${lr},${lg},${lb},0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    if (layer.type === 'clouds') {
      const rand = seededRandom(lr + lg * 256 + lb * 65536)
      const count = layer.scale * 6
      for (let i = 0; i < count; i++) {
        const x = rand() * canvas.width
        const y = rand() * canvas.height
        const r = rand() * (size / 6) + size / 12
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
        gradient.addColorStop(0, `rgba(${lr},${lg},${lb},${layer.opacity * 0.6})`)
        gradient.addColorStop(0.5, `rgba(${lr},${lg},${lb},${layer.opacity * 0.3})`)
        gradient.addColorStop(1, `rgba(${lr},${lg},${lb},0)`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.ellipse(x, y, r * 1.5, r * 0.6, rand() * Math.PI, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping
  return texture
}

const textureCache = new Map<string, THREE.CanvasTexture>()

export function getPlanetTexture(planetId: string): THREE.CanvasTexture | null {
  if (textureCache.has(planetId)) {
    return textureCache.get(planetId)!
  }

  const config = textureConfigs[planetId]
  if (!config) return null

  const texture = generateTexture(config)
  textureCache.set(planetId, texture)
  return texture
}

export function getSaturnRingTexture(): THREE.CanvasTexture {
  if (textureCache.has('saturn-ring')) {
    return textureCache.get('saturn-ring')!
  }

  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 64
  const ctx = canvas.getContext('2d')!

  // Create ring bands with gaps
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
  gradient.addColorStop(0, 'rgba(180, 160, 100, 0)')
  gradient.addColorStop(0.1, 'rgba(200, 180, 120, 0.8)')
  gradient.addColorStop(0.2, 'rgba(210, 190, 140, 0.9)')
  gradient.addColorStop(0.3, 'rgba(180, 160, 100, 0.3)')  // Cassini division
  gradient.addColorStop(0.35, 'rgba(180, 160, 100, 0.1)')
  gradient.addColorStop(0.4, 'rgba(220, 200, 150, 0.85)')
  gradient.addColorStop(0.6, 'rgba(210, 190, 130, 0.7)')
  gradient.addColorStop(0.75, 'rgba(195, 175, 115, 0.5)')
  gradient.addColorStop(0.9, 'rgba(180, 160, 100, 0.2)')
  gradient.addColorStop(1, 'rgba(180, 160, 100, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Add some noise for realism
  const rand = seededRandom(42)
  for (let x = 0; x < canvas.width; x += 2) {
    for (let y = 0; y < canvas.height; y += 2) {
      if (rand() > 0.7) {
        const brightness = Math.floor(rand() * 30)
        ctx.fillStyle = `rgba(${200 + brightness},${180 + brightness},${130 + brightness},${rand() * 0.15})`
        ctx.fillRect(x, y, 2, 2)
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.RepeatWrapping
  textureCache.set('saturn-ring', texture)
  return texture
}
