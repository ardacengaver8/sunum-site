import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useMemo, useRef, useState } from 'react'

const HOLD_MS = 1000
const ROOM_AVG = 7.4

// The room's scores as a smooth hill (two bumps, like a real film's spread).
function useHillPath(width, height) {
  return useMemo(() => {
    const pts = []
    for (let i = 0; i <= 90; i++) {
      const s = 1 + (i / 90) * 9
      const y = Math.exp(-((s - 7.6) ** 2) / 1.1) + 0.35 * Math.exp(-((s - 5.2) ** 2) / 0.8)
      pts.push([((s - 1) / 9) * width, height - y * (height - 12)])
    }
    return `M0 ${height} ` + pts.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ` L${width} ${height} Z`
  }, [width, height])
}

// Ruler → hold to lock → reveal. Tells the parent when the seal opens.
export function RatingDemo({ onReveal }) {
  const [score, setScore] = useState(6.5)
  const [hold, setHold] = useState(0)
  const [locked, setLocked] = useState(false)
  const timer = useRef(null)
  const hill = useHillPath(400, 110)

  useEffect(() => onReveal(locked), [locked, onReveal])
  useEffect(() => () => cancelAnimationFrame(timer.current), [])

  const startHold = () => {
    if (locked) return
    const start = performance.now()
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / HOLD_MS)
      setHold(p)
      if (p < 1) timer.current = requestAnimationFrame(tick)
      else setLocked(true)
    }
    timer.current = requestAnimationFrame(tick)
  }
  const stopHold = () => {
    cancelAnimationFrame(timer.current)
    if (!locked) setHold(0)
  }
  const reset = () => {
    setLocked(false)
    setHold(0)
  }

  const diff = score - ROOM_AVG
  const x = ((score - 1) / 9) * 400

  return (
    <div className="glass rounded-3xl p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Dene: “Son Kış”</p>
        <span className="font-mono text-xs text-dim">{locked ? 'mühür açıldı' : '12 yorum mühürlü'}</span>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <span className="font-serif text-6xl italic text-gradient-frost">{score.toFixed(1)}</span>
        <span className="pb-2 font-mono text-xs text-dim">1.0 — 10.0</span>
      </div>

      <input
        type="range"
        min={1}
        max={10}
        step={0.1}
        value={score}
        disabled={locked}
        onChange={(e) => setScore(Number(e.target.value))}
        aria-label="Puan"
        className="mt-4 w-full accent-[#9fd8ff] disabled:opacity-40"
      />

      <div className="mt-5 h-[110px]">
        <AnimatePresence mode="wait">
          {!locked ? (
            <motion.button
              key="hold"
              exit={{ opacity: 0, y: -8 }}
              onPointerDown={startHold}
              onPointerUp={stopHold}
              onPointerLeave={stopHold}
              onKeyDown={(e) => e.key === 'Enter' && !e.repeat && startHold()}
              onKeyUp={(e) => e.key === 'Enter' && stopHold()}
              className="relative h-14 w-full touch-none overflow-hidden rounded-2xl border border-frost/30 text-sm font-medium select-none"
            >
              <span className="absolute inset-y-0 left-0 bg-frost/25" style={{ width: `${hold * 100}%` }} />
              <span className="relative">Kilitlemek için basılı tut</span>
            </motion.button>
          ) : (
            <motion.div key="hill" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
              <svg viewBox="0 0 400 110" className="h-[110px] w-full overflow-visible">
                <defs>
                  <linearGradient id="hill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#c7b8ff" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#c7b8ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d={hill}
                  fill="url(#hill)"
                  stroke="#c7b8ff"
                  strokeWidth="1.5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
                <motion.line
                  x1={x}
                  x2={x}
                  y2={110}
                  stroke="#9fd8ff"
                  strokeWidth="2.5"
                  initial={{ y1: -40, opacity: 0 }}
                  animate={{ y1: 0, opacity: 1 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 180, damping: 14 }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 flex min-h-6 items-center justify-between text-sm">
        {locked ? (
          <>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="text-muted">
              Salon <span className="text-lilac">{ROOM_AVG.toFixed(1)}</span> · sen{' '}
              <span className="text-frost">{score.toFixed(1)}</span> ·{' '}
              {Math.abs(diff) < 0.5 ? 'kalabalıkla aynı yerdesin' : diff > 0 ? 'kalabalıktan cömertsin' : 'kalabalıktan sertsin'}
            </motion.span>
            <button onClick={reset} className="font-mono text-xs text-dim underline-offset-4 hover:text-fg hover:underline">
              tekrar
            </button>
          </>
        ) : (
          <span className="text-dim">Ortalama sen puanlayana kadar gizli.</span>
        )}
      </div>
    </div>
  )
}
