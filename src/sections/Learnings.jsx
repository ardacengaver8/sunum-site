import { Reveal } from '../components/ui/Reveal'
import { Section } from '../components/ui/Section'
import { SectionHeading } from '../components/ui/SectionHeading'
import { learnings } from '../content/learnings'
import { visuals } from './learnings/visuals'

function Card({ item, index }) {
  const Visual = visuals[item.visual]
  return (
    <Reveal delay={(index % 4) * 0.07} className="h-full">
      <article className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl transition-colors duration-500 hover:border-white/20">
        <div className="relative h-40 border-b border-line bg-gradient-to-b from-white/[0.03] to-transparent p-4">
          <Visual />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <span className="font-mono text-[11px] text-dim">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="mt-2 text-xl font-medium tracking-tight">{item.title}</h3>
          <p className="mt-1 font-serif text-lg italic text-fg/80">{item.lead}</p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted">
            {item.points.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ember" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  )
}

export function Learnings() {
  return (
    <Section id="ogrendiklerim" className="py-32">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="02 · Öğrendiklerim"
          title="Kavramlar,"
          accent="ellerimle denediğim haliyle."
          lead="AI Engineering Bazaar ve Claude Academy’de okuduklarımı, Amirkia ile her gün 16:00’daki daily’de sorduklarımı ve projelerde gördüklerimi sekiz başlıkta topladım."
        />
        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {learnings.map((item, i) => (
            <Card key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </Section>
  )
}
