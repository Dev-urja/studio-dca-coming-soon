import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { layout } from '../brand'
import { geos, mats } from './materials'
import { anim } from './anim'

function Arm({ side, bind, children }) {
  const sign = side === 'left' ? -1 : 1
  const armKey = side === 'left' ? 'armL' : 'armR'
  const elbowKey = side === 'left' ? 'elbowL' : 'elbowR'
  return (
    <group
      ref={(node) => {
        bind[armKey] = node
      }}
      position={[sign * 0.2, 0.26, 0]}
    >
      <mesh geometry={geos.shoulder} material={mats.suit} castShadow />
      <mesh position={[sign * 0.01, -0.11, 0]} geometry={geos.upperArm} material={mats.suit} castShadow />
      <group
        ref={(node) => {
          bind[elbowKey] = node
        }}
        position={[sign * 0.01, -0.21, 0]}
      >
        <mesh position={[0, -0.095, 0]} geometry={geos.lowerArm} material={mats.grey} castShadow />
        <mesh position={[0, -0.185, 0.02]} geometry={geos.hand} material={mats.glove} castShadow />
        {children}
      </group>
    </group>
  )
}

function Leg({ side, bind }) {
  const sign = side === 'left' ? -1 : 1
  const legKey = side === 'left' ? 'legL' : 'legR'
  const kneeKey = side === 'left' ? 'kneeL' : 'kneeR'
  return (
    <group
      ref={(node) => {
        bind[legKey] = node
      }}
      position={[sign * 0.072, -0.02, 0]}
    >
      <mesh position={[0, -0.11, 0]} geometry={geos.upperLeg} material={mats.suit} castShadow />
      <mesh position={[0, -0.2, 0.03]} geometry={geos.knee} material={mats.slate} castShadow />
      <group
        ref={(node) => {
          bind[kneeKey] = node
        }}
        position={[0, -0.22, 0]}
      >
        <mesh position={[0, -0.1, 0]} geometry={geos.lowerLeg} material={mats.grey} castShadow />
        <mesh position={[0, -0.2, 0.03]} geometry={geos.boot} material={mats.boot} castShadow />
      </group>
    </group>
  )
}

function Tool({ kind, bind }) {
  if (kind === 'hammer') {
    return (
      <group
        ref={(node) => {
          bind.tool = node
        }}
        position={[0, -0.2, 0.02]}
      >
        <mesh position={[0, -0.02, 0]} geometry={geos.hammerHandle} material={mats.ink} castShadow />
        <mesh position={[0, -0.12, 0]} geometry={geos.hammerHead} material={mats.steel} castShadow />
      </group>
    )
  }
  if (kind === 'drill') {
    return (
      <group
        ref={(node) => {
          bind.tool = node
        }}
        position={[0, -0.2, 0.04]}
        rotation={[0.5, 0, 0]}
      >
        <mesh geometry={geos.drillBody} material={mats.slate} castShadow />
        <mesh
          ref={(node) => {
            bind.bit = node
          }}
          position={[0, -0.09, 0.02]}
          geometry={geos.drillBit}
          material={mats.mist}
          castShadow
        />
      </group>
    )
  }
  if (kind === 'wrench') {
    return (
      <group
        ref={(node) => {
          bind.tool = node
        }}
        position={[0, -0.18, 0.03]}
        rotation={[0.2, 0, 0.4]}
      >
        <mesh geometry={geos.wrench} material={mats.steel} castShadow />
        <mesh position={[0, 0.09, 0]} geometry={geos.wrenchHead} material={mats.steel} castShadow />
      </group>
    )
  }
  if (kind === 'panel') {
    return (
      <group
        ref={(node) => {
          bind.tool = node
        }}
        position={[0, -0.08, 0.1]}
      >
        <mesh geometry={geos.panel} material={mats.mist} castShadow />
      </group>
    )
  }
  if (kind === 'tape') {
    return (
      <group
        ref={(node) => {
          bind.tool = node
        }}
        position={[0, -0.16, 0.05]}
      >
        <mesh geometry={geos.tapeCase} material={mats.slate} castShadow />
        <mesh
          ref={(node) => {
            bind.blade = node
          }}
          position={[0.28, 0.02, 0]}
          geometry={geos.tapeBlade}
          material={mats.mist}
        />
        <mesh position={[-0.02, 0.42, 0]} geometry={geos.rod} material={mats.grey} castShadow />
      </group>
    )
  }
  if (kind === 'tile') {
    return (
      <group
        ref={(node) => {
          bind.tool = node
        }}
        position={[0, -0.16, 0.08]}
      >
        <mesh geometry={geos.tile} material={mats.mist} castShadow />
      </group>
    )
  }
  return null
}

