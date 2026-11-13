import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/motion'

/**
 * A hand-drawn rule under a word, drawn once when it scrolls into view.
 * It stays fully visible for reduced-motion users.
 */
export default function Scribble({ className = '' }) {
  const pathRef = useRef(null)

  useLayoutEffect(() => {
    const path = pathRef.current
    if (!path || prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      const length = path.getTotalLength()

      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length })
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.15,
        ease: 'power2.inOut',
        scrollTrigger: {
          trigger: path,
          start: 'top 94%',
          once: true,
        },
      })
    }, path)

    return () => context.revert()
  }, [])

  return (
    <svg
      className={`scribble ${className}`.trim()}
      viewBox="0 0 300 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        ref={pathRef}
        d="M3 9 C 34 3, 67 12, 101 7 S 168 2, 201 8 S 260 12, 297 5"
        fill="none"
        stroke="var(--secondary)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  )
}
