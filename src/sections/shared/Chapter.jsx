import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

const tones = {
  dusk: { text: 'text-gradient-dusk', glow: 'from-ember/25 to-violet/25' },
  frost: { text: 'text-gradient-frost', glow: 'from-frost/25 to-lilac/25' },
  sun: { text: 'text-gradient-sun', glow: 'from-sun/25 to-sea/20' },
}

// A full-screen chapter card between parts. The big word drifts sideways and
// the title comes into focus while it is pinned.
export function Chapter({ id, number, title, line, word, tone = 'dusk' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x = useTransform(scrollYProgress, [0, 1], ['10%', '-35%'])
  const scale = useTransform(scrollYProgress, [0.15, 0.5], [0.85, 1])
  const blur = useTransform(scrollYProgress, [0.15, 0.45, 0.7, 0.9], ['blur(16px)', 'blur(0px)', 'blur(0px)', 'blur(12px)'])
  const opacity = useTransform(scrollYProgress, [0.15, 0.4, 0.7, 0.9], [0, 1, 1, 0])
  const t = tones[tone]

  return (
    <section id={id} data-section ref={ref} className="relative h-[160svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden">
        <div className={`pointer-events-none absolute h-[30rem] w-[50rem] rounded-full bg-gradient-to-r ${t.glow} blur-[140px]`} />
        <motion.p
          style={{ x }}
          aria-hidden
          className="pointer-events-none absolute font-serif text-[28vw] leading-none whitespace-nowrap italic text-transparent [-webkit-text-stroke:1px_rgb(255_255_255_/_0.07)]"
        >
          {word} · {word}
        </motion.p>
        <motion.div style={{ scale, filter: blur, opacity }} className="relative px-4 text-center">
          <p className="font-mono text-xs tracking-[0.35em] text-muted">BÖLÜM {number}</p>
          <h2 className={`mt-4 font-serif text-7xl leading-none italic sm:text-9xl ${t.text}`}>{title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted">{line}</p>
        </motion.div>
      </div>
    </section>
  )
}
