import * as THREE from 'three'

const makeCanvas = (width, height) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

const finishTexture = (texture, { colorSpace = true } = {}) => {
  if (colorSpace) texture.colorSpace = THREE.SRGBColorSpace
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true
  return texture
}

export const createDotTexture = () => {
  const canvas = makeCanvas(64, 64)
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.22, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.55, 'rgba(255,255,255,0.22)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return finishTexture(new THREE.CanvasTexture(canvas), { colorSpace: false })
}

export const createTextTexture = (
  text,
  {
    fontSize = 64,
    weight = 600,
    color = '#ffffff',
    font = 'Space Grotesk',
    padding = 24,
    letterSpacing = 0,
  } = {},
) => {
  const measureCanvas = makeCanvas(8, 8)
  const measureCtx = measureCanvas.getContext('2d')
  measureCtx.font = `${weight} ${fontSize}px "${font}", sans-serif`
  const width = Math.ceil(measureCtx.measureText(text).width + padding * 2)
  const height = Math.ceil(fontSize * 1.35 + padding)
  const canvas = makeCanvas(Math.max(width, 64), Math.max(height, 64))
  const ctx = canvas.getContext('2d')
  ctx.font = `${weight} ${fontSize}px "${font}", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  if (letterSpacing && 'letterSpacing' in ctx) ctx.letterSpacing = `${letterSpacing}px`
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  const texture = finishTexture(new THREE.CanvasTexture(canvas))
  return {
    texture,
    aspect: canvas.width / canvas.height,
  }
}

export const createGridTexture = ({
  color = '#7857ff',
  accent = '#00cfff',
  label = 'NEXUS / DATA',
} = {}) => {
  const canvas = makeCanvas(512, 512)
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 512, 512)

  const gradient = ctx.createRadialGradient(256, 256, 20, 256, 256, 330)
  gradient.addColorStop(0, 'rgba(12, 16, 30, 0.88)')
  gradient.addColorStop(0.7, 'rgba(7, 9, 17, 0.4)')
  gradient.addColorStop(1, 'rgba(5, 6, 9, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)

  ctx.strokeStyle = color
  ctx.globalAlpha = 0.22
  ctx.lineWidth = 1
  for (let x = 0; x <= 512; x += 32) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 512)
    ctx.stroke()
  }
  for (let y = 0; y <= 512; y += 32) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(512, y)
    ctx.stroke()
  }

  ctx.globalAlpha = 0.55
  ctx.strokeStyle = accent
  ctx.lineWidth = 2
  ctx.strokeRect(10, 10, 492, 492)

  ctx.globalAlpha = 0.85
  ctx.fillStyle = color
  ctx.fillRect(18, 18, 54, 3)
  ctx.fillRect(18, 18, 3, 54)
  ctx.fillStyle = accent
  ctx.fillRect(440, 491, 54, 3)
  ctx.fillRect(491, 440, 3, 54)

  ctx.globalAlpha = 0.8
  ctx.fillStyle = accent
  ctx.font = '500 18px "JetBrains Mono", monospace'
  ctx.fillText(label, 24, 470)

  ctx.globalAlpha = 0.45
  ctx.fillStyle = '#ffffff'
  ctx.font = '400 13px "JetBrains Mono", monospace'
  ctx.fillText('SIGNAL: STABLE', 24, 52)
  ctx.fillText('NODE: 0x7A9F', 24, 74)

  return finishTexture(new THREE.CanvasTexture(canvas))
}

export const createCodeTexture = (accent = '#a78bfa') => {
  const canvas = makeCanvas(512, 512)
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 512, 512)
  ctx.fillStyle = 'rgba(5, 7, 13, 0.86)'
  ctx.fillRect(0, 0, 512, 512)

  ctx.strokeStyle = 'rgba(167, 139, 250, 0.28)'
  ctx.strokeRect(8, 8, 496, 496)
  ctx.fillStyle = accent
  ctx.fillRect(8, 8, 512 - 16, 2)

  const lines = [
    ['const', ' nexus = ', 'createUniverse()'],
    ['nexus', '.add(', "'intelligence'", ')'],
    ['nexus', '.add(', "'curiosity'", ')'],
    ['nexus', '.render(', '{ depth: true }', ')'],
    ['', '', ''],
    ['// build what matters', '', ''],
    ['export', ' default ', 'Mayuresh'],
  ]

  ctx.font = '400 20px "JetBrains Mono", monospace'
  lines.forEach((line, index) => {
    const y = 88 + index * 46
    ctx.fillStyle = 'rgba(146, 150, 165, 0.45)'
    ctx.fillText(String(index + 1).padStart(2, '0'), 28, y)
    ctx.fillStyle = index % 2 ? '#00cfff' : '#f5f5f7'
    const code = line.join('')
    if (code) ctx.fillText(code, 70, y)
  })

  ctx.fillStyle = accent
  ctx.font = '600 34px "Space Grotesk", sans-serif'
  ctx.fillText('</>', 378, 456)

  return finishTexture(new THREE.CanvasTexture(canvas))
}

export const createNebulaTexture = () => {
  const canvas = makeCanvas(1024, 512)
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, 1024, 512)
  const blobs = [
    [300, 250, 260, 'rgba(120, 87, 255, 0.34)'],
    [560, 300, 300, 'rgba(0, 207, 255, 0.15)'],
    [760, 180, 220, 'rgba(167, 139, 250, 0.2)'],
    [180, 330, 190, 'rgba(90, 59, 232, 0.24)'],
  ]
  blobs.forEach(([x, y, r, color]) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'rgba(5, 6, 9, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 512)
  })
  return finishTexture(new THREE.CanvasTexture(canvas))
}

export const createScreenshotTexture = (accent = '#7857ff', title = 'NEXUS') => {
  const canvas = makeCanvas(768, 480)
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#080b12'
  ctx.fillRect(0, 0, 768, 480)

  const gradient = ctx.createLinearGradient(0, 0, 768, 480)
  gradient.addColorStop(0, 'rgba(120, 87, 255, 0.24)')
  gradient.addColorStop(1, 'rgba(0, 207, 255, 0.05)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 768, 480)

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
  for (let x = 0; x < 768; x += 32) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 480)
    ctx.stroke()
  }
  for (let y = 0; y < 480; y += 32) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(768, y)
    ctx.stroke()
  }

  ctx.fillStyle = 'rgba(9, 12, 20, 0.88)'
  ctx.fillRect(64, 72, 640, 336)
  ctx.strokeStyle = accent
  ctx.globalAlpha = 0.5
  ctx.strokeRect(64, 72, 640, 336)
  ctx.globalAlpha = 1

  ctx.fillStyle = accent
  ctx.font = '500 13px "JetBrains Mono", monospace'
  ctx.fillText('CONCEPT VISUAL', 96, 116)
  ctx.fillStyle = '#f5f5f7'
  ctx.font = '600 52px "Space Grotesk", sans-serif'
  ctx.fillText(title, 96, 196)
  ctx.fillStyle = 'rgba(146, 150, 165, 0.85)'
  ctx.font = '400 18px "Inter", sans-serif'
  ctx.fillText('Actual screenshots pending.', 96, 236)
  ctx.fillStyle = accent
  ctx.fillRect(96, 280, 130, 3)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)'
  ctx.fillRect(96, 302, 420, 10)
  ctx.fillRect(96, 326, 360, 10)
  ctx.fillRect(96, 350, 300, 10)

  return finishTexture(new THREE.CanvasTexture(canvas))
}
