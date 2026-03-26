import { motion } from 'framer-motion'

export function HUD() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 1 }}
      className="absolute top-0 left-0 w-full p-6 pointer-events-none z-10"
    >
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-xl sm:text-2xl font-semibold text-white/80 tracking-tight" style={{ padding: '10px' }}>
          Solar System Explorer
        </h1>
      </div>
      <p className="text-xs text-white/30 tracking-wide ml-[18px] font-light" style={{ padding: '10px' }}>
        Select a planet to inspect &nbsp;/&nbsp; Scroll to zoom &nbsp;/&nbsp; Move cursor to orbit
      </p>
    </motion.div>
  )
}
