import { Suspense, lazy, useEffect, useState } from 'react'
import Navigation from '../components/ui/Navigation'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Skills from '../components/sections/Skills'
import Projects from '../components/sections/Projects'
import Experience from '../components/sections/Experience'
import Achievements from '../components/sections/Achievements'
import Contact from '../components/sections/Contact'
import SceneBoundary from '../components/3d/SceneBoundary'
import { ScrollTrigger } from '../lib/motion'
import { supportsWebGL2 } from '../lib/webgl'
import useActiveSection from '../hooks/useActiveSection'
import useDocumentTitle from '../hooks/useDocumentTitle'

const NexusCanvas = lazy(() => import('../components/3d/NexusCanvas'))

const SCENE_FALLBACK = <div className="scene-fallback" aria-hidden="true" />

const HOME_TITLE =
  'Mayuresh Devadiga — CSE (AI & ML) Student & Developer'

const CHAPTERS = {
  home: ['00', 'Intro'],
  about: ['01', 'About'],
  skills: ['02', 'Toolkit'],
  projects: ['03', 'Work'],
  experience: ['04', 'Journey'],
  achievements: ['05', 'Milestones'],
  contact: ['06', 'Contact'],
}

export default function Home({ introDone }) {
  useDocumentTitle(HOME_TITLE)
  const active = useActiveSection()
  const [chapterIndex, chapterLabel] = CHAPTERS[active] ?? CHAPTERS.home
  const [sceneReady, setSceneReady] = useState(false)
  const [webglAvailable] = useState(supportsWebGL2)

  // Warm the scene chunk while the intro is still on screen, but only mount it
  // once the preloader is gone. Keeping it out of the initial graph lets the
  // hero text paint first; devices without WebGL 2 never request it at all.
  useEffect(() => {
    if (!webglAvailable) return undefined

    if (!introDone) {
      import('../components/3d/NexusCanvas').catch(() => {})
      return undefined
    }

    const frame = requestAnimationFrame(() => setSceneReady(true))
    return () => cancelAnimationFrame(frame)
  }, [introDone, webglAvailable])

  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(frame)
  }, [introDone])

  return (
    <main id="main" className="home">
      {sceneReady && webglAvailable ? (
        <SceneBoundary fallback={SCENE_FALLBACK}>
          <Suspense fallback={SCENE_FALLBACK}>
            <NexusCanvas />
          </Suspense>
        </SceneBoundary>
      ) : (
        SCENE_FALLBACK
      )}

      <div className="home__content">
        <Hero introDone={introDone} />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Achievements />
        <Contact />
      </div>

      <Navigation />

      <div className="side-rail" aria-hidden="true">
        <div className="side-rail__inner">
          <span className="side-rail__dot" />
          <span className="side-rail__chapter" key={active}>
            <b>{chapterIndex}</b>
            {chapterLabel}
          </span>
          <span>Mayuresh Devadiga</span>
        </div>
      </div>
    </main>
  )
}
