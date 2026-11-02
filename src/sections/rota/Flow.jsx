import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useRef, useState } from 'react'
import { rota } from '../../content/rota'

// "One message's journey": a glowing line fills as you scroll and each layer
// it reaches lights up.
export function Flow() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 55%'] })
  const [active, setActive] = useState(-1)
  const steps = rota.flow

  useMotionValueEvent(scrollYProgress, 'change', (v) => setActive(Math.floor(v * steps.length - 0.01)))

  return (
    <div ref={ref} className="relative mx-auto max-w-3xl">
      <div className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-line sm:left-1/2" />
      <motion.div
        style={{ scaleY: scrollYProgress }}
        className="absolute top-2 bottom-2 left-[1.15rem] w-px origin-top bg-gradient-to-b from-sun via-ember to-sea shadow-[0_0_12px_#ffb347] sm:left-1/2"
      />
      <ol className="space-y-6">
        {steps.map((s, i) => {
          const on = i <= active
          const right = i % 2 === 1
          return (
            <li key={s.node} className="relative grid grid-cols-[2.3rem_1fr] items-center sm:grid-cols-[1fr_2.3rem_1fr]">
              <div className={`hidden sm:block ${right ? '' : 'pr-8 text-right'}`}>
                {!right && <Body s={s} on={on} />}
              </div>
              <div className="flex justify-center">
                <span
                  className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border font-mono text-xs transition-all duration-500 ${on ? 'border-sun bg-sun text-ink shadow-[0_0_24px_#ffb347]' : 'border-line bg-surface text-dim'}`}
                >
                  {i + 1}
                </span>
              </div>
              <div className={`pl-4 sm:pl-8 ${right ? '' : 'sm:hidden'}`}>
                <Body s={s} on={on} />
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function Body({ s, on }) {
  return (
    <div className={`transition-opacity duration-500 ${on ? 'opacity-100' : 'opacity-35'}`}>
      <p className="text-lg font-medium tracking-tight">{s.node}</p>
      <p className="font-mono text-[11px] text-sun">{s.tech}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
    </div>
  )
}