function Body({ bind, tool }) {
  return (
    <group
      ref={(node) => {
        bind.hips = node
      }}
      position={[0, 0.5, 0]}
    >
      <mesh geometry={geos.pelvis} material={mats.suit} scale={[1, 0.72, 0.86]} castShadow />
      <mesh position={[0, 0.02, 0]} geometry={geos.belt} material={mats.ink} castShadow />
      <group
        ref={(node) => {
          bind.spine = node
        }}
      >
        <mesh position={[0, 0.18, 0]} geometry={geos.torso} material={mats.suit} castShadow />
        <mesh position={[0, 0.17, 0.075]} geometry={geos.vest} material={mats.slate} castShadow />
        <mesh position={[0, 0.22, 0.108]} geometry={geos.stripe} material={mats.mist} />
        <mesh position={[0, 0.15, 0.108]} geometry={geos.stripe} material={mats.mist} />
        <mesh position={[0.07, 0.02, 0.06]} geometry={geos.pouch} material={mats.ink} castShadow />
        <mesh position={[0, 0.34, 0]} geometry={geos.neck} material={mats.skin} />
        {tool === 'beam' && (
          <group
            ref={(node) => {
              bind.shoulderTool = node
            }}
            position={[0.16, 0.24, 0.02]}
          >
            <mesh position={[0.05, 0.06, 0]} rotation={[0.15, 0.2, 0.55]} geometry={geos.beam} material={mats.steel} castShadow />
          </group>
        )}
        <group
          ref={(node) => {
            bind.head = node
          }}
          position={[0, 0.42, 0]}
        >
          <mesh geometry={geos.head} material={mats.skin} castShadow />
          <mesh position={[0, 0.028, -0.006]} geometry={geos.helmet} material={mats.slate} scale={[1.05, 0.78, 1.08]} castShadow />
          <mesh position={[0, 0.055, 0.01]} geometry={geos.ridge} material={mats.mist} />
          <mesh position={[0, -0.02, 0.012]} geometry={geos.brim} material={mats.ink} castShadow />
          <mesh position={[0, -0.006, 0.07]} geometry={geos.visor} material={mats.ink} />
          <mesh position={[-0.024, -0.01, 0.064]} geometry={geos.eye} material={mats.ink} />
          <mesh position={[0.024, -0.01, 0.064]} geometry={geos.eye} material={mats.ink} />
          <mesh position={[0, -0.02, 0.072]} geometry={geos.nose} material={mats.skin} scale={[0.7, 0.85, 1]} />
        </group>
        <Arm side="left" bind={bind} />
        <Arm side="right" bind={bind}>
          <Tool kind={tool} bind={bind} />
        </Arm>
      </group>
      <Leg side="left" bind={bind} />
      <Leg side="right" bind={bind} />
    </group>
  )
}

function showWorker(root, scale) {
  const reveal = THREE.MathUtils.smoothstep(anim.reveal, 0.02, 0.55)
  root.visible = anim.reveal > 0.03
  const s = scale * (0.86 + 0.14 * reveal)
  root.scale.setScalar(s)
  return reveal
}

function stride(bind, t, speed, phase, armAmp = 0.45) {
  const c = Math.cos(t * speed + phase)
  bind.legL.rotation.x = c * 0.72
  bind.legR.rotation.x = -c * 0.72
  bind.kneeL.rotation.x = Math.max(0, -c) * 0.85
  bind.kneeR.rotation.x = Math.max(0, c) * 0.85
  bind.armL.rotation.x = 0.35 - c * armAmp
  bind.armR.rotation.x = 0.35 + c * armAmp
  bind.elbowL.rotation.x = 0.35
  bind.elbowR.rotation.x = 0.35
  bind.hips.position.y = 0.5 + Math.abs(c) * 0.018
  bind.spine.rotation.z = c * 0.04
  bind.spine.rotation.x = 0.06
}

