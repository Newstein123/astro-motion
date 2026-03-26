import { motion } from 'framer-motion'
import { useSimulation } from '../lib/SimulationContext'

const SPEED_PRESETS = [
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '1x', value: 1 },
  { label: '2x', value: 2 },
  { label: '5x', value: 5 },
]

export function TimeControls() {
  const { paused, speed, togglePause, setSpeed } = useSimulation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.6 }}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 px-4 py-2.5 rounded-full"
      style={{
        background: 'rgba(8,10,20,0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Play/Pause */}
      <button
        onClick={togglePause}
        className="w-8 h-8 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
      >
        {paused ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
            <path d="M2 0.5L13 7L2 13.5V0.5Z" />
          </svg>
        ) : (
          <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
            <rect x="0" y="0" width="4" height="14" rx="1" />
            <rect x="8" y="0" width="4" height="14" rx="1" />
          </svg>
        )}
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-white/10" />

      {/* Speed presets */}
      <div className="flex items-center gap-1">
        {SPEED_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setSpeed(preset.value)}
            className="px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer"
            style={{
              color: speed === preset.value ? '#fff' : 'rgba(255,255,255,0.35)',
              background: speed === preset.value ? 'rgba(255,255,255,0.12)' : 'transparent',
            }}
          >
            {preset.label}
          </button>
        ))}
      </div>
    </motion.div>
  )
}
