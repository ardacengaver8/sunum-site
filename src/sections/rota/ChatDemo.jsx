import { AnimatePresence, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { rota } from '../../content/rota'

const hues = {
  sun: 'from-sun/40 border-sun/30',
  sea: 'from-sea/40 border-sea/30',
  violet: 'from-violet/40 border-violet/30',
}

// A scripted replay of one Rota turn: message → working steps → option cards.
// stage: 0 empty, 1 message, 2..(1+steps) steps ticking, then cards.
export function ChatDemo() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const [stage, setStage] = useState(0)
  const [run, setRun] = useState(0)
  const { demo } = rota
  const cardsAt = 2 + demo.steps.length

  useEffect(() => {
    if (!inView) return
    setStage(0)
    const timers = Array.from({ length: cardsAt + 1 }, (_, i) => setTimeout(() => setStage(i), 500 + i * 1100))
    return () => timers.forEach(clearTimeout)
  }, [inView, run, cardsAt])

  return (
    <div ref={ref} className="glass relative flex min-h-[30rem] flex-col rounded-3xl p-5 sm:p-7">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-sun shadow-[0_0_10px_#ffb347]" />
          <span className="text-sm font-medium">Rota</span>
        </div>
        <button onClick={() => setRun((r) => r + 1)} className="font-mono text-xs text-dim hover:text-fg">
          ↻ tekrar oynat
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 pt-5">
        <AnimatePresence>
          {stage >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-white/10 px-4 py-3 text-sm leading-relaxed"
            >
              {demo.user}
            </motion.div>
          )}
        </AnimatePresence>

        {stage >= 2 && (
          <div className="space-y-1.5">
            {demo.steps.map((s, i) => {
              const done = stage > 2 + i
              const shown = stage >= 2 + i
              return (
                shown && (
                  <motion.div key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 font-mono text-xs">
                    <span className={done ? 'text-sea' : 'animate-pulse text-sun'}>{done ? '✓' : '●'}</span>
                    <span className={done ? 'text-dim' : 'text-fg'}>{s}…</span>
                  </motion.div>
                )
              )
            })}
          </div>
        )}

        {stage >= cardsAt && (
          <div className="mt-auto grid gap-3 sm:grid-cols-3">
            {demo.options.map((o, i) => (
              <motion.div
                key={o.place}
                initial={{ opacity: 0, y: 24, rotate: -2 + i * 2 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 140, damping: 16 }}
                className={`overflow-hidden rounded-2xl border bg-gradient-to-b ${hues[o.hue]} to-surface p-4`}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-fg/60">Kartpostal</p>
                <p className="mt-6 font-serif text-3xl italic">{o.place}</p>
                <div className="mt-3 space-y-0.5 font-mono text-[11px] text-fg/70">
                  <p>🚗 {o.drive}</p>
                  <p>☁ {o.weather}</p>
                  <p className="text-fg">≈ {o.cost} / kişi</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <p className="mt-4 font-mono text-[10px] text-dim">Canlandırma, örnek veri · gerçek demo sunumda</p>
    </div>
  )
}
