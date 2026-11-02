import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'

// A real screenshot in a browser window that tilts back and straightens up as
// it scrolls in.
export function ScreenFrame({ src, url, alt, glow = '#9fd8ff' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const rotateX = useTransform(scrollYProgress, [0, 1], [28, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.35], [0, 1])

  return (
    <div ref={ref} className="[perspective:1400px]">
      <motion.figure
        style={{ rotateX, scale, opacity, boxShadow: `0 40px 120px -30px ${glow}55` }}
        className="overflow-hidden rounded-2xl border border-white/10 bg-surface"
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-raise px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="mx-auto truncate rounded-md bg-white/5 px-3 py-0.5 font-mono text-[11px] text-muted">{url}</span>
        </div>
        <img src={src} alt={alt} loading="lazy" className="block w-full" />
      </motion.figure>
    </div>
  )
}
