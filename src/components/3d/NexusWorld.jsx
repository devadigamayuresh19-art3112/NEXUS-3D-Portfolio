import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Float, Lightformer, Line } from '@react-three/drei'
import * as THREE from 'three'
import {
  createCodeTexture,
  createDotTexture,
  createGridTexture,
  createNebulaTexture,
} from './textures'
import {
  fresnelFragmentShader,
  fresnelVertexShader,
  portalFragmentShader,
  portalVertexShader,
} from './shaders'
import { scrollState } from '../../lib/scrollState'
import { Starfield, DustField } from './Particles'

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function GlowSprite({ color, scale, opacity = 0.35, texture }) {
  return (
    <sprite scale={[scale, scale, 1]}>
      <spriteMaterial
        map={texture}
        color={color}
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </sprite>
  )
}

function EnergyRing({
  radius,
  tube = 0.012,
  color = '#7857ff',
  rotation = [0, 0, 0],
  speed = 0.12,
  opacity = 0.65,
}) {
  const ref = useRef()
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.z += delta * speed
      ref.current.rotation.x += delta * speed * 0.35
    }
  })
  return (
    <mesh ref={ref} rotation={rotation}>
      <torusGeometry args={[radius, tube, 8, 180]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Hero: chrome nexus sphere                                           */
/* ------------------------------------------------------------------ */

function ChromeSphere({ glowTexture }) {
  const group = useRef()
  const inner = useRef()

  const fresnelUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#7857ff') },
      uColorB: { value: new THREE.Color('#00cfff') },
      uIntensity: { value: 0.85 },
      uPower: { value: 2.4 },
    }),
    [],
  )

  useFrame((state, delta) => {
    if (!group.current) return
    const time = state.clock.elapsedTime
    group.current.rotation.y += delta * 0.055
    group.current.rotation.x = Math.sin(time * 0.1) * 0.06 + scrollState.pointer.y * 0.05
    group.current.rotation.z = scrollState.pointer.x * 0.035
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.03
    }
  })

  return (
    <group ref={group} position={[3.15, 0.95, -0.8]}>
      <GlowSprite
        texture={glowTexture}
        color="#7857ff"
        scale={7.4}
        opacity={0.34}
      />
      <mesh>
        <sphereGeometry args={[2.05, 80, 80]} />
        <meshStandardMaterial
          color="#b9c0d2"
          metalness={1}
          roughness={0.115}
          envMapIntensity={2.1}
        />
      </mesh>
      <mesh scale={1.025}>
        <sphereGeometry args={[2.05, 48, 48]} />
        <shaderMaterial
          vertexShader={fresnelVertexShader}
          fragmentShader={fresnelFragmentShader}
          uniforms={fresnelUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.055}>
        <sphereGeometry args={[2.05, 28, 28]} />
        <meshBasicMaterial
          color="#7857ff"
          wireframe
          transparent
          opacity={0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <group ref={inner}>
        <EnergyRing radius={2.55} tube={0.012} rotation={[1.25, 0.2, 0.3]} speed={0.12} color="#7857ff" opacity={0.8} />
        <EnergyRing radius={2.9} tube={0.008} rotation={[1.55, -0.35, -0.2]} speed={-0.08} color="#00cfff" opacity={0.6} />
        <EnergyRing radius={3.35} tube={0.006} rotation={[1.05, 0.6, 0.5]} speed={0.05} color="#a78bfa" opacity={0.45} />
        <mesh position={[2.55, 0.55, 0.2]}>
          <sphereGeometry args={[0.055, 12, 12]} />
          <meshBasicMaterial color="#00cfff" toneMapped={false} />
        </mesh>
        <mesh position={[-2.3, -0.8, 0.4]}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial color="#a78bfa" toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

function HeroShards() {
  const shards = useMemo(
    () => [
      { position: [-1.9, 2.7, 1.6], scale: 0.22, color: '#7857ff' },
      { position: [6.6, 1.4, 1.3], scale: 0.15, color: '#00cfff' },
      { position: [4.8, -1.6, 2.2], scale: 0.12, color: '#a78bfa' },
      { position: [1.2, -1.2, 2.8], scale: 0.09, color: '#7857ff' },
      { position: [5.9, 4.2, -2.2], scale: 0.2, color: '#8b9dff' },
    ],
    [],
  )

  return (
    <group>
      {shards.map((shard, index) => (
        <Float
          key={index}
          speed={0.8 + index * 0.12}
          rotationIntensity={0.6}
          floatIntensity={0.8}
        >
          <mesh position={shard.position} scale={shard.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#161a27"
              metalness={0.95}
              roughness={0.2}
              emissive={shard.color}
              emissiveIntensity={0.25}
              envMapIntensity={1.2}
            />
          </mesh>
        </Float>
      ))}
    </group>
  )
}

function HoloCube({ texture }) {
  const inner = useRef()
  const codeTexture = useMemo(() => createCodeTexture('#a78bfa'), [])

  useEffect(() => () => codeTexture.dispose(), [codeTexture])

  useFrame((state, delta) => {
    if (inner.current) {
      inner.current.rotation.y += delta * 0.22
      inner.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.15
    }
  })

  return (
    <Float speed={1.25} rotationIntensity={0.25} floatIntensity={0.5}>
      <group position={[5.15, 3.45, 0.6]} scale={0.72}>
        <group ref={inner}>
          <mesh>
            <boxGeometry args={[1.45, 1.45, 1.45]} />
            <meshBasicMaterial
              color="#7857ff"
              wireframe
              transparent
              opacity={0.45}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh position={[0, 0, 0.72]}>
            <planeGeometry args={[1.35, 1.35]} />
            <meshBasicMaterial
              map={codeTexture}
              transparent
              opacity={0.72}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0, -0.72]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.35, 1.35]} />
            <meshBasicMaterial
              map={texture}
              transparent
              opacity={0.35}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
        <pointLight color="#7857ff" intensity={12} distance={6} />
      </group>
    </Float>
  )
}

