import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/motion'
import './Preloader.css'

const ASSETS = ['/assets/portrait-hero.webp', '/assets/portrait-about.webp']

const loadImage = (src) =>
  new Promise((resolve) => {
    const image = new Image()
    image.onload = resolve
    image.onerror = resolve
    image.src = src
  })

export default function Preloader({ onComplete }) {
  const rootRef = useRef(null)
  const canvasRef = useRef(null)
  const progressBarRef = useRef(null)
  const progressTextRef = useRef(null)
  const statusRef = useRef(null)
  const skipRef = useRef(null)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    if (!root || !canvas) return undefined

    const reduced = prefersReducedMotion()
    const exitingRef = { current: false }
    const completedRef = { current: false }
    document.body.classList.add('is-loading')

    let raf = 0
    let introTimeline = null
    let exitTimeline = null
    let progressTween = null
    let burst = false
    let resizeHandler = null

    const progress = { value: 0 }

    const updateProgress = () => {
      const value = Math.max(0, Math.min(100, Math.round(progress.value)))
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${value / 100})`
        const bar = progressBarRef.current.parentElement
        if (bar) bar.setAttribute('aria-valuenow', String(value))
      }
      if (progressTextRef.current) {
        progressTextRef.current.textContent = String(value).padStart(3, '0')
      }
    }

    const finish = () => {
      if (completedRef.current) return
      completedRef.current = true
      document.body.classList.remove('is-loading')
      onCompleteRef.current?.()
    }

    const beginExit = () => {
      if (exitingRef.current) return
      exitingRef.current = true
      burst = true
      introTimeline?.kill()
      progressTween?.kill()

      if (reduced) {
        gsap.to(root, {
          opacity: 0,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: finish,
        })
        return
      }

      exitTimeline = gsap.timeline({ onComplete: finish })
      exitTimeline
        .to(root.querySelector('.preloader__initials'), {
          opacity: 0,
          y: -14,
          duration: 0.3,
          ease: 'power2.in',
        }, 0)
        .to(root.querySelector('.preloader__ui'), {
          opacity: 0,
          y: 8,
          duration: 0.3,
          ease: 'power2.in',
        }, 0)
        .to(root.querySelector('.preloader__sphere'), {
          scale: 1.55,
          duration: 0.8,
          ease: 'power2.in',
        }, 0)
        .to(root.querySelector('.preloader__rings'), {
          scale: 1.65,
          opacity: 0,
          duration: 0.85,
          ease: 'power2.in',
        }, 0)
        .to(root.querySelector('.preloader__portal'), {
          opacity: 1,
          scale: 1.15,
          duration: 0.4,
          ease: 'power2.out',
        }, 0.28)
        .to(root.querySelector('.preloader__portal'), {
          scale: 16,
          opacity: 0,
          duration: 1.05,
          ease: 'power3.in',
        }, 0.62)
        .to(root.querySelector('.preloader__flash'), {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        }, 0.8)
        .to(root, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.inOut',
        }, 1.02)
    }

    skipRef.current = () => {
      if (exitingRef.current) return
      progress.value = 100
      updateProgress()
      beginExit()
    }

    /* ---------------- particle canvas ---------------- */
    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let width = window.innerWidth
    let height = window.innerHeight

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    resizeHandler = resize
    window.addEventListener('resize', resizeHandler)

    const glow = document.createElement('canvas')
    glow.width = 64
    glow.height = 64
    const glowCtx = glow.getContext('2d')
    const glowGradient = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32)
    glowGradient.addColorStop(0, 'rgba(255,255,255,1)')
    glowGradient.addColorStop(0.18, 'rgba(255,255,255,0.9)')
    glowGradient.addColorStop(0.45, 'rgba(167,139,250,0.45)')
    glowGradient.addColorStop(1, 'rgba(120,87,255,0)')
    glowCtx.fillStyle = glowGradient
    glowCtx.fillRect(0, 0, 64, 64)

    const colors = ['#7857ff', '#00cfff', '#a78bfa', '#f5f5f7']
    const count = width < 760 ? 70 : 150
    const particles = Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      radius: 180 + Math.random() * 380,
      target: 100 + Math.random() * 170,
      speed: 0.25 + Math.random() * 0.9,
      size: 2 + Math.random() * 7,
      alpha: 0.2 + Math.random() * 0.8,
      color: colors[Math.floor(Math.random() * colors.length)],
      offset: (Math.random() - 0.5) * 0.25,
    }))

    const draw = () => {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)
      ctx.globalCompositeOperation = 'lighter'
      const cx = width / 2
      const cy = height / 2
      const baseRadius = Math.min(width, height) * 0.19

      particles.forEach((particle) => {
        if (burst) {
          particle.radius += 4 + particle.speed * 7
          particle.alpha *= 0.985
        } else {
          const target = baseRadius + (particle.target - 120) * 0.22
          particle.radius += (target - particle.radius) * 0.012 * particle.speed
          particle.angle += 0.0012 * particle.speed
        }

        const x = cx + Math.cos(particle.angle) * particle.radius
        const y = cy + Math.sin(particle.angle) * particle.radius * 0.9
        const size = particle.size * (burst ? 1.3 : 1)
        ctx.globalAlpha = Math.max(0, particle.alpha) * (burst ? 0.7 : 1)
        ctx.drawImage(glow, x - size / 2, y - size / 2, size, size)
      })

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    if (!reduced) {
      raf = requestAnimationFrame(draw)
    }

    /* ---------------- intro timeline ---------------- */
    const spark = root.querySelector('.preloader__spark')
    const rings = root.querySelectorAll('.preloader__ring')
    const sphere = root.querySelector('.preloader__sphere')
    const initials = root.querySelector('.preloader__initials')
    const ui = root.querySelector('.preloader__ui')
    const meta = root.querySelectorAll('.preloader__meta')
    const top = root.querySelector('.preloader__top')

    gsap.set([initials, ui, ...meta], { opacity: 0 })
    gsap.set(sphere, { opacity: 0, scale: 0.55 })
    gsap.set(initials, { y: 14, filter: 'blur(10px)' })
    gsap.set(spark, { scale: 0, opacity: 0 })
    gsap.set(rings, { scale: 0.35, opacity: 0 })
    gsap.set(top, { opacity: 0 })

    if (!reduced) {
      introTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
      introTimeline
        .to(spark, { scale: 1, opacity: 1, duration: 0.7 }, 0)
        .to(top, { opacity: 1, duration: 0.5 }, 0.2)
        .to(rings, {
          scale: 1,
          opacity: 1,
          duration: 1.15,
          stagger: 0.12,
        }, 0.35)
        .to(sphere, {
          opacity: 1,
          scale: 1,
          duration: 1.35,
          ease: 'expo.out',
        }, 0.85)
        .to(initials, {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.9,
        }, 1.55)
        .to(ui, { opacity: 1, y: 0, duration: 0.6 }, 1.35)
        .to(meta, { opacity: 0.65, duration: 0.8, stagger: 0.1 }, 1.4)
        .to(spark, { opacity: 0.45, duration: 0.8 }, 1.2)
    } else {
      gsap.set([sphere, initials, ui, ...meta], { opacity: 1, y: 0 })
      gsap.set(sphere, { scale: 1 })
      gsap.set(initials, { filter: 'blur(0px)' })
      gsap.set(rings, { scale: 1, opacity: 1 })
      gsap.set(spark, { scale: 1, opacity: 1 })
      gsap.set(top, { opacity: 1 })
      gsap.set(meta, { opacity: 0.65 })
    }

    progressTween = gsap.to(progress, {
      value: 88,
      duration: reduced ? 0.5 : 2.25,
      ease: 'power1.inOut',
      onUpdate: updateProgress,
    })

    /* ---------------- asset loading ---------------- */
    const minimumDelay = new Promise((resolve) =>
      window.setTimeout(resolve, reduced ? 300 : 1500),
    )
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const images = ASSETS.map(loadImage)

    let cancelled = false

    Promise.all([fonts, ...images, minimumDelay]).then(() => {
      if (cancelled || exitingRef.current) return
      progressTween?.kill()
      if (statusRef.current) statusRef.current.textContent = 'READY'
      gsap.to(progress, {
        value: 100,
        duration: reduced ? 0.2 : 0.45,
        ease: 'power2.out',
        onUpdate: updateProgress,
        onComplete: () => {
          if (statusRef.current) statusRef.current.textContent = 'WELCOME'
          window.setTimeout(beginExit, reduced ? 100 : 320)
        },
      })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      introTimeline?.kill()
      exitTimeline?.kill()
      progressTween?.kill()
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      document.body.classList.remove('is-loading')
    }
  }, [])

  return (
    <div
      className="preloader"
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading the NEXUS portfolio"
    >
      <canvas ref={canvasRef} className="preloader__canvas" aria-hidden="true" />
      <div className="preloader__bg" aria-hidden="true" />
      <div className="preloader__top">
        <div className="preloader__brand">
          <span className="preloader__brand-mark">Mayuresh Devadiga</span>
          <span className="preloader__brand-meta">Portfolio · 2026</span>
        </div>
        <button
          type="button"
          className="preloader__skip"
          onClick={() => skipRef.current?.()}
          data-cursor-label="SKIP"
        >
          Skip <span aria-hidden="true">↗</span>
        </button>
      </div>

      <div className="preloader__stage">
        <div className="preloader__rings" aria-hidden="true">
          <span className="preloader__ring preloader__ring--1" />
          <span className="preloader__ring preloader__ring--2" />
          <span className="preloader__ring preloader__ring--3" />
        </div>
        <div className="preloader__spark" aria-hidden="true" />
        <div className="preloader__sphere" aria-hidden="true">
          <span className="preloader__sphere-glint" />
        </div>
        <div className="preloader__initials" aria-hidden="true">
          MD
        </div>
        <div className="preloader__portal" aria-hidden="true" />
        <div className="preloader__flash" aria-hidden="true" />
        <div className="preloader__scan" aria-hidden="true" />
      </div>

      <div className="preloader__ui">
        <div className="preloader__ui-left">
          <span className="preloader__status" ref={statusRef}>
            SETTING THINGS UP
          </span>
          <span className="preloader__coords">KOLHAPUR, INDIA</span>
        </div>
        <div className="preloader__progress">
          <div className="preloader__progress-head">
            <span>Loading</span>
            <span ref={progressTextRef} className="preloader__percent">
              000
            </span>
          </div>
          <div
            className="preloader__bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <span ref={progressBarRef} />
          </div>
        </div>
      </div>

      <div className="preloader__meta preloader__meta--left" aria-hidden="true">
        MAYURESH M. DEVADIGA
        <br />
        CSE (AI &amp; ML) · KITCOEK
      </div>
      <div className="preloader__meta preloader__meta--right" aria-hidden="true">
        PORTFOLIO · 2026
        <br />
        KOLHAPUR, INDIA
      </div>
    </div>
  )
}
