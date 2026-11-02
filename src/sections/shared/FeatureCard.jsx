import { Reveal } from '../../components/ui/Reveal'
import { Tag } from '../../components/ui/Tag'

// Two-colour gradients per project, rotated per card so the grid isn't flat.
const palettes = {
  frost: [
    ['#9fd8ff', '#3b2d7a'],
    ['#c7b8ff', '#0e2a4a'],
    ['#7ab8ff', '#4b1d5e'],
  ],
  sun: [
    ['#ffb347', '#5a1d3a'],
    ['#4fd1c5', '#2a1a4a'],
    ['#ff7a45', '#123a3a'],
  ],
}

// Template-library style card: image area on top, name + category below.
export function FeatureCard({ feature, index, tone }) {
  const [a, b] = palettes[tone][index % 3]
  return (
    <Reveal delay={(index % 3) * 0.06} className="h-full">
      <article className="group glass h-full overflow-hidden rounded-3xl transition-transform duration-500 hover:-translate-y-1">
        <div
          className="relative h-32 overflow-hidden"
          style={{ background: `radial-gradient(120% 140% at ${20 + (index * 23) % 60}% 0%, ${a}55, transparent 60%), radial-gradient(90% 120% at 100% 100%, ${b}, #0f0e14)` }}
        >
          <span className="absolute right-5 bottom-2 font-serif text-7xl italic text-white/15 transition-transform duration-700 group-hover:scale-110">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-medium tracking-tight">{feature.title}</h4>
            <Tag tone={tone}>{feature.tag}</Tag>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">{feature.text}</p>
        </div>
      </article>
    </Reveal>
  )
}
