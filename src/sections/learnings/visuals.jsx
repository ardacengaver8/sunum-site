import { motion } from 'motion/react'

// Small looping diagrams, one per learning card. Each fills a h-40 box.
const loop = (duration, delay = 0) => ({ duration, delay, repeat: Infinity, ease: 'easeInOut' })

function ContextWindow() {
  const parts = [
    { label: 'Sistem', w: '18%', c: 'bg-violet' },
    { label: 'Geçmiş', w: '30%', c: 'bg-violet/60' },
    { label: 'Tool', w: '22%', c: 'bg-ember/80' },
    { label: 'Belge', w: '18%', c: 'bg-frost/70' },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-2">
      <div className="flex justify-between font-mono text-[10px] text-dim">
        <span>context window</span>
        <span>200K token</span>
      </div>
      <div className="relative flex h-10 overflow-hidden rounded-lg border border-line">
        {parts.map((p, i) => (
          <motion.div
            key={p.label}
            className={`${p.c} h-full border-r border-ink/60`}
            initial={{ width: 0 }}
            animate={{ width: [0, p.w, p.w, 0] }}
            transition={{ ...loop(7), times: [0, 0.15 + i * 0.1, 0.85, 1] }}
          />
        ))}
      </div>
      <div className="flex gap-3 font-mono text-[10px] text-muted">
        {parts.map((p) => (
          <span key={p.label} className="flex items-center gap-1">
            <i className={`h-2 w-2 rounded-sm ${p.c}`} />
            {p.label}
          </span>
        ))}
      </div>
    </div>
  )
}

function Rag() {
  return (
    <div className="flex h-full items-center justify-between gap-4 px-2">
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }, (_, i) => (
          <motion.div
            key={i}
            className="h-6 w-6 rounded border border-line bg-raise"
            animate={i === 2 || i === 6 ? { backgroundColor: ['#16151d', '#9fd8ff', '#9fd8ff', '#16151d'] } : {}}
            transition={{ ...loop(4), times: [0, 0.3, 0.7, 1] }}
          />
        ))}
      </div>
      <motion.div
        className="font-mono text-xs text-frost"
        animate={{ x: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
        transition={loop(2)}
      >
        → ara →
      </motion.div>
      <div className="flex w-24 flex-col gap-1.5 rounded-lg border border-line p-2">
        <span className="font-mono text-[9px] text-dim">context</span>
        <div className="h-2 rounded bg-violet/60" />
        <motion.div className="h-2 rounded bg-frost" animate={{ opacity: [0, 1, 1, 0] }} transition={{ ...loop(4), times: [0, 0.4, 0.75, 1] }} />
        <motion.div className="h-2 rounded bg-frost" animate={{ opacity: [0, 1, 1, 0] }} transition={{ ...loop(4), times: [0, 0.5, 0.75, 1] }} />
      </div>
    </div>
  )
}

function AgentLoop() {
  const nodes = ['Düşün', 'Tool çağır', 'Sonucu gör', 'Cevap']
  const pos = [
    [50, 8],
    [92, 50],
    [50, 92],
    [8, 50],
  ]
  return (
    <div className="relative mx-auto h-full w-56">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <circle cx="50" cy="50" r="38" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeDasharray="2 3" />
      </svg>
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}>
        <div className="absolute top-[12%] left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember shadow-[0_0_12px_#ff7a45]" />
      </motion.div>
      {nodes.map((n, i) => (
        <span
          key={n}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[10px] whitespace-nowrap text-fg"
          style={{ left: `${pos[i][0]}%`, top: `${pos[i][1]}%` }}
        >
          {n}
        </span>
      ))}
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-serif text-lg italic text-muted">harness</span>
    </div>
  )
}

function Loops() {
  const levels = [
    { n: 1, t: 'tek çağrı' },
    { n: 2, t: 'verification loop', on: true },
    { n: 3, t: '…' },
    { n: 4, t: 'Ralph loop', on: true },
  ]
  return (
    <div className="flex h-full items-end gap-2 px-2 pb-2">
      {levels.map((l, i) => (
        <div key={l.n} className="flex flex-1 flex-col items-center gap-2">
          <motion.div
            className={`w-full rounded-t-md border ${l.on ? 'border-ember/50 bg-ember/20' : 'border-line bg-raise'}`}
            initial={{ height: 0 }}
            whileInView={{ height: 24 + i * 26 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.12 }}
          >
            <span className={`block pt-1 text-center font-mono text-xs ${l.on ? 'text-ember' : 'text-dim'}`}>{l.n}</span>
          </motion.div>
          <span className="text-center font-mono text-[9px] leading-tight text-muted">{l.t}</span>
        </div>
      ))}
    </div>
  )
}

