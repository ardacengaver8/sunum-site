import { Environment, Float, Lightformer, MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const GRID = 44
const GAP = 0.36
const LOW = new THREE.Color('#1a1530')
const MID = new THREE.Color('#8b7bff')
const HIGH = new THREE.Color('#ff7a45')

// A dusk field of pylons that swell under the cursor. `shock` holds the time of
// the last click on the orb; a ring wave runs out from the centre after it.
function Pylons({ shock }) {
  const mesh = useRef(null)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const cursor = useRef(new THREE.Vector3(0, 0, 100))
  const target = useMemo(() => new THREE.Vector3(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), [])
  const ray = useMemo(() => new THREE.Raycaster(), [])

  const cells = useMemo(() => {
    const list = []
    const half = ((GRID - 1) * GAP) / 2
    for (let i = 0; i < GRID; i++)
      for (let j = 0; j < GRID; j++) list.push([i * GAP - half, j * GAP - half - 1.5])
    return list
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    ray.setFromCamera(state.pointer, state.camera)
    if (ray.ray.intersectPlane(plane, target)) cursor.current.lerp(target, 0.08)
    const since = shock.current == null ? 99 : t - shock.current
    const ring = since * 7

    cells.forEach(([x, z], k) => {
      const dx = x - cursor.current.x
      const dz = z - cursor.current.z
      const near = Math.exp(-(dx * dx + dz * dz) / 2.2)
      const dist = Math.hypot(x, z + 1.5)
      const wave = Math.sin(dist * 1.1 - t * 1.2) * 0.12 + 0.18
      const burst = since < 3 ? Math.exp(-((dist - ring) ** 2) * 1.5) * (1 - since / 3) * 2.2 : 0
      const h = wave + near * 2.4 + burst

      dummy.position.set(x, h / 2, z)
      dummy.scale.set(1, h, 1)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(k, dummy.matrix)

      const glow = Math.min(1, h / 2.2)
      color.copy(LOW).lerp(MID, Math.min(1, glow * 1.6))
      if (glow > 0.55) color.lerp(HIGH, (glow - 0.55) / 0.45)
      mesh.current.setColorAt(k, color)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.instanceColor.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, GRID * GRID]}>
      <boxGeometry args={[GAP * 0.62, 1, GAP * 0.62]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  )
}

function Orb({ shock }) {
  const ref = useRef(null)
  const kick = useRef(0)
  const clock = useThree((s) => s.clock)

  useFrame((state, delta) => {
    const { x, y } = state.pointer
    ref.current.rotation.y += delta * 0.25
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, y * 0.4, 0.05)
    ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, -x * 0.3, 0.05)
    kick.current = THREE.MathUtils.lerp(kick.current, 0, 0.06)
    ref.current.scale.setScalar(1 + kick.current)
  })

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh
        ref={ref}
        position={[0, 2.3, -0.6]}
        onClick={(e) => {
          e.stopPropagation()
          kick.current = 0.25
          shock.current = clock.elapsedTime
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = '')}
      >
        <torusKnotGeometry args={[0.85, 0.3, 220, 36]} />
        <MeshTransmissionMaterial
          backside
          samples={6}
          resolution={512}
          thickness={0.6}
          roughness={0.08}
          ior={1.35}
          chromaticAberration={0.6}
          anisotropy={0.2}
          distortion={0.4}
          distortionScale={0.4}
          temporalDistortion={0.15}
          color="#f3eaff"
          fog={false}
        />
      </mesh>
    </Float>
  )
}

function CameraDrift() {
  useFrame((state) => {
    const { x, y } = state.pointer
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 0.8, 0.03)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 4.2 + y * 0.4, 0.03)
    state.camera.lookAt(0, 1, -1)
  })
  return null
}

export function HeroScene() {
  const shock = useRef(null)

  return (
    <>
      <color attach="background" args={['#07060a']} />
      <fog attach="fog" args={['#07060a', 7, 17]} />
      <Pylons shock={shock} />
      <Orb shock={shock} />
      <CameraDrift />
      <Environment resolution={256}>
        <Lightformer intensity={6} color="#ff7a45" position={[-4, 2, -2]} scale={[6, 2, 1]} />
        <Lightformer intensity={6} color="#8b7bff" position={[4, 3, 2]} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={4} color="#ffffff" position={[0, 2, 6]} scale={3} />
        <Lightformer intensity={1.5} color="#ffffff" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[8, 8, 1]} />
      </Environment>
    </>
  )
}
