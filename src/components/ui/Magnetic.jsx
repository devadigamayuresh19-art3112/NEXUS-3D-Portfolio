import { useRef } from 'react'
import { gsap, isFinePointer, prefersReducedMotion } from '../../lib/motion'

export default function Magnetic({
  children,
  className = '',
  strength = 0.22,
  as: Tag = 'span',
}) {
  const ref = useRef(null)

  const handleMove = (event) => {
    if (!ref.current || !isFinePointer() || prefersReducedMotion()) return
    const rect = ref.current.getBoundingClientRect()
    const x = event.clientX - (rect.left + rect.width / 2)
    const y = event.clientY - (rect.top + rect.height / 2)
    gsap.to(ref.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.5,
      ease: 'power3.out',
    })
  }

  const handleLeave = () => {
    if (!ref.current) return
    gsap.to(ref.current, {
      x: 0,
      y: 0,
      duration: 0.65,
      ease: 'elastic.out(1, 0.45)',
    })
  }

  return (
    <Tag
      ref={ref}
      className={`magnetic ${className}`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {children}
    </Tag>
  )
}