export function poseClimb(phase, ladderKey = 'letterLadder') {
  return (bind, root, t) => {
    if (!bind.armL) return
    showWorker(root, root.userData.scale || 1)
    const lad = layout()[ladderKey]
    const height = lad ? lad.height : 1.2
    const climb = Math.sin(t * 0.62 + phase) * 0.5 + 0.5
    root.position.y = height * 0.06 + climb * height * 0.7
    const s = Math.sin(t * 5.4 + phase)
    bind.armL.rotation.x = 2.15 + s * 0.55
    bind.armR.rotation.x = 2.15 - s * 0.55
    bind.armL.rotation.z = 0.15
    bind.armR.rotation.z = -0.15
    bind.elbowL.rotation.x = 0.7 + Math.max(0, s) * 0.35
    bind.elbowR.rotation.x = 0.7 + Math.max(0, -s) * 0.35
    bind.legL.rotation.x = 0.55 - s * 0.65
    bind.legR.rotation.x = 0.55 + s * 0.65
    bind.kneeL.rotation.x = 0.85 + Math.max(0, s) * 0.35
    bind.kneeR.rotation.x = 0.85 + Math.max(0, -s) * 0.35
    bind.hips.position.y = 0.5 + Math.abs(s) * 0.012
    bind.spine.rotation.x = 0.18
    bind.head.rotation.x = -0.1 + Math.sin(t * 2 + phase) * 0.06
    bind.head.rotation.y = 0.15
  }
}

export function poseInstall(phase, toolMotion) {
  return (bind, root, t) => {
    if (!bind.armL) return
    showWorker(root, root.userData.scale || 1)
    const s = Math.sin(t * (toolMotion === 'drill' ? 2.4 : 1.8) + phase)
    bind.armL.rotation.x = 2.05 + s * 0.12
    bind.armR.rotation.x = 2.25 + Math.sin(t * 3.1 + phase) * 0.16
    bind.armL.rotation.z = 0.35
    bind.armR.rotation.z = -0.42
    bind.elbowL.rotation.x = 1.15
    bind.elbowR.rotation.x = 1.25 + s * 0.18
    bind.legL.rotation.x = 0.08
    bind.legR.rotation.x = -0.04
    bind.kneeL.rotation.x = 0.12
    bind.kneeR.rotation.x = 0.18
    bind.hips.position.y = 0.5 + Math.sin(t * 1.6 + phase) * 0.008
    bind.spine.rotation.x = 0.12
    bind.spine.rotation.y = Math.sin(t * 0.9 + phase) * 0.08
    bind.head.rotation.x = -0.25
    bind.head.rotation.y = Math.sin(t * 0.7 + phase) * 0.12
    if (bind.bit) bind.bit.rotation.y = t * 16
    if (bind.tool && toolMotion === 'tile') bind.tool.position.y = -0.16 + s * 0.03
  }
}

export function poseAdjust(phase) {
  return (bind, root, t) => {
    if (!bind.armL) return
    showWorker(root, root.userData.scale || 1)
    const s = Math.sin(t * 2.2 + phase)
    bind.armL.rotation.x = 1.2
    bind.armR.rotation.x = 2.05 + s * 0.2
    bind.armL.rotation.z = 0.4
    bind.armR.rotation.z = -0.55 + s * 0.08
    bind.elbowL.rotation.x = 0.8
    bind.elbowR.rotation.x = 0.95 + Math.abs(s) * 0.25
    bind.legL.rotation.x = 0.12
    bind.legR.rotation.x = 0.28
    bind.kneeL.rotation.x = 0.2
    bind.kneeR.rotation.x = 0.45
    bind.hips.position.y = 0.5
    bind.spine.rotation.x = 0.16
    bind.spine.rotation.y = -0.25 + s * 0.06
    bind.head.rotation.y = -0.3
    bind.head.rotation.x = -0.12
    if (bind.tool) bind.tool.rotation.z = 0.4 + s * 0.35
  }
}

