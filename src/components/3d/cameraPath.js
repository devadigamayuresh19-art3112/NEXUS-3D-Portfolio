import * as THREE from 'three'
import { clamp, lerp, smoothstep } from '../../lib/scrollState'

/**
 * Camera presets for each narrative zone. The actual scroll progress for each
 * zone is measured from the DOM, so the camera always arrives with the content.
 */
export const CAMERA_PRESETS = {
  hero: {
    pos: [0, 0.95, 9.8],
    look: [2.05, 0.9, -0.6],
    fov: 42,
  },
  about: {
    pos: [-5.6, 2.35, -5.4],
    look: [-11.2, 1.05, -12.5],
    fov: 48,
  },
  skills: {
    pos: [5.2, 2.65, -19.2],
    look: [10.8, 2.1, -26],
    fov: 50,
  },
  projects: {
    pos: [0, 1.9, -26.8],
    look: [0, 2.1, -33.5],
    fov: 52,
  },
  'project-0': {
    pos: [-1.4, 1.55, -31.2],
    look: [6.2, 2.2, -38],
    fov: 52,
  },
  'project-1': {
    pos: [1.4, 1.55, -40.2],
    look: [-3.2, 2.2, -47],
    fov: 52,
  },
  'project-2': {
    pos: [-1.4, 1.55, -49.2],
    look: [3.8, 2.2, -56],
    fov: 52,
  },
  'project-3': {
    pos: [1.4, 1.55, -58.2],
    look: [-3.2, 2.2, -65],
    fov: 52,
  },
  experience: {
    pos: [4.8, 2.6, -71.5],
    look: [-6.4, 4.6, -81.5],
    fov: 52,
  },
  achievements: {
    pos: [-4.6, 3.4, -89.5],
    look: [5.4, 3.3, -98],
    fov: 50,
  },
  contact: {
    pos: [0, 1.9, -109.5],
    look: [0, 2.4, -124.5],
    fov: 54,
  },
}

export function buildWaypoints() {
  if (typeof document === 'undefined') return []

  const maxScroll = Math.max(
    1,
    document.documentElement.scrollHeight - window.innerHeight,
  )
  const viewportCenter = window.innerHeight * 0.5

  const nodes = Array.from(document.querySelectorAll('[data-camera]'))

  const waypoints = nodes
    .map((element) => {
      const key = element.dataset.camera
      const preset = CAMERA_PRESETS[key]
      if (!preset) return null

      const rect = element.getBoundingClientRect()
      const top = rect.top + window.scrollY
      const focusY = top + rect.height * 0.45
      const t = clamp((focusY - viewportCenter) / maxScroll, 0, 1)

      return {
        key,
        t,
        pos: new THREE.Vector3(...preset.pos),
        look: new THREE.Vector3(...preset.look),
        fov: preset.fov,
      }
    })
    .filter(Boolean)
    .sort((a, b) => a.t - b.t)

  if (!waypoints.length) return []

  if (waypoints[0].t > 0.001) {
    waypoints.unshift({
      ...waypoints[0],
      t: 0,
      pos: waypoints[0].pos.clone(),
      look: waypoints[0].look.clone(),
    })
  }

  const last = waypoints[waypoints.length - 1]
  if (last.t < 0.999) {
    waypoints.push({
      ...last,
      t: 1,
      pos: last.pos.clone().add(new THREE.Vector3(0, 0.1, -1.2)),
      look: last.look.clone(),
    })
  }

  return waypoints
}

export function sampleWaypoints(waypoints, progress, outPos, outLook) {
  if (!waypoints.length) {
    outPos.set(0, 0.95, 9.8)
    outLook.set(2.05, 0.9, -0.6)
    return 42
  }

  const p = clamp(progress, 0, 1)
  let index = 0

  while (
    index < waypoints.length - 1 &&
    p > waypoints[index + 1].t
  ) {
    index += 1
  }

  const a = waypoints[index]
  const b = waypoints[Math.min(index + 1, waypoints.length - 1)]
  const span = b.t - a.t || 1
  const local = clamp((p - a.t) / span, 0, 1)
  const eased = smoothstep(local)

  outPos.lerpVectors(a.pos, b.pos, eased)
  outLook.lerpVectors(a.look, b.look, eased)

  return lerp(a.fov, b.fov, eased)
}
