import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  gsap,
  prefersReducedMotion,
  scrollToSection,
} from '../../lib/motion'
import { useLenisInstance } from '../../lib/LenisContext'
import Magnetic from '../ui/Magnetic'
import SocialLinks from '../ui/SocialLinks'
import {
  IconArrowUpRight,
  IconChevronDown,
  IconDownload,
} from '../ui/Icons'

const FADE_SELECTOR =
  '[data-hero-fade], .hero__visual, .hero__chip, .hero__bottom'

export default function Hero({ introDone }) {
  const rootRef = useRef(null)
  const playedRef = useRef(false)
  const lenis = useLenisInstance()
  const [cvMeta, setCvMeta] = useState(null)

  useEffect(() => {
    let active = true

    fetch('/cv-meta.json')
      .then((response) => (response.ok ? response.json() : null))
      .then((meta) => {
        if (active && meta && Number.isFinite(meta.bytes) && meta.updated) {
          setCvMeta(meta)
        }
      })
      .catch(() => null)

    return () => {
      active = false
    }
  }, [])

  const cvLabel = cvMeta
    ? `PDF · ${Math.max(1, Math.round(cvMeta.bytes / 1024))} KB · ${new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(new Date(cvMeta.updated))}`
    : 'PDF resume'

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      gsap.set('[data-hero-line]', { yPercent: 112, filter: 'blur(7px)' })
      gsap.set(FADE_SELECTOR, { opacity: 0, y: 24 })
      gsap.set('.portrait', { clipPath: 'inset(100% 0% 0% 0%)' })
      gsap.set('.portrait img', { scale: 1.14 })
    }, root)

    return () => context.revert()
  }, [])

  useEffect(() => {
    if (!introDone || playedRef.current) return
    playedRef.current = true

    if (prefersReducedMotion()) {
      gsap.set(
        '[data-hero-line], [data-hero-fade], .hero__visual, .hero__chip, .hero__bottom',
        { opacity: 1, y: 0, yPercent: 0 },
      )
      gsap.set('.portrait', { clipPath: 'inset(0% 0% 0% 0%)' })
      gsap.set('.portrait img', { scale: 1 })
      return
    }

    const root = rootRef.current
    if (!root) return

    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } })
    timeline
      .to('[data-hero-line]', {
        yPercent: 0,
        filter: 'blur(0px)',
        duration: 1.1,
        stagger: 0.09,
        ease: 'expo.out',
      }, 0.05)
      .to('[data-hero-fade="label"]', { opacity: 1, y: 0, duration: 0.7 }, 0.15)
      .to('.hero__visual', { opacity: 1, y: 0, duration: 1.1 }, 0.3)
      .to('.portrait', {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.3,
        ease: 'power4.inOut',
      }, 0.42)
      .to('.portrait img', {
        scale: 1,
        duration: 1.8,
        ease: 'power3.out',
      }, 0.42)
      .to('[data-hero-fade="role"]', { opacity: 1, y: 0, duration: 0.7 }, 0.5)
      .to('[data-hero-fade="description"]', { opacity: 1, y: 0, duration: 0.7 }, 0.62)
      .to('[data-hero-fade="actions"]', { opacity: 1, y: 0, duration: 0.7 }, 0.74)
      .to('[data-hero-fade="footer"]', { opacity: 1, y: 0, duration: 0.8 }, 0.88)
      .to('.hero__chip', { opacity: 1, y: 0, duration: 0.8, stagger: 0.08 }, 0.85)
      .to('.hero__bottom', { opacity: 1, y: 0, duration: 0.7 }, 1)

    return () => {
      timeline.kill()
      playedRef.current = false
    }
  }, [introDone])

  // The hero drifts away as the next chapter arrives, so the hand-off between
  // the page and the 3D camera feels like one movement instead of a jump cut.
  useEffect(() => {
    const root = rootRef.current
    if (!root || prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      gsap.to('.hero__stage', {
        yPercent: -6,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: '80% top',
          scrub: 0.35,
        },
      })
    }, root)

    return () => context.revert()
  }, [])

  return (
    <section
      id="home"
      className="hero"
      data-camera="hero"
      aria-labelledby="hero-title"
      ref={rootRef}
    >
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__stage">
        <div className="container hero__grid">
          <div className="hero__content">
            <div className="hero__label" data-hero-fade="label">
              <span className="status-dot">Open to internships</span>
              <span className="hero__label-sep" aria-hidden="true">
                /
              </span>
              <span>Kolhapur, India</span>
            </div>

            <h1 id="hero-title" className="hero__title">
              <span className="hero__line">
                <span data-hero-line>Mayuresh</span>
              </span>
              <span className="hero__line hero__line--accent">
                <span data-hero-line>Madhav</span>
              </span>
              <span className="hero__line">
                <span data-hero-line>Devadiga</span>
              </span>
            </h1>

            <div className="hero__role" data-hero-fade="role">
              <span className="hero__role-mark" aria-hidden="true" />
              <span>
                Computer Science &amp; Engineering <em>(AI &amp; ML)</em>
              </span>
            </div>

            <p className="hero__description" data-hero-fade="description">
              Second-year student at KITCOEK. I spend most of my time building
              small AI tools, learning how software really works, and designing
              interfaces I would actually want to use.
            </p>

            <div className="hero__actions" data-hero-fade="actions">
              <Magnetic>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={() => scrollToSection(lenis, '#projects', -82)}
                  data-cursor-label="WORK"
                >
                  See what I&apos;ve built
                  <IconArrowUpRight className="btn__icon" />
                </button>
              </Magnetic>
              <Magnetic className="hero__cv">
                <a
                  className="btn btn--ghost"
                  href="/assets/mayuresh-resume.pdf"
                  download="Mayuresh-Devadiga-Resume.pdf"
                  data-cursor-label="CV"
                >
                  Download CV
                  <IconDownload className="btn__icon" />
                </a>
                <span className="hero__cv-meta">{cvLabel}</span>
              </Magnetic>
            </div>

            <div className="hero__footer" data-hero-fade="footer">
              <SocialLinks />
              <div className="hero__note">
                <span className="hero__note-kicker">Right now</span>
                <span>
                  Building with Python and React. Open to internships,
                  collaborations and anything that actually ships.
                </span>
              </div>
            </div>
          </div>

          <div className="hero__visual" data-hero-fade="visual">
            <div className="hero__portrait-glow" aria-hidden="true" />

            <figure className="portrait">
              <img
                src="/assets/portrait-hero.webp"
                alt="Mayuresh Madhav Devadiga"
                width="470"
                height="1140"
                fetchPriority="high"
                decoding="async"
              />
              <span className="portrait__fade" aria-hidden="true" />
            </figure>

            <div className="portrait__caption">
              <span>Mayuresh, 2026</span>
              <span>Kolhapur</span>
            </div>

            <div className="hero__chip hero__chip--top">
              <span className="hero__chip-dot" aria-hidden="true" />
              AI &amp; ML
            </div>
            <div className="hero__chip hero__chip--bottom">
              <span className="hero__chip-dot" aria-hidden="true" />
              First-year CGPA 9.81 / 10
            </div>
          </div>
        </div>
      </div>

      <div className="hero__bottom">
        <button
          type="button"
          className="hero__scroll"
          onClick={() => scrollToSection(lenis, '#about', -82)}
        >
          <span>Scroll</span>
          <IconChevronDown />
        </button>
        <span className="hero__coords">16.70° N, 74.24° E</span>
        <span className="hero__coords hero__coords--right">Portfolio — 2026</span>
      </div>
    </section>
  )
}
