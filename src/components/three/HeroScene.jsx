import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { usePosterTexture } from './SealScene'

// The hero tells the whole story in one picture: the model in the middle,
// the context swirling into it, the harness orbiting it with tool calls
// running out and back (the agent loop), and the two products further out.

const HARNESS = ['tool', 'skill', 'hook', 'alt ajan', 'hafıza', 'test']
const RING_R = 2.1
const RING_TILT = 1.15
const PLANE_TILT = RING_TILT - Math.PI / 2
const TOKENS = 1300
const TRAIL = 32
const X_AXIS = new THREE.Vector3(1, 0, 0)

const EMBER = new THREE.Color('#ff7a45')
const VIOLET = new THREE.Color('#8b7bff')
const FROST = new THREE.Color('#9fd8ff')
const SEA = new THREE.Color('#4fd1c5')
const HOT = new THREE.Color('#ffb08a')
const COOL = new THREE.Color('#d9d2ff')
const asVec = (c) => new THREE.Vector3(c.r, c.g, c.b)
const V_EMBER = asVec(EMBER)
const V_VIOLET = asVec(VIOLET)
const V_FROST = asVec(FROST)

const tmp = new THREE.Vector3()
const under = new THREE.Vector3()
const ctrl = new THREE.Vector3()
const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3())

function ringPos(i, t, out) {
  const a = (i / HARNESS.length) * Math.PI * 2 + t * 0.16
  out.set(Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R)
  return out.applyAxisAngle(X_AXIS, PLANE_TILT)
}

const jumpTo = (id) => window.dispatchEvent(new CustomEvent('jump-to', { detail: id }))

// Ashima 3D simplex noise, for the core's moving surface.
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

