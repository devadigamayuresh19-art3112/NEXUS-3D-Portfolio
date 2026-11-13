import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ScrollTrigger } from '../../lib/motion'
import { scrollState, clamp } from '../../lib/scrollState'
import { buildWaypoints, sampleWaypoints } from './cameraPath'

export default function CameraRig() {
  const { camera, size } = useThree()
  const waypointsRef = useRef([])
  const lookRef = useRef(new THREE.Vector3(2.05, 0.9, -0.6))
  const targetPos = useMemo(() => new THREE.Vector3(), [])
  const targetLook = useMemo(() => new THREE.Vector3(), [])
  const initialized = useRef(false)
  const resizeTimer = useRef(null)

  useEffect(() => {
    const rebuild = () => {
      waypointsRef.current = buildWaypoints()
    }

    rebuild()

    const onResize = () => {
      window.clearTimeout(resizeTimer.current)
      resizeTimer.current = window.setTimeout(rebuild, 120)
    }

    window.addEventListener('resize', onResize)
    ScrollTrigger.addEventListener('refresh', rebuild)

    const frame = requestAnimationFrame(rebuild)
    const late = window.setTimeout(rebuild, 700)

    return () => {
      window.clearTimeout(resizeTimer.current)
      window.clearTimeout(late)
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      ScrollTrigger.removeEventListener('refresh', rebuild)
    }
  }, [])

  useFrame((state, delta) => {
    const waypoints = waypointsRef.current
    if (!waypoints.length) return

    const progress = clamp(scrollState.progress, 0, 1)
    const fov = sampleWaypoints(waypoints, progress, targetPos, targetLook)
    const mobile = size.width < 760
    const reduced = scrollState.reducedMotion
    const time = state.clock.elapsedTime

    if (!reduced && !mobile) {
      targetPos.x += Math.sin(time * 0.14) * 0.14 + scrollState.pointer.x * 0.55
      targetPos.y += Math.cos(time * 0.11) * 0.08 + scrollState.pointer.y * 0.3
      targetLook.x += scrollState.pointer.x * 0.26
      targetLook.y += scrollState.pointer.y * 0.18
    } else if (!reduced) {
      targetPos.x += Math.sin(time * 0.14) * 0.05
      targetPos.y += Math.cos(time * 0.11) * 0.03
    }

    if (mobile && progress < 0.08) {
      targetLook.x += 0.5
    }

    if (!initialized.current) {
      camera.position.copy(targetPos)
      lookRef.current.copy(targetLook)
      initialized.current = true
    }

    const damping = reduced ? 12 : 3.1
    const factor = 1 - Math.exp(-delta * damping)

    camera.position.lerp(targetPos, factor)
    lookRef.current.lerp(targetLook, factor)
    camera.lookAt(lookRef.current)

    if (camera.isPerspectiveCamera) {
      const nextFov = camera.fov + (fov - camera.fov) * factor
      if (Math.abs(nextFov - camera.fov) > 0.002) {
        camera.fov = nextFov
        camera.updateProjectionMatrix()
      }
    }

    const velocity = clamp(scrollState.velocity, -1800, 1800)
    const roll =
      Math.sin(time * 0.07) * 0.006 + velocity * 0.0000018
    camera.rotateZ(roll)
  })

  return null
}