export function poseFix(phase) {
  return (bind, root, t) => {
    if (!bind.armL) return
    showWorker(root, root.userData.scale || 1)
    const lad = layout().soonLadder
    const height = lad ? lad.height : 1.2
    const climb = Math.sin(t * 0.45 + phase) * 0.5 + 0.5
    root.position.y = height * 0.22 + climb * height * 0.12
    const tap = Math.max(0, Math.sin(t * 7.5 + phase))
    bind.armL.rotation.x = 1.85
    bind.armR.rotation.x = 1.35 + tap * 0.85
    bind.armL.rotation.z = 0.2
    bind.armR.rotation.z = -0.25
    bind.elbowL.rotation.x = 0.9
    bind.elbowR.rotation.x = 0.4 + tap * 0.7
    bind.legL.rotation.x = 0.35
    bind.legR.rotation.x = 0.15
    bind.kneeL.rotation.x = 0.55
    bind.kneeR.rotation.x = 0.4
    bind.hips.position.y = 0.5
    bind.spine.rotation.x = 0.14
    bind.head.rotation.x = -0.2
    if (bind.tool) bind.tool.rotation.x = -0.4 + tap * 1.15
  }
}

export function poseCarry(phase, speed, kind) {
  return (bind, root, t) => {
    if (!bind.armL) return
    showWorker(root, root.userData.scale || 1)
    const range = layout().deck.width * 0.3
    const ping = Math.sin(t * speed + phase)
    const vel = Math.cos(t * speed + phase)
    root.position.x = ping * range
    root.rotation.y = vel >= 0 ? Math.PI / 2 : -Math.PI / 2
    if (kind === 'beam') {
      stride(bind, t, speed * 2.2, phase, 0.18)
      bind.armR.rotation.x = 1.55
      bind.armR.rotation.z = -0.35
      bind.elbowR.rotation.x = 0.7
      bind.armL.rotation.x = 0.45 - vel * 0.25
      if (bind.shoulderTool) bind.shoulderTool.rotation.z = Math.sin(t * speed * 2 + phase) * 0.05
    } else {
      bind.legL.rotation.x = vel * 0.68
      bind.legR.rotation.x = -vel * 0.68
      bind.kneeL.rotation.x = Math.max(0, -vel) * 0.8
      bind.kneeR.rotation.x = Math.max(0, vel) * 0.8
      bind.armL.rotation.x = 1.25
      bind.armR.rotation.x = 1.25
      bind.armL.rotation.z = 0.28
      bind.armR.rotation.z = -0.28
      bind.elbowL.rotation.x = 1.35
      bind.elbowR.rotation.x = 1.35
      bind.hips.position.y = 0.5 + Math.abs(vel) * 0.016
      bind.spine.rotation.x = 0.08
      bind.spine.rotation.z = vel * 0.03
      if (bind.tool) bind.tool.position.y = -0.08 + Math.abs(vel) * 0.02
    }
    bind.head.rotation.y = vel >= 0 ? -0.4 : 0.4
    bind.head.rotation.x = 0.05
  }
}

export function poseCrane(phase) {
  return (bind, root, t) => {
    if (!bind.armL) return
    showWorker(root, root.userData.scale || 1)
    const s = Math.sin(t * 0.7 + phase)
    bind.armL.rotation.x = 1.45 + s * 0.2
    bind.armR.rotation.x = 1.85 + Math.sin(t * 0.55 + phase) * 0.15
    bind.armL.rotation.z = 0.25
    bind.armR.rotation.z = -0.35
    bind.elbowL.rotation.x = 0.65
    bind.elbowR.rotation.x = 0.95
    bind.legL.rotation.x = 0.18
    bind.legR.rotation.x = 0.22
    bind.kneeL.rotation.x = 0.28
    bind.kneeR.rotation.x = 0.32
    bind.spine.rotation.x = 0.12
    bind.spine.rotation.y = Math.sin(t * 0.5 + phase) * 0.1
    bind.head.rotation.y = 0.35 + s * 0.08
    bind.head.rotation.x = -0.08
  }
}

