import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Counter } from '../components/ui/Counter'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { howIWork, lessons, next, totals } from '../content/closing'
import { site } from '../content/site'
import { LinkButton } from './shared/LinkButton'

export function Numbers() {
  return (
    <Section id="rakamlar" className="py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="05 · Rakamlar" title="Biraz" accent="sayı." />
        <div className="mt-16 grid grid-cols-2 border-t border-line lg:grid-cols-5">
          {totals.map((t, i) => (
            <Reveal key={t.label} delay={i * 0.08} className="border-b border-line py-10 pr-4 lg:border-r lg:border-b-0 lg:pl-6 lg:first:pl-0 lg:last:border-r-0">
              <p className="font-serif text-6xl leading-none italic text-gradient-dusk sm:text-7xl">
                <Counter value={t.value} decimals={t.decimals ?? 0} />
              </p>
              <p className="mt-4 text-sm text-fg">{t.label}</p>
              {t.note && <p className="mt-1 font-mono text-[11px] text-dim">{t.note}</p>}
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

export function HowIWork() {
  return (
    <Section id="nasil" className="py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="06 · Nasıl çalışıyorum"
          title="Kodu Claude yazıyor,"
          accent="yönü ben veriyorum."
          lead="Kodu elle yazmıyorum. Benim işim ne yapılacağına, nasıl test edileceğine ve ne zaman bittiğine karar vermek."
        />
        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {howIWork.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="h-full">
              <div className="glass group relative h-full overflow-hidden rounded-3xl p-7">
                <span className="absolute -top-6 -right-2 font-serif text-[9rem] leading-none italic text-white/[0.04] transition-colors duration-500 group-hover:text-ember/10">
                  {s.n}
                </span>
                <span className="font-mono text-xs text-ember">{s.n}</span>
                <h3 className="mt-10 text-2xl font-medium tracking-tight">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.text}</p>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {s.files.map((f) => (
                    <span key={f} className="rounded-md border border-line px-2 py-0.5 font-mono text-[10px] text-dim">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

function Lesson({ item, index, open, onToggle }) {
  return (
    <div className="border-b border-line">
      <button onClick={onToggle} className="flex w-full items-center gap-6 py-6 text-left">
        <span className="font-mono text-xs text-dim">{String(index + 1).padStart(2, '0')}</span>
        <span className="flex-1 text-xl font-medium tracking-tight sm:text-2xl">{item.q}</span>
        <motion.span animate={{ rotate: open ? 45 : 0 }} className="text-2xl text-muted">
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-6 pl-12 leading-relaxed text-muted">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Lessons() {
  const [open, setOpen] = useState(0)
  return (
    <Section id="dersler" className="py-32">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading
          eyebrow="07 · Dersler"
          title="Ters giden şeyler"
          accent="ve öğrettikleri."
          lead="En çok şey öğrendiğim anlar, bir şeylerin bozulduğu anlardı."
        />
        <Reveal className="border-t border-line">
          {lessons.map((l, i) => (
            <Lesson key={l.q} item={l} index={i} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} />
          ))}
        </Reveal>
      </div>
    </Section>
  )
}

export function Next() {
  return (
    <Section id="son" className="pt-32 pb-16">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="08 · Sırada" title="Yarım kalanlar" accent="ve sırada olanlar." />
        <div className="mt-16 grid gap-5 md:grid-cols-2">
          {next.map((p, i) => (
            <Reveal key={p.project} delay={i * 0.1}>
              <div className="glass h-full rounded-3xl p-8">
                <p className={`font-serif text-5xl italic ${p.hue === 'sun' ? 'text-gradient-sun' : 'text-gradient-frost'}`}>{p.project}</p>
                <ul className="mt-6 space-y-3">
                  {p.items.map((it) => (
                    <li key={it} className="flex gap-3 text-muted">
                      <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${p.hue === 'sun' ? 'bg-sun' : 'bg-frost'}`} />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="relative mt-40 overflow-hidden text-center">
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-ember/20 to-violet/20 blur-[100px]" />
          <Reveal>
            <p className="relative font-serif text-[18vw] leading-none italic text-gradient-dusk sm:text-[12rem]">Teşekkürler</p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="relative mt-6 text-2xl text-muted">Sorular?</p>
          </Reveal>
          <Reveal delay={0.25} className="relative mt-10 flex justify-center">
            <LinkButton href={site.links.github}>GitHub</LinkButton>
          </Reveal>
        </div>

        <footer className="mt-32 flex flex-col justify-between gap-2 border-t border-line pt-6 font-mono text-[11px] text-dim sm:flex-row">
          <span>{site.name} · {site.team}</span>
          <span>{site.range} · Claude Code ile yapıldı</span>
        </footer>
      </div>
    </Section>
  )
}
