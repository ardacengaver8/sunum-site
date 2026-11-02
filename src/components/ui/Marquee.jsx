// An endless row of words. Two copies slide left so the loop has no seam.
export function Marquee({ items, reverse = false, duration = 40 }) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((it) => (
        <span key={it} className="flex items-center gap-10 font-serif text-4xl whitespace-nowrap italic text-fg/70 sm:text-5xl">
          {it}
          <span className="h-1.5 w-1.5 rounded-full bg-ember/70" />
        </span>
      ))}
    </div>
  )
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
      <div className="flex" style={{ animation: `marquee ${duration}s linear infinite ${reverse ? 'reverse' : ''}` }}>
        {row}
        {row}
      </div>
    </div>
  )
}
