import Lenis from 'lenis'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Nav } from './components/ui/Nav'
import { sections } from './content/site'
import { ColdTake } from './sections/ColdTake'
import { HowIWork, Lessons, Next, Numbers } from './sections/Closing'
import { Hero } from './sections/Hero'
import { Journey } from './sections/Journey'
import { Learnings } from './sections/Learnings'
import { Rota } from './sections/Rota'

const NEXT_KEYS = ['ArrowDown', 'ArrowRight', 'PageDown', ' ']
const PREV_KEYS = ['ArrowUp', 'ArrowLeft', 'PageUp']

// Index of the section whose top has passed the upper third of the screen.
function currentIndex() {
  const line = window.innerHeight / 3
  let index = 0
  sections.forEach((s, i) => {
    const el = document.getElementById(s.id)
    if (el && el.getBoundingClientRect().top <= line) index = i
  })
  return index
}

export default function App() {
  const lenis = useRef(null)
  const [active, setActive] = useState(0)

  const jump = useCallback((i) => {
    const target = document.getElementById(sections[Math.max(0, Math.min(sections.length - 1, i))].id)
    lenis.current?.scrollTo(target, { duration: 1.4 })
  }, [])

  // Smooth scrolling + tracking which section is on screen.
  useEffect(() => {
    const instance = new Lenis({ lerp: 0.09 })
    lenis.current = instance
    instance.on('scroll', () => setActive(currentIndex()))
    let frame
    const raf = (time) => {
      instance.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      instance.destroy()
    }
  }, [])

  // Presenter mode: arrow keys / PageUp / PageDown / space jump between
  // sections (presentation clickers send PageUp/PageDown).
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest('input, textarea, button')) return
      const step = NEXT_KEYS.includes(e.key) ? 1 : PREV_KEYS.includes(e.key) ? -1 : 0
      if (!step) return
      e.preventDefault()
      jump(currentIndex() + step)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [jump])

  return (
    <>
      <div className="grain" />
      <Nav active={active} onJump={jump} />
      <main>
        <Hero />
        <Journey />
        <Learnings />
        <ColdTake />
        <Rota />
        <Numbers />
        <HowIWork />
        <Lessons />
        <Next />
      </main>
    </>
  )
}
