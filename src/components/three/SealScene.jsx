import { Environment, Float, Lightformer, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// A made-up film poster drawn on a canvas, so the page needs no image files.
function usePosterTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 768
    const g = c.getContext('2d')

    const sky = g.createLinearGradient(0, 0, 0, 768)
    sky.addColorStop(0, '#0b1a3a')
    sky.addColorStop(0.55, '#5b3d9e')
    sky.addColorStop(1, '#f0806a')
    g.fillStyle = sky
    g.fillRect(0, 0, 512, 768)

    g.fillStyle = '#ffd9a8'
    g.beginPath()
    g.arc(256, 430, 120, 0, Math.PI * 2)
    g.fill()

    g.fillStyle = '#120d24'
    g.beginPath()
    g.moveTo(0, 560)
    g.lineTo(140, 450)
    g.lineTo(230, 520)
    g.lineTo(350, 420)
    g.lineTo(512, 540)
    g.lineTo(512, 768)
    g.lineTo(0, 768)
    g.fill()

    g.fillStyle = '#f5f0ff'
    g.textAlign = 'center'
    g.font = 'italic 92px "Instrument Serif", Georgia, serif'
    g.fillText('Son Kış', 256, 150)
    g.font = '500 20px "Geist Mono", monospace'
    g.fillStyle = 'rgba(245,240,255,0.7)'
    g.fillText('BİR FİLM · 2026', 256, 196)
    g.fillText('SEN PUANLAYANA KADAR MÜHÜRLÜ', 256, 720)

    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])
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

function Poster({ revealed }) {
  const texture = usePosterTexture()
  const group = useRef(null)
  const glass = useRef(null)

  useFrame((state) => {
    const { x, y } = state.pointer
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.35, 0.05)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.2, 0.05)
    const m = glass.current
    if (m) {
      m.roughness = THREE.MathUtils.lerp(m.roughness, revealed ? 0 : 0.55, 0.04)
      m.distortion = THREE.MathUtils.lerp(m.distortion, revealed ? 0 : 0.6, 0.04)
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.5}>
      <group ref={group}>
        <mesh position={[0, 0, -0.08]}>
          <planeGeometry args={[2, 3]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
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
    </Float>
  )
}

export function SealScene({ revealed }) {
  return (
    <>
      <Poster revealed={revealed} />
      <Environment resolution={256}>
        <Lightformer intensity={2} color="#9fd8ff" position={[-3, 2, 3]} scale={[4, 4, 1]} />
        <Lightformer intensity={2} color="#c7b8ff" position={[3, -1, 3]} scale={[4, 4, 1]} />
      </Environment>
    </>
  )
}
