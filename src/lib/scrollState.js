export const scrollState = {
  progress: 0,
  velocity: 0,
  pointer: { x: 0, y: 0 },
  pointerRaw: { x: 0, y: 0 },
  introDone: false,
  reducedMotion: false,
  isMobile: false,
}

export const setPointer = (x, y) => {
  scrollState.pointerRaw.x = x
  scrollState.pointerRaw.y = y
  scrollState.pointer.x = (x / window.innerWidth) * 2 - 1
  scrollState.pointer.y = -((y / window.innerHeight) * 2 - 1)
}

export const resetPointer = () => {
  scrollState.pointer.x = 0
  scrollState.pointer.y = 0
}

export const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

export const lerp = (a, b, t) => a + (b - a) * t

export const smoothstep = (t) => t * t * (3 - 2 * t)
