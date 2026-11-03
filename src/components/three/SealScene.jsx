import { Environment, Float, Lightformer, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { ROOM_AVG, roomCurve } from '../../sections/coldtake/room'

// A made-up film poster drawn on a canvas, so the page needs no image files.
// With a `score` it is the opened poster: the room's average, the spread of
// everyone's scores and your own line on it.
export function usePosterTexture(score = null) {
  return useMemo(() => {
    const W = 1024
    const H = 1536
    const c = document.createElement('canvas')
    c.width = W
    c.height = H
    const g = c.getContext('2d')

    const sky = g.createLinearGradient(0, 0, 0, H)
    sky.addColorStop(0, '#0b1a3a')
    sky.addColorStop(0.55, '#5b3d9e')
    sky.addColorStop(1, '#f0806a')
    g.fillStyle = sky
    g.fillRect(0, 0, W, H)

    g.fillStyle = '#ffd9a8'
    g.beginPath()
    g.arc(512, 860, 240, 0, Math.PI * 2)
    g.fill()

    g.fillStyle = '#120d24'
    g.beginPath()
    g.moveTo(0, 1120)
    g.lineTo(280, 900)
    g.lineTo(460, 1040)
    g.lineTo(700, 840)
    g.lineTo(W, 1080)
    g.lineTo(W, H)
    g.lineTo(0, H)
    g.fill()

    g.fillStyle = '#f5f0ff'
    g.textAlign = 'center'
    g.font = 'italic 184px "Instrument Serif", Georgia, serif'
    g.fillText('Son Kış', 512, 300)
    g.font = '500 40px "Geist Mono", monospace'
    g.fillStyle = 'rgba(245,240,255,0.75)'
    g.fillText('BİR FİLM · 2026', 512, 392)

    if (score === null) {
      g.fillText('SEN PUANLAYANA KADAR MÜHÜRLÜ', 512, 1440)
    } else {
      // The opened panel over the dark hills.
      const top = 1130
      g.fillStyle = 'rgba(7,6,10,0.72)'
      g.fillRect(0, top, W, H - top)
      g.textAlign = 'left'
      g.font = '500 30px "Geist Mono", monospace'
      g.fillStyle = 'rgba(199,184,255,0.9)'
      g.fillText('SALON', 70, top + 70)
      g.fillStyle = 'rgba(159,216,255,0.95)'
      g.textAlign = 'right'
      g.fillText('SEN', W - 70, top + 70)
      g.font = 'italic 110px "Instrument Serif", Georgia, serif'
      g.fillStyle = '#c7b8ff'
      g.textAlign = 'left'
      g.fillText(ROOM_AVG.toFixed(1), 70, top + 170)
      g.fillStyle = '#9fd8ff'
      g.textAlign = 'right'
      g.fillText(score.toFixed(1), W - 70, top + 170)

      // The hill of everyone's scores, 1 to 10, with your score on it.
      const x0 = 70
      const x1 = W - 70
      const base = H - 50
      const tall = 170
      const sx = (v) => x0 + ((v - 1) / 9) * (x1 - x0)
      g.beginPath()
      g.moveTo(x0, base)
      for (let i = 0; i <= 120; i++) {
        const v = 1 + (i / 120) * 9
        g.lineTo(sx(v), base - roomCurve(v) * tall)
      }
      g.lineTo(x1, base)
      g.closePath()
      g.fillStyle = 'rgba(199,184,255,0.35)'
      g.fill()
      g.strokeStyle = '#c7b8ff'
      g.lineWidth = 4
      g.stroke()
      g.strokeStyle = '#9fd8ff'
      g.lineWidth = 8
      g.beginPath()
      g.moveTo(sx(score), base)
      g.lineTo(sx(score), base - tall - 20)
      g.stroke()
    }

    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  }, [score])
}

// The seal: an eye pressed into the frost. It shrinks away when revealed.
function EyeSeal({ revealed }) {
  const ref = useRef(null)
  const pupil = useRef(null)

  useFrame((state) => {
    const s = THREE.MathUtils.lerp(ref.current.scale.x, revealed ? 0.001 : 1, 0.08)
    ref.current.scale.setScalar(s)
    pupil.current.position.x = THREE.MathUtils.lerp(pupil.current.position.x, state.pointer.x * 0.08, 0.1)
    pupil.current.position.y = THREE.MathUtils.lerp(pupil.current.position.y, state.pointer.y * 0.05, 0.1)
  })

  return (
    <group ref={ref} position={[0, 0, 0.32]}>
      <mesh scale={[1, 0.55, 1]}>
        <torusGeometry args={[0.42, 0.035, 16, 80]} />
        <meshBasicMaterial color="#cfeaff" toneMapped={false} />
      </mesh>
      <mesh ref={pupil}>
        <circleGeometry args={[0.13, 48]} />
        <meshBasicMaterial color="#9fd8ff" toneMapped={false} />
      </mesh>
    </group>
  )
}

function Poster({ score }) {
  const revealed = score !== null
  const texture = usePosterTexture(score)
  const group = useRef(null)
  const glass = useRef(null)
  const lid = useRef(null)

  useFrame((state, delta) => {
    const { x, y } = state.pointer
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.35, 0.05)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.2, 0.05)
    const m = glass.current
    if (m) {
      m.roughness = THREE.MathUtils.lerp(m.roughness, revealed ? 0 : 0.55, 0.04)
      m.distortion = THREE.MathUtils.lerp(m.distortion, revealed ? 0 : 0.6, 0.04)
    }
    // Opening slides the frosted glass up and out of the way, so the
    // poster underneath is seen sharp, not through the glass.
    const l = lid.current
    l.position.y = THREE.MathUtils.damp(l.position.y, revealed ? 5 : 0, revealed ? 2.2 : 5, delta)
    l.rotation.x = THREE.MathUtils.damp(l.rotation.x, revealed ? -0.6 : 0, 2.2, delta)
    l.visible = l.position.y < 4
  })

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.5}>
      <group ref={group}>
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[2, 3]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <group ref={lid}>
          <RoundedBox args={[2.25, 3.25, 0.28]} radius={0.08} smoothness={6} position={[0, 0, 0.12]}>
            <MeshTransmissionMaterial
              ref={glass}
              samples={6}
              resolution={512}
              thickness={0.5}
              roughness={0.55}
              ior={1.2}
              chromaticAberration={0.25}
              distortion={0.6}
              distortionScale={0.5}
              temporalDistortion={0.05}
              color="#eaf6ff"
            />
          </RoundedBox>
          <EyeSeal revealed={revealed} />
        </group>
      </group>
    </Float>
  )
}

export function SealScene({ score }) {
  return (
    <>
      <Poster score={score} />
      <Environment resolution={256}>
        <Lightformer intensity={2} color="#9fd8ff" position={[-3, 2, 3]} scale={[4, 4, 1]} />
        <Lightformer intensity={2} color="#c7b8ff" position={[3, -1, 3]} scale={[4, 4, 1]} />
      </Environment>
    </>
  )
}
