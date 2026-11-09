import { Suspense, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Center, Text3D } from '@react-three/drei'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json'
import { computePage, layout } from '../brand'
import { anim } from './anim'
import { mats } from './materials'
import ConstructionCrew from './SiteHumans'
import { HEADLINE_BASE_SIZE, HEADLINE_METRICS } from './ComingSoon3D'

function Scaffold({ width, height, depth }) {
  const rail = 0.028
  const deck = 0.055
  const top = height
  const xs = [-width * 0.44, width * 0.44]
  const zs = [-depth * 0.36, depth * 0.36]
  return (
    <group>
      {xs.flatMap((x) => zs.map((z) => (
        <mesh key={`${x}-${z}`} position={[x, height * 0.5, z]} castShadow>
          <cylinderGeometry args={[rail, rail, height, 10]} />
          <primitive object={mats.ink} attach="material" />
        </mesh>
      )))}
      {[height * 0.42, height * 0.72].map((y) => (
        <group key={y}>
          <mesh position={[0, y, depth * 0.36]} castShadow>
            <boxGeometry args={[width, rail, rail]} />
            <primitive object={mats.steel} attach="material" />
          </mesh>
          <mesh position={[0, y, -depth * 0.36]} castShadow>
            <boxGeometry args={[width, rail, rail]} />
            <primitive object={mats.steel} attach="material" />
          </mesh>
        </group>
      ))}
      {[-1, 1].map((side) => (
        <mesh
          key={`brace-${side}`}
          position={[0, height * 0.48, side * depth * 0.37]}
          rotation={[0, 0, side * 0.72]}
          castShadow
        >
          <boxGeometry args={[rail, height * 0.84, rail]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
      ))}
      <mesh position={[0, top - deck * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[width, deck, depth]} />
        <primitive object={mats.grey} attach="material" />
      </mesh>
      <mesh position={[0, top + 0.28, -depth * 0.36]} castShadow>
        <boxGeometry args={[width, rail, rail]} />
        <primitive object={mats.steel} attach="material" />
      </mesh>
      {xs.map((x) => (
        <mesh key={`guard-${x}`} position={[x, top + 0.14, -depth * 0.36]} castShadow>
          <cylinderGeometry args={[rail, rail, 0.32, 10]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
      ))}
      <IntegratedLadder height={height} width={Math.min(0.38, width * 0.33)} z={depth * 0.38 + 0.018} />
    </group>
  )
}

function IntegratedLadder({ height, width, z }) {
  const count = Math.max(5, Math.floor(height / 0.19))
  const rungs = Array.from({ length: count }, (_, i) => 0.1 + i * ((height - 0.2) / (count - 1)))
  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * width * 0.48, height * 0.5, 0]} castShadow>
          <boxGeometry args={[0.025, height, 0.025]} />
          <primitive object={mats.ink} attach="material" />
        </mesh>
      ))}
      {rungs.map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[width, 0.016, 0.022]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
      ))}
    </group>
  )
}

