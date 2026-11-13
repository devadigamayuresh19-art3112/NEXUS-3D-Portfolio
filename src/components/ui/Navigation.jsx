import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ScrollTrigger, scrollToSection } from '../../lib/motion'
import { useLenisInstance } from '../../lib/LenisContext'
import useActiveSection from '../../hooks/useActiveSection'
import { socials } from '../../data/projects'
import SocialLinks from './SocialLinks'
import { IconClose, IconMenu } from './Icons'
import './Navigation.css'

const LINKS = [
  { id: 'about', label: 'About', index: '01' },
  { id: 'skills', label: 'Skills', index: '02' },
  { id: 'projects', label: 'Projects', index: '03' },
  { id: 'experience', label: 'Experience', index: '04' },
  { id: 'achievements', label: 'Achievements', index: '05' },
  { id: 'contact', label: 'Contact', index: '06' },
]

const menuVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, staggerChildren: 0.06, delayChildren: 0.08 },
  },
  exit: { opacity: 0, transition: { duration: 0.25 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function Navigation() {
  const lenis = useLenisInstance()
  const active = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const progressRef = useRef(null)
  const progressTextRef = useRef(null)

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${self.progress})`
        }
        if (progressTextRef.current) {
          progressTextRef.current.textContent = String(
            Math.round(self.progress * 100),
          ).padStart(2, '0')
        }
        if (navRef.current) {
          const y = self.scroll()
          navRef.current.classList.toggle('is-scrolled', y > 28)
          navRef.current.classList.toggle(
            'is-hidden',
            y > 520 &&
              self.direction === 1 &&
              !document.body.classList.contains('menu-open'),
          )
        }
      },
    })

    return () => trigger.kill()
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    lenis?.stop()
    document.body.classList.add('menu-open')
    return () => {
      document.body.classList.remove('menu-open')
      lenis?.start()
    }
  }, [menuOpen, lenis])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const goTo = (id) => {
    setMenuOpen(false)
    window.setTimeout(() => {
      scrollToSection(lenis, `#${id}`, -82)
    }, menuOpen ? 180 : 0)
  }

  return (
    <>
      <div className="scroll-progress" aria-hidden="true">
        <span ref={progressRef} />
      </div>

      <header className="nav" ref={navRef}>
        <div className="nav__bar">
          <a
            className="nav__logo"
            href="#home"
            onClick={(event) => {
              event.preventDefault()
              setMenuOpen(false)
              if (lenis) lenis.scrollTo(0, { duration: 1.4 })
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            aria-label="Mayuresh Devadiga — back to top"
            data-cursor-label="TOP"
          >
            <span className="nav__logo-mark">
              MD<span>.</span>
            </span>
            <span className="nav__logo-meta">PORTFOLIO / 26</span>
          </a>

          <nav className="nav__links" aria-label="Primary navigation">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={active === link.id ? 'is-active' : ''}
                onClick={(event) => {
                  event.preventDefault()
                  goTo(link.id)
                }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="nav__right">
            <span className="nav__availability">
              <span className="status-dot">Open to work</span>
            </span>
            <span className="nav__progress-text" ref={progressTextRef}>
              00
            </span>
            <a
              className="nav__cta"
              href="#contact"
              onClick={(event) => {
                event.preventDefault()
                goTo('contact')
              }}
              data-cursor-label="TALK"
            >
              Let's talk
            </a>
            <button
              type="button"
              className="nav__menu-button"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <IconClose /> : <IconMenu />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="nav-menu__glow" aria-hidden="true" />
            <div className="nav-menu__top">
              <span className="nav-menu__eyebrow">MENU</span>
              <button
                type="button"
                className="nav-menu__close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                autoFocus
              >
                <IconClose />
              </button>
            </div>

            <nav className="nav-menu__links" aria-label="Mobile navigation">
              {LINKS.map((link) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  variants={itemVariants}
                  className={active === link.id ? 'is-active' : ''}
                  onClick={(event) => {
                    event.preventDefault()
                    goTo(link.id)
                  }}
                >
                  <span className="nav-menu__index">{link.index}</span>
                  <span>{link.label}</span>
                  <span className="nav-menu__arrow">↗</span>
                </motion.a>
              ))}
            </nav>

            <motion.div className="nav-menu__footer" variants={itemVariants}>
              <div>
                <span className="nav-menu__label">EMAIL</span>
                <a href={`mailto:${socials.email}`} className="nav-menu__email">
                  {socials.email}
                </a>
              </div>
              <SocialLinks />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
