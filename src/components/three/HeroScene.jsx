import { Environment, Html, Lightformer, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

// The hero tells the whole story in one picture: the model in the middle,
// the harness orbiting it, tool calls pulsing out and back (the agent loop),
// tokens streaming into the context, and the two products further out.

const HARNESS = ['CLAUDE.md', 'skill', 'hook', 'alt ajan', 'hafıza', 'test']
const RING_R = 2.05
const RING_TILT = 1.15
const TOKENS = 700
const X_AXIS = new THREE.Vector3(1, 0, 0)

const tmp = new THREE.Vector3()

function ringPos(i, t, out) {
  const a = (i / HARNESS.length) * Math.PI * 2 + t * 0.18
  out.set(Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R)
  return out.applyAxisAngle(X_AXIS, RING_TILT - Math.PI / 2)
}

const jumpTo = (id) => window.dispatchEvent(new CustomEvent('jump-to', { detail: id }))

function Core({ pulse }) {
  const glass = useRef(null)
  const heart = useRef(null)
  const wire = useRef(null)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    glass.current.rotation.y += delta * 0.2
    glass.current.rotation.x += delta * 0.07
    wire.current.rotation.y -= delta * 0.1
    heart.current.scale.setScalar(1 + Math.sin(t * 2.2) * 0.04 + pulse.current * 0.22)
    pulse.current = THREE.MathUtils.lerp(pulse.current, 0, 0.08)
  })

  return (
    <group>
      <mesh ref={heart}>
        <sphereGeometry args={[0.26, 48, 48]} />
        <meshBasicMaterial color="#ffd2b0" toneMapped={false} />
      </mesh>
      <mesh scale={0.45}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#ff7a45" transparent opacity={0.25} toneMapped={false} />
      </mesh>
      <mesh ref={glass}>
        <icosahedronGeometry args={[0.95, 1]} />
        <MeshTransmissionMaterial
          samples={6}
          resolution={512}
          thickness={0.25}
          roughness={0}
          ior={1.15}
          chromaticAberration={0.9}
          anisotropy={0.3}
          distortion={0.2}
          distortionScale={0.3}
          temporalDistortion={0.1}
          color="#ffffff"
          flatShading
        />
      </mesh>
      <mesh ref={wire} scale={1.22}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#8b7bff" wireframe transparent opacity={0.18} />
      </mesh>
      <Html center position={[0, -1.45, 0]} className="pointer-events-none">
        <span className="font-mono text-[10px] tracking-[0.25em] whitespace-nowrap text-ember">MODEL</span>
      </Html>
    </group>
  )
}

// Tokens spiral in from far away and vanish into the core: the context.
function TokenStream() {
  const ref = useRef(null)
  const { positions, colors, seeds } = useMemo(() => {
    const positions = new Float32Array(TOKENS * 3)
    const colors = new Float32Array(TOKENS * 3)
    const seeds = Array.from({ length: TOKENS }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 1.2 + Math.random() * 6,
      y: (Math.random() - 0.5) * 3,
      s: 0.25 + Math.random() * 0.5,
    }))
    const palette = ['#8b7bff', '#ff7a45', '#9fd8ff', '#ffb347'].map((c) => new THREE.Color(c))
    seeds.forEach((_, i) => palette[i % 4].toArray(colors, i * 3))
    return { positions, colors, seeds }
  }, [])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)
    seeds.forEach((p, i) => {
      p.r -= d * p.s * (0.6 + 2 / p.r)
      p.a += d * (0.9 / p.r)
      if (p.r < 0.9) {
        p.r = 5 + Math.random() * 2.5
        p.y = (Math.random() - 0.5) * 3
      }
      const k = Math.min(1, (p.r - 0.9) / 3)
      positions[i * 3] = Math.cos(p.a) * p.r
      positions[i * 3 + 1] = p.y * k
      positions[i * 3 + 2] = Math.sin(p.a) * p.r
    })
    ref.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={ref} rotation-x={0.25}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} vertexColors transparent opacity={0.85} sizeAttenuation toneMapped={false} depthWrite={false} />
    </points>
  )
}

// The harness ring. One node at a time gets a tool call: a light runs from
// the core to it and back, and the core beats when it returns.
function Harness({ pulse }) {
  const nodes = useRef([])
  const labels = useRef([])
  const spark = useRef(null)
  const beam = useRef(null)
  const beamGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]), [])
  const last = useRef(-1)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const cycle = 1.4
    const round = Math.floor(t / cycle)
    const which = round % HARNESS.length
    const phase = (t % cycle) / cycle // out 0–.45, back .45–.9, rest

    HARNESS.forEach((_, i) => {
      const n = nodes.current[i]
      if (!n) return
      ringPos(i, t, n.position)
      n.rotation.set(t * 0.4, t * 0.6 + i, 0)
      const hit = i === which && phase > 0.38 && phase < 0.6
      n.scale.setScalar(THREE.MathUtils.lerp(n.scale.x, hit ? 1.6 : 1, 0.15))
      if (labels.current[i]) labels.current[i].style.opacity = i === which && phase < 0.9 ? '1' : '0.4'
    })

    const target = nodes.current[which]
    if (!target) return
    const out = phase < 0.45 ? phase / 0.45 : phase < 0.9 ? 1 - (phase - 0.45) / 0.45 : 0
    spark.current.position.copy(tmp.copy(target.position).multiplyScalar(out))
    spark.current.visible = phase < 0.9
    beamGeo.attributes.position.setXYZ(1, target.position.x, target.position.y, target.position.z)
    beamGeo.attributes.position.needsUpdate = true
    beam.current.material.opacity = phase < 0.9 ? 0.4 * Math.sin((Math.PI * phase) / 0.9) : 0

    if (phase >= 0.88 && last.current !== round) {
      last.current = round
      pulse.current = 1
    }
  })

  return (
    <group>
      <mesh rotation-x={RING_TILT}>
        <torusGeometry args={[RING_R, 0.004, 8, 160]} />
        <meshBasicMaterial color="#8b7bff" transparent opacity={0.35} />
      </mesh>
      <line ref={beam} geometry={beamGeo}>
        <lineBasicMaterial color="#ffd9a8" transparent opacity={0} toneMapped={false} />
      </line>
      <mesh ref={spark}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#fff1e0" toneMapped={false} />
      </mesh>
      {HARNESS.map((name, i) => (
        <group key={name} ref={(el) => (nodes.current[i] = el)}>
          <RoundedBox args={[0.26, 0.26, 0.26]} radius={0.05}>
            <meshStandardMaterial color="#1c1830" emissive="#8b7bff" emissiveIntensity={0.9} metalness={0.4} roughness={0.25} />
          </RoundedBox>
          <Html center position={[0, -0.36, 0]} className="pointer-events-none">
            <span
              ref={(el) => (labels.current[i] = el)}
              className="rounded-full border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[10px] whitespace-nowrap text-violet transition-opacity duration-300"
            >
              {name}
            </span>
          </Html>
        </group>
      ))}
    </group>
  )
}

