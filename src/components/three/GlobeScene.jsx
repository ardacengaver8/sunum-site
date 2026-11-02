import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const R = 2
const DEG = Math.PI / 180

const CITIES = {
  istanbul: [41.01, 28.98],
  izmir: [38.42, 27.14],
  ankara: [39.93, 32.86],
  sapanca: [40.69, 30.27],
  amasya: [40.65, 35.83],
  kapadokya: [38.64, 34.83],
  fethiye: [36.62, 29.12],
  roma: [41.9, 12.5],
  paris: [48.86, 2.35],
  berlin: [52.52, 13.4],
  prag: [50.08, 14.43],
  tiflis: [41.72, 44.79],
  londra: [51.51, -0.13],
  barselona: [41.39, 2.17],
  dubai: [25.2, 55.27],
  kahire: [30.04, 31.24],
}

// Example trips, in Türkiye and abroad.
const ROUTES = [
  ['istanbul', 'sapanca'],
  ['istanbul', 'amasya'],
  ['ankara', 'kapadokya'],
  ['izmir', 'fethiye'],
  ['istanbul', 'roma'],
  ['istanbul', 'paris'],
  ['ankara', 'berlin'],
  ['izmir', 'prag'],
  ['istanbul', 'tiflis'],
  ['istanbul', 'londra'],
  ['izmir', 'barselona'],
  ['ankara', 'dubai'],
  ['istanbul', 'kahire'],
]

function toVec([lat, lon], r = R) {
  const phi = (90 - lat) * DEG
  const theta = (lon + 180) * DEG
  return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta))
}

// Evenly spread points on the sphere (Fibonacci lattice).
function useDots(count = 2600) {
  return useMemo(() => {
    const pos = new Float32Array(count * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      const a = golden * i
      pos.set([Math.cos(a) * r * R, y * R, Math.sin(a) * r * R], i * 3)
    }
    return pos
  }, [count])
}

function Arc({ from, to, color, delay }) {
  const ref = useRef(null)
  const points = useMemo(() => {
    const a = toVec(CITIES[from])
    const b = toVec(CITIES[to])
    const lift = 1 + a.distanceTo(b) * 0.35
    const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * lift)
    return new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(60)
  }, [from, to])

  useFrame((_, delta) => {
    if (ref.current) ref.current.material.dashOffset -= delta * 0.6
  })

  return (
    <>
      <Line points={points} color={color} lineWidth={1.2} transparent opacity={0.35} toneMapped={false} />
      <Line
        ref={ref}
        points={points}
        color={color}
        lineWidth={3}
        dashed
        dashSize={0.35}
        gapSize={1.2}
        dashOffset={delay}
        toneMapped={false}
      />
    </>
  )
}

export function GlobeScene() {
  const dots = useDots()
  const spin = useRef(null)
  const home = toVec(CITIES.ankara)
  const face = -Math.atan2(home.x, home.z)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    spin.current.rotation.y = face + Math.sin(t * 0.15) * 0.45 + state.pointer.x * 0.25
  })

  return (
    <group rotation-x={0.72} position={[0, -0.1, 0]}>
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[R * 0.985, 64, 64]} />
          <meshBasicMaterial color="#0e0c16" />
        </mesh>
        <mesh scale={1.06}>
          <sphereGeometry args={[R, 64, 64]} />
          <meshBasicMaterial color="#ffb347" transparent opacity={0.05} side={THREE.BackSide} />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dots, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.026} color="#7f78a8" sizeAttenuation transparent opacity={0.8} />
        </points>
        {ROUTES.map(([a, b], i) => (
          <Arc key={a + b} from={a} to={b} delay={i * 0.4} color={i % 3 === 0 ? '#4fd1c5' : i % 3 === 1 ? '#ffb347' : '#ff7a45'} />
        ))}
        {Object.entries(CITIES).map(([name, ll]) => (
          <mesh key={name} position={toVec(ll, R * 1.005)}>
            <sphereGeometry args={[0.035, 12, 12]} />
            <meshBasicMaterial color="#ffd9a8" toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
