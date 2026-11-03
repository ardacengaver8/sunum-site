import { motion, useScroll, useTransform } from 'motion/react'
import { useLayoutEffect, useRef, useState } from 'react'
import { SectionHeading } from '../components/ui/SectionHeading'
import { Tag } from '../components/ui/Tag'
import { journey } from '../content/journey'

const glow = {
  ember: 'from-ember',
  violet: 'from-violet',
  frost: 'from-frost',
  sun: 'from-sun',
}

function Card({ item, index }) {
  return (
    <article className="glass relative flex h-[22rem] w-[19rem] shrink-0 flex-col overflow-hidden rounded-3xl p-7 sm:w-[23rem]">
      <div className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${glow[item.accent]} to-transparent`} />
      <div className={`absolute -top-24 -left-16 h-48 w-48 rounded-full bg-gradient-to-br ${glow[item.accent]} to-transparent opacity-20 blur-3xl`} />
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-dim">{String(index + 1).padStart(2, '0')}</span>
        <Tag tone={item.accent}>{item.tag}</Tag>
      </div>
      <p className="mt-auto font-serif text-4xl italic text-fg/90">{item.when}</p>
      <h3 className="mt-3 text-xl font-medium tracking-tight">{item.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
    </article>
  )
}

export function Journey() {
  const outer = useRef(null)
  const track = useRef(null)
  const [distance, setDistance] = useState(0)
  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useLayoutEffect(() => {
    const measure = () => setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth + 32))
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <section id="yolculuk" data-section ref={outer} className="relative" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <SectionHeading
            eyebrow="01 · Yolculuk"
            title="Gün gün,"
            accent="ne oldu?"
            lead="İlk günkü denemelerden bugüne, kısaca. Aşağı kaydırdıkça zaman ilerliyor."
          />
        </div>
        <motion.div ref={track} style={{ x }} className="mt-12 flex gap-5 px-4 sm:px-8 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]">
          {journey.map((item, i) => (
            <Card key={item.title} item={item} index={i} />
          ))}
        </motion.div>
        <div className="mx-auto mt-10 h-px w-full max-w-7xl bg-line px-4 sm:px-8">
          <motion.div style={{ width: bar }} className="h-px bg-gradient-to-r from-ember to-violet" />
        </div>
      </div>
    </section>
  )
}
