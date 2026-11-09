import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import * as THREE from 'three'
import Experience from './scene/Experience'

export default function App() {
  return (
    <>
      <Canvas
        orthographic
        shadows
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 20], near: 0.08, far: 80, zoom: 1 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#000000')
          gl.shadowMap.type = THREE.PCFSoftShadowMap
        }}
        aria-label="Studio DCA coming soon"
      >
        <Suspense fallback={null}>
          <Experience />
          <Preload all />
        </Suspense>
      </Canvas>
      <a
        className="whatsapp-button"
        href="https://wa.me/919583067855"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Studio DCA on WhatsApp at +91 95830 67855"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path className="whatsapp-circle" d="M12 1.8A10.2 10.2 0 0 0 3.2 17l-1.3 5 5.1-1.3A10.2 10.2 0 1 0 12 1.8Z" />
          <path className="whatsapp-phone" d="M8.1 6.5c.3-.3.8-.3 1.1-.1l1.4 1.8c.2.3.2.7 0 1l-.7.9c.8 1.7 2.2 3.1 3.9 3.9l.9-.7c.3-.2.7-.2 1 0l1.8 1.4c.3.3.3.8.1 1.1l-.8 1c-.6.7-1.6 1-2.5.7-3.8-1.3-6.8-4.3-8.1-8.1-.3-.9 0-1.9.7-2.5l1.2-.4Z" />
        </svg>
        <span>Talk to us</span>
      </a>
    </>
  )
}