/* ------------------------------------------------------------------ */
/* Floating islands                                                    */
/* ------------------------------------------------------------------ */

function FloatingIsland({
  position,
  scale = 1,
  accent = '#7857ff',
  arch = false,
  glowTexture,
}) {
  const ring = useRef()

  useFrame((state, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.07
  })

  return (
    <Float speed={0.8} rotationIntensity={0.12} floatIntensity={0.45}>
      <group position={position} scale={scale}>
        <mesh position={[0, -2.1, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[3.35, 4.4, 7]} />
          <meshStandardMaterial
            color="#0a0d16"
            metalness={0.55}
            roughness={0.6}
            envMapIntensity={0.6}
          />
        </mesh>
        <mesh>
          <cylinderGeometry args={[3.05, 3.5, 0.55, 9]} />
          <meshStandardMaterial
            color="#111522"
            metalness={0.7}
            roughness={0.4}
            envMapIntensity={0.8}
          />
        </mesh>
        <mesh position={[0, 0.32, 0]}>
          <cylinderGeometry args={[2.65, 2.9, 0.1, 32]} />
          <meshStandardMaterial color="#070a10" metalness={0.4} roughness={0.8} />
        </mesh>
        <mesh ref={ring} position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.9, 0.018, 8, 160]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {[
          [-2.1, 0.4, 0.8, 0.28],
          [2.2, 0.3, -0.6, 0.2],
          [0.9, 0.35, 1.9, 0.16],
          [-1.4, 0.3, -1.8, 0.12],
        ].map(([x, y, z, s], index) => (
          <mesh key={index} position={[x, y, z]} scale={s}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color="#171c2b"
              metalness={0.6}
              roughness={0.5}
              emissive={accent}
              emissiveIntensity={0.08}
            />
          </mesh>
        ))}

        <mesh position={[0.4, 0.9, 0.2]} rotation={[0, 0.3, 0.2]}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color="#1a1530"
            metalness={0.7}
            roughness={0.2}
            emissive={accent}
            emissiveIntensity={0.65}
          />
        </mesh>

        {arch && (
          <group position={[0, 3.15, 0]}>
            <mesh>
              <torusGeometry args={[2.35, 0.028, 8, 140]} />
              <meshBasicMaterial
                color={accent}
                transparent
                opacity={0.55}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[0, -1.2, 0]} scale={[1, 1.5, 1]}>
              <torusGeometry args={[2.35, 0.012, 8, 140]} />
              <meshBasicMaterial
                color="#00cfff"
                transparent
                opacity={0.28}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[-2.35, -1.55, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 3.1, 8]} />
              <meshBasicMaterial color={accent} transparent opacity={0.4} />
            </mesh>
            <mesh position={[2.35, -1.55, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 3.1, 8]} />
              <meshBasicMaterial color={accent} transparent opacity={0.4} />
            </mesh>
            <GlowSprite
              texture={glowTexture}
              color={accent}
              scale={6}
              opacity={0.14}
            />
          </group>
        )}
      </group>
    </Float>
  )
}

