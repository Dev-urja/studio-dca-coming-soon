import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { layout } from '../brand'
import { anim } from './anim'

const WORKER_URL = '/models/drew-3d-person-construction-worker-with-hard-hat-and-hi-vis.glb'

// The model faces local +Z. The webpage is behind it at lower Z, so scaffold
// workers use PI radians to inspect the lettering.

function prepare(root) {
  root.traverse((obj) => {
    if (!obj.isMesh) return
    obj.castShadow = true
    obj.receiveShadow = true
  })
}

function Worker({ task, scale = 1 }) {
  const root = useRef(null)
  const { scene } = useGLTF(WORKER_URL)
  const model = useMemo(() => {
    const cloned = scene.clone(true)
    prepare(cloned)
    return cloned
  }, [scene])
  const metrics = useMemo(() => {
    const box = new THREE.Box3().setFromObject(model)
    return {
      height: Math.max(0.01, box.max.y - box.min.y),
      foot: box.min.y,
    }
  }, [model])

  useFrame(() => {
    if (!root.current) return
    const lv = layout()
    const spot = lv.workers[task]
    const hiddenOnMobile = lv.mobile && (task === 'left' || task === 'right')
    root.current.visible = !hiddenOnMobile && anim.reveal > 0.02
    const fit = (lv.worker * scale) / metrics.height
    root.current.scale.setScalar(fit)
    root.current.position.set(spot.x, spot.y - metrics.foot * fit, spot.z)
    root.current.rotation.set(0, spot.yaw, 0)
  })

  return (
    <group ref={root} visible={false}>
      <primitive object={model} />
    </group>
  )
}

export default function ConstructionCrew() {
  return (
    <>
      <Worker task="left" scale={0.98} />
      <Worker task="right" scale={0.94} />
      <Worker task="ground" scale={1.02} />
      <Worker task="supervisor" scale={0.97} />
    </>
  )
}

useGLTF.preload(WORKER_URL)
