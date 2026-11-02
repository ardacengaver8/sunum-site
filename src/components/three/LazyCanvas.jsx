import { Canvas } from '@react-three/fiber'
import { useInView } from 'motion/react'
import { useRef } from 'react'

// Mounts the WebGL canvas the first time it comes near the screen and pauses
// rendering while it is off screen, so several 3D scenes can share one page.
export function LazyCanvas({ children, className = '', ...props }) {
  const ref = useRef(null)
  const near = useInView(ref, { once: true, margin: '400px 0px' })
  const visible = useInView(ref, { margin: '100px 0px' })

  return (
    <div ref={ref} className={className}>
      {near && (
        <Canvas dpr={[1, 1.75]} frameloop={visible ? 'always' : 'never'} {...props}>
          {children}
        </Canvas>
      )}
    </div>
  )
}
