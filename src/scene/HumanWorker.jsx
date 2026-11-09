import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useAnimations, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { SkeletonUtils } from 'three-stdlib'
import { layout } from '../brand'
import { anim } from './anim'
import { geos, mats } from './materials'

const MODEL = '/models/CesiumMan.glb'

function tintHuman(root) {
  root.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return
    const m = obj.material
    if (m.color) {
      const hsl = { h: 0, s: 0, l: 0 }
      m.color.getHSL(hsl)
      if (hsl.l > 0.35) m.color.set('#cbb8a6')
      else m.color.set('#2a2d35')
    }
    m.roughness = Math.min(0.92, (m.roughness ?? 0.6) + 0.12)
    m.metalness = Math.min(0.25, m.metalness ?? 0)
    m.envMapIntensity = 0.65
  })
}

function Hammer({ bind }) {
  return (
    <group
      ref={(node) => {
        bind.hammer = node
      }}
      position={[0.14, 0.92, 0.08]}
      rotation={[-0.35, 0.2, 0.45]}
    >
      <mesh geometry={geos.hammerHandle} material={mats.ink} castShadow />
      <mesh position={[0, 0.1, 0]} geometry={geos.hammerHead} material={mats.steel} castShadow />
    </group>
  )
}

function Rope({ bind }) {
  return (
    <group ref={(node) => { bind.rope = node }} position={[0.05, 1.02, 0.06]}>
      <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.22, 8]} />
        <meshStandardMaterial color="#595959" roughness={0.7} />
      </mesh>
    </group>
  )
}

export function poseHammerNav(phase = 0) {
  return (bind, root, t) => {
    const tap = Math.max(0, Math.sin(t * 9 + phase))
    if (bind.hammer) {
      bind.hammer.rotation.x = -0.55 + tap * 1.35
      bind.hammer.position.y = 0.92 - tap * 0.04
    }
    root.rotation.x = tap * 0.06
  }
}

export function posePullAbout(phase = 0) {
  return (bind, root, t) => {
    const pull = Math.sin(t * 1.4 + phase) * 0.5 + 0.5
    const lean = Math.sin(t * 2.1 + phase) * 0.08
    root.rotation.z = -lean
    root.rotation.y = -0.42 - pull * 0.12
    if (bind.rope) {
      bind.rope.rotation.y = -pull * 0.35
      bind.rope.position.x = 0.05 + pull * 0.06
    }
    root.userData.pull = pull
  }
}

export default function HumanWorker({
  layoutKey,
  pose,
  tool,
  rotation = [0, 0, 0],
  modelScale = 0.55,
}) {
  const root = useRef(null)
  const bind = useRef({})
  const group = useRef(null)
  const { scene, animations } = useGLTF(MODEL)
  const model = useMemo(() => {
    const cloned = SkeletonUtils.clone(scene)
    tintHuman(cloned)
    return cloned
  }, [scene])

  const { actions, mixer } = useAnimations(animations, group)

  useEffect(() => {
    const run =
      actions?.walk ||
      actions?.Walk ||
      actions?.Run ||
      actions?.run ||
      Object.values(actions || {})[0]
    if (run) {
      run.reset().fadeIn(0.2).play()
      run.setEffectiveTimeScale(0.35)
    }
    return () => run?.fadeOut(0.15)
  }, [actions])

  useLayoutEffect(() => () => model?.traverse?.((o) => {
    if (o.geometry) o.geometry.dispose?.()
  }), [model])

  useFrame((state, delta) => {
    if (mixer) mixer.update(delta)
    if (!root.current) return

    const lv = layout()
    const spec = lv[layoutKey]
    if (!spec) return

    const reveal = THREE.MathUtils.smoothstep(anim.reveal, 0.02, 0.55)
    root.current.visible = anim.reveal > 0.03
    const s = lv.worker * modelScale * (0.88 + 0.12 * reveal)
    root.current.scale.setScalar(s)
    root.current.position.set(spec.x, spec.y, spec.z)

    pose?.(bind.current, root.current, state.clock.elapsedTime)
  })

  return (
    <group ref={root} visible={false} rotation={rotation}>
      <group ref={group}>
        <primitive object={model} />
        {tool === 'hammer' && <Hammer bind={bind.current} />}
        {tool === 'rope' && <Rope bind={bind.current} />}
      </group>
    </group>
  )
}

useGLTF.preload(MODEL)
