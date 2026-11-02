const tones = {
  default: 'border-line text-muted',
  ember: 'border-ember/30 text-ember',
  violet: 'border-violet/30 text-violet',
  frost: 'border-frost/30 text-frost',
  sun: 'border-sun/30 text-sun',
  sea: 'border-sea/30 text-sea',
}

export function Tag({ children, tone = 'default' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  )
}