function MiniCrane({ height, arm, payloadRef, cableRef, trolleyRef, leverRef }) {
  const braceLength = Math.hypot(arm * 0.58, height * 0.24)
  const braceAngle = Math.atan2(height * 0.24, -arm * 0.58)
  return (
    <group>
      <mesh position={[0, 0.035, 0]} castShadow>
        <boxGeometry args={[0.58, 0.07, 0.32]} />
        <primitive object={mats.ink} attach="material" />
      </mesh>
      <mesh position={[0, height * 0.5, 0]} castShadow>
        <boxGeometry args={[0.07, height, 0.07]} />
        <primitive object={mats.ink} attach="material" />
      </mesh>
      <mesh position={[-arm * 0.35, height, 0]} rotation={[0, 0, -0.03]} castShadow>
        <boxGeometry args={[arm, 0.075, 0.065]} />
        <primitive object={mats.steel} attach="material" />
      </mesh>
      <mesh position={[0, height - 0.005, 0]} castShadow>
        <boxGeometry args={[0.18, 0.18, 0.11]} />
        <primitive object={mats.ink} attach="material" />
      </mesh>
      <mesh
        position={[-arm * 0.29, height * 0.88, 0]}
        rotation={[0, 0, braceAngle]}
        castShadow
      >
        <boxGeometry args={[braceLength, 0.05, 0.05]} />
        <primitive object={mats.steel} attach="material" />
      </mesh>
      <mesh position={[-arm * 0.58, height, 0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.08, 12]} />
        <primitive object={mats.ink} attach="material" />
      </mesh>
      <mesh position={[0, height * 0.76, 0.01]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.08, 12]} />
        <primitive object={mats.ink} attach="material" />
      </mesh>
      <mesh position={[arm * 0.12, height - 0.08, 0]} castShadow>
        <boxGeometry args={[0.28, 0.18, 0.2]} />
        <meshStandardMaterial color="#343a49" roughness={0.55} metalness={0.24} />
      </mesh>
      <group ref={trolleyRef} position={[-arm * 0.72, height - 0.04, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.15, 0.14]} />
          <primitive object={mats.ink} attach="material" />
        </mesh>
        <mesh position={[0, 0.09, 0]} castShadow>
          <boxGeometry args={[0.065, 0.18, 0.09]} />
          <primitive object={mats.ink} attach="material" />
        </mesh>
        {[-0.055, 0.055].map((x) => (
          <mesh key={x} position={[x, 0.065, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.035, 10]} />
            <primitive object={mats.steel} attach="material" />
          </mesh>
        ))}
      </group>
      <mesh ref={cableRef} position={[-arm * 0.72, height * 0.7, 0]} castShadow>
        <boxGeometry args={[0.018, 1, 0.018]} />
        <primitive object={mats.ink} attach="material" />
      </mesh>
      <group ref={payloadRef} position={[-arm * 0.72, height * 0.2, 0.03]}>
        <mesh position={[0, 0.43, 0]} castShadow>
          <boxGeometry args={[0.17, 0.13, 0.09]} />
          <primitive object={mats.ink} attach="material" />
        </mesh>
        <mesh position={[0, 0.43, 0.055]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.052, 0.052, 0.035, 14]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
        <mesh position={[0, 0.315, 0]} castShadow>
          <boxGeometry args={[0.018, 0.11, 0.018]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
        <mesh position={[0.035, 0.23, 0]} rotation={[0, 0, -0.35]} castShadow>
          <torusGeometry args={[0.075, 0.015, 8, 18, Math.PI * 1.45]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
        <mesh position={[0, 0.105, 0]} castShadow>
          <boxGeometry args={[0.014, 0.15, 0.014]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
        <Center>
          <Text3D
            font={helvetiker}
            size={HEADLINE_BASE_SIZE}
            height={0.028}
            bevelEnabled
            bevelThickness={0.006}
            bevelSize={0.004}
            bevelSegments={2}
            castShadow
          >
            N
            <meshStandardMaterial color="#29282d" roughness={0.46} metalness={0.08} />
          </Text3D>
        </Center>
      </group>
      <group position={[-0.24, 0.2, 0.16]}>
        <mesh castShadow>
          <boxGeometry args={[0.26, 0.28, 0.18]} />
          <meshStandardMaterial color="#343a49" roughness={0.55} metalness={0.18} />
        </mesh>
        <group ref={leverRef} position={[0, 0.18, 0]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.16, 8]} />
            <primitive object={mats.steel} attach="material" />
          </mesh>
          <mesh position={[0, 0.17, 0]} castShadow>
            <sphereGeometry args={[0.035, 10, 8]} />
            <primitive object={mats.ink} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function ActivityProps({ toolRef, measureRef, beaconMaterial }) {
  return (
    <group>
      <group ref={toolRef} position={[0.35, 0.18, 0.18]}>
        <mesh castShadow>
          <boxGeometry args={[0.12, 0.05, 0.07]} />
          <primitive object={mats.ink} attach="material" />
        </mesh>
        <mesh position={[0.08, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.009, 0.009, 0.1, 8]} />
          <primitive object={mats.steel} attach="material" />
        </mesh>
      </group>
      <mesh ref={measureRef} position={[-0.28, 0.07, 0.16]} castShadow>
        <boxGeometry args={[1, 0.012, 0.016]} />
        <meshStandardMaterial color="#595959" roughness={0.48} metalness={0.25} />
      </mesh>
      <mesh position={[-0.42, 0.31, 0.08]} castShadow>
        <cylinderGeometry args={[0.045, 0.055, 0.075, 12]} />
        <meshStandardMaterial
          ref={beaconMaterial}
          color="#d3d3d3"
          emissive="#d3d3d3"
          emissiveIntensity={0.2}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}

export default function Crew() {
  const { size } = useThree()
  const spec = useMemo(
    () => layout(computePage(size.width / Math.max(size.height, 1))),
    [size.width, size.height],
  )
  const root = useRef(null)
  const left = useRef(null)
  const right = useRef(null)
  const mobileLadder = useRef(null)
  const deck = useRef(null)
  const crane = useRef(null)
  const activity = useRef(null)
  const payload = useRef(null)
  const cable = useRef(null)
  const trolley = useRef(null)
  const tool = useRef(null)
  const measure = useRef(null)
  const beaconMaterial = useRef(null)
  const materials = useRef(null)
  const lever = useRef(null)
  const motion = useRef({
    lift: 0.55,
    sway: 0,
    tool: -0.08,
    measure: 0.14,
    light: 0.2,
    material: 0,
    lever: -0.18,
  })

  useGSAP(() => {
    const m = motion.current
    const targetLift = spec.soon.pos[1] - spec.crane.y
    const craneTimeline = gsap.timeline({ repeat: -1, repeatDelay: 0.8, delay: 1.15 })
    craneTimeline
      .to(m, { lift: targetLift, sway: 0.018, duration: 5.2, ease: 'power2.inOut' })
      .to(m, { sway: 0, duration: 0.65, ease: 'sine.out' })
      .to(m, { lift: targetLift, duration: 1.8 })
      .to(m, { lift: 0.55, duration: 2.2, ease: 'power2.inOut' })

    gsap.to(m, { tool: 0.12, duration: 0.48, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: 0.75, delay: 0.45 })
    gsap.to(m, { measure: 0.52, duration: 1.8, ease: 'power1.inOut', yoyo: true, repeat: -1, repeatDelay: 1.7, delay: 2.25 })
    gsap.to(m, { light: 3.2, duration: 0.16, ease: 'steps(1)', yoyo: true, repeat: -1, repeatDelay: 1.25, delay: 0.9 })
    gsap.to(m, { material: 0.1, duration: 1.4, ease: 'sine.inOut', yoyo: true, repeat: -1, repeatDelay: 2.2, delay: 1.6 })
    gsap.to(m, { lever: 0.22, duration: 0.55, ease: 'power1.inOut', yoyo: true, repeat: -1, repeatDelay: 2.6, delay: 2.9 })
  }, { dependencies: [spec.crane.height, spec.soon.pos[1], spec.crane.y] })

  useFrame(() => {
    if (root.current) root.current.visible = anim.reveal > 0.04
    const lv = layout()
    if (left.current) left.current.visible = !lv.mobile
    if (right.current) right.current.visible = !lv.mobile
    if (mobileLadder.current) mobileLadder.current.visible = lv.mobile
    if (activity.current) activity.current.visible = !lv.mobile
    left.current?.position.set(lv.scaffoldLeft.x, lv.scaffoldLeft.y, lv.scaffoldLeft.z)
    right.current?.position.set(lv.scaffoldRight.x, lv.scaffoldRight.y, lv.scaffoldRight.z)
    mobileLadder.current?.position.set(-lv.deck.width * 0.38, lv.deck.top, lv.deck.z + 0.04)
    deck.current?.position.set(lv.deck.x, lv.deck.y, lv.deck.z)
    crane.current?.position.set(lv.crane.x, lv.crane.y, lv.crane.z)
    activity.current?.position.set(lv.scaffoldLeft.x, lv.scaffoldLeft.top, lv.scaffoldLeft.z)

    const m = motion.current
    const headlineScale = lv.soon.width / HEADLINE_METRICS.fullWidth
    const targetNCenter = lv.soon.pos[0] + lv.soon.width * 0.5 - HEADLINE_METRICS.nWidth * headlineScale * 0.5
    const payloadX = targetNCenter - lv.crane.x
    if (payload.current) {
      payload.current.position.set(payloadX, m.lift, 0.03)
      payload.current.rotation.z = m.sway
      payload.current.scale.setScalar(headlineScale)
    }
    if (cable.current) {
      const top = lv.crane.height - 0.04
      const hookY = m.lift + 0.5 * headlineScale
      const length = Math.max(0.08, top - hookY)
      cable.current.position.set(payloadX, top - length * 0.5, 0)
      cable.current.scale.y = length
    }
    if (trolley.current) trolley.current.position.x = payloadX
    if (tool.current) tool.current.rotation.z = m.tool
    if (measure.current) {
      measure.current.scale.x = m.measure
      measure.current.position.x = -0.48 + m.measure * 0.5
    }
    if (beaconMaterial.current) beaconMaterial.current.emissiveIntensity = m.light
    if (materials.current) materials.current.position.x = m.material
    if (lever.current) lever.current.rotation.z = m.lever
  })

  return (
    <group ref={root} visible={false}>
      <group ref={left}>
        <Scaffold
          width={spec.scaffoldLeft.width}
          height={spec.scaffoldLeft.height}
          depth={spec.scaffoldLeft.depth}
        />
      </group>
      <group ref={right}>
        <Scaffold
          width={spec.scaffoldRight.width}
          height={spec.scaffoldRight.height}
          depth={spec.scaffoldRight.depth}
        />
      </group>
      <group ref={mobileLadder} visible={false}>
        <IntegratedLadder
          height={spec.scaffoldLeft.height}
          width={Math.min(0.42, spec.scaffoldLeft.width * 0.75)}
          z={0}
        />
      </group>
      <group ref={deck}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[spec.deck.width, spec.deck.thickness, spec.deck.depth]} />
          <primitive object={mats.grey} attach="material" />
        </mesh>
        <group ref={materials}>
          <mesh position={[-spec.deck.width * 0.29, spec.deck.thickness * 0.5 + 0.07, 0.09]} castShadow>
            <boxGeometry args={[0.28, 0.14, 0.18]} />
            <meshStandardMaterial color="#343a49" roughness={0.6} metalness={0.15} />
          </mesh>
          <mesh position={[-spec.deck.width * 0.25, spec.deck.thickness * 0.5 + 0.05, -0.05]} castShadow>
            <boxGeometry args={[0.38, 0.07, 0.12]} />
            <primitive object={mats.steel} attach="material" />
          </mesh>
        </group>
        <mesh position={[spec.deck.width * 0.25, spec.deck.thickness * 0.5 + 0.03, 0.1]} rotation={[-0.6, 0.2, 0]} castShadow>
          <boxGeometry args={[0.28, 0.36, 0.012]} />
          <meshStandardMaterial color="#d3d3d3" roughness={0.72} />
        </mesh>
      </group>
      <group ref={crane}>
        <MiniCrane
          height={spec.crane.height}
          arm={spec.crane.arm}
          payloadRef={payload}
          cableRef={cable}
          trolleyRef={trolley}
          leverRef={lever}
        />
      </group>
      <group ref={activity}>
        <ActivityProps toolRef={tool} measureRef={measure} beaconMaterial={beaconMaterial} />
      </group>
      <Suspense fallback={null}>
        <ConstructionCrew />
      </Suspense>
    </group>
  )
}
