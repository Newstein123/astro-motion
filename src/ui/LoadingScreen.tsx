import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  ready: boolean
}

export function LoadingScreen({ ready }: LoadingScreenProps) {
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{ background: 'radial-gradient(ellipse at center, #0a0e1a 0%, #000005 100%)' }}
        >
          {/* Orbiting dots */}
          <div className="relative w-24 h-24 mb-8">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#FDB813', '#4a90d9', '#c1440e'][i],
                  boxShadow: `0 0 8px ${['#FDB81380', '#4a90d980', '#c1440e80'][i]}`,
                }}
                animate={{
                  x: [
                    Math.cos((i * Math.PI * 2) / 3) * 32,
                    Math.cos((i * Math.PI * 2) / 3 + Math.PI * 2) * 32,
                  ],
                  y: [
                    Math.sin((i * Math.PI * 2) / 3) * 32,
                    Math.sin((i * Math.PI * 2) / 3 + Math.PI * 2) * 32,
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            ))}
            {/* Center dot (sun) */}
            <div
              className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full"
              style={{
                backgroundColor: '#FDB813',
                boxShadow: '0 0 16px #FDB81360',
              }}
            />
          </div>

          <motion.p
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-xs text-white/40 tracking-[0.25em] uppercase font-light"
          >
            Initializing
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
