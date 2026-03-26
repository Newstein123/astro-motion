import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface SimulationState {
  paused: boolean
  speed: number
  togglePause: () => void
  setSpeed: (speed: number) => void
}

const SimulationContext = createContext<SimulationState>({
  paused: false,
  speed: 1,
  togglePause: () => {},
  setSpeed: () => {},
})

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const [speed, setSpeed] = useState(1)

  const togglePause = useCallback(() => setPaused((p) => !p), [])

  return (
    <SimulationContext.Provider value={{ paused, speed, togglePause, setSpeed }}>
      {children}
    </SimulationContext.Provider>
  )
}

export function useSimulation() {
  return useContext(SimulationContext)
}
