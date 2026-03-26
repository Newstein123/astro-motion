import { motion } from 'framer-motion'
import { sunData, planets } from '../data/planets'
import type { PlanetData } from '../types/planet'

interface PlanetNavProps {
  selectedPlanet: PlanetData | null
  onSelect: (planet: PlanetData) => void
}

export function PlanetNav({ selectedPlanet, onSelect }: PlanetNavProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="absolute bottom-20 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2.5 rounded-full"
      style={{
        background: 'rgba(8,10,20,0.6)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {[sunData, ...planets].map((planet) => {
        const isSelected = selectedPlanet?.id === planet.id
        return (
          <button
            key={planet.id}
            onClick={() => onSelect(planet)}
            className="group relative flex flex-col items-center cursor-pointer transition-all"
            title={planet.name}
          >
            <div
              className="w-6 h-6 rounded-full transition-all flex items-center justify-center"
              style={{
                background: isSelected ? `${planet.color}30` : 'transparent',
                border: isSelected ? `1.5px solid ${planet.color}80` : '1.5px solid transparent',
              }}
            >
              <div
                className="rounded-full transition-transform group-hover:scale-125"
                style={{
                  width: Math.max(6, planet.size * 5),
                  height: Math.max(6, planet.size * 5),
                  backgroundColor: planet.color,
                  boxShadow: isSelected ? `0 0 8px ${planet.color}80` : 'none',
                }}
              />
            </div>
            <span
              className="text-[9px] mt-1 transition-opacity font-medium"
              style={{
                color: isSelected ? planet.color : 'rgba(255,255,255,0.3)',
                opacity: isSelected ? 1 : 0.7,
              }}
            >
              {planet.name.slice(0, 3)}
            </span>
          </button>
        )
      })}
    </motion.div>
  )
}
