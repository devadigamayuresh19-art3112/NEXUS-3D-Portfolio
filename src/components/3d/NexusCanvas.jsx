import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'
import NexusWorld from './NexusWorld'
import CameraRig from './CameraRig'

function AdaptiveQuality({ minDpr = 1 }) {
  const setDpr = useThree((state) => state.setDpr)
  const stats = useRef({ frames: 0, time: 0, low: 0, done: false })

  useFrame((state, delta) => {
    const current = stats.current
    if (current.done) return
    current.frames += 1
    current.time += delta
    if (current.time >= 4) {
      const fps = current.frames / current.time
      if (fps < 34) {
        current.low += 1
        if (current.low >= 2) {
          setDpr(minDpr)
          current.done = true
        }
      } else {
        current.low = 0
      }
      current.frames = 0
      current.time = 0
    }
  })

  return null
}

function PostEffects() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.95}
        luminanceThreshold={0.36}
        luminanceSmoothing={0.3}
        mipmapBlur
        radius={0.72}
      />
      <Vignette eskil={false} offset={0.16} darkness={0.74} />
    </EffectComposer>
  )
}

export default function NexusCanvas() {
  const hostRef = useRef(null)
  const [mobile, setMobile] = useState(
    () => window.matchMedia('(max-width: 760px)').matches,
  )
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [contextLost, setContextLost] = useState(false)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 760px)')
    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const sync = () => {
      setMobile(mobileQuery.matches)
      setReduced(reducedQuery.matches)
    }

    sync()
    mobileQuery.addEventListener('change', sync)
    reducedQuery.addEventListener('change', sync)

    return () => {
      mobileQuery.removeEventListener('change', sync)
      reducedQuery.removeEventListener('change', sync)
    }
  }, [])

  // A lost GPU context is usually transient (driver reset, tab asleep), so we
  // cover the canvas while it is gone instead of unmounting the scene.
  useEffect(() => {
    const canvas = hostRef.current?.querySelector('canvas')
    if (!canvas) return undefined

    const handleLost = (event) => {
      event.preventDefault()
      setContextLost(true)
    }
    const handleRestored = () => setContextLost(false)

    canvas.addEventListener('webglcontextlost', handleLost)
    canvas.addEventListener('webglcontextrestored', handleRestored)

    return () => {
      canvas.removeEventListener('webglcontextlost', handleLost)
      canvas.removeEventListener('webglcontextrestored', handleRestored)
    }
  }, [])

  return (
    <div className="scene-layer" ref={hostRef} aria-hidden="true">
      <Canvas
        dpr={[1, mobile ? 1.4 : 1.75]}
        camera={{ position: [0, 0.95, 9.8], fov: 42, near: 0.1, far: 260 }}
        gl={{
          antialias: !mobile,
          alpha: false,
          stencil: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.08
          gl.outputColorSpace = THREE.SRGBColorSpace
        }}
      >
        <Suspense fallback={null}>
          <NexusWorld mobile={mobile} reduced={reduced} />
          <CameraRig />
          <AdaptiveQuality minDpr={1} />
          {!mobile && !reduced && <PostEffects />}
        </Suspense>
      </Canvas>

      {contextLost ? (
        <div className="scene-fallback scene-fallback--overlay" aria-hidden="true" />
      ) : null}
    </div>
  )
}
