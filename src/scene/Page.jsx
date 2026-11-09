import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { FINAL_YAW, computePage, layout, setPage } from '../brand'
import { anim } from './anim'
import { mats } from './materials'
import Crew from './Crew'
import ComingSoon3D from './ComingSoon3D'

// ── Font preload ──────────────────────────────────────────────────────────────
const outfit = new FontFace('Outfit', 'url(/fonts/Outfit-SemiBold.woff)')
outfit.load().then((f) => document.fonts.add(f)).catch(() => {})

// ── Canvas texture helpers ────────────────────────────────────────────────────

function makeCanvasTex(w, h, draw) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  draw(canvas.getContext('2d'), w, h)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 16
  return tex
}

function makeDomainTex() {
  return makeCanvasTex(1280, 192, (ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#29282d'
    ctx.font = '600 110px Outfit,"Helvetica Neue",Arial,sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('studiodca.in', W / 2, H / 2 + 4)
  })
}

function makeNavTex(text) {
  return makeCanvasTex(480, 100, (ctx, W, H) => {
    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#29282d'
    ctx.font = '600 68px Outfit,"Helvetica Neue",Arial,sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, W / 2, H / 2 + 2)
  })
}

// ── Generic canvas plane ──────────────────────────────────────────────────────
// Scale is set every frame via setScale(w, h) so it responds to viewport.
function CanvasPlane({ makeTex, renderOrd = 5 }) {
  const ref = useRef(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let live = true
    outfit.loaded.then(() => { if (live) setTick(1) }).catch(() => {})
    return () => { live = false }
  }, [])

  const tex = useMemo(makeTex, [tick])
  useLayoutEffect(() => () => tex.dispose(), [tex])
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    map: tex, transparent: true, toneMapped: false, depthWrite: false,
  }), [tex])
  useLayoutEffect(() => () => mat.dispose(), [mat])

  return (
    <mesh ref={ref} material={mat} renderOrder={renderOrd} visible={false}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

// ── studiodca.in label ────────────────────────────────────────────────────────
function DomainSign() {
  const ref = useRef(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let live = true
    outfit.loaded.then(() => { if (live) setTick(1) }).catch(() => {})
    return () => { live = false }
  }, [])

  const tex = useMemo(() => makeDomainTex(), [tick])
  useLayoutEffect(() => () => tex.dispose(), [tex])
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    map: tex, transparent: true, toneMapped: false, depthWrite: false,
  }), [tex])
  useLayoutEffect(() => () => mat.dispose(), [mat])

  useFrame(() => {
    if (!ref.current) return
    const p = layout().domain
    const e = THREE.MathUtils.smoothstep(anim.reveal, 0, 0.55)
    ref.current.visible = anim.reveal > 0.01
    ref.current.position.set(p.pos[0], p.pos[1] + (1 - e) * p.size * 0.5, p.pos[2])
    ref.current.scale.set(p.size * 7.6, p.size * 1.1, 1)
  })

  return (
    <mesh ref={ref} visible={false} material={mat} renderOrder={5}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

// ── Nav label (Home / Projects / About) ───────────────────────────────────────
function NavLabel({ specKey, text, delay, widthFactor = 5.0 }) {
  const ref = useRef(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let live = true
    outfit.loaded.then(() => { if (live) setTick(1) }).catch(() => {})
    return () => { live = false }
  }, [])

  const tex = useMemo(() => makeNavTex(text), [tick])
  useLayoutEffect(() => () => tex.dispose(), [tex])
  const mat = useMemo(() => new THREE.MeshBasicMaterial({
    map: tex, transparent: true, toneMapped: false, depthWrite: false,
  }), [tex])
  useLayoutEffect(() => () => mat.dispose(), [mat])

  useFrame(() => {
    if (!ref.current) return
    const p = layout()[specKey]
    const raw = (anim.reveal - delay) / Math.max(0.08, 1 - delay)
    const e = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(raw, 0, 1), 0, 1)
    ref.current.visible = raw > 0.02
    ref.current.position.set(p.pos[0], p.pos[1] + (1 - e) * p.size * 0.8, p.pos[2])
    ref.current.scale.set(p.size * widthFactor, p.size * 1.1, 1)
  })

  return (
    <mesh ref={ref} visible={false} material={mat} renderOrder={5}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  )
}

function Sheet() {
  const { size } = useThree()
  const page = useMemo(() => computePage(size.width / Math.max(size.height, 1)), [size.width, size.height])
  const geo = useMemo(() => new THREE.PlaneGeometry(page.w, page.h), [page])

  useLayoutEffect(() => () => geo.dispose(), [geo])

  const mesh = useRef(null)
  useFrame(() => {
    const opacity = anim.sheet
    mats.sheet.opacity        = opacity
    mats.sheet.transparent    = opacity < 0.985
    mats.sheet.depthWrite     = opacity >= 0.985
    if (mesh.current) {
      const emerge = THREE.MathUtils.smoothstep(anim.open, 0.08, 0.72)
      const scale = THREE.MathUtils.lerp(0.965, 1, emerge)
      mesh.current.scale.set(scale, scale, 1)
      mesh.current.rotation.set(0, 0, 0)
      mesh.current.visible = opacity > 0.02
    }
  })

  return <mesh ref={mesh} geometry={geo} material={mats.sheet} receiveShadow castShadow frustumCulled={false} />
}

