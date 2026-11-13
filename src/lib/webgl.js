let cached

/**
 * three.js (r163+) requires WebGL 2. Probe it once before the scene is ever
 * requested, and release the test context immediately so we do not burn one
 * of the browser's limited WebGL contexts.
 */
export function supportsWebGL2() {
  if (cached !== undefined) return cached
  if (typeof document === 'undefined') return false

  try {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl2')

    if (!context) {
      cached = false
      return cached
    }

    context.getExtension('WEBGL_lose_context')?.loseContext()
    cached = true
  } catch {
    cached = false
  }

  return cached
}
