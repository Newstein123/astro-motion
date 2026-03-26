import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const facts = [
  'The Sun accounts for 99.86% of all mass in the solar system.',
  'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.',
  'There are more stars in the universe than grains of sand on all of Earth\'s beaches.',
  'A year on Pluto lasts 248 Earth years. It hasn\'t completed a full orbit since its discovery in 1930.',
  'The Milky Way and Andromeda galaxies will collide in about 4.5 billion years.',
  'Neutron stars are so dense that a teaspoon of their material would weigh about 6 billion tons.',
  'Space is completely silent — there is no medium for sound waves to travel through.',
  'The largest known star, UY Scuti, has a radius about 1,700 times that of our Sun.',
  'The Voyager 1 spacecraft, launched in 1977, is the most distant human-made object from Earth.',
  'One day on Venus is longer than one year on Venus — it takes 243 Earth days to rotate once.',
  'The footprints on the Moon will remain there for at least 100 million years.',
  'Jupiter\'s moon Europa may have more water beneath its icy surface than all of Earth\'s oceans combined.',
  'The observable universe is about 93 billion light-years in diameter.',
  'Saturn\'s rings are mostly made of chunks of ice and rock, some as small as grains of sand.',
  'A photon can take 100,000 years to travel from the Sun\'s core to its surface, then only 8 minutes to reach Earth.',
]

interface AstronomyFactsProps {
  visible: boolean
}

export function AstronomyFacts({ visible }: AstronomyFactsProps) {
  const [factIndex, setFactIndex] = useState(0)

  useEffect(() => {
    if (!visible) return
    const interval = setInterval(() => {
      setFactIndex((i) => (i + 1) % facts.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-36 left-1/2 -translate-x-1/2 z-10 max-w-lg text-center pointer-events-none"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.6 }}
              className="text-sm text-white/35 leading-relaxed font-light px-6"
            >
              {facts[factIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