export function poseMeasure(phase) {
  return (bind, root, t) => {
    if (!bind.armL) return
    showWorker(root, root.userData.scale || 1)
    const s = Math.sin(t * 0.8 + phase)
    const slide = Math.sin(t * 0.45 + phase)
    root.position.y = slide * layout().worker * 0.12
    bind.armL.rotation.x = 1.7
    bind.armR.rotation.x = 1.45 + s * 0.12
    bind.armL.rotation.z = 0.15
    bind.armR.rotation.z = -0.2
    bind.elbowL.rotation.x = 0.45
    bind.elbowR.rotation.x = 0.7
    bind.legL.rotation.x = 0.2
    bind.legR.rotation.x = 0.05
    bind.kneeL.rotation.x = 0.35 + Math.max(0, s) * 0.2
    bind.kneeR.rotation.x = 0.2
    bind.hips.position.y = 0.5
    bind.spine.rotation.x = 0.28
    bind.spine.rotation.y = s * 0.08
    bind.head.rotation.x = 0.35
    bind.head.rotation.y = 0.2
    if (bind.blade) {
      const ext = 0.65 + s * 0.35
      bind.blade.scale.x = ext
      bind.blade.position.x = 0.08 + ext * 0.22
    }
    if (bind.tool) bind.tool.rotation.z = s * 0.06
  }
}

function placeAnchor(root, anchor, t) {
  const lv = layout()
  if (anchor === 'letterLadder') {
    const lad = lv.letterLadder
    const climb = Math.sin(t * 0.5) * 0.5 + 0.5
    root.position.set(lad.x, lad.y + climb * (lad.height - 0.3), lad.z + 0.09)
    return
  }
  if (anchor === 'catwalk') {
    const walk = Math.sin(t * 0.32) * lv.catwalk.width * 0.32
    root.position.set(lv.catwalk.x + walk, lv.catwalk.y + 0.05, lv.catwalk.z + 0.06)
    root.rotation.y = walk > 0 ? Math.PI / 2 : -Math.PI / 2
    return
  }
  if (anchor === 'deckWalk') {
    const vel = Math.cos(t * 0.28)
    root.position.set(
      vel * lv.deck.width * 0.22,
      lv.deck.y + 0.05,
      lv.deck.z + 0.08,
    )
    root.rotation.y = vel >= 0 ? Math.PI / 2 : -Math.PI / 2
  }
}

export default function Worker({
  pose,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, Math.PI, 0],
  userData,
  anchor,
}) {
  const root = useRef(null)
  const bind = useRef({})
  const baseRot = useRef(rotation)

  useFrame((state) => {
    if (!root.current) return
    if (userData) Object.assign(root.current.userData, userData, { scale })
    else root.current.userData.scale = scale

    const lv = layout()
    const mult = typeof scale === 'number' ? scale : 1
    const liveScale = lv.worker * mult
    root.current.userData.scale = liveScale

    if (!anchor) {
      root.current.position.set(position[0], position[1], position[2])
      root.current.rotation.set(baseRot.current[0], baseRot.current[1], baseRot.current[2])
    } else if (anchor === 'scaffoldLeft') {
      root.current.position.set(
        lv.scaffoldLeft.x,
        lv.scaffoldLeft.y + lv.scaffoldLeft.height - 0.05,
        lv.scaffoldLeft.z + 0.08,
      )
      root.current.rotation.set(0, Math.PI * 0.85, 0)
    } else if (anchor === 'scaffoldRightTop') {
      root.current.position.set(
        lv.scaffoldRight.x,
        lv.scaffoldRight.y + lv.scaffoldRight.height - 0.05,
        lv.scaffoldRight.z + 0.08,
      )
      root.current.rotation.set(0, Math.PI * 1.1, 0)
    } else if (anchor === 'crane') {
      root.current.position.set(lv.crane.x - 0.2, lv.crane.y, lv.crane.z + 0.12)
      root.current.rotation.set(0, -Math.PI * 0.55, 0)
    } else {
      placeAnchor(root.current, anchor, state.clock.elapsedTime)
    }

    pose(bind.current, root.current, state.clock.elapsedTime)
  })
  return (
    <group ref={root} position={position} rotation={rotation}>
      <Body bind={bind.current} tool={userData?.tool} />
    </group>
  )
}
