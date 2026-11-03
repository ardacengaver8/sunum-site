import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { heroLog } from '../../content/hero'

const KEEP = 6

// The hero scene's agent loop written out: each call the scene sends from the
// model to a harness node, and what comes back, as it happens.
export function AgentLog() {
  const [lines, setLines] = useState([])
  const id = useRef(0)

  useEffect(() => {
    const onStep = (e) => {
      const { which, kind } = e.detail
      const step = heroLog[which]
      const line = { id: id.current++, kind, node: step.node, text: kind === 'call' ? step.call : step.result }
      setLines((old) => [...old, line].slice(-KEEP))
    }
    window.addEventListener('agent-step', onStep)
    return () => window.removeEventListener('agent-step', onStep)
  }, [])

  return (
    <div className="glass w-[22rem] rounded-2xl p-4 font-mono text-[11px]">
      <div className="flex items-center justify-between text-dim">
        <span className="tracking-[0.2em]">AGENT DÖNGÜSÜ</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sea" /> canlı
        </span>
      </div>
      <ul className="mt-3 flex h-[8.6rem] flex-col justify-end gap-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {lines.map((l) => (
            <motion.li
              key={l.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex gap-2 whitespace-nowrap"
            >
              <span className={l.kind === 'call' ? 'text-ember' : 'text-sea'}>{l.kind === 'call' ? '→' : '←'}</span>
              <span className={`truncate ${l.kind === 'call' ? 'text-fg/85' : 'text-muted'}`}>{l.text}</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-3 border-t border-line pt-2 leading-relaxed text-dim">
        Model sadece ne çağrılacağını söylüyor. Çağrıyı harness yapıyor, sonuç context’e dönüyor.
      </p>
    </div>
  )
}