function MiniPoster() {
  return (
    <group>
      <RoundedBox args={[0.5, 0.74, 0.04]} radius={0.03}>
        <meshStandardMaterial color="#2a2560" emissive="#3b2d7a" emissiveIntensity={0.6} roughness={0.4} />
      </RoundedBox>
      <mesh position={[0, -0.24, 0.025]}>
        <circleGeometry args={[0.07, 32]} />
        <meshBasicMaterial color="#f0806a" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.04]}>
        <planeGeometry args={[0.5, 0.74]} />
        <meshBasicMaterial color="#cfeaff" transparent opacity={0.28} />
      </mesh>
      <mesh position={[0, 0.06, 0.05]} scale={[1, 0.55, 1]}>
        <torusGeometry args={[0.12, 0.012, 12, 48]} />
        <meshBasicMaterial color="#9fd8ff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.06, 0.05]}>
        <circleGeometry args={[0.04, 24]} />
        <meshBasicMaterial color="#9fd8ff" toneMapped={false} />
      </mesh>
    </group>
  )
}

function MiniGlobe() {
  const dots = useMemo(() => {
    const n = 420
    const pos = new Float32Array(n * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      pos.set([Math.cos(golden * i) * r * 0.36, y * 0.36, Math.sin(golden * i) * r * 0.36], i * 3)
    }
    return pos
  }, [])
  const arc = useMemo(() => {
    const a = new THREE.Vector3(-0.2, 0.18, 0.25).normalize().multiplyScalar(0.37)
    const b = new THREE.Vector3(0.25, 0.05, 0.25).normalize().multiplyScalar(0.37)
    const mid = a.clone().add(b).normalize().multiplyScalar(0.55)
    return new THREE.BufferGeometry().setFromPoints(new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(30))
  }, [])

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color="#120f1a" />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dots, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.018} color="#ffb347" toneMapped={false} />
      </points>
      <line geometry={arc}>
        <lineBasicMaterial color="#4fd1c5" toneMapped={false} />
      </line>
    </group>
  )
}

// The two products on an outer orbit. Click one to jump to its section.
function Product({ offset, color, label, target, children }) {
  const ref = useRef(null)
  const [hover, setHover] = useState(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const a = offset + t * 0.09
    ref.current.position.set(Math.cos(a) * 2.7, Math.sin(a) * 1.7, Math.sin(a) * 1.2)
    ref.current.rotation.y = Math.sin(t * 0.5 + offset) * 0.4
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, hover ? 1.35 : 1, 0.12))
  })

  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation()
        jumpTo(target)
      }}
      onPointerOver={() => {
        setHover(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHover(false)
        document.body.style.cursor = ''
      }}
    >
      {children}
      <Html center position={[0, -0.62, 0]} zIndexRange={[30, 0]}>
        <button
          onClick={() => jumpTo(target)}
          className="rounded-full border px-2.5 py-1 font-serif text-sm whitespace-nowrap italic backdrop-blur"
          style={{ borderColor: `${color}55`, color, background: '#07060a99' }}
        >
          {label}
        </button>
      </Html>
    </group>
  )
}

function System() {
  const group = useRef(null)
  const pulse = useRef(0)
  const wide = useThree((s) => s.viewport.aspect > 1.1)

  useFrame((state) => {
    const { x, y } = state.pointer
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.35, 0.04)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.2, 0.04)
  })

  return (
    <group ref={group} position={wide ? [1.9, 0.5, 0] : [0, 1.5, 0]} scale={wide ? 1 : 0.62}>
      <Core pulse={pulse} />
      <TokenStream />
      <Harness pulse={pulse} />
      <Product offset={0.4} color="#9fd8ff" label="Cold Take" target="cold-take">
        <MiniPoster />
      </Product>
      <Product offset={0.4 + Math.PI} color="#ffb347" label="Rota" target="rota">
        <MiniGlobe />
      </Product>
    </group>
  )
}

export function HeroScene() {
  return (
    <>
      <color attach="background" args={['#07060a']} />
      <fog attach="fog" args={['#07060a', 9, 18]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={8} color="#ff7a45" distance={5} />
      <System />
      <Environment resolution={256}>
        <Lightformer intensity={6} color="#ff7a45" position={[-4, 2, -2]} scale={[6, 2, 1]} />
        <Lightformer intensity={6} color="#8b7bff" position={[4, 3, 2]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={4} color="#ffffff" position={[0, 2, 6]} scale={3} />
      </Environment>
    </>
  )
}
