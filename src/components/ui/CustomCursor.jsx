import { useEffect, useRef } from 'react'
import { isFinePointer } from '../../lib/motion'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!isFinePointer()) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring) return undefined

    document.body.classList.add('has-custom-cursor')

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ringPosition = { x: pointer.x, y: pointer.y }
    let raf = 0
    let hovering = false
    let visible = false

    const render = () => {
      ringPosition.x += (pointer.x - ringPosition.x) * 0.16
      ringPosition.y += (pointer.y - ringPosition.y) * 0.16
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`
      ring.style.transform = `translate3d(${ringPosition.x}px, ${ringPosition.y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(render)
    }

    const onMove = (event) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      if (!visible) {
        visible = true
        document.body.classList.add('cursor-visible')
        ringPosition.x = pointer.x
        ringPosition.y = pointer.y
      }

      const target = event.target
      const interactive =
        target instanceof Element &&
        target.closest('a, button, [data-cursor], input, textarea, select')
      const cursorLabel = target instanceof Element
        ? target.closest('[data-cursor-label]')?.getAttribute('data-cursor-label')
        : null

      if (cursorLabel && label) {
        label.textContent = cursorLabel
        document.body.classList.add('cursor-labeled')
      } else {
        document.body.classList.remove('cursor-labeled')
      }

      const nextHovering = Boolean(interactive)
      if (nextHovering !== hovering) {
        hovering = nextHovering
        document.body.classList.toggle('cursor-hovering', hovering)
      }
    }

    const onDown = () => document.body.classList.add('cursor-down')
    const onUp = () => document.body.classList.remove('cursor-down')
    const onLeave = () => {
      visible = false
      document.body.classList.remove('cursor-visible')
    }
    const onEnter = () => {
      visible = true
      document.body.classList.add('cursor-visible')
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)
    raf = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
      document.body.classList.remove(
        'has-custom-cursor',
        'cursor-visible',
        'cursor-hovering',
        'cursor-down',
        'cursor-labeled',
      )
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <span ref={ringRef} className="cursor__ring">
        <span ref={labelRef} className="cursor__label" />
      </span>
      <span ref={dotRef} className="cursor__dot" />
    </div>
  )
}
