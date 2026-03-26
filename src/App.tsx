import { useState, useCallback, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence } from 'framer-motion'
import { Scene } from './three/Scene'
import { InfoPanel } from './ui/InfoPanel'
import { HUD } from './ui/HUD'
import { TimeControls } from './ui/TimeControls'
import { PlanetNav } from './ui/PlanetNav'
import { LoadingScreen } from './ui/LoadingScreen'
import { AstronomyFacts } from './ui/AstronomyFacts'
import { SimulationProvider } from './lib/SimulationContext'
import { planets } from './data/planets'
import type { PlanetData } from './types/planet'
import { CAMERA_INITIAL_POSITION, CAMERA_FOV } from './lib/constants'

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null)
  const [ready, setReady] = useState(false)

  const handleSelectPlanet = useCallback((planet: PlanetData) => {
    setSelectedPlanet(planet)
  }, [])

  const handleClose = useCallback(() => {
    setSelectedPlanet(null)
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedPlanet(null)
        return
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        setSelectedPlanet((current) => {
          const currentIndex = current ? planets.findIndex((p) => p.id === current.id) : -1
          let nextIndex: number

          if (e.key === 'ArrowRight') {
            nextIndex = currentIndex < planets.length - 1 ? currentIndex + 1 : 0
          } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : planets.length - 1
          }

          return planets[nextIndex]
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <SimulationProvider>
      <div className="relative w-full h-full">
        <LoadingScreen ready={ready} />

        <Canvas
          camera={{
            position: CAMERA_INITIAL_POSITION,
            fov: CAMERA_FOV,
            near: 0.1,
            far: 1000,
          }}
          dpr={[1, 2]}
          gl={{ antialias: true }}
          onCreated={() => {
            setTimeout(() => setReady(true), 800)
          }}
        >
          <Scene
            onSelectPlanet={handleSelectPlanet}
            selectedPlanet={selectedPlanet}
          />
        </Canvas>

        <HUD />
        <AstronomyFacts visible={!selectedPlanet} />
        <PlanetNav selectedPlanet={selectedPlanet} onSelect={handleSelectPlanet} />
        <TimeControls />

        <AnimatePresence>
          {selectedPlanet && (
            <InfoPanel
              key={selectedPlanet.id}
              planet={selectedPlanet}
              onClose={handleClose}
            />
          )}
        </AnimatePresence>
      </div>
    </SimulationProvider>
  )
}

export default App
