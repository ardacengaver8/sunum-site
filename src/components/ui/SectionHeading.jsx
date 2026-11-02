import { Reveal } from './Reveal'

// Eyebrow (small mono label) + big title. `accent` is the serif italic part.
export function SectionHeading({ eyebrow, title, accent, accentClass = 'text-gradient-dusk', lead, align = 'left' }) {
  const center = align === 'center'
  return (
    <div className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <Reveal>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
          <span className="mr-2 inline-block h-px w-6 translate-y-[-3px] bg-muted/60 align-middle" />
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-tight sm:text-6xl">
          {title}{' '}
          {accent && <span className={`font-serif font-normal italic ${accentClass}`}>{accent}</span>}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.16}>
          <p className="mt-6 text-lg leading-relaxed text-muted">{lead}</p>
        </Reveal>
      )}
    </div>
  )
}
