import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export { gsap, ScrollTrigger }

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isFinePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(pointer: fine)').matches

export const scrollToSection = (lenis, target, offset = -82) => {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.35 })
    return
  }
  const element = typeof target === 'string' ? document.querySelector(target) : target
  if (element) {
    const top = element.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}
