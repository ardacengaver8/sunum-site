import { Reveal } from '../../components/ui/Reveal'

// Numbered notes that explain what the screenshot above shows.
export function Callouts({ items, tone = 'text-frost' }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {items.map((text, i) => (
        <Reveal key={text} delay={i * 0.08} className="flex gap-3">
          <span className={`font-serif text-2xl italic ${tone}`}>{i + 1}</span>
          <p className="text-sm leading-relaxed text-muted">{text}</p>
        </Reveal>
      ))}
    </div>
  )
}
