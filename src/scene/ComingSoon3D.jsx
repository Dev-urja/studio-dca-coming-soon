import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, Text3D } from '@react-three/drei'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import helvetiker from 'three/examples/fonts/helvetiker_bold.typeface.json'
import { layout } from '../brand'
import { anim } from './anim'

export const HEADLINE_BASE_SIZE = 0.42
const FULL_TEXT = 'COMING SOON'
const INCOMPLETE_TEXT = 'COMING SOO'

function textWidth(text) {
  const font = new FontLoader().parse(helvetiker)
  const geometry = new TextGeometry(text, {
    font,
    size: HEADLINE_BASE_SIZE,
    depth: 0.028,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.006,
    bevelSize: 0.004,
    bevelSegments: 2,
  })
  geometry.computeBoundingBox()
  const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x
  geometry.dispose()
  return width
}

export const HEADLINE_METRICS = {
  fullWidth: textWidth(FULL_TEXT),
  incompleteWidth: textWidth(INCOMPLETE_TEXT),
  nWidth: textWidth('N'),
}

export default function ComingSoon3D() {
  const root = useRef(null)

  useFrame(() => {
    if (!root.current) return
    const { pos, width } = layout().soon
    const e = THREE.MathUtils.smoothstep(anim.reveal, 0.05, 0.8)
    root.current.visible = anim.reveal > 0.04
    const s = width / HEADLINE_METRICS.fullWidth
    root.current.scale.setScalar(s)
    root.current.position.set(pos[0], pos[1] + (1 - e) * 0.12, pos[2])
  })

  return (
    <group ref={root} visible={false}>
      <group position={[-(HEADLINE_METRICS.fullWidth - HEADLINE_METRICS.incompleteWidth) * 0.5, 0, 0]}>
        <Center>
          <Text3D
            font={helvetiker}
            size={HEADLINE_BASE_SIZE}
            height={0.028}
            bevelEnabled
            bevelThickness={0.006}
            bevelSize={0.004}
            bevelSegments={2}
            curveSegments={10}
            castShadow
            receiveShadow
          >
            {INCOMPLETE_TEXT}
            <meshStandardMaterial color="#29282d" roughness={0.46} metalness={0.08} />
          </Text3D>
        </Center>
      </group>
    </group>
  )
}