// The model: a dark orb with a nebula moving inside, a hot centre and a rim
// that glows violet to ember. It beats when a tool call comes back.
const coreShader = {
  vertexShader: /* glsl */ `
    varying vec3 vNormal; varying vec3 vView; varying vec3 vPos;
    void main(){
      vPos = position;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      vNormal = normalize(normalMatrix * normal);
      vView = normalize(-mv.xyz);
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */ `
    uniform float uTime; uniform float uPulse;
    varying vec3 vNormal; varying vec3 vView; varying vec3 vPos;
    ${NOISE}
    void main(){
      float facing = clamp(dot(vNormal, vView), 0.0, 1.0);
      float rim = pow(1.0 - facing, 2.6);
      vec3 p = vPos * 1.6;
      float n = snoise(p + vec3(0.0, uTime * 0.25, uTime * 0.12));
      n += 0.5 * snoise(p * 2.3 - vec3(uTime * 0.3, 0.0, 0.0));
      float bands = smoothstep(-0.2, 1.1, n);
      vec3 deep = vec3(0.04, 0.025, 0.09);
      vec3 ember = vec3(1.0, 0.48, 0.27);
      vec3 violet = vec3(0.55, 0.48, 1.0);
      vec3 col = deep + mix(violet, ember, bands) * bands * 0.9;
      col += pow(facing, 10.0) * vec3(1.0, 0.8, 0.66) * (0.45 + uPulse * 1.2);
      col += rim * mix(violet, ember, 0.5 + 0.5 * sin(uTime * 0.6 + vPos.y * 2.0)) * 2.2;
      gl_FragColor = vec4(col, 1.0);
    }`,
}

// Round, soft, additive points; used by the context disk and the comet trail.
const pointsShader = {
  vertexShader: /* glsl */ `
    attribute float aSize; attribute float aAlpha; attribute vec3 aColor;
    uniform float uScale;
    varying float vAlpha; varying vec3 vColor;
    void main(){
      vAlpha = aAlpha; vColor = aColor;
      vec4 mv = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * uScale / -mv.z;
      gl_Position = projectionMatrix * mv;
    }`,
  fragmentShader: /* glsl */ `
    varying float vAlpha; varying vec3 vColor;
    void main(){
      float d = length(gl_PointCoord - 0.5);
      float a = smoothstep(0.5, 0.0, d);
      gl_FragColor = vec4(vColor * a, a * vAlpha);
    }`,
}

function usePointsMaterial() {
  const dpr = useThree((s) => s.gl.getPixelRatio())
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        ...pointsShader,
        uniforms: { uScale: { value: 60 * dpr } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [dpr],
  )
}

// A soft round light, shared by every glow in the scene.
let glowTexture
function glowMap() {
  if (glowTexture) return glowTexture
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, 'rgba(255,255,255,0.35)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 128, 128)
  glowTexture = new THREE.CanvasTexture(c)
  return glowTexture
}

function Glow({ color, scale, opacity = 1 }) {
  return (
    <sprite scale={scale}>
      <spriteMaterial map={glowMap()} color={color} transparent opacity={opacity} depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  )
}

function Core({ pulse }) {
  const mat = useRef(null)
  const orb = useRef(null)
  const rings = useRef([])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    mat.current.uniforms.uTime.value = t
    mat.current.uniforms.uPulse.value = pulse.current
    orb.current.scale.setScalar(1 + Math.sin(t * 2) * 0.012 + pulse.current * 0.06)
    rings.current.forEach((r, i) => {
      if (!r) return
      r.rotation.x += delta * (0.25 + i * 0.1)
      r.rotation.y += delta * (0.15 - i * 0.12)
    })
    pulse.current = THREE.MathUtils.lerp(pulse.current, 0, 0.06)
  })

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPulse: { value: 0 } }), [])

  return (
    <group>
      <Glow color="#ff8a5c" scale={3.4} opacity={0.35} />
      <Glow color="#8b7bff" scale={6} opacity={0.18} />
      <mesh ref={orb}>
        <sphereGeometry args={[0.72, 96, 96]} />
        <shaderMaterial ref={mat} args={[coreShader]} uniforms={uniforms} />
      </mesh>
      {[1.0, 1.14].map((r, i) => (
        <mesh key={r} ref={(el) => (rings.current[i] = el)} rotation={[i * 1.2, i * 0.7, 0]}>
          <torusGeometry args={[r, 0.0045, 8, 200]} />
          <meshBasicMaterial color={i ? '#8b7bff' : '#ffb08a'} transparent opacity={0.55} toneMapped={false} />
        </mesh>
      ))}
    </group>
  )
}

// The context: tokens on a disk, spiralling in faster as they near the
// model, cooling from violet at the edge to ember near the centre.
function ContextDisk() {
  const ref = useRef(null)
  const material = usePointsMaterial()
  const { geo, seeds } = useMemo(() => {
    const pos = new Float32Array(TOKENS * 3)
    const col = new Float32Array(TOKENS * 3)
    const size = new Float32Array(TOKENS)
    const alpha = new Float32Array(TOKENS)
    const seeds = Array.from({ length: TOKENS }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 0.9 + Math.random() * 2.8,
      y: (Math.random() - 0.5) * 0.35,
      s: 0.6 + Math.random() * 0.8,
    }))
    seeds.forEach((_, i) => (size[i] = 0.25 + Math.random() * 0.6))
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alpha, 1))
    return { geo, seeds }
  }, [])

  useFrame((_, delta) => {
    const d = Math.min(delta, 0.05)
    const pos = geo.attributes.position.array
    const col = geo.attributes.aColor.array
    const alpha = geo.attributes.aAlpha.array
    seeds.forEach((p, i) => {
      p.r -= d * p.s * (0.1 + 0.35 / p.r)
      p.a += d * (1.1 / Math.pow(p.r, 1.2))
      if (p.r < 0.78) {
        p.r = 3.1 + Math.random() * 0.7
        p.a = Math.random() * Math.PI * 2
      }
      const k = THREE.MathUtils.clamp((p.r - 0.78) / 3, 0, 1)
      pos[i * 3] = Math.cos(p.a) * p.r
      pos[i * 3 + 1] = p.y * k * 1.5
      pos[i * 3 + 2] = Math.sin(p.a) * p.r
      tmp.copy(V_EMBER).lerp(V_VIOLET, Math.min(1, k * 1.6)).lerp(V_FROST, Math.max(0, k - 0.6))
      tmp.multiplyScalar(1 + (1 - k) * 1.8)
      tmp.toArray(col, i * 3)
      // Fade in at the edge, fade out as they fall into the model.
      alpha[i] = Math.min(1, (3.8 - p.r) * 1.2) * Math.min(1, (p.r - 0.78) * 4) * 0.8
    })
    geo.attributes.position.needsUpdate = true
    geo.attributes.aColor.needsUpdate = true
    geo.attributes.aAlpha.needsUpdate = true
  })

  return <points ref={ref} geometry={geo} material={material} rotation={[PLANE_TILT + 0.22, 0, 0.18]} frustumCulled={false} />
}

// The harness ring. One node at a time gets a tool call: a comet runs from
// the model out to it (ember), the node lights up, and the result runs back
// (sea green). The model beats when it lands.
function Harness({ pulse }) {
  const nodes = useRef([])
  const halos = useRef([])
  const cores = useRef([])
  const arcLine = useRef(null)
  const last = useRef(-1)
  const sent = useRef(-1)
  const material = usePointsMaterial()

  const arcGeo = useMemo(() => new THREE.BufferGeometry().setFromPoints(Array.from({ length: 48 }, () => new THREE.Vector3())), [])
  const trail = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3))
    geo.setAttribute('aColor', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3))
    geo.setAttribute('aSize', new THREE.BufferAttribute(new Float32Array(TRAIL).map((_, i) => 5 * (1 - i / TRAIL) + 0.6), 1))
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(new Float32Array(TRAIL), 1))
    return geo
  }, [])
  const ringGeo = useMemo(() => {
    const pts = Array.from({ length: 241 }, (_, i) => {
      const a = (i / 240) * Math.PI * 2
      return new THREE.Vector3(Math.cos(a) * RING_R, 0, Math.sin(a) * RING_R).applyAxisAngle(X_AXIS, PLANE_TILT)
    })
    const g = new THREE.BufferGeometry().setFromPoints(pts)
    g.computeBoundingSphere()
    return g
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const cycle = 1.8
    const round = Math.floor(t / cycle)
    const which = round % HARNESS.length
    const phase = (t % cycle) / cycle // out 0–.42, back .5–.92, rest

    HARNESS.forEach((_, i) => {
      const n = nodes.current[i]
      if (!n) return
      ringPos(i, t, n.position)
      const hit = i === which && phase > 0.36 && phase < 0.6
      n.scale.setScalar(THREE.MathUtils.lerp(n.scale.x, hit ? 1.9 : 1, 0.12))
      if (halos.current[i]) halos.current[i].material.opacity = THREE.MathUtils.lerp(halos.current[i].material.opacity, hit ? 0.9 : 0.25, 0.1)
      const c = cores.current[i]
      if (c) c.material.color.lerp(hit ? HOT : COOL, 0.15)
      if (halos.current[i]) halos.current[i].material.color.lerp(hit ? EMBER : VIOLET, 0.15)
    })

    const target = nodes.current[which]
    if (!target) return

    // The call's path bows away from the ring plane, so it reads as a jump.
    curve.v0.set(0, 0, 0)
    curve.v2.copy(target.position)
    ctrl.copy(target.position).multiplyScalar(0.5)
    ctrl.y += 0.9
    curve.v1.copy(ctrl)
    const arcPos = arcGeo.attributes.position
    for (let k = 0; k < arcPos.count; k++) {
      curve.getPoint(0.14 + (k / (arcPos.count - 1)) * 0.86, tmp)
      arcPos.setXYZ(k, tmp.x, tmp.y, tmp.z)
    }
    arcPos.needsUpdate = true
    arcLine.current.material.opacity = phase < 0.95 ? 0.22 * Math.sin((Math.PI * Math.min(phase, 0.95)) / 0.95) : 0

    const going = phase < 0.5
    const head = going ? phase / 0.42 : 1 - (phase - 0.5) / 0.42
    const color = going ? EMBER : SEA
    const pos = trail.attributes.position.array
    const col = trail.attributes.aColor.array
    const alpha = trail.attributes.aAlpha.array
    const visible = (going && phase < 0.42) || (!going && phase < 0.92)
    for (let k = 0; k < TRAIL; k++) {
      const s = THREE.MathUtils.clamp(head + (going ? -1 : 1) * k * 0.012, 0.14, 1)
      curve.getPoint(s, tmp)
      tmp.toArray(pos, k * 3)
      tmp.set(color.r, color.g, color.b).multiplyScalar(k < 2 ? 3 : 1.6)
      tmp.toArray(col, k * 3)
      alpha[k] = visible ? 1 - k / TRAIL : 0
    }
    trail.attributes.position.needsUpdate = true
    trail.attributes.aColor.needsUpdate = true
    trail.attributes.aAlpha.needsUpdate = true

    // Tell the page's live log (Hero.jsx) when a call leaves and when it lands.
    if (sent.current !== round) {
      sent.current = round
      window.dispatchEvent(new CustomEvent('agent-step', { detail: { which, kind: 'call' } }))
    }
    if (phase >= 0.9 && last.current !== round) {
      last.current = round
      pulse.current = 1
      window.dispatchEvent(new CustomEvent('agent-step', { detail: { which, kind: 'result' } }))
    }
  })

  return (
    <group>
      <line geometry={ringGeo}>
        <lineBasicMaterial color="#8b7bff" transparent opacity={0.4} toneMapped={false} />
      </line>
      <line ref={arcLine} geometry={arcGeo}>
        <lineBasicMaterial color="#ffd9a8" transparent opacity={0} toneMapped={false} />
      </line>
      <points geometry={trail} material={material} frustumCulled={false} />
      {HARNESS.map((name, i) => (
        <group key={name} ref={(el) => (nodes.current[i] = el)}>
          <mesh ref={(el) => (cores.current[i] = el)}>
            <octahedronGeometry args={[0.075, 0]} />
            <meshBasicMaterial color="#d9d2ff" />
          </mesh>
          <sprite ref={(el) => (halos.current[i] = el)} scale={0.6}>
            <spriteMaterial map={glowMap()} color="#8b7bff" transparent opacity={0.25} depthWrite={false} blending={THREE.AdditiveBlending} />
          </sprite>
        </group>
      ))}
    </group>
  )
}

// Cold Take: the film poster, frosted over, with the eye seal on top.
function MiniPoster() {
  const map = usePosterTexture()
  return (
    <group>
      <mesh position={[0, 0, -0.012]}>
        <planeGeometry args={[0.7, 1.02]} />
        <meshBasicMaterial color={[0.62, 0.85, 1.6]} toneMapped={false} />
      </mesh>
      <mesh>
        <planeGeometry args={[0.68, 1.0]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.68, 1.0]} />
        <meshBasicMaterial color="#dff1ff" transparent opacity={0.62} />
      </mesh>
      <mesh position={[0, 0.02, 0.02]} scale={[1, 0.55, 1]}>
        <torusGeometry args={[0.15, 0.014, 12, 48]} />
        <meshBasicMaterial color="#3a5fa8" />
      </mesh>
      <mesh position={[0, 0.02, 0.02]}>
        <circleGeometry args={[0.05, 32]} />
        <meshBasicMaterial color="#3a5fa8" />
      </mesh>
    </group>
  )
}

// Rota: a dotted globe with routes flying between cities.
function MiniGlobe() {
  const spin = useRef(null)
  const flyers = useRef([])
  const dots = useMemo(() => {
    const n = 900
    const pos = new Float32Array(n * 3)
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2
      const r = Math.sqrt(1 - y * y)
      pos.set([Math.cos(golden * i) * r * 0.5, y * 0.5, Math.sin(golden * i) * r * 0.5], i * 3)
    }
    return pos
  }, [])
  const arcs = useMemo(
    () =>
      [
        [[-0.3, 0.3, 0.4], [0.35, 0.15, 0.35]],
        [[0.35, 0.15, 0.35], [0.1, -0.3, 0.45]],
        [[-0.3, 0.3, 0.4], [-0.45, -0.1, -0.2]],
      ].map(([a, b]) => {
        const va = new THREE.Vector3(...a).normalize().multiplyScalar(0.51)
        const vb = new THREE.Vector3(...b).normalize().multiplyScalar(0.51)
        const mid = va.clone().add(vb).normalize().multiplyScalar(0.78)
        const c = new THREE.QuadraticBezierCurve3(va, mid, vb)
        return { curve: c, geo: new THREE.BufferGeometry().setFromPoints(c.getPoints(40)) }
      }),
    [],
  )

  useFrame((state, delta) => {
    spin.current.rotation.y += delta * 0.25
    const t = state.clock.elapsedTime
    flyers.current.forEach((f, i) => f && arcs[i].curve.getPoint((t * 0.45 + i / 3) % 1, f.position))
  })

  return (
    <group>
      <Glow color="#ffb347" scale={1.9} opacity={0.22} />
      <group ref={spin} rotation-x={0.35}>
        <mesh>
          <sphereGeometry args={[0.49, 48, 48]} />
          <meshBasicMaterial color="#0d0a12" />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[dots, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.016} color={[1.5, 0.95, 0.4]} toneMapped={false} />
        </points>
        {arcs.map((a, i) => (
          <group key={i}>
            <line geometry={a.geo}>
              <lineBasicMaterial color="#4fd1c5" transparent opacity={0.7} toneMapped={false} />
            </line>
            <mesh ref={(el) => (flyers.current[i] = el)}>
              <sphereGeometry args={[0.018, 12, 12]} />
              <meshBasicMaterial color={[1, 3, 2.8]} toneMapped={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  )
}

const ORBIT = { x: 2.75, y: 0.95, z: 1.5 }

// The two products on an outer orbit. Click one to jump to its section.
// Hovering one shows its name in `tag`, a plain DOM element over the canvas.
function Product({ offset, color, label, target, tag, children }) {
  const ref = useRef(null)
  const [hover, setHover] = useState(false)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const a = offset + t * 0.08
    ref.current.position.set(Math.cos(a) * ORBIT.x, Math.sin(a) * ORBIT.y, Math.sin(a) * ORBIT.z)
    ref.current.rotation.y = Math.sin(t * 0.5 + offset) * 0.35
    ref.current.rotation.z = Math.sin(t * 0.4 + offset) * 0.06
    ref.current.scale.setScalar(THREE.MathUtils.lerp(ref.current.scale.x, hover ? 1.25 : 1, 0.12))
    const el = tag.current
    if (hover && el) {
      ref.current.localToWorld(under.set(0, -0.72, 0)).project(state.camera)
      el.style.left = `${((under.x + 1) / 2) * state.size.width}px`
      el.style.top = `${((1 - under.y) / 2) * state.size.height}px`
    }
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
        const el = tag.current
        if (!el) return
        el.textContent = `${label} →`
        el.style.color = color
        el.style.borderColor = `${color}66`
        el.style.opacity = '1'
      }}
      onPointerOut={() => {
        setHover(false)
        document.body.style.cursor = ''
        if (tag.current) tag.current.style.opacity = '0'
      }}
    >
      {children}
      {/* An invisible, roomier target, so both products are as easy to hover. */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  )
}

function OrbitPath() {
  const geo = useMemo(() => {
    const pts = Array.from({ length: 201 }, (_, i) => {
      const a = (i / 200) * Math.PI * 2
      return new THREE.Vector3(Math.cos(a) * ORBIT.x, Math.sin(a) * ORBIT.y, Math.sin(a) * ORBIT.z)
    })
    return new THREE.BufferGeometry().setFromPoints(pts)
  }, [])
  return (
    <line geometry={geo} onUpdate={(l) => l.computeLineDistances()}>
      <lineDashedMaterial color="#ffffff" transparent opacity={0.12} dashSize={0.06} gapSize={0.08} />
    </line>
  )
}

function System({ tag }) {
  const group = useRef(null)
  const pulse = useRef(0)
  const wide = useThree((s) => s.viewport.aspect > 1.1)

  useFrame((state) => {
    const { x, y } = state.pointer
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.3, 0.04)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.15, 0.04)
  })

  return (
    <group ref={group} position={wide ? [1.85, 0.75, 0] : [0, 1.55, 0]} scale={wide ? 0.95 : 0.6}>
      <Core pulse={pulse} />
      <ContextDisk />
      <Harness pulse={pulse} />
      <OrbitPath />
      <Product offset={0.5} color="#9fd8ff" label="Cold Take" target="cold-take" tag={tag}>
        <MiniPoster />
      </Product>
      <Product offset={0.5 + Math.PI} color="#ffb347" label="Rota" target="rota" tag={tag}>
        <MiniGlobe />
      </Product>
    </group>
  )
}

// Far, slow dust so the black has depth.
function Dust() {
  const ref = useRef(null)
  const pos = useMemo(() => {
    const p = new Float32Array(500 * 3)
    for (let i = 0; i < 500; i++) p.set([(Math.random() - 0.5) * 30, (Math.random() - 0.5) * 18, -4 - Math.random() * 10], i * 3)
    return p
  }, [])
  useFrame((_, d) => (ref.current.rotation.z += d * 0.004))
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#8b80b0" transparent opacity={0.5} depthWrite={false} />
    </points>
  )
}

export function HeroScene({ tag }) {
  return (
    <>
      <color attach="background" args={['#07060a']} />
      <Dust />
      <System tag={tag} />
    </>
  )
}
