import { AnimatePresence, motion } from 'motion/react'
import { Suspense, useEffect, useState } from 'react'
import { GlobeScene } from '../../components/three/GlobeScene'
import { LazyCanvas } from '../../components/three/LazyCanvas'
import { rota } from '../../content/rota'

const STAY_MS = 5500

// Which example trip is in focus; moves on every few seconds.
export function useTripCycle() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % rota.globeTrips.length), STAY_MS)
    return () => clearInterval(id)
  }, [])
  return i
}

// The globe turns to the trip in focus and draws it.
export function Globe({ i }) {
  return (
    <LazyCanvas className="h-[420px] sm:h-[560px]" camera={{ position: [0, 0, 6.9], fov: 40 }} gl={{ alpha: true }}>
      <Suspense fallback={null}>
        <GlobeScene trip={rota.globeTrips[i]} />
      </Suspense>
    </LazyCanvas>
  )
}

// Beside it, the tools Rota calls for that trip, ticking off one by one.
export function GlobeCaption({ i }) {
  const trip = rota.globeTrips[i]
  return (
    <div className="glass max-w-md rounded-2xl p-5">
      <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-dim">
        <span>ÖRNEK GEZİ · TOOL ÇAĞRILARI</span>
        <span>
          {i + 1} / {rota.globeTrips.length}
        </span>
      </div>
      <div className="mt-3 min-h-[7.5rem]">
        <AnimatePresence mode="wait">
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }}>
            <p className="font-serif text-2xl italic text-gradient-sun">{trip.title}</p>
            <p className="font-mono text-[11px] text-dim">{trip.who}</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[12px]">
              {trip.tools.map((t, k) => (
                <motion.li
                  key={t}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + k * 0.45 }}
                  className="flex items-center gap-2 text-muted"
                >
                  <span className="text-sea">✓</span>
                  {t}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
      <p className="border-t border-line pt-3 text-xs leading-relaxed text-dim">
        Model hangi tool’a ihtiyacı olduğunu söylüyor, tool gerçek veriyi getiriyor, plan o veriyle yazılıyor.
      </p>
    </div>
  )
}
