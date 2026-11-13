import { useLayoutEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/motion'

export default function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
  y = 32,
  stagger = 0,
  clip = false,
  start = 'top 88%',
  once = true,
  ...rest
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion()) return undefined

    const targets =
      stagger > 0
        ? element.querySelectorAll('[data-reveal-item]')
        : [element]

    if (!targets.length) return undefined

    const context = gsap.context(() => {
      gsap.set(targets, {
        opacity: 0,
        y,
        ...(clip ? { clipPath: 'inset(0% 0% 26% 0%)' } : {}),
      })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        ...(clip ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}),
        duration: 1.05,
        delay,
        ease: 'power3.out',
        stagger: stagger > 0 ? stagger : 0,
        scrollTrigger: {
          trigger: element,
          start,
          once,
          toggleActions: 'play none none none',
        },
      })
    }, element)

    return () => context.revert()
  }, [clip, delay, once, stagger, start, y])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}

/**
 * Gentle scrub parallax. Keep it as a child of a Reveal wrapper so the
 * entrance tween and the scroll movement never animate the same element.
 */
export function Parallax({
  as: Tag = 'div',
  children,
  className = '',
  speed = 30,
  ...rest
}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || prefersReducedMotion()) return undefined

    const context = gsap.context(() => {
      gsap.fromTo(
        element,
        { y: speed },
        {
          y: -speed,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        },
      )
    }, element)

    return () => context.revert()
  }, [speed])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
