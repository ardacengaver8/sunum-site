import { Canvas } from '@react-three/fiber'
import { motion } from 'motion/react'
import { Suspense, useRef } from 'react'
import { HeroScene } from '../components/three/HeroScene'
import { site } from '../content/site'

const rise = (delay) => ({
  initial: { opacity: 0, y: 40, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] },
})

export function Hero() {
  const ref = useRef(null)
  const tag = useRef(null)

  return (
    <section id="giris" data-section ref={ref} className="relative h-svh min-h-[640px] overflow-hidden">
      <div className="absolute inset-0">
        <Canvas
          eventSource={ref}
          eventPrefix="client"
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.4, 9], fov: 40 }}
        >
          <Suspense fallback={null}>
            <HeroScene tag={tag} />
          </Suspense>
        </Canvas>
        {/* The hovered product's name, placed by the scene. */}
        <span
          ref={tag}
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border bg-ink/80 px-3 py-1 font-serif text-base whitespace-nowrap italic opacity-0 backdrop-blur transition-opacity duration-300"
        />
      </div>

      {/* Darken the bottom so the headline stays readable over the pylons. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink via-ink/60 to-transparent" />

      <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-14 sm:px-8 sm:pb-20">
        <motion.p {...rise(0.2)} className="font-mono text-xs tracking-[0.2em] text-muted">
          {site.name} · {site.team} · {site.range}
        </motion.p>
        <motion.h1
          {...rise(0.35)}
          className="mt-6 text-[13vw] font-medium leading-[0.92] tracking-[-0.04em] sm:text-[8.5vw] lg:text-[7.4rem]"
        >
          <span className="font-serif font-normal italic text-gradient-dusk">3,5 haftada</span>
          <br />
          iki canlı ürün.
        </motion.h1>
        <motion.div
          {...rise(0.55)}
          className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-xl text-lg leading-relaxed text-muted">
            AI engineering’i okuyarak değil, yaparak öğrendim. Bu sayfa o yolculuğun haritası:
            ne öğrendim, <span className="text-frost">Cold Take</span> ve{' '}
            <span className="text-sun">Rota</span> nasıl doğdu.
          </p>
          <ul className="space-y-1.5 font-mono text-[11px] text-dim">
            <li><span className="text-ember">●</span> ortada model</li>
            <li><span className="text-violet">◇</span> etrafında harness: tool, skill, hook, alt ajan, hafıza, test</li>
            <li><span className="text-ember">→</span> turuncu ışık çağrı, <span className="text-sea">yeşil</span> ışık dönen sonuç</li>
            <li><span className="text-frost">◆</span> yörüngede Cold Take ve Rota: tıkla, oraya git</li>
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