function Harness() {
  const parts = ['CLAUDE.md', 'skill', 'hook', 'alt ajan', 'hafıza']
  return (
    <div className="relative mx-auto h-full w-60">
      <div className="absolute top-1/2 left-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-violet to-ember text-xs font-medium text-ink">
        Model
      </div>
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}>
        {parts.map((p, i) => {
          const a = (i / parts.length) * Math.PI * 2
          return (
            <motion.span
              key={p}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[10px] whitespace-nowrap text-muted"
              style={{ left: `${50 + Math.cos(a) * 40}%`, top: `${50 + Math.sin(a) * 40}%` }}
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              {p}
            </motion.span>
          )
        })}
      </motion.div>
    </div>
  )
}

function Trace() {
  // A LangSmith-like waterfall: before (grey, long map calls) → after (short).
  const rows = [
    { label: 'model', start: 0, before: 22, after: 22, c: 'bg-violet' },
    { label: 'harita', start: 22, before: 40, after: 4, c: 'bg-ember' },
    { label: 'harita', start: 22, before: 34, after: 3, c: 'bg-ember' },
    { label: 'model', start: 62, before: 30, after: 30, c: 'bg-violet' },
  ]
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-2">
      {rows.map((r, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-10 font-mono text-[10px] text-dim">{r.label}</span>
          <div className="relative h-3 flex-1">
            <motion.div
              className={`absolute h-full rounded-sm ${r.c}`}
              animate={{
                left: [`${r.start}%`, `${r.start}%`, `${i === 3 ? 30 : r.start}%`, `${i === 3 ? 30 : r.start}%`],
                width: [`${r.before}%`, `${r.before}%`, `${r.after}%`, `${r.after}%`],
              }}
              transition={{ ...loop(6), times: [0, 0.35, 0.55, 1] }}
            />
          </div>
        </div>
      ))}
      <motion.p
        className="text-right font-mono text-[10px] text-ember"
        animate={{ opacity: [0, 0, 1, 1] }}
        transition={{ ...loop(6), times: [0, 0.45, 0.6, 1] }}
      >
        31 sn → 2,5 sn
      </motion.p>
    </div>
  )
}

function Stack() {
  const checks = ['lint', 'test', 'build', 'e2e']
  return (
    <div className="flex h-full flex-col justify-center gap-2 px-2">
      <div className="rounded-lg border border-dashed border-line p-2">
        <span className="font-mono text-[9px] text-dim">turborepo</span>
        <div className="mt-1 grid grid-cols-2 gap-2">
          <div className="rounded border border-line bg-raise px-2 py-1.5 font-mono text-[10px]">apps/web</div>
          <div className="rounded border border-line bg-raise px-2 py-1.5 font-mono text-[10px]">apps/agent</div>
        </div>
      </div>
      <div className="flex gap-1.5">
        {checks.map((c, i) => (
          <motion.span
            key={c}
            className="flex-1 rounded border border-line py-1 text-center font-mono text-[10px]"
            animate={{ color: ['#5c5a69', '#4fd1c5', '#4fd1c5', '#5c5a69'], borderColor: ['rgba(255,255,255,0.08)', 'rgba(79,209,197,0.5)', 'rgba(79,209,197,0.5)', 'rgba(255,255,255,0.08)'] }}
            transition={{ ...loop(5), times: [0, 0.15 + i * 0.12, 0.85, 1] }}
          >
            ✓ {c}
          </motion.span>
        ))}
      </div>
    </div>
  )
}

function Models() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-2 font-mono text-[10px]">
      {[
        { name: 'ana model', speed: 55, ok: 92, c: 'bg-violet' },
        { name: 'hızlı model', speed: 85, ok: 60, c: 'bg-ember' },
      ].map((m) => (
        <div key={m.name}>
          <span className="text-muted">{m.name}</span>
          <div className="mt-1 grid grid-cols-[3rem_1fr] items-center gap-x-2 gap-y-1 text-dim">
            <span>hız</span>
            <motion.div className={`h-1.5 rounded ${m.c} opacity-60`} initial={{ width: 0 }} whileInView={{ width: `${m.speed}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
            <span>doğruluk</span>
            <motion.div className={`h-1.5 rounded ${m.c}`} initial={{ width: 0 }} whileInView={{ width: `${m.ok}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} />
          </div>
        </div>
      ))}
      <span className="text-sea">çökerse → yedek model</span>
    </div>
  )
}

export const visuals = {
  context: ContextWindow,
  rag: Rag,
  agent: AgentLoop,
  loops: Loops,
  harness: Harness,
  trace: Trace,
  stack: Stack,
  models: Models,
}
