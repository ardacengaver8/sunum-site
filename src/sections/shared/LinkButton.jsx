const tones = {
  default: 'border-line text-fg hover:bg-white/5',
  frost: 'border-frost/40 text-frost hover:bg-frost/10',
  sun: 'border-sun/40 text-sun hover:bg-sun/10',
}

// Renders nothing when there is no link yet (links live in content/site.js).
export function LinkButton({ href, children, tone = 'default' }) {
  if (!href) return null
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm transition-colors ${tones[tone]}`}
    >
      {children}
      <span aria-hidden>↗</span>
    </a>
  )
}
