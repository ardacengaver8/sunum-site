import { motion, useMotionValue, useSpring } from 'motion/react'
import { useEffect } from 'react'

// A soft light that follows the mouse across the whole page.
export function CursorGlow() {
  const x = useMotionValue(-1000)
  const y = useMotionValue(-1000)
  const sx = useSpring(x, { stiffness: 120, damping: 20 })
  const sy = useSpring(y, { stiffness: 120, damping: 20 })

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [x, y])

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed top-0 left-0 z-40 -mt-[300px] -ml-[300px] hidden h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgb(139_123_255_/_0.10),transparent_60%)] mix-blend-screen md:block"
    />
  )
}
