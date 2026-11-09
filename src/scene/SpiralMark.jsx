import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import { mats } from './materials'
import { anim } from './anim'

const TARGET = 3.25

export default function SpiralMark() {
  const data = useLoader(SVGLoader, '/brand/spiral.svg')
  const spin = useRef(null)
  const tilt = useRef(null)

  const fitted = useMemo(() => {
    const geoms = []
    for (const path of data.paths) {
      const shapes = SVGLoader.createShapes(path)
      for (const shape of shapes) {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 64,
          bevelEnabled: true,
          bevelThickness: 7,
          bevelSize: 4.5,
          bevelOffset: 0,
          bevelSegments: 2,
          curveSegments: 18,
          steps: 1,
        })
        geoms.push(geometry)
      }
    }

    const box = new THREE.Box3()
    for (const geometry of geoms) {
      geometry.computeBoundingBox()
      box.union(geometry.boundingBox)
    }
    const size = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(size)
    box.getCenter(center)
    for (const geometry of geoms) {
      geometry.translate(-center.x, -center.y, -center.z)
    }
    const fit = TARGET / Math.max(size.x, size.y)
    const zScale = 0.28 / Math.max(size.z, 0.001)
    return { geoms, fit, zScale }
  }, [data])

  useLayoutEffect(() => {
    return () => {
      for (const geometry of fitted.geoms) geometry.dispose()
    }
  }, [fitted])

  useFrame(() => {
    if (!spin.current || !tilt.current) return
    const opacity = anim.spiral
    spin.current.rotation.z = anim.spin
    spin.current.visible = opacity > 0.015
    tilt.current.rotation.x = 0.12 * Math.min(1, opacity + 0.15)
    tilt.current.rotation.y = 0.14 * Math.min(1, opacity + 0.15)
    const grow = 1 + (1 - THREE.MathUtils.clamp(opacity, 0, 1)) * 0.55
    const flatten = THREE.MathUtils.lerp(0.35, 1, THREE.MathUtils.clamp(opacity, 0, 1))
    tilt.current.scale.set(grow, grow, flatten)
    mats.spiral.opacity = opacity
  })

  return (
    <group ref={tilt}>
      <group ref={spin} scale={[fitted.fit, -fitted.fit, fitted.zScale]}>
        {fitted.geoms.map((geometry, index) => (
          <mesh key={index} geometry={geometry} material={mats.spiral} castShadow />
        ))}
      </group>
    </group>
  )
}