/* ------------------------------------------------------------------ */
/* Portal                                                              */
/* ------------------------------------------------------------------ */

function Portal({
  position,
  radius = 5.6,
  accent = '#7857ff',
  accentSecondary = '#00cfff',
  intensity = 1,
  glowTexture,
  rotation = [0, 0, 0],
}) {
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: intensity },
      uColorA: { value: new THREE.Color(accent) },
      uColorB: { value: new THREE.Color(accentSecondary) },
    }),
    [accent, accentSecondary, intensity],
  )

  const rings = useRef([])

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime
    rings.current.forEach((ring, index) => {
      if (!ring) return
      ring.rotation.z += delta * (index % 2 === 0 ? 0.055 : -0.04)
    })
  })

  return (
    <group position={position} rotation={rotation}>
      <GlowSprite
        texture={glowTexture}
        color={accent}
        scale={radius * 4.2}
        opacity={0.22}
      />
      <mesh position={[0, 0, -0.12]}>
        <circleGeometry args={[radius * 0.98, 64]} />
        <meshBasicMaterial color="#04050a" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[radius * 0.96, 96]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={portalVertexShader}
          fragmentShader={portalFragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
      {[1, 1.07, 1.16].map((factor, index) => (
        <mesh
          key={factor}
          ref={(node) => {
            rings.current[index] = node
          }}
          rotation={[0, 0, index * 0.4]}
        >
          <torusGeometry args={[radius * factor, index === 0 ? 0.045 : 0.012, 8, 180]} />
          <meshBasicMaterial
            color={index === 1 ? accentSecondary : accent}
            transparent
            opacity={index === 0 ? 0.9 : 0.45}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
      <pointLight color={accent} intensity={35 * intensity} distance={radius * 4} />
      <pointLight
        position={[0, 0, 2]}
        color={accentSecondary}
        intensity={18 * intensity}
        distance={radius * 2}
      />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Project monoliths                                                   */
/* ------------------------------------------------------------------ */

function TrustCartMonolith({ position, gridTexture, accent, accentSecondary }) {
  const bars = useMemo(() => [0.45, 0.8, 1.15, 0.62, 0.96], [])
  return (
    <Float speed={1.05} rotationIntensity={0.1} floatIntensity={0.4}>
      <group position={position} rotation={[0, -0.22, 0]}>
        <mesh>
          <boxGeometry args={[3.6, 2.45, 0.1]} />
          <meshStandardMaterial
            color="#07130f"
            metalness={0.65}
            roughness={0.35}
            emissive="#0a2a22"
            emissiveIntensity={0.35}
          />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[3.35, 2.2]} />
          <meshBasicMaterial
            map={gridTexture}
            transparent
            opacity={0.62}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[3.6, 2.45, 0.1]} />
          <meshBasicMaterial
            color={accent}
            wireframe
            transparent
            opacity={0.42}
            depthWrite={false}
          />
        </mesh>
        {bars.map((height, index) => (
          <mesh
            key={index}
            position={[-1.15 + index * 0.42, -0.78 + height / 2, 0.16]}
          >
            <boxGeometry args={[0.2, height, 0.045]} />
            <meshBasicMaterial
              color={index % 2 === 0 ? accent : accentSecondary}
              transparent
              opacity={0.9}
              toneMapped={false}
            />
          </mesh>
        ))}
        <mesh position={[1.15, 0.35, 0.2]}>
          <torusGeometry args={[0.46, 0.026, 8, 64]} />
          <meshBasicMaterial color={accentSecondary} toneMapped={false} />
        </mesh>
        <mesh position={[1.15, 0.35, 0.22]}>
          <circleGeometry args={[0.36, 32]} />
          <meshBasicMaterial color={accent} transparent opacity={0.2} />
        </mesh>
        <mesh position={[-0.6, 0.72, 0.2]}>
          <boxGeometry args={[0.7, 0.16, 0.03]} />
          <meshBasicMaterial color="#f5f5f7" transparent opacity={0.45} />
        </mesh>
        <pointLight color={accent} intensity={16} distance={9} />
      </group>
    </Float>
  )
}

function TestPilotMonolith({ position, codeTexture, accent, accentSecondary }) {
  const scan = useRef()

  useFrame((state) => {
    if (scan.current) {
      scan.current.position.y = Math.sin(state.clock.elapsedTime * 1.15) * 0.85
    }
  })

  return (
    <Float speed={1.1} rotationIntensity={0.09} floatIntensity={0.45}>
      <group position={position} rotation={[0, 0.2, 0]}>
        <mesh>
          <boxGeometry args={[3.7, 2.5, 0.1]} />
          <meshStandardMaterial
            color="#06101a"
            metalness={0.7}
            roughness={0.32}
            emissive="#062735"
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[3.45, 2.25]} />
          <meshBasicMaterial
            map={codeTexture}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[3.7, 2.5, 0.1]} />
          <meshBasicMaterial
            color={accent}
            wireframe
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
        <mesh ref={scan} position={[0, 0, 0.14]}>
          <boxGeometry args={[3.35, 0.035, 0.02]} />
          <meshBasicMaterial
            color={accentSecondary}
            transparent
            opacity={0.9}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        {[-1.4, -1.15, -0.9].map((x, index) => (
          <mesh key={x} position={[x, 1.02, 0.14]}>
            <sphereGeometry args={[0.055, 10, 10]} />
            <meshBasicMaterial
              color={index === 0 ? '#ff6b6b' : index === 1 ? '#ffb86b' : accent}
              toneMapped={false}
            />
          </mesh>
        ))}
        {[0, 1, 2, 3].map((index) => (
          <mesh
            key={index}
            position={[-1.25 + index * 0.1, 0.55 - index * 0.3, 0.14]}
          >
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial
              color={index < 2 ? accent : accentSecondary}
              toneMapped={false}
            />
          </mesh>
        ))}
        <mesh position={[0.9, 0.62, 0.16]}>
          <boxGeometry args={[1.0, 0.5, 0.03]} />
          <meshBasicMaterial
            color={accent}
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
        <mesh position={[0.9, 0.62, 0.18]}>
          <boxGeometry args={[1.0, 0.5, 0.03]} />
          <meshBasicMaterial color={accent} wireframe transparent opacity={0.5} />
        </mesh>
        <pointLight color={accent} intensity={18} distance={9} />
      </group>
    </Float>
  )
}

function SahayakMonolith({ position, gridTexture, accent, accentSecondary }) {
  const cubes = useMemo(() => {
    const items = []
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        items.push({
          x: -1.2 + col * 0.8,
          y: -0.7 + row * 0.62,
          height: 0.22 + ((row + col) % 3) * 0.14,
          accent: (row + col) % 2 === 0,
        })
      }
    }
    return items
  }, [])

  const orb = useRef()
  useFrame((state, delta) => {
    if (orb.current) {
      orb.current.rotation.y += delta * 0.5
      orb.current.position.y = 0.78 + Math.sin(state.clock.elapsedTime * 0.9) * 0.08
    }
  })

  return (
    <Float speed={0.95} rotationIntensity={0.1} floatIntensity={0.5}>
      <group position={position} rotation={[0, -0.18, 0]}>
        <mesh>
          <boxGeometry args={[3.6, 2.45, 0.1]} />
          <meshStandardMaterial
            color="#0e0a18"
            metalness={0.65}
            roughness={0.35}
            emissive="#241341"
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[3.35, 2.2]} />
          <meshBasicMaterial
            map={gridTexture}
            transparent
            opacity={0.46}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[3.6, 2.45, 0.1]} />
          <meshBasicMaterial
            color={accent}
            wireframe
            transparent
            opacity={0.38}
            depthWrite={false}
          />
        </mesh>
        {cubes.map((cube, index) => (
          <mesh
            key={index}
            position={[cube.x, cube.y, 0.16]}
          >
            <boxGeometry args={[0.46, cube.height, 0.35]} />
            <meshStandardMaterial
              color={cube.accent ? '#1a1230' : '#101a25'}
              metalness={0.6}
              roughness={0.3}
              emissive={cube.accent ? accent : accentSecondary}
              emissiveIntensity={0.22}
            />
          </mesh>
        ))}
        <group ref={orb} position={[1.05, 0.78, 0.35]}>
          <mesh>
            <icosahedronGeometry args={[0.22, 1]} />
            <meshStandardMaterial
              color="#1b1430"
              metalness={0.8}
              roughness={0.15}
              emissive={accentSecondary}
              emissiveIntensity={0.6}
            />
          </mesh>
          <mesh>
            <torusGeometry args={[0.36, 0.012, 8, 64]} />
            <meshBasicMaterial color={accent} toneMapped={false} />
          </mesh>
        </group>
        <pointLight color={accent} intensity={18} distance={9} />
      </group>
    </Float>
  )
}

