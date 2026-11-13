import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './lib/motion'
import { scrollState, setPointer, resetPointer } from './lib/scrollState'
import { LenisContext } from './lib/LenisContext'
import Home from './pages/Home'
import Preloader from './components/ui/Preloader'
import CustomCursor from './components/ui/CustomCursor'
import ProjectDetails from './pages/ProjectDetails'
import NotFound from './pages/NotFound'

export default function App() {
  const location = useLocation()
  const [lenis, setLenis] = useState(null)
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem('nexus-intro-seen') === '1',
  )
  const pageRef = useRef(null)
  const hasNavigated = useRef(false)

  const isHome = location.pathname === '/'

  useEffect(() => {
    const instance = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.2,
      autoResize: true,
    })

    instance.on('scroll', ScrollTrigger.update)
    const tick = (time) => instance.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    // Expose the external Lenis instance to context consumers.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance)

    scrollState.reducedMotion = prefersReducedMotion()
    scrollState.isMobile = window.innerWidth < 760

    const progressTrigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollState.progress = self.progress
        scrollState.velocity = self.getVelocity()
      },
    })

    const onPointerMove = (event) => setPointer(event.clientX, event.clientY)
    const onPointerLeave = () => resetPointer()
    const onResize = () => {
      scrollState.isMobile = window.innerWidth < 760
      scrollState.reducedMotion = prefersReducedMotion()
      ScrollTrigger.refresh()
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onPointerLeave)
    window.addEventListener('resize', onResize)
    window.history.scrollRestoration = 'manual'

    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(frame)
      progressTrigger.kill()
      gsap.ticker.remove(tick)
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('mouseleave', onPointerLeave)
      window.removeEventListener('resize', onResize)
      instance.destroy()
      setLenis(null)
    }
  }, [])

  useEffect(() => {
    if (!lenis) return
    if (isHome && !introDone) {
      lenis.stop()
      document.body.classList.add('is-loading')
    } else {
      lenis.start()
      document.body.classList.remove('is-loading')
    }
  }, [introDone, isHome, lenis])

  useEffect(() => {
    if (!lenis) return
    lenis.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [lenis, location.pathname])

  // A quiet cross-fade when moving between the home page, a case study and the
  // 404. Opacity only, so fixed layers (scene, nav, cursor) keep their anchors.
  useLayoutEffect(() => {
    const page = pageRef.current
    if (!page) return undefined
    if (!hasNavigated.current) {
      hasNavigated.current = true
      return undefined
    }
    if (prefersReducedMotion()) return undefined

    const animation = page.animate(
      [{ opacity: 0 }, { opacity: 1 }],
      { duration: 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    )

    return () => animation.cancel()
  }, [location.pathname])

  const completeIntro = () => {
    sessionStorage.setItem('nexus-intro-seen', '1')
    scrollState.introDone = true
    setIntroDone(true)
    document.body.classList.remove('is-loading')
    window.setTimeout(() => ScrollTrigger.refresh(), 100)
  }

  return (
    <LenisContext.Provider value={lenis}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div ref={pageRef}>
        <Routes>
          <Route path="/" element={<Home introDone={introDone} />} />
          <Route path="/projects/:slug" element={<ProjectDetails />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {isHome && !introDone ? <Preloader onComplete={completeIntro} /> : null}

      <CustomCursor />
      <div className="grain" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />
    </LenisContext.Provider>
  )
}
