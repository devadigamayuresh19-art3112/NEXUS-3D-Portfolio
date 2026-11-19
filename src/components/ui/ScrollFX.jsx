import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import { useLenisInstance } from '../../lib/LenisContext'
import './ScrollFX.css'

const PETAL_COLORS = [
  '255, 178, 122',
  '255, 213, 184',
  '207, 194, 255',
  '244, 240, 232',
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/**
 * Decorative, scroll-reactive FX layer for the home page.
 *
 * - Blossom rain responds to scroll velocity and fades out a few seconds after
 *   the page stops moving.
 * - Manga speed lines grow with fast scrolling.
 * - A masked speedster and a neon car each cross the screen once, at different
 *   points in the page. Both are original vector silhouettes.
 *
 * Everything is pointer-events: none, hidden for reduced motion, and the
 * canvas loop stops entirely once the last petal leaves the screen.
 */
export default function ScrollFX({ enabled = false }) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const speedRef = useRef(null)
  const heroRef = useRef(null)
  const carRef = useRef(null)
  const lenis = useLenisInstance()

  useEffect(() => {
    if (!enabled || !lenis || prefersReducedMotion()) return undefined

    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = 1
    let frame = 0
    let lastTime = 0
    let lastSpawn = 0
    let lastBurst = 0
    let lastProgress = 0
    let idleTimer = 0
    let heroPlayed = false
    let carPlayed = false
    let heroPlaying = false
    let heroTimeline = null
    let carTimeline = null

    const petals = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const drawPetal = (petal) => {
      context.save()
      context.translate(petal.x, petal.y)
      context.rotate(petal.rot)
      context.globalAlpha = petal.alpha
      context.fillStyle = `rgba(${petal.color}, 0.92)`

      if (petal.blossom) {
        for (let index = 0; index < 5; index += 1) {
          context.save()
          context.rotate((Math.PI * 2 * index) / 5)
          context.beginPath()
          context.ellipse(
            0,
            -petal.size * 0.42,
            petal.size * 0.22,
            petal.size * 0.42,
            0,
            0,
            Math.PI * 2,
          )
          context.fill()
          context.restore()
        }
        context.fillStyle = 'rgba(255, 210, 160, 0.95)'
        context.beginPath()
        context.arc(0, 0, petal.size * 0.17, 0, Math.PI * 2)
        context.fill()
      } else {
        context.beginPath()
        context.moveTo(0, -petal.size)
        context.bezierCurveTo(
          petal.size * 0.82,
          -petal.size * 0.52,
          petal.size * 0.62,
          petal.size * 0.5,
          0,
          petal.size,
        )
        context.bezierCurveTo(
          -petal.size * 0.62,
          petal.size * 0.5,
          -petal.size * 0.82,
          -petal.size * 0.52,
          0,
          -petal.size,
        )
        context.fill()
      }

      context.restore()
    }

    const step = (time) => {
      if (!lastTime) lastTime = time
      const delta = Math.min(32, time - lastTime) / 16.667
      lastTime = time

      context.clearRect(0, 0, width, height)

      for (let index = petals.length - 1; index >= 0; index -= 1) {
        const petal = petals[index]
        petal.phase += 0.022 * delta
        petal.x += (petal.vx + Math.sin(petal.phase) * petal.sway) * delta
        petal.y += petal.vy * delta
        petal.rot += petal.spin * delta

        if (
          petal.y > height + 40 ||
          petal.x < -80 ||
          petal.x > width + 80
        ) {
          petals.splice(index, 1)
          continue
        }

        drawPetal(petal)
      }

      if (petals.length) {
        frame = requestAnimationFrame(step)
      } else {
        frame = 0
        lastTime = 0
        context.clearRect(0, 0, width, height)
      }
    }

    const wake = () => {
      if (!frame) {
        lastTime = 0
        frame = requestAnimationFrame(step)
      }
    }

    const spawn = (count, gust = false) => {
      const max = width < 680 ? 44 : 86
      for (let index = 0; index < count; index += 1) {
        if (petals.length >= max) break
        const size = 3.5 + Math.random() * 7
        petals.push({
          x: Math.random() * width,
          y: -30 - Math.random() * height * (gust ? 0.5 : 0.22),
          size,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (gust ? 2 : 1) + Math.random() * 2.1,
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.055,
          sway: 0.35 + Math.random() * 0.95,
          phase: Math.random() * Math.PI * 2,
          color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
          alpha: 0.32 + Math.random() * 0.52,
          blossom: Math.random() > 0.84,
        })
      }
      canvas.classList.add('is-live')
      wake()
    }

    const markIdle = () => {
      canvas.classList.remove('is-live')
      if (speedRef.current) speedRef.current.style.opacity = '0'
    }

    const playHero = () => {
      const element = heroRef.current
      if (heroPlayed || !element || !rootRef.current) return
      heroPlayed = true
      heroPlaying = true

      const lines = element.querySelectorAll('.fx-hero-line')
      const burst = element.querySelector('.fx-hero-burst')

      gsap.set(element, { x: -element.offsetWidth - 80, opacity: 1 })
      heroTimeline = gsap.timeline({
        onComplete: () => {
          heroPlaying = false
          gsap.set(element, { opacity: 0 })
          if (!carPlayed && lastProgress > 0.68) {
            window.setTimeout(playCar, 350)
          }
        },
      })

      heroTimeline
        .to(
          lines,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power3.out',
          },
          0,
        )
        .to(
          burst,
          {
            opacity: 1,
            scale: 1,
            rotate: -6,
            duration: 0.45,
            ease: 'back.out(2)',
          },
          0.2,
        )
        .to(
          element,
          {
            x: window.innerWidth + 80,
            duration: 2.05,
            ease: 'power2.inOut',
          },
          0,
        )
        .to(
          lines,
          { opacity: 0, duration: 0.3, stagger: 0.02 },
          1.55,
        )
        .to(burst, { opacity: 0, scale: 1.18, duration: 0.32 }, 1.6)
        .to(element, { opacity: 0, duration: 0.28 }, 1.82)
    }

    const playCar = () => {
      const element = carRef.current
      if (carPlayed || !element) return
      carPlayed = true

      const trails = element.querySelectorAll('.fx-car-trail')
      const wheels = element.querySelectorAll('.fx-car-wheel')
      const caption = element.querySelector('.fx-car-caption')

      gsap.set(element, { x: '110vw', opacity: 1 })
      carTimeline = gsap.timeline({
        onComplete: () => gsap.set(element, { opacity: 0 }),
      })

      carTimeline
        .to(
          element,
          { x: '-65vw', duration: 2.55, ease: 'power1.inOut' },
          0,
        )
        .to(
          wheels,
          {
            rotate: -900,
            duration: 2.55,
            ease: 'none',
            transformOrigin: '50% 50%',
          },
          0,
        )
        .to(
          trails,
          { scaleX: 1, opacity: 0.85, duration: 0.4, stagger: 0.07 },
          0,
        )
        .to(caption, { opacity: 1, y: 0, duration: 0.32 }, 0.22)
        .to(caption, { opacity: 0, duration: 0.3 }, 1.9)
        .to(trails, { opacity: 0, duration: 0.4 }, 2.05)
        .to(element, { opacity: 0, duration: 0.3 }, 2.3)
    }

    const onScroll = (instance) => {
      if (document.body.classList.contains('is-loading')) return

      const now = performance.now()
      const velocity = Math.abs(instance.velocity || 0)
      const progress = clamp(instance.progress || 0, 0, 1)
      lastProgress = progress

      if (speedRef.current) {
        const strength = clamp(velocity / 130, 0, 0.46)
        speedRef.current.style.opacity = String(strength)
      }

      canvas.classList.add('is-live')
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(markIdle, 2600)

      if (velocity > 6 && now - lastSpawn > 38) {
        spawn(1 + (Math.random() > 0.72 ? 1 : 0))
        lastSpawn = now
      }

      // Occasional heavier gust while the visitor is moving quickly.
      if (now - lastBurst > 4800 && velocity > 80) {
        spawn(width < 680 ? 7 : 15, true)
        lastBurst = now
      }

      if (!heroPlayed && progress > 0.32) playHero()
      if (!carPlayed && !heroPlaying && progress > 0.68) playCar()
    }

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame)
        frame = 0
        lastTime = 0
      } else if (petals.length) {
        wake()
      }
    }

    resize()
    lenis.on('scroll', onScroll)
    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      lenis.off('scroll', onScroll)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearTimeout(idleTimer)
      cancelAnimationFrame(frame)
      heroTimeline?.kill()
      carTimeline?.kill()
    }
  }, [enabled, lenis])

  return (
    <div className="scroll-fx" ref={rootRef} aria-hidden="true">
      <div className="scroll-fx__speed" ref={speedRef} />
      <canvas className="scroll-fx__petals" ref={canvasRef} />

      <div className="scroll-fx__hero" ref={heroRef}>
        <div className="fx-hero-lines">
          <i className="fx-hero-line" />
          <i className="fx-hero-line" />
          <i className="fx-hero-line" />
          <i className="fx-hero-line" />
        </div>

        <div className="fx-hero-burst">
          <span>WHOOSH</span>
        </div>

        <svg
          className="fx-hero-figure"
          viewBox="0 0 260 180"
          role="presentation"
        >
          <path
            className="fx-runner-cape"
            d="M176 72 C152 78 136 96 108 96 C122 108 146 112 164 106 L170 96 Z"
          />
          <path
            className="fx-runner-scarf"
            d="M176 70 C150 58 126 64 100 48 C86 40 70 42 52 34 C66 54 80 64 102 74 C84 78 66 74 48 68 C66 84 88 92 112 90 C130 88 146 82 160 76 Z"
          />

          <g className="fx-runner-lines" fill="none">
            <path d="M192 60 L210 84 L228 80" />
            <path d="M170 78 L142 90 L124 82" />
            <path d="M160 112 L126 148 L96 152" />
            <path d="M170 112 L200 142 L232 148" />
            <path d="M200 88 L224 96 L242 88" />
          </g>

          <g className="fx-runner-body">
            <path
              className="fx-runner-torso"
              d="M190 62 L172 70 L180 96 L166 114 L152 104 L160 78 L174 64 Z"
            />
            <circle cx="198" cy="50" r="16" />
            <path
              className="fx-runner-hair"
              d="M184 40 L174 24 L186 30 L188 16 L198 28 L212 18 L210 34 L224 32 L214 44 Z"
            />
            <path
              className="fx-runner-mask"
              d="M182 47 L214 45 L214 55 L182 57 Z"
            />
            <path className="fx-runner-leg" d="M166 110 L188 138 L220 144" />
            <path className="fx-runner-leg" d="M160 108 L132 134 L104 142" />
            <path className="fx-runner-leg" d="M188 138 L202 152" />
            <path className="fx-runner-leg" d="M132 134 L120 152" />
          </g>

          <path
            className="fx-runner-foot"
            d="M214 144 L232 146 M96 142 L84 148"
          />
        </svg>
      </div>

      <div className="scroll-fx__car" ref={carRef}>
        <span className="fx-car-caption">VROOM</span>
        <div className="fx-car-trails">
          <i className="fx-car-trail" />
          <i className="fx-car-trail" />
          <i className="fx-car-trail" />
        </div>
        <span className="fx-car-glow" />

        <svg className="fx-car-figure" viewBox="0 0 300 110" role="presentation">
          <path
            className="fx-car-body"
            d="M16 78 L34 60 L78 52 L104 34 L178 32 L214 44 L252 54 L280 62 L286 76 L280 86 L22 86 Z"
          />
          <path
            className="fx-car-window"
            d="M112 48 L136 37 L174 37 L200 48 Z"
          />
          <path className="fx-car-detail" d="M104 52 L112 48 M202 48 L234 56 M36 62 L78 56" />
          <path className="fx-car-light" d="M20 68 L6 66" />
          <path className="fx-car-tail" d="M280 64 L294 62" />

          <g className="fx-car-wheel">
            <circle cx="76" cy="86" r="16" />
            <path d="M76 74 L76 98 M64 86 L88 86" />
          </g>
          <g className="fx-car-wheel">
            <circle cx="224" cy="86" r="16" />
            <path d="M224 74 L224 98 M212 86 L236 86" />
          </g>
        </svg>
      </div>
    </div>
  )
}
