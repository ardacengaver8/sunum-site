import {
  Brain, CalendarHeart, ChartColumn, Clapperboard, CloudRain, Import, Languages, Link, ListOrdered,
  MapPin, Receipt, RefreshCw, Route, Rss, Scale, Signpost, TrainFront, Users, UsersRound, Vibrate, Zap,
} from 'lucide-react'
import { Reveal } from '../../components/ui/Reveal'
import { Tag } from '../../components/ui/Tag'

// Only the icons the content uses, so the bundle stays small.
const icons = {
  Brain, CalendarHeart, ChartColumn, Clapperboard, CloudRain, Import, Languages, Link, ListOrdered,
  MapPin, Receipt, RefreshCw, Route, Rss, Scale, Signpost, TrainFront, Users, UsersRound, Vibrate, Zap,
}

const tones = {
  frost: { a: '#9fd8ff', b: '#c7b8ff', deep: '#1a2350' },
  sun: { a: '#ffb347', b: '#4fd1c5', deep: '#3a1c1c' },
}

// Template-library style card: a lit icon on top, name + category below.
export function FeatureCard({ feature, index, tone }) {
  const Icon = icons[feature.icon]
  const c = tones[tone]
  const glow = index % 2 ? c.b : c.a
  return (
    <Reveal delay={(index % 4) * 0.06} className="h-full">
      <article className="group glass h-full overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:border-white/20">
        <div
          className="relative flex h-36 items-center justify-center overflow-hidden"
          style={{ background: `radial-gradient(70% 90% at 50% 100%, ${glow}33, transparent 70%), linear-gradient(180deg, #0f0e14, ${c.deep}66)` }}
        >
          {/* Faint grid, like a design canvas. */}
          <div
            className="absolute inset-0 opacity-40 [mask-image:radial-gradient(60%_80%_at_50%_60%,black,transparent)]"
            style={{ backgroundImage: 'linear-gradient(rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.06) 1px, transparent 1px)', backgroundSize: '22px 22px' }}
          />
          <div
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-white/5 backdrop-blur transition-transform duration-700 group-hover:scale-110 group-hover:rotate-[-4deg]"
            style={{ boxShadow: `0 0 40px ${glow}40, inset 0 1px 0 rgb(255 255 255 / 0.15)` }}
          >
            {Icon && <Icon size={28} strokeWidth={1.4} color={glow} />}
          </div>
          <span className="absolute top-3 left-4 font-mono text-[10px] text-white/30">{String(index + 1).padStart(2, '0')}</span>
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
