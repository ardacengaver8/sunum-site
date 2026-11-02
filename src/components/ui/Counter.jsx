import { animate, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const format = (n, decimals) =>
  n.toLocaleString('tr-TR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })

// Counts up from 0 to `value` once it scrolls into view.
export function Counter({ value, decimals = 0, duration = 1.8 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const [shown, setShown] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: setShown })
    return () => controls.stop()
  }, [inView, value, duration])

  return <span ref={ref}>{format(shown, decimals)}</span>
}
