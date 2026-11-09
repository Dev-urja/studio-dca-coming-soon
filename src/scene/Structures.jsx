import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { computePage, layout } from '../brand'
import { anim } from './anim'
import { mats } from './materials'

export function Ladder({ height, width = 0.36 }) {
  const built = useMemo(() => {
    const rails = new THREE.BoxGeometry(0.038, height, 0.05)
    const rung = new THREE.BoxGeometry(width, 0.02, 0.028)
    const count = Math.max(5, Math.round(height / 0.14))
    const ys = []
    for (let i = 0; i < count; i++) {
      ys.push(0.12 + (i * (height - 0.24)) / Math.max(1, count - 1))
    }
    return { rails, rung, ys }
  }, [height, width])

  useLayoutEffect(() => () => {
    built.rails.dispose()
    built.rung.dispose()
  }, [built])

  return (
    <group>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * width * 0.5, height * 0.5, 0]} geometry={built.rails} material={mats.ink} castShadow />
      ))}
      {built.ys.map((y, i) => (
        <mesh key={i} position={[0, y, 0]} geometry={built.rung} material={mats.steel} castShadow />
      ))}
    </group>
  )
}

export function ScaffoldTower({ width, height }) {
  const plank = useMemo(() => new THREE.BoxGeometry(width, 0.045, 0.36), [width])
  const rail = useMemo(() => new THREE.BoxGeometry(width, 0.02, 0.02), [width])
  const pole = useMemo(() => new THREE.CylinderGeometry(0.02, 0.022, height, 10), [height])
  const brace = useMemo(() => new THREE.BoxGeometry(0.02, height * 0.42, 0.02), [height])
  const foot = useMemo(() => new THREE.BoxGeometry(0.14, 0.03, 0.14), [])

  useLayoutEffect(() => () => {
    plank.dispose()
    rail.dispose()
    pole.dispose()
    brace.dispose()
    foot.dispose()
  }, [plank, rail, pole, brace, foot])

  const xs = [-width * 0.44, -width * 0.14, width * 0.14, width * 0.44]
  return (
    <group>
      {xs.map((x) => (
        <group key={x}>
          <mesh position={[x, height * 0.5, 0]} geometry={pole} material={mats.ink} castShadow />
          <mesh position={[x, 0.015, 0.04]} geometry={foot} material={mats.steel} castShadow receiveShadow />
        </group>
      ))}
      <mesh position={[0, height * 0.34, 0.02]} rotation={[0, 0, 0.52]} geometry={brace} material={mats.grey} />
      <mesh position={[0, height * 0.58, -0.02]} rotation={[0, 0, -0.48]} geometry={brace} material={mats.grey} />
      <mesh position={[0, height - 0.02, 0.02]} geometry={plank} material={mats.grey} castShadow receiveShadow />
      <mesh position={[0, height * 0.55, 0.03]} geometry={plank} material={mats.grey} castShadow receiveShadow />
      <mesh position={[0, height + 0.28, 0.04]} geometry={rail} material={mats.steel} />
      <mesh position={[0, height * 0.72, 0.04]} geometry={rail} material={mats.steel} />
    </group>
  )
}

export function Catwalk({ width }) {
  const deck = useMemo(() => new THREE.BoxGeometry(width, 0.04, 0.32), [width])
  const lip = useMemo(() => new THREE.BoxGeometry(width, 0.025, 0.025), [width])
  useLayoutEffect(() => () => { deck.dispose(); lip.dispose() }, [deck, lip])
  return (
    <group>
      <mesh geometry={deck} material={mats.grey} castShadow receiveShadow />
      <mesh position={[0, 0.14, -0.14]} geometry={lip} material={mats.steel} castShadow />
    </group>
  )
}

export function MiniCrane({ armLength }) {
  const hook = useRef(null)
  const block = useRef(null)
  useFrame((state) => {
    if (!hook.current || !block.current) return
    const t = state.clock.elapsedTime
    const y = Math.sin(t * 0.55) * 0.12 - 0.05
    hook.current.position.y = y
    block.current.position.y = y - 0.18
  })

  return (
    <group>
      <mesh position={[0, 0.08, 0]} material={mats.ink} castShadow>
        <boxGeometry args={[0.36, 0.16, 0.36]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={mats.ink} castShadow>
        <boxGeometry args={[0.08, 1.0, 0.08]} />
      </mesh>
      <mesh position={[armLength * 0.45, 1.02, 0]} rotation={[0, 0, 0.08]} material={mats.steel} castShadow>
        <boxGeometry args={[armLength, 0.06, 0.06]} />
      </mesh>
      <mesh ref={hook} position={[armLength * 0.82, 0.72, 0]} material={mats.steel}>
        <torusGeometry args={[0.05, 0.012, 8, 16]} />
      </mesh>
      <mesh ref={block} position={[armLength * 0.82, 0.5, 0.05]} material={mats.mist} castShadow>
        <boxGeometry args={[0.14, 0.18, 0.08]} />
      </mesh>
    </group>
  )
}

export default function Structures() {
  const { size } = useThree()
  const root = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)
  const ladderRef = useRef(null)
  const catRef = useRef(null)
  const craneRef = useRef(null)

  const spec = useMemo(
    () => layout(computePage(size.width / Math.max(size.height, 1))),
    [size.width, size.height],
  )

  useFrame(() => {
    if (root.current) root.current.visible = anim.reveal > 0.04
    const lv = layout()
    if (leftRef.current) leftRef.current.position.set(lv.scaffoldLeft.x, lv.scaffoldLeft.y, lv.scaffoldLeft.z)
    if (rightRef.current) rightRef.current.position.set(lv.scaffoldRight.x, lv.scaffoldRight.y, lv.scaffoldRight.z)
    if (ladderRef.current) {
      ladderRef.current.position.set(lv.letterLadder.x, lv.letterLadder.y, lv.letterLadder.z)
      ladderRef.current.rotation.x = lv.letterLadder.lean
    }
    if (catRef.current) catRef.current.position.set(lv.catwalk.x, lv.catwalk.y, lv.catwalk.z)
    if (craneRef.current) craneRef.current.position.set(lv.crane.x, lv.crane.y, lv.crane.z)
  })

  return (
    <group ref={root} visible={false}>
      <group ref={leftRef}>
        <ScaffoldTower width={spec.scaffoldLeft.width} height={spec.scaffoldLeft.height} />
      </group>
      <group ref={rightRef}>
        <ScaffoldTower width={spec.scaffoldRight.width} height={spec.scaffoldRight.height} />
      </group>
      <group ref={ladderRef}>
        <Ladder height={spec.letterLadder.height} width={spec.letterLadder.width} />
      </group>
      <group ref={catRef}>
        <Catwalk width={spec.catwalk.width} />
      </group>
      <group ref={craneRef}>
        <MiniCrane armLength={spec.crane.arm} />
      </group>
    </group>
  )
}
