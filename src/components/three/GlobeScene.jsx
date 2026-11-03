import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import land from './landDots.json'

const R = 2
const DEG = Math.PI / 180

const CITIES = {
  istanbul: [41.01, 28.98],
  izmir: [38.42, 27.14],
  ankara: [39.93, 32.86],
  sapanca: [40.69, 30.27],
  amasya: [40.65, 35.83],
  kapadokya: [38.64, 34.83],
  antalya: [36.9, 30.7],
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

// Faint example trips behind the one in focus, in Türkiye and abroad.
const ROUTES = [
  ['istanbul', 'amasya'],
  ['izmir', 'fethiye'],
  ['istanbul', 'roma'],
  ['ankara', 'berlin'],
  ['izmir', 'prag'],
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

function arcCurve(from, to) {
  const a = toVec(CITIES[from])
  const b = toVec(CITIES[to])
  const lift = 1 + a.distanceTo(b) * 0.35
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * Math.max(lift, 1.08))
  return new THREE.QuadraticBezierCurve3(a, mid, b)
}

// Land only: points spread evenly over the sphere, kept where Natural Earth
// has land (made once by a script, so the page loads no map data).
function useLand() {
  return useMemo(() => {
    const pos = new Float32Array(land.length * 1.5)
    for (let i = 0; i < land.length; i += 2) toVec([land[i], land[i + 1]]).toArray(pos, i * 1.5)
    return pos
  }, [])
}

// A thin rim of light around the globe, brighter at the edge.
const atmosphere = {
  vertexShader: /* glsl */ `
    varying vec3 vNormal;
    void main(){ vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    varying vec3 vNormal;
    void main(){ float a = pow(0.55 - dot(vNormal, vec3(0., 0., 1.)), 4.0) * 0.9; gl_FragColor = vec4(1.0, 0.7, 0.28, 1.0) * a; }`,
}

function Arc({ from, to, delay }) {
  const ref = useRef(null)
  const points = useMemo(() => arcCurve(from, to).getPoints(60), [from, to])

  useFrame((_, delta) => {
    if (ref.current) ref.current.material.dashOffset -= delta * 0.4
  })

  return (
    <>
      <Line points={points} color="#8b7bff" lineWidth={1} transparent opacity={0.18} toneMapped={false} />
      <Line ref={ref} points={points} color="#8b7bff" lineWidth={2} dashed dashSize={0.25} gapSize={1.4} dashOffset={delay} transparent opacity={0.5} toneMapped={false} />
    </>
  )
}

// The trip in focus: its arc draws itself, a light travels along it and the
// destination sends out rings. Remounted for each trip, so it starts over.
function Trip({ from, to }) {
  const curve = useMemo(() => arcCurve(from, to), [from, to])
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 90, 0.016, 8, false), [curve])
  const end = useMemo(() => toVec(CITIES[to], R * 1.004), [to])
  const start = useMemo(() => toVec(CITIES[from], R * 1.004), [from])
  const head = useRef(null)
  const rings = useRef([])
  const born = useRef(null)

  useFrame((state) => {
    if (born.current === null) born.current = state.clock.elapsedTime
    const t = state.clock.elapsedTime - born.current
    const drawn = Math.min(1, t / 1.4)
    tube.setDrawRange(0, Math.floor(tube.index.count * drawn / 6) * 6)
    curve.getPoint((t * 0.45) % 1, head.current.position)
    rings.current.forEach((r, i) => {
      if (!r) return
      const p = drawn < 1 ? 0 : ((t - 1.4) * 0.6 + i * 0.5) % 1
      r.scale.setScalar(0.4 + p * 2.6)
      r.material.opacity = drawn < 1 ? 0 : (1 - p) * 0.8
    })
  })

  const normal = end.clone().normalize()
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)

  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color="#ffb347" toneMapped={false} />
      </mesh>
      <mesh ref={head}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshBasicMaterial color="#fff1d6" toneMapped={false} />
      </mesh>
      <mesh position={start}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#4fd1c5" toneMapped={false} />
      </mesh>
      <mesh position={end}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffb347" toneMapped={false} />
      </mesh>
      {[0, 1].map((i) => (
        <mesh key={i} ref={(el) => (rings.current[i] = el)} position={end} quaternion={quat}>
          <ringGeometry args={[0.07, 0.085, 48]} />
          <meshBasicMaterial color="#ffb347" transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

// Turn so a point on the globe faces the camera (the tilt is set for Türkiye's latitude).
const facing = (ll) => {
  const v = toVec(ll)
  return -Math.atan2(v.x, v.z)
}

export function GlobeScene({ trip }) {
  const dots = useLand()
  const spin = useRef(null)
  const target = useMemo(() => {
    const [a, b] = [CITIES[trip.from], CITIES[trip.to]]
    return facing([(a[0] + b[0]) / 2, (a[1] + b[1]) / 2])
  }, [trip])

  useFrame((state) => {
    const s = spin.current
    if (s.userData.y === undefined) s.userData.y = target
    // The shortest way round to the trip in focus.
    let d = target - s.userData.y
    d = Math.atan2(Math.sin(d), Math.cos(d))
    s.userData.y += d * 0.04
    s.rotation.y = s.userData.y + Math.sin(state.clock.elapsedTime * 0.3) * 0.05 + state.pointer.x * 0.15
  })

  return (
    <group rotation-x={0.72}>
      <mesh scale={1.12}>
        <sphereGeometry args={[R, 64, 64]} />
        <shaderMaterial args={[atmosphere]} side={THREE.BackSide} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <group ref={spin}>
        <mesh>
          <sphereGeometry args={[R * 0.99, 64, 64]} />
          <meshBasicMaterial color="#0e0c16" />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dots, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.032} color="#9d93cf" sizeAttenuation transparent opacity={0.85} />
        </points>
        {ROUTES.map(([a, b], i) => (
          <Arc key={a + b} from={a} to={b} delay={i * 0.4} />
        ))}
        {Object.entries(CITIES).map(([name, ll]) => (
          <mesh key={name} position={toVec(ll, R * 1.005)}>
            <sphereGeometry args={[0.026, 12, 12]} />
            <meshBasicMaterial color="#ffd9a8" toneMapped={false} />
          </mesh>
        ))}
        <Trip key={trip.from + trip.to} from={trip.from} to={trip.to} />
      </group>
    </group>
  )
}