function RepoMonolith({ position, codeTexture, accent, accentSecondary }) {
  const nodes = useMemo(
    () => [
      { p: [0, 0.1, 0.2], s: 0.15, c: accent },
      { p: [-1.0, 0.7, 0.2], s: 0.09, c: accentSecondary },
      { p: [-0.7, -0.72, 0.2], s: 0.08, c: accent },
      { p: [1.0, 0.6, 0.2], s: 0.08, c: accentSecondary },
      { p: [0.85, -0.6, 0.2], s: 0.1, c: accent },
      { p: [-1.35, 0.15, 0.2], s: 0.06, c: accentSecondary },
      { p: [1.35, 0.05, 0.2], s: 0.06, c: accentSecondary },
      { p: [0.15, 0.9, 0.2], s: 0.06, c: accent },
    ],
    [accent, accentSecondary],
  )

  const links = useMemo(
    () => [
      [nodes[0].p, nodes[1].p],
      [nodes[0].p, nodes[2].p],
      [nodes[0].p, nodes[3].p],
      [nodes[0].p, nodes[4].p],
      [nodes[1].p, nodes[5].p],
      [nodes[3].p, nodes[6].p],
      [nodes[0].p, nodes[7].p],
      [nodes[7].p, nodes[3].p],
    ],
    [nodes],
  )

  return (
    <Float speed={1.15} rotationIntensity={0.08} floatIntensity={0.4}>
      <group position={position} rotation={[0, 0.22, 0]}>
        <mesh>
          <boxGeometry args={[3.6, 2.45, 0.1]} />
          <meshStandardMaterial
            color="#070c18"
            metalness={0.7}
            roughness={0.32}
            emissive="#0a1630"
            emissiveIntensity={0.4}
          />
        </mesh>
        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[3.35, 2.2]} />
          <meshBasicMaterial
            map={codeTexture}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <boxGeometry args={[3.6, 2.45, 0.1]} />
          <meshBasicMaterial
            color={accent}
            wireframe
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
        {links.map((points, index) => (
          <Line
            key={index}
            points={points}
            color={index % 2 ? accentSecondary : accent}
            lineWidth={1}
            transparent
            opacity={0.45}
            depthWrite={false}
          />
        ))}
        {nodes.map((node, index) => (
          <mesh key={index} position={node.p} scale={node.s}>
            <sphereGeometry args={[1, 12, 12]} />
            <meshBasicMaterial color={node.c} toneMapped={false} />
          </mesh>
        ))}
        {[0, 1].map((index) => (
          <mesh
            key={index}
            position={[-1.1 + index * 0.55, -1.0, 0.16]}
          >
            <boxGeometry args={[0.45, 0.18, 0.03]} />
            <meshBasicMaterial
              color={index === 0 ? accent : accentSecondary}
              transparent
              opacity={0.7}
            />
          </mesh>
        ))}
        <pointLight color={accent} intensity={18} distance={9} />
      </group>
    </Float>
  )
}

