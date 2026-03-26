import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSimulation } from '../lib/SimulationContext'

const COMET_COUNT = 5
const TAIL_SEGMENTS = 80

interface CometData {
  angle: number
  speed: number
  semiMajor: number
  semiMinor: number
  tiltX: number
  tiltZ: number
  yOffset: number
  hue: number
  size: number
}

function createComet(i: number): CometData {
  // Deterministic pseudo-random per comet
  const s = (n: number) => ((Math.sin(i * 127.1 + n * 311.7) * 43758.5453) % 1 + 1) % 1

  return {
    angle: s(0) * Math.PI * 2,
    speed: 0.12 + s(1) * 0.2,
    semiMajor: 35 + s(2) * 40,
    semiMinor: 12 + s(3) * 18,
    tiltX: (s(4) - 0.5) * 0.6,
    tiltZ: (s(5) - 0.5) * 0.4,
    yOffset: (s(6) - 0.5) * 4,
    hue: s(7),
    size: 0.1 + s(8) * 0.1,
  }
}

function Comet({ data }: { data: CometData }) {
  const groupRef = useRef<THREE.Group>(null)
  const headRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const tailLineRef = useRef<THREE.Line>(null)
  const angleRef = useRef(data.angle)
  const { paused, speed } = useSimulation()

  const headColor = useMemo(() => new THREE.Color().setHSL(data.hue, 0.15, 0.95), [data.hue])
  const tailColor = useMemo(() => new THREE.Color().setHSL(data.hue, 0.4, 0.75), [data.hue])
  const glowColor = useMemo(() => new THREE.Color().setHSL(data.hue, 0.3, 0.85), [data.hue])

  const tailGeometry = useMemo(() => {
    const points = Array.from({ length: TAIL_SEGMENTS }, () => new THREE.Vector3())
    const geo = new THREE.BufferGeometry().setFromPoints(points)

    // Per-vertex color: bright at head, fading to transparent
    const colors = new Float32Array(TAIL_SEGMENTS * 3)
    for (let i = 0; i < TAIL_SEGMENTS; i++) {
      const t = 1 - i / TAIL_SEGMENTS
      const fade = t * t // quadratic falloff
      colors[i * 3] = tailColor.r * fade
      colors[i * 3 + 1] = tailColor.g * fade
      colors[i * 3 + 2] = tailColor.b * fade
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [tailColor])

  const tailMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  }, [])

  const getPos = (angle: number): THREE.Vector3 => {
    const x = Math.cos(angle) * data.semiMajor
    const z = Math.sin(angle) * data.semiMinor
    const y = data.yOffset + Math.sin(angle * 0.5) * 2
    return new THREE.Vector3(x, y, z)
  }

  useFrame((state, delta) => {
    if (!paused) {
      // Kepler-like: faster near perihelion
      const r = data.semiMajor * (1 - 0.5 * Math.cos(angleRef.current))
      const angularSpeed = data.speed * (data.semiMajor / r) ** 1.5
      angleRef.current += angularSpeed * delta * speed
    }

    const headPos = getPos(angleRef.current)

    if (headRef.current) {
      headRef.current.position.copy(headPos)
    }

    // Glow follows head, always faces camera
    if (glowRef.current) {
      glowRef.current.position.copy(headPos)
      glowRef.current.lookAt(state.camera.position)
      // Subtle pulse
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + data.angle) * 0.15
      const s = data.size * 4 * pulse
      glowRef.current.scale.set(s, s, s)
    }

    // Update tail positions
    const positions = tailGeometry.attributes.position
    for (let i = 0; i < TAIL_SEGMENTS; i++) {
      const trailAngle = angleRef.current - i * 0.008
      const p = getPos(trailAngle)
      positions.setXYZ(i, p.x, p.y, p.z)
    }
    positions.needsUpdate = true
  })

  // Create a soft glow texture
  const glowTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    gradient.addColorStop(0, 'rgba(255,255,255,1)')
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.6)')
    gradient.addColorStop(0.5, 'rgba(255,255,255,0.15)')
    gradient.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 64, 64)
    const tex = new THREE.CanvasTexture(canvas)
    return tex
  }, [])

  return (
    <group ref={groupRef} rotation={[data.tiltX, 0, data.tiltZ]}>
      {/* Comet head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[data.size, 12, 12]} />
        <meshBasicMaterial color={headColor} toneMapped={false} />
      </mesh>

      {/* Soft glow sprite around head */}
      <mesh ref={glowRef}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTexture}
          color={glowColor}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Tail line */}
      <primitive ref={tailLineRef} object={new THREE.Line(tailGeometry, tailMaterial)} />
    </group>
  )
}

export function Comets() {
  const comets = useMemo(() =>
    Array.from({ length: COMET_COUNT }, (_, i) => createComet(i)),
    []
  )

  return (
    <group>
      {comets.map((data, i) => (
        <Comet key={i} data={data} />
      ))}
    </group>
  )
}
