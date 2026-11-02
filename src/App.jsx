import Lenis from 'lenis'
import { useCallback, useEffect, useRef, useState } from 'react'
import { CursorGlow } from './components/ui/CursorGlow'
import { Nav } from './components/ui/Nav'
import { chapters, sections } from './content/site'
import { ColdTake } from './sections/ColdTake'
import { HowIWork, Lessons, Next, Numbers } from './sections/Closing'
import { Hero } from './sections/Hero'
import { Journey } from './sections/Journey'
import { Learnings } from './sections/Learnings'
import { Rota } from './sections/Rota'
import { Chapter } from './sections/shared/Chapter'

const NEXT_KEYS = ['ArrowDown', 'ArrowRight', 'PageDown', ' ']
const PREV_KEYS = ['ArrowUp', 'ArrowLeft', 'PageUp']

// Index of the stop whose top has passed the upper third of the screen.
function currentIndex() {
  const line = window.innerHeight / 3
  let index = 0
  sections.forEach((s, i) => {
    const el = document.getElementById(s.id)
    if (el && el.getBoundingClientRect().top <= line) index = i
  })
  return index
}

// The nav highlights real sections; a chapter card counts as the one after it.
function navId(index) {
  const next = sections.slice(index).find((s) => !s.chapter)
  return next ? next.id : sections[index].id
}

function chapter(id) {
  return <Chapter id={id} {...chapters[id]} />
}

export default function App() {
  const lenis = useRef(null)
  const [active, setActive] = useState('giris')

  const jump = useCallback((target) => {
    const i = typeof target === 'number' ? target : sections.findIndex((s) => s.id === target)
    const el = document.getElementById(sections[Math.max(0, Math.min(sections.length - 1, i))].id)
    lenis.current?.scrollTo(el, { duration: 1.4 })
  }, [])

  // Smooth scrolling + tracking which section is on screen.
  useEffect(() => {
    const instance = new Lenis({ lerp: 0.09 })
    lenis.current = instance
    instance.on('scroll', () => setActive(navId(currentIndex())))
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

  // The hero's 3D products ask to jump to their section.
  useEffect(() => {
    const onJump = (e) => jump(e.detail)
    window.addEventListener('jump-to', onJump)
    return () => window.removeEventListener('jump-to', onJump)
  }, [jump])

  // Presenter mode: arrow keys / PageUp / PageDown / space step through the
  // stops (presentation clickers send PageUp/PageDown).
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
      <CursorGlow />
      <Nav active={active} onJump={jump} />
      <main>
        <Hero />
        {chapter('bolum-1')}
        <Journey />
        <Learnings />
        {chapter('bolum-2')}
        <ColdTake />
        {chapter('bolum-3')}
        <Rota />
        {chapter('bolum-4')}
        <Numbers />
        <HowIWork />
        <Lessons />
        <Next />
      </main>
    </>
  )
}
