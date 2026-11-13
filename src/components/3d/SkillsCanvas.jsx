import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { skills } from '../../data/projects'
import { scrollState } from '../../lib/scrollState'
import { createDotTexture, createTextTexture } from './textures'
import {
  fresnelFragmentShader,
  fresnelVertexShader,
} from './shaders'

const ORBITS = {
  Programming: {
    radius: 2.35,
    y: 0.35,
    tilt: [0.35, 0.15, 0],
    speed: 0.17,
  },
  'Web Development': {
    radius: 3.05,
    y: -0.45,
    tilt: [-0.22, 0.32, 0.08],
    speed: -0.12,
  },
  Databases: {
    radius: 1.95,
    y: 1.05,
    tilt: [0.5, -0.2, -0.1],
    speed: 0.23,
  },
  'AI & Emerging Technology': {
    radius: 3.55,
    y: 0.42,
    tilt: [-0.3, -0.18, 0.12],
    speed: -0.085,
  },
  'Tools & Platforms': {
    radius: 4.05,
    y: -0.92,
    tilt: [0.18, 0.22, -0.05],
    speed: 0.065,
  },
}

function useLabelTexture(text) {
  const label = useMemo(
    () =>
      createTextTexture(text, {
        fontSize: 42,
        weight: 500,
        font: 'Inter',
        color: '#f5f5f7',
        padding: 18,
      }),
    [text],
  )
  useEffect(() => () => label.texture.dispose(), [label])
  return label
}

function TechNode({
  tech,
  group,
  color,
  index,
  count,
  hovered,
  selected,
  dimmed,
  onHover,
  onSelect,
}) {
  const ref = useRef()
  const label = useLabelTexture(tech.name)
  const orbit = ORBITS[group] || ORBITS.Programming
  const angleRef = useRef((index / Math.max(count, 1)) * Math.PI * 2)
  const euler = useMemo(() => new THREE.Euler(...orbit.tilt), [orbit.tilt])
  const temp = useMemo(() => new THREE.Vector3(), [])

  const isPaused = hovered === tech.name || selected === tech.name
  const isActive = hovered === tech.name || selected === tech.name

  useFrame((state, delta) => {
    if (!ref.current) return
    if (!isPaused) {
      angleRef.current += delta * orbit.speed
    }
    const angle = angleRef.current
    temp
      .set(Math.cos(angle) * orbit.radius, Math.sin(angle) * orbit.radius, 0)
      .applyEuler(euler)
    temp.y += orbit.y
    ref.current.position.copy(temp)

    const scaleTarget = isActive ? 1.35 : 1
    ref.current.scale.lerp(
      new THREE.Vector3(scaleTarget, scaleTarget, scaleTarget),
      1 - Math.exp(-delta * 8),
    )
  })

  return (
    <group
      ref={ref}
      onPointerOver={(event) => {
        event.stopPropagation()
        onHover(tech)
      }}
      onPointerOut={(event) => {
        event.stopPropagation()
        onHover(null)
      }}
      onClick={(event) => {
        event.stopPropagation()
        onSelect(tech)
      }}
    >
      <mesh>
        <sphereGeometry args={[0.09, 18, 18]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={dimmed ? 0.08 : isActive ? 2.4 : 0.85}
          metalness={0.45}
          roughness={0.18}
          transparent
          opacity={dimmed ? 0.18 : 1}
        />
      </mesh>
      <mesh scale={isActive ? 2.1 : 1.65}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={dimmed ? 0.02 : isActive ? 0.22 : 0.08}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <sprite position={[0, 0.31, 0]} scale={[0.2 * label.aspect, 0.2, 1]}>
        <spriteMaterial
          map={label.texture}
          transparent
          opacity={dimmed ? 0.12 : isActive ? 1 : 0.62}
          depthWrite={false}
          toneMapped={false}
        />
      </sprite>
    </group>
  )
}

function OrbitRing({ orbit, color, dimmed }) {
  return (
    <mesh
      position={[0, orbit.y, 0]}
      rotation={new THREE.Euler(...orbit.tilt)}
    >
      <torusGeometry args={[orbit.radius, 0.0055, 6, 180]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={dimmed ? 0.025 : 0.13}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

function MatrixCore({ glowTexture }) {
  const group = useRef()
  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#7857ff') },
      uColorB: { value: new THREE.Color('#00cfff') },
      uIntensity: { value: 1 },
      uPower: { value: 2.2 },
    }),
    [],
  )

  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.18
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.12
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.035
    group.current.scale.setScalar(pulse)
  })

  return (
    <group ref={group}>
      <sprite scale={[5.2, 5.2, 1]}>
        <spriteMaterial
          map={glowTexture}
          color="#7857ff"
          transparent
          opacity={0.32}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </sprite>
      <mesh>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial
          color="#121628"
          metalness={0.9}
          roughness={0.15}
          emissive="#241452"
          emissiveIntensity={0.8}
          envMapIntensity={1.2}
        />
      </mesh>
      <mesh scale={1.25}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshBasicMaterial
          color="#7857ff"
          wireframe
          transparent
          opacity={0.45}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh scale={1.05}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <shaderMaterial
          vertexShader={fresnelVertexShader}
          fragmentShader={fresnelFragmentShader}
          uniforms={uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[1.2, 0.3, 0]}>
        <torusGeometry args={[1.18, 0.01, 8, 140]} />
        <meshBasicMaterial color="#00cfff" transparent opacity={0.4} depthWrite={false} />
      </mesh>
      <mesh rotation={[1.55, -0.4, 0.4]}>
        <torusGeometry args={[1.45, 0.006, 8, 140]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </group>
  )
}

