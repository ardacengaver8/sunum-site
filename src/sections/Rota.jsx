import { motion } from 'motion/react'
import { Suspense } from 'react'
import { GlobeScene } from '../components/three/GlobeScene'
import { LazyCanvas } from '../components/three/LazyCanvas'
import { Counter } from '../components/ui/Counter'
import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { Tag } from '../components/ui/Tag'
import { rota } from '../content/rota'
import { site } from '../content/site'
import { ChatDemo } from './rota/ChatDemo'
import { Flow } from './rota/Flow'
import { Callouts } from './shared/Callouts'
import { FeatureCard } from './shared/FeatureCard'
import { LinkButton } from './shared/LinkButton'
import { ScreenFrame } from './shared/ScreenFrame'

function SubHeading({ children, accent }) {
  return (
    <Reveal>
      <h3 className="text-3xl font-medium tracking-tight sm:text-4xl">
        {children} {accent && <span className="font-serif italic text-gradient-sun">{accent}</span>}
      </h3>
    </Reveal>
  )
}

function Phases() {
  return (
    <div className="mt-10 flex flex-wrap gap-2">
      {rota.phases.map((p, i) => {
        const done = i < rota.phasesDone
        return (
          <motion.span
            key={p}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.035 }}
            className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${done ? 'border-sun/30 bg-sun/[0.06]' : 'border-dashed border-line text-muted'}`}
          >
            <span className={`font-mono text-[11px] ${done ? 'text-sun' : 'text-dim'}`}>{i}</span>
            {p}
            {!done && <span className="font-mono text-[10px] text-ember">· şimdi</span>}
          </motion.span>
        )
      })}
    </div>
  )
}

function Hunt() {
  const { hunt } = rota
  const max = Math.max(...hunt.speed.map((s) => s.before))
  return (
    <Reveal className="glass grid gap-10 rounded-3xl p-7 lg:grid-cols-2 lg:p-10">
      <div>
        <Tag tone="sun">LangSmith · alt ajanlar</Tag>
        <h3 className="mt-4 text-2xl font-medium tracking-tight">{hunt.title}</h3>
        <p className="mt-3 leading-relaxed text-muted">{hunt.text}</p>
        <div className="mt-8 grid grid-cols-3 gap-4">
          {hunt.numbers.map((n) => (
            <div key={n.label}>
              <p className="font-serif text-5xl italic text-gradient-sun">
                <Counter value={n.value} />
              </p>
              <p className="font-mono text-[11px] text-muted">{n.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6 self-center">
        {hunt.speed.map((s, i) => (
          <div key={s.label}>
            <div className="flex justify-between text-sm">
              <span>{s.label}</span>
              <span className="font-mono text-xs text-muted">
                {s.before.toLocaleString('tr-TR')} → <span className="text-sea">{s.after.toLocaleString('tr-TR')}</span> {s.unit}
              </span>
            </div>
            <div className="relative mt-2 h-2.5 rounded-full bg-white/5">
              <div className="absolute inset-y-0 left-0 rounded-full bg-white/10" style={{ width: `${(s.before / max) * 100}%` }} />
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sea to-sun"
                initial={{ width: `${(s.before / max) * 100}%` }}
                whileInView={{ width: `${(s.after / max) * 100}%` }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 1.4, delay: 0.3 + i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>
        ))}
      </div>
    </Reveal>
  )
}

export function Rota() {
  return (
    <Section id="rota" className="py-32">
      <div className="pointer-events-none absolute top-20 right-0 h-[40rem] w-[50rem] rounded-full bg-sun/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
            <span className="mr-2 inline-block h-px w-6 translate-y-[-3px] bg-muted/60 align-middle" />
            04 · Proje · AI Agent
          </p>
        </Reveal>

        <div className="mt-6 grid items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <Reveal delay={0.05}>
              <h2 className="font-serif text-8xl leading-none italic sm:text-9xl lg:text-[10rem]">
                <span className="text-gradient-sun">Rota</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-2xl font-medium tracking-tight sm:text-3xl">{rota.tagline}</p>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{rota.intro}</p>
            </Reveal>
          </div>
          <LazyCanvas className="h-[420px] sm:h-[560px]" camera={{ position: [0, 0, 5.9], fov: 40 }} gl={{ alpha: true }}>
            <Suspense fallback={null}>
              <GlobeScene />
            </Suspense>
          </LazyCanvas>
        </div>

        <div className="mt-20 grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <SubHeading accent="Kartlar.">Cevap düz yazı değil.</SubHeading>
            <Reveal delay={0.1}>
              <p className="mt-5 leading-relaxed text-muted">
                Agent çalışırken ne yaptığını adım adım gösteriyor. Sonuç, akıştaki olaylardan çizilen kartlar: seçenekler
                kartpostal, ulaşım bilet, bütçe fiş. Buna <span className="text-fg">generative UI</span> deniyor.
              </p>
            </Reveal>
          </div>
          <ChatDemo />
        </div>

        <div className="mt-32">
          <SubHeading accent="Belgrad, 3 kişi.">Gerçek bir plan:</SubHeading>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-muted">{rota.screen.lead}</p>
          </Reveal>
          <div className="mt-10">
            <ScreenFrame src="./shots/rota-plan.webp" url="rota · paylaşım linki" alt="Rota'nın Belgrad planı" glow="#ffb347" />
          </div>
          <Callouts items={rota.screen.notes} tone="text-sun" />
        </div>

        <div className="mt-32">
          <div className="mx-auto max-w-3xl text-center">
            <SubHeading accent="yolculuğu">Bir mesajın</SubHeading>
            <Reveal delay={0.1}>
              <p className="mt-4 text-muted">Enter’a bastığın andan kartın çizildiği ana kadar. Kaydırdıkça ilerliyor.</p>
            </Reveal>
          </div>
          <div className="mt-16">
            <Flow />
          </div>
        </div>

        <div className="mt-32">
          <SubHeading accent="22 aşama.">Plandan internete:</SubHeading>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-muted">
              Her aşama ayrı bir dal ve PR. CI yeşil olmadan merge yok. İlk 15 aşama 4 günde bitti.
            </p>
          </Reveal>
          <Phases />
        </div>

        <div className="mt-24">
          <SubHeading accent="Planlamaktan fazlası.">Bir gezi uygulaması:</SubHeading>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rota.features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} tone="sun" />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <Hunt />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_auto]">
          <Reveal className="glass rounded-3xl p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-xs uppercase tracking-[0.2em] text-dim">Stack</span>
              {rota.stack.map((s) => (
                <Tag key={s.name} tone={s.spec ? 'sun' : 'default'}>
                  {s.name}
                </Tag>
              ))}
            </div>
            <p className="mt-4 font-mono text-[11px] text-dim">
              <span className="text-sun">turuncu</span> = ekipten gelen zorunlu teknoloji
            </p>
          </Reveal>
          <Reveal className="glass grid grid-cols-2 gap-x-8 gap-y-4 rounded-3xl px-8 py-6 sm:grid-cols-4">
            {rota.stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-4xl italic text-gradient-sun">
                  <Counter value={s.value} />
                </p>
                <p className="font-mono text-[11px] text-muted">{s.label}</p>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href={site.links.rotaRepo} tone="sun">GitHub</LinkButton>
        </div>
      </div>
    </Section>
  )
}