function Edges() {
  const { size } = useThree()
  const ref  = useRef(null)
  const page = useMemo(() => computePage(size.width / Math.max(size.height, 1)), [size.width, size.height])
  const { w, h, d, front } = page
  const zMid = front - d / 2

  useFrame(() => {
    if (!ref.current) return
    const k = THREE.MathUtils.smoothstep(anim.open, 0.82, 1)
    ref.current.visible  = k > 0.03
    ref.current.scale.z  = Math.max(0.05, k)
  })

  const side = 0.018
  return (
    <group ref={ref} visible={false}>
      {/* side edges */}
      <mesh position={[ w / 2 + d / 2 - side, 0, zMid]} material={mats.edge} castShadow>
        <boxGeometry args={[d, h + d, d]} />
      </mesh>
      <mesh position={[-w / 2 - d / 2 + side, 0, zMid]} material={mats.edge} castShadow>
        <boxGeometry args={[d, h + d, d]} />
      </mesh>
      {/* top/bottom edges */}
      <mesh position={[0,  h / 2 + d / 2 - side, zMid]} material={mats.edge} castShadow>
        <boxGeometry args={[w + d * 2, d, d]} />
      </mesh>
      <mesh position={[0, -h / 2 - d / 2 + side, zMid]} material={mats.edge} castShadow>
        <boxGeometry args={[w + d * 2, d, d]} />
      </mesh>
      {/* back face */}
      <mesh position={[0, 0, front - d - 0.001]} material={mats.back} receiveShadow>
        <planeGeometry args={[w, h]} />
      </mesh>
      {/* slate accent stripe on right edge */}
      <mesh position={[w / 2 - 0.01, 0, front + 0.005]} material={mats.slateLine}>
        <boxGeometry args={[0.012, h - 0.18, 0.009]} />
      </mesh>
    </group>
  )
}

function ArchitecturalDetails() {
  const { size } = useThree()
  const ref = useRef(null)
  const page = useMemo(() => computePage(size.width / Math.max(size.height, 1)), [size.width, size.height])
  const { w, h, front } = page
  const inset = Math.min(w, h) * 0.055
  const line = 0.018
  const z = front + 0.016

  useFrame(() => {
    if (!ref.current) return
    const e = THREE.MathUtils.smoothstep(anim.reveal, 0.04, 0.82)
    ref.current.visible = anim.reveal > 0.03
    ref.current.scale.setScalar(0.985 + e * 0.015)
  })

  return (
    <group ref={ref} visible={false}>
      <mesh position={[0, h * 0.5 - inset, z]} material={mats.slateLine}>
        <boxGeometry args={[w - inset * 2, line, 0.016]} />
      </mesh>
      <mesh position={[0, -h * 0.5 + inset, z]} material={mats.slateLine}>
        <boxGeometry args={[w - inset * 2, line, 0.016]} />
      </mesh>
      <mesh position={[-w * 0.5 + inset, 0, z]} material={mats.slateLine}>
        <boxGeometry args={[line, h - inset * 2, 0.016]} />
      </mesh>
      <mesh position={[w * 0.5 - inset, 0, z]} material={mats.slateLine}>
        <boxGeometry args={[line, h - inset * 2, 0.016]} />
      </mesh>
      {[-1, 1].flatMap((sx) => [-1, 1].map((sy) => (
        <mesh
          key={`${sx}-${sy}`}
          position={[sx * (w * 0.5 - inset), sy * (h * 0.5 - inset), z + 0.015]}
          rotation={[Math.PI / 2, 0, 0]}
          material={mats.steel}
          castShadow
        >
          <cylinderGeometry args={[0.045, 0.045, 0.025, 12]} />
        </mesh>
      )))}
      {[-0.28, -0.18, 0.18, 0.28].map((x) => (
        <mesh key={x} position={[w * x, -h * 0.27, z]} material={mats.mist}>
          <boxGeometry args={[line, h * 0.12, 0.012]} />
        </mesh>
      ))}
      <mesh position={[0, -h * 0.21, z]} material={mats.mist}>
        <boxGeometry args={[w * 0.56, line, 0.012]} />
      </mesh>
    </group>
  )
}

// ── Assembled signs layer ─────────────────────────────────────────────────────
function Signs() {
  return (
    <group>
      <DomainSign />
      <ComingSoon3D />
      <NavLabel specKey="home" text="Home" delay={0.1} widthFactor={4.2} />
      <NavLabel specKey="projects" text="Projects" delay={0.18} widthFactor={5.8} />
      <NavLabel specKey="about" text="About" delay={0.14} widthFactor={4.2} />
    </group>
  )
}

// ── Root page ─────────────────────────────────────────────────────────────────
export default function Page() {
  const { size } = useThree()
  const rig = useRef(null)

  useLayoutEffect(() => { setPage(size.width / Math.max(size.height, 1)) }, [size.width, size.height])

  useFrame(() => {
    setPage(size.width / Math.max(size.height, 1))
    if (!rig.current) return
    rig.current.rotation.y = anim.yaw
    rig.current.rotation.x = -0.012 * THREE.MathUtils.smoothstep(anim.open, 0.55, 1)
  })

  return (
    <group ref={rig} rotation={[0, FINAL_YAW, 0]}>
      <Sheet />
      <Signs />
      <Crew />
    </group>
  )
}

