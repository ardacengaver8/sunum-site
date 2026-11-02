import { motion } from 'motion/react'
import { sections } from '../../content/site'

// Fixed top bar + side dots. `active` is the index of the section on screen.
export function Nav({ active, onJump }) {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      >
        <nav className="glass flex w-full max-w-7xl items-center justify-between rounded-full py-2 pr-2 pl-5">
          <button onClick={() => onJump(0)} className="flex items-center gap-2 text-sm font-medium">
            <span className="h-3 w-3 rounded-full bg-gradient-to-br from-ember to-violet" />
            <span>
              arda<span className="text-muted">.cengaver</span>
            </span>
          </button>
          <div className="hidden items-center gap-1 lg:flex">
            {sections.slice(1).map((s, i) => (
              <button
                key={s.id}
                onClick={() => onJump(i + 1)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${active === i + 1 ? 'bg-white/10 text-fg' : 'text-muted hover:text-fg'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <span className="rounded-full border border-line px-3 py-1.5 font-mono text-[11px] text-muted">
            {String(active + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}
          </span>
        </nav>
      </motion.header>

      <div className="fixed top-1/2 right-4 z-50 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {sections.map((s, i) => (
          <button key={s.id} onClick={() => onJump(i)} aria-label={s.label} className="group flex items-center justify-end gap-3">
            <span className="font-mono text-[10px] text-muted opacity-0 transition-opacity group-hover:opacity-100">{s.label}</span>
            <span className={`block h-1.5 rounded-full transition-all duration-500 ${active === i ? 'w-6 bg-fg' : 'w-1.5 bg-white/25'}`} />
          </button>
        ))}
      </div>
    </>
  )
}