/* ------------------------------------------------------------------ */
/* Experience staircase                                                */
/* ------------------------------------------------------------------ */

function ExperienceStaircase({ accent = '#7857ff' }) {
  const steps = useMemo(
    () =>
      Array.from({ length: 6 }, (_, index) => ({
        position: [index * 0.95, index * 0.72, -index * 0.38],
        height: 0.18,
      })),
    [],
  )

  const ring = useRef()
  useFrame((state, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.1
  })

  return (
    <group position={[-6.4, -0.4, -81.5]} rotation={[0, 0.18, 0]}>
      {steps.map((step, index) => (
        <group key={index} position={step.position}>
          <mesh>
            <boxGeometry args={[1.7, step.height, 1.15]} />
            <meshStandardMaterial
              color="#111522"
              metalness={0.8}
              roughness={0.28}
              emissive={accent}
              emissiveIntensity={0.08}
            />
          </mesh>
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[1.7, 0.012, 1.15]} />
            <meshBasicMaterial
              color={index % 2 ? '#00cfff' : accent}
              transparent
              opacity={0.7}
              toneMapped={false}
            />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 1.2, 6]} />
            <meshBasicMaterial
              color={index % 2 ? '#00cfff' : accent}
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh position={[0, 1.28, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshBasicMaterial
              color={index % 2 ? '#00cfff' : accent}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
      <mesh position={[2.4, 5.15, -1.9]} rotation={[0.2, 0.3, 0]}>
        <torusGeometry args={[1.35, 0.025, 8, 120]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
      <mesh ref={ring} position={[2.4, 5.15, -1.9]} rotation={[0.2, 0.3, 0]}>
        <torusGeometry args={[1.62, 0.008, 8, 120]} />
        <meshBasicMaterial
          color="#00cfff"
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[2.4, 4.2, -1.4]} color={accent} intensity={24} distance={14} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Achievement museum                                                  */
/* ------------------------------------------------------------------ */

function AchievementMuseum({ gridTexture, accent = '#7857ff' }) {
  const frames = useMemo(
    () => [
      { position: [-2.6, 0.2, 0.4], rotation: 0.2 },
      { position: [-1.3, 0.9, -0.1], rotation: 0.1 },
      { position: [0, 1.3, -0.4], rotation: 0 },
      { position: [1.3, 0.9, -0.1], rotation: -0.1 },
      { position: [2.6, 0.2, 0.4], rotation: -0.2 },
    ],
    [],
  )

  return (
    <group position={[5.4, 2.2, -98]}>
      {frames.map((frame, index) => (
        <Float
          key={index}
          speed={0.7 + index * 0.08}
          rotationIntensity={0.12}
          floatIntensity={0.3}
        >
          <group
            position={frame.position}
            rotation={[0, frame.rotation, 0]}
          >
            <mesh>
              <boxGeometry args={[2.0, 1.4, 0.07]} />
              <meshBasicMaterial
                color={index % 2 ? '#00cfff' : accent}
                wireframe
                transparent
                opacity={0.42}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, 0, 0.05]}>
              <planeGeometry args={[1.84, 1.24]} />
              <meshBasicMaterial
                map={gridTexture}
                transparent
                opacity={0.42}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
            <mesh position={[0, -0.85, 0]}>
              <cylinderGeometry args={[0.12, 0.22, 0.8, 6]} />
              <meshStandardMaterial
                color="#121725"
                metalness={0.7}
                roughness={0.3}
                emissive={index % 2 ? '#00cfff' : accent}
                emissiveIntensity={0.12}
              />
            </mesh>
            <mesh position={[0, -0.4, 0.05]}>
              <boxGeometry args={[0.5, 0.02, 0.2]} />
              <meshBasicMaterial
                color={index % 2 ? '#00cfff' : accent}
                transparent
                opacity={0.5}
              />
            </mesh>
          </group>
        </Float>
      ))}
      <pointLight color={accent} intensity={30} distance={16} position={[0, 2, 2]} />
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* World                                                               */
/* ------------------------------------------------------------------ */

export default function NexusWorld({ mobile = false, reduced = false }) {
  const textures = useMemo(
    () => ({
      glow: createDotTexture(),
      grid: createGridTexture(),
      code: createCodeTexture(),
      nebula: createNebulaTexture(),
    }),
    [],
  )

  useEffect(
    () => () => {
      Object.values(textures).forEach((texture) => texture.dispose())
    },
    [textures],
  )

  return (
    <>
      <color attach="background" args={['#050609']} />
      <fogExp2 attach="fog" args={['#050609', mobile ? 0.0145 : 0.0125]} />

      <ambientLight intensity={0.26} />
      <directionalLight
        position={[6, 9, 8]}
        intensity={1.35}
        color="#dfe6ff"
      />
      <pointLight
        position={[3.2, 1.2, 2.5]}
        color="#7857ff"
        intensity={26}
        distance={16}
      />
      <pointLight
        position={[-7, 4, 1]}
        color="#00cfff"
        intensity={16}
        distance={18}
      />

      <Environment resolution={128} frames={1}>
        <Lightformer
          intensity={4.5}
          position={[0, 7, -9]}
          scale={[14, 7, 1]}
          color="#ffffff"
          target={[0, 0, 0]}
        />
        <Lightformer
          intensity={3.4}
          position={[-9, 2, 1]}
          scale={[7, 12, 1]}
          color="#7857ff"
          rotation-y={Math.PI / 2}
          target={[0, 0, 0]}
        />
        <Lightformer
          intensity={2.8}
          position={[9, 3, 0]}
          scale={[7, 12, 1]}
          color="#00cfff"
          rotation-y={-Math.PI / 2}
          target={[0, 0, 0]}
        />
        <Lightformer
          intensity={1.6}
          position={[0, -7, 3]}
          scale={[12, 5, 1]}
          color="#202744"
          rotation-x={Math.PI / 2}
          target={[0, 0, 0]}
        />
      </Environment>

      <Nebula texture={textures.nebula} />
      <Starfield count={mobile ? 850 : 1900} />
      <DustField count={mobile ? 320 : 760} />

      <ChromeSphere glowTexture={textures.glow} />
      <HeroShards />
      <HoloCube texture={textures.grid} />

      <FloatingIsland
        position={[-11.2, -0.2, -12.5]}
        scale={1.15}
        accent="#7857ff"
        arch
        glowTexture={textures.glow}
      />
      <FloatingIsland
        position={[-19, 6, -38]}
        scale={1.7}
        accent="#00cfff"
        glowTexture={textures.glow}
      />
      <FloatingIsland
        position={[18, -2, -61]}
        scale={1.2}
        accent="#a78bfa"
        glowTexture={textures.glow}
      />
      <FloatingIsland
        position={[0, 13, -48]}
        scale={0.9}
        accent="#8b9dff"
        glowTexture={textures.glow}
      />

      <Portal
        position={[10.8, 2.1, -27.5]}
        radius={2.45}
        accent="#a78bfa"
        accentSecondary="#00cfff"
        intensity={0.8}
        glowTexture={textures.glow}
        rotation={[0, -0.25, 0]}
      />

      <TrustCartMonolith
        position={[6.2, 2.2, -38]}
        gridTexture={textures.grid}
        accent="#37e6b0"
        accentSecondary="#00cfff"
      />
      <TestPilotMonolith
        position={[-6.2, 2.2, -47]}
        codeTexture={textures.code}
        accent="#00cfff"
        accentSecondary="#7857ff"
      />
      <SahayakMonolith
        position={[6.2, 2.2, -56]}
        gridTexture={textures.grid}
        accent="#a78bfa"
        accentSecondary="#ffb86b"
      />
      <RepoMonolith
        position={[-6.2, 2.2, -65]}
        codeTexture={textures.code}
        accent="#8b9dff"
        accentSecondary="#37e6b0"
      />

      <ExperienceStaircase accent="#7857ff" />
      <AchievementMuseum gridTexture={textures.grid} accent="#7857ff" />

      <Portal
        position={[0, 2.4, -126]}
        radius={5.6}
        accent="#7857ff"
        accentSecondary="#00cfff"
        intensity={1}
        glowTexture={textures.glow}
      />
      <Portal
        position={[0, 2.4, -126.4]}
        radius={6.15}
        accent="#00cfff"
        accentSecondary="#7857ff"
        intensity={0.18}
        glowTexture={textures.glow}
        rotation={[0, 0, 0.5]}
      />

      {!reduced && (
        <group>
          <EnergyRing
            radius={8}
            tube={0.01}
            color="#7857ff"
            rotation={[0.2, 0.4, 0]}
            speed={0.015}
            opacity={0.18}
          />
        </group>
      )}
    </>
  )
}

function Nebula({ texture }) {
  return (
    <mesh position={[0, 10, -162]} scale={[150, 82, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={0.5}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  )
}
