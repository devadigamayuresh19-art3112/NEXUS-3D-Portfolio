import { useEffect, useState } from 'react'

export const SECTION_IDS = [
  'home',
  'about',
  'skills',
  'projects',
  'experience',
  'achievements',
  'contact',
]

/**
 * Tracks which section currently sits under the reading line. A scroll
 * position check is more predictable than IntersectionObserver here because
 * sections have very different heights (the hero is a full viewport, the
 * project corridor is several).
 */
export default function useActiveSection(ids = SECTION_IDS) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    let frame = 0

    const measure = () => {
      frame = 0
      const line = window.innerHeight * 0.36
      let current = ids[0]

      ids.forEach((id) => {
        const element = document.getElementById(id)
        if (!element) return
        if (element.getBoundingClientRect().top <= line) current = id
      })

      setActive((previous) => (previous === current ? previous : current))
    }

    const schedule = () => {
      if (frame) return
      frame = requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ids])

  return active
}
