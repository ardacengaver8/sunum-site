import { Suspense, useCallback, useState } from 'react'
import { LazyCanvas } from '../components/three/LazyCanvas'
import { SealScene } from '../components/three/SealScene'
import { Counter } from '../components/ui/Counter'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { Tag } from '../components/ui/Tag'
import { coldTake } from '../content/coldtake'
import { site } from '../content/site'
import { RatingDemo } from './coldtake/RatingDemo'
import { FeatureCard } from './shared/FeatureCard'
import { LinkButton } from './shared/LinkButton'

function Lab() {
  const { lab } = coldTake
  return (
    <Reveal className="glass mt-6 grid gap-8 rounded-3xl p-7 lg:grid-cols-[1.2fr_1fr] lg:p-10">
      <div>
        <Tag tone="frost">Ralph loop</Tag>
        <h3 className="mt-4 text-2xl font-medium tracking-tight">{lab.title}</h3>
        <p className="mt-3 leading-relaxed text-muted">{lab.text}</p>
        <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs text-dim">
          {['PLAN.md', 'PROGRESS.md', 'CLAUDE.md', 'ralph.sh', 'pytest'].map((f) => (
            <span key={f} className="rounded-md border border-line px-2 py-1">{f}</span>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-4">
        {[{ label: 'Başta', tests: 12 }, ...lab.rounds.map((r) => ({ label: `${r.label} · ${r.tasks} görev`, tests: r.tests[1] }))].map((b, i) => (
          <div key={b.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="font-serif text-3xl italic text-gradient-frost">{b.tests}</span>
            <Reveal delay={0.15 * i} className="w-full">
              <div
                className="w-full rounded-t-xl border border-frost/30 bg-gradient-to-t from-frost/5 to-frost/30"
                style={{ height: `${30 + b.tests * 1.5}px` }}
              />
            </Reveal>
            <span className="text-center font-mono text-[10px] text-muted">{b.label}</span>
          </div>
        ))}
      </div>
      <p className="font-mono text-[11px] text-dim lg:col-span-2">test sayısı · her turda temiz context, işin bittiğine testler karar veriyor</p>
    </Reveal>
  )
}

export function ColdTake() {
  const [revealed, setRevealed] = useState(false)
  const onReveal = useCallback((v) => setRevealed(v), [])

  return (
    <Section id="cold-take" className="py-32">
      {/* Icy glow behind the section. */}
      <div className="pointer-events-none absolute top-40 left-1/2 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-frost/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
            <span className="mr-2 inline-block h-px w-6 translate-y-[-3px] bg-muted/60 align-middle" />
            03 · Proje · Web + Mobil
          </p>
        </Reveal>

        <div className="mt-6 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <Reveal delay={0.05}>
              <h2 className="font-serif text-7xl leading-none italic sm:text-8xl lg:text-9xl">
                <span className="text-gradient-frost">Cold Take</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-2xl font-medium tracking-tight sm:text-3xl">{coldTake.tagline}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{coldTake.problem}</p>
            </Reveal>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {coldTake.steps.map((s, i) => (
                <Reveal key={s.n} delay={0.1 * i}>
                  <div className={`h-full rounded-2xl border p-4 transition-colors duration-700 ${revealed && i === 2 ? 'border-frost/40 bg-frost/5' : 'border-line'}`}>
                    <span className="font-mono text-xs text-frost">{s.n}</span>
                    <p className="mt-1 font-medium">{s.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <LazyCanvas className="h-[420px] sm:h-[480px]" camera={{ position: [0, 0, 5.2], fov: 40 }} gl={{ alpha: true }}>
              <Suspense fallback={null}>
                <SealScene revealed={revealed} />
              </Suspense>
            </LazyCanvas>
            <RatingDemo onReveal={onReveal} />
          </div>
        </div>

        <div className="mt-28">
          <Reveal>
            <h3 className="text-3xl font-medium tracking-tight sm:text-4xl">
              Kör kural her yerde. <span className="font-serif italic text-gradient-frost">Sosyal ama ön yargısız.</span>
            </h3>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coldTake.features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} tone="frost" />
            ))}
          </div>
        </div>

        <Lab />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
          <Reveal className="glass flex flex-wrap items-center gap-2 rounded-3xl p-6">
            <span className="mr-2 font-mono text-xs uppercase tracking-[0.2em] text-dim">Stack</span>
            {coldTake.stack.map((s) => (
              <Tag key={s}>{s}</Tag>
            ))}
          </Reveal>
          <Reveal className="glass flex items-center gap-8 rounded-3xl px-8 py-6">
            {coldTake.stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-4xl italic text-gradient-frost">
                  <Counter value={s.value} />
                </p>
                <p className="font-mono text-[11px] text-muted">{s.note ?? s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href={site.links.coldTakeLive} tone="frost">Canlı site</LinkButton>
          <LinkButton href={site.links.coldTakeRepo}>GitHub</LinkButton>
        </div>
      </div>
    </Section>
  )
}
