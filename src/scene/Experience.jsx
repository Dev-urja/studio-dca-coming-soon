import { useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { setPage } from '../brand'
import { anim } from './anim'
import SpiralMark from './SpiralMark'
import Page from './Page'

function Lights() {
  return (
    <>
      <color attach="background" args={['#f3f1eb']} />

      {/* Sky + bounce */}
      <hemisphereLight args={['#e8e8f2', '#1c1c24', 0.52]} />
      <ambientLight intensity={0.24} />

      {/* Primary key – warm, top-right, casts shadows */}
      <directionalLight
        position={[6.5, 12, 10]}
        intensity={5.8}
        color="#fffff8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-bias={-0.00018}
        shadow-normalBias={0.035}
      />

      {/* Cool fill – left side */}
      <directionalLight position={[-7.5, 4, 7]} intensity={1.5} color="#c8ccdf" />

      {/* Rim from behind page – edge glow on page slab */}
      <directionalLight position={[-5, 7, -10]} intensity={2.4} color="#343a4a" />

      {/* Front fill – faces COMING SOON and worker fronts directly */}
      <directionalLight position={[1.2, 4.5, 11]} intensity={2.6} color="#f7f4ee" />

      {/* Overhead accent on COMING SOON zone */}
      <directionalLight position={[0, 10, 5]} intensity={2.0} color="#ffffff" />

      {/* Warm under-bounce from deck level */}
      <directionalLight position={[0, -6, 6]} intensity={0.55} color="#d4c8b8" />
    </>
  )
}

function Director() {
  const { camera, size } = useThree()

  const fitViewport = () => {
    const aspect = size.width / Math.max(size.height, 1)
    camera.left = -size.width / 2
    camera.right = size.width / 2
    camera.top = size.height / 2
    camera.bottom = -size.height / 2
    camera.zoom = size.height / 9
    camera.position.set(0, 0, 20)
    camera.rotation.set(0, 0, 0)
    camera.updateProjectionMatrix()
    setPage(aspect)
  }

  useGSAP(() => {
    const view   = new URLSearchParams(window.location.search).get('view')
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    gsap.set(anim, { spin: 0, open: 0, reveal: 0, spiral: 0, sheet: 0, yaw: 0, ready: 0 })
    fitViewport()

    const jumpToFinal = () => {
      gsap.set(anim, { spin: Math.PI * 1.15, open: 1, reveal: 1, spiral: 0, sheet: 1, yaw: 0, ready: 1 })
      fitViewport()
    }

    if (reduce || view === 'page') { jumpToFinal(); return }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        anim.ready = 1
      },
    })

    tl.to(anim, { spiral: 1, duration: 0.4, ease: 'power1.out' }, 0)
    tl.to(anim, { spin: Math.PI * 1.15, duration: 1.45, ease: 'power2.inOut' }, 0)
    tl.to(anim, { sheet: 1, duration: 0.45, ease: 'power1.out' }, 0.9)
    tl.to(anim, { open: 1, duration: 1.15, ease: 'power2.inOut' }, 0.85)
    tl.to(anim, { spiral: 0, duration: 0.45, ease: 'power1.in' }, 1.35)
    tl.to(anim, { reveal: 1, duration: 0.8, ease: 'power2.out' }, 1.48)

    if (view === 'spiral') { tl.pause(); tl.seek(1.05) }
    else if (view === 'mid') { tl.pause(); tl.seek(3.25) }
  }, [])

  useEffect(() => {
    fitViewport()
  }, [camera, size.width, size.height])

  useFrame(() => {
    camera.position.set(0, 0, 20)
    camera.rotation.set(0, 0, 0)
  })

  return null
}

export default function Experience() {
  return (
    <>
      <Lights />
      <Director />
      <SpiralMark />
      <Page />
    </>
  )
}
