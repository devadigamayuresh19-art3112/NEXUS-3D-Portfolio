import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { createDotTexture } from './textures'

function useDotTexture() {
  const texture = useMemo(() => createDotTexture(), [])
  useEffect(() => () => texture.dispose(), [texture])
  return texture
}

function createField({ count, spread, height, depthStart, depthEnd, palette, size }) {
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const color = new THREE.Color()

  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = (Math.random() - 0.5) * spread
    positions[i * 3 + 1] = Math.random() * height - height * 0.32
    positions[i * 3 + 2] = depthStart + Math.random() * (depthEnd - depthStart)
    color.set(palette[Math.floor(Math.random() * palette.length)])
    const brightness = 0.35 + Math.random() * 0.65
    colors[i * 3] = color.r * brightness
    colors[i * 3 + 1] = color.g * brightness
    colors[i * 3 + 2] = color.b * brightness
  }

  return { positions, colors, size }
}

export function Starfield({ count = 1800 }) {
  const texture = useDotTexture()
  const ref = useRef()
  const field = useMemo(
    () =>
      createField({
        count,
        spread: 150,
        height: 70,
        depthStart: -175,
        depthEnd: 20,
        palette: ['#ffffff', '#a78bfa', '#7857ff', '#00cfff', '#8b9dff'],
        size: 0.14,
      }),
    [count],
  )

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.003
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.02
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[field.positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[field.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={field.size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.78}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}

export function DustField({ count = 700 }) {
  const texture = useDotTexture()
  const ref = useRef()
  const field = useMemo(
    () =>
      createField({
        count,
        spread: 34,
        height: 16,
        depthStart: -136,
        depthEnd: 13,
        palette: ['#7857ff', '#00cfff', '#a78bfa', '#f5f5f7'],
        size: 0.055,
      }),
    [count],
  )

  useFrame((state, delta) => {
    if (!ref.current) return
    ref.current.rotation.y += delta * 0.008
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.25
  })

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[field.positions, 3]}
        />
        <bufferAttribute attach="attributes-color" args={[field.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        size={field.size}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  )
}
