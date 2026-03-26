import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import type { PlanetData } from '../types/planet'
import { useSimulation } from '../lib/SimulationContext'
import {
  CAMERA_INITIAL_POSITION,
  CAMERA_MIN_DISTANCE,
  CAMERA_MAX_DISTANCE,
  PARALLAX_STRENGTH,
  PARALLAX_LERP_FACTOR,
  ZOOM_LERP_FACTOR,
  FOCUS_LERP_FACTOR,
} from '../lib/constants'

interface CameraControllerProps {
  selectedPlanet: PlanetData | null
}

export function CameraController({ selectedPlanet }: CameraControllerProps) {
  const { camera, gl } = useThree()
  const targetPosition = useRef(new THREE.Vector3(...CAMERA_INITIAL_POSITION))
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))
  const mouseRef = useRef({ x: 0, y: 0 })
  const zoomRef = useRef(1)
  const planetAngleRef = useRef(0)
  const { paused, speed } = useSimulation()

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      zoomRef.current = THREE.MathUtils.clamp(
        zoomRef.current + e.deltaY * 0.001,
        CAMERA_MIN_DISTANCE / 60,
        CAMERA_MAX_DISTANCE / 60,
      )
    }

    const domElement = gl.domElement
    window.addEventListener('mousemove', handleMouseMove)
    domElement.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      domElement.removeEventListener('wheel', handleWheel)
    }
  }, [gl])

  useFrame((_, delta) => {
    if (selectedPlanet) {
      if (!paused) {
        planetAngleRef.current += selectedPlanet.orbitSpeed * delta * speed
      }
      const px = Math.cos(planetAngleRef.current) * selectedPlanet.orbitRadius
      const pz = Math.sin(planetAngleRef.current) * selectedPlanet.orbitRadius

      targetLookAt.current.set(px, 0, pz)
      targetPosition.current.set(
        px + 8,
        5 + selectedPlanet.size * 2,
        pz + 8,
      )
    } else {
      const basePos = CAMERA_INITIAL_POSITION
      targetPosition.current.set(
        basePos[0] + mouseRef.current.x * PARALLAX_STRENGTH,
        basePos[1] + mouseRef.current.y * PARALLAX_STRENGTH * 0.5,
        basePos[2] * zoomRef.current,
      )
      targetLookAt.current.set(0, 0, 0)
    }

    camera.position.lerp(targetPosition.current, selectedPlanet ? FOCUS_LERP_FACTOR : PARALLAX_LERP_FACTOR)

    currentLookAt.current.lerp(targetLookAt.current, selectedPlanet ? FOCUS_LERP_FACTOR : ZOOM_LERP_FACTOR)
    camera.lookAt(currentLookAt.current)
  })

  return null
}
