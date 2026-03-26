import { motion } from 'framer-motion'
import type { PlanetData } from '../types/planet'

interface InfoPanelProps {
  planet: PlanetData
  onClose: () => void
}

export function InfoPanel({ planet, onClose }: InfoPanelProps) {
  return (
    <motion.div
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '100%', opacity: 0 }}
      transition={{ type: 'spring', damping: 28, stiffness: 220 }}
      className="absolute top-0 right-0 h-full w-[340px] sm:w-[420px] z-10 flex flex-col overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(8,10,20,0.92) 0%, rgba(12,16,30,0.88) 100%)',
        backdropFilter: 'blur(24px)',
        borderLeft: `1px solid ${planet.color}20`,
      }}
    >
      {/* Accent line at top */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${planet.color}, transparent)` }} />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-6 w-8 h-8 rounded-full border border-white/10 hover:border-white/30 text-white/40 hover:text-white flex items-center justify-center transition-all cursor-pointer text-sm"
      >
        &times;
      </button>

      <div className="flex-1 overflow-y-auto px-8 py-7">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4 mb-2"
        >
          <div
            className="w-12 h-12 rounded-full shrink-0"
            style={{
              backgroundColor: planet.color,
              boxShadow: `0 0 24px ${planet.color}50, inset 0 -3px 6px rgba(0,0,0,0.3)`,
            }}
          />
          <div>
            <h2 className="text-2xl font-semibold text-white tracking-tight leading-none">
              {planet.name}
            </h2>
            <span
              className="text-[11px] font-medium uppercase tracking-[0.15em] mt-1 inline-block"
              style={{ color: planet.color }}
            >
              {planet.type}
            </span>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[13px] text-white/50 leading-relaxed mt-4 mb-6"
        >
          {planet.description}
        </motion.p>

        {/* Divider */}
        <div className="h-px w-full bg-white/[0.06] mb-5" />

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6"
        >
          <StatCell label="Distance" value={planet.distanceFromSun} color={planet.color} />
          <StatCell label="Diameter" value={planet.diameter} color={planet.color} />
          <StatCell label="Orbit" value={planet.orbitalPeriod} color={planet.color} />
          <StatCell label="Gravity" value={planet.gravity} color={planet.color} />
          <StatCell label="Moons" value={planet.moons.toString()} color={planet.color} />
          <StatCell label="Temperature" value={planet.temperature} color={planet.color} />
        </motion.div>

        {/* Divider */}
        <div className="h-px w-full bg-white/[0.06] mb-5" />

        {/* Fun fact */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="rounded-lg p-4"
          style={{
            background: `linear-gradient(135deg, ${planet.color}08, ${planet.color}04)`,
            border: `1px solid ${planet.color}15`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: planet.color }} />
            <p className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: `${planet.color}99` }}>
              Did you know
            </p>
          </div>
          <p className="text-[13px] text-white/70 leading-relaxed">
            {planet.funFact}
          </p>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div
        className="h-16 shrink-0 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(8,10,20,0.95), transparent)',
        }}
      />
    </motion.div>
  )
}

function StatCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="group">
      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/25 mb-1">
        {label}
      </p>
      <p className="text-sm font-medium" style={{ color: `${color}dd` }}>
        {value}
      </p>
    </div>
  )
}