function CameraDrift() {
  const { camera } = useThree()
  const look = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    const factor = 1 - Math.exp(-delta * 2.4)
    const targetX = scrollState.pointer.x * 0.55 + Math.sin(time * 0.12) * 0.1
    const targetY = scrollState.pointer.y * 0.4 + Math.cos(time * 0.1) * 0.08
    camera.position.x += (targetX - camera.position.x) * factor
    camera.position.y += (targetY - camera.position.y) * factor
    camera.lookAt(look.current)
  })

  return null
}

function SceneContent({ hovered, selected, filter, onHover, onSelect }) {
  const glowTexture = useMemo(() => createDotTexture(), [])
  useEffect(() => () => glowTexture.dispose(), [glowTexture])

  const nodes = useMemo(
    () =>
      skills.flatMap((group) =>
        group.items.map((tech, index) => ({
          ...tech,
          group: group.group,
          color: group.color,
          index,
          count: group.items.length,
        })),
      ),
    [],
  )

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 4, 6]} intensity={40} color="#7857ff" distance={20} />
      <pointLight position={[-5, -3, 4]} intensity={26} color="#00cfff" distance={20} />
      <pointLight position={[0, 0, 5]} intensity={18} color="#a78bfa" distance={12} />

      <CameraDrift />
      <MatrixCore glowTexture={glowTexture} />

      {skills.map((group) => (
        <OrbitRing
          key={group.group}
          orbit={ORBITS[group.group] || ORBITS.Programming}
          color={group.color}
          dimmed={filter !== 'All' && filter !== group.group}
        />
      ))}

      {nodes.map((tech) => (
        <TechNode
          key={`${tech.group}-${tech.name}`}
          tech={tech}
          group={tech.group}
          color={tech.color}
          index={tech.index}
          count={tech.count}
          hovered={hovered?.name}
          selected={selected?.name}
          dimmed={filter !== 'All' && filter !== tech.group}
          onHover={onHover}
          onSelect={onSelect}
        />
      ))}

      <Sparkles
        count={70}
        scale={[11, 7, 5]}
        size={1.4}
        speed={0.25}
        opacity={0.45}
        color="#a78bfa"
      />
    </>
  )
}

export default function SkillsCanvas({
  inView,
  hovered,
  selected,
  filter,
  onHover,
  onSelect,
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={inView ? 'always' : 'demand'}
      camera={{ position: [0, 0, 9], fov: 42, near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      style={{ background: 'transparent' }}
    >
      <SceneContent
        hovered={hovered}
        selected={selected}
        filter={filter}
        onHover={onHover}
        onSelect={onSelect}
      />
    </Canvas>
  )
}
