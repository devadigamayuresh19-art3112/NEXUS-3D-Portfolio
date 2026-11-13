import { useEffect, useRef, useState } from 'react'
import { experience } from '../../data/projects'
import Reveal from '../ui/Reveal'
import SectionHead from '../ui/SectionHead'
import { IconArrowUpRight } from '../ui/Icons'

export default function Experience() {
  const [active, setActive] = useState(0)
  const listRef = useRef(null)

  useEffect(() => {
    const items = Array.from(
      listRef.current?.querySelectorAll('[data-timeline-item]') ?? [],
    )
    if (!items.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.timelineItem)
            setActive(index)
          }
        })
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  return (
    <section id="experience" className="section experience" data-camera="experience">
      <div className="section-scrim" aria-hidden="true" />
      <div className="container">
        <Reveal>
          <SectionHead
            index="04"
            eyebrow="The journey so far"
            title={
              <>
                Learning by
                <br />
                <span className="text-gradient">doing it.</span>
              </>
            }
            lede="Communities and roles that have kept me close to technology — and to people who ship things."
            aside={
              <div className="section-head__meta">
                <span>03 ROLES</span>
                <span className="status-dot">Currently active</span>
              </div>
            }
          />
        </Reveal>

        <div className="timeline" ref={listRef}>
          <div className="timeline__rail" aria-hidden="true">
            <span className="timeline__rail-line" />
            <span className="timeline__rail-glow" />
          </div>

          {experience.map((item, index) => {
            const isRight = index % 2 === 1
            const isActive = active === index
            return (
              <article
                key={item.index}
                className={`timeline__item ${isRight ? 'timeline__item--right' : ''} ${isActive ? 'is-active' : ''}`}
                data-timeline-item={index}
              >
                <Reveal className="timeline__content" y={30} delay={0.05}>
                  <div className="timeline__card panel">
                    <span className="panel__corner panel__corner--tl" aria-hidden="true" />
                    <span className="panel__corner panel__corner--br" aria-hidden="true" />
                    <div className="timeline__card-head">
                      <span className="timeline__card-index">Experience {item.index}</span>
                      {item.date.includes('Present') && (
                        <span className="chip chip--accent">Current</span>
                      )}
                    </div>
                    <h3 className="timeline__role">{item.role}</h3>
                    <p className="timeline__org">{item.org}</p>
                    <p className="timeline__description">{item.description}</p>
                    <span className="timeline__highlight">
                      <span aria-hidden="true" />
                      {item.highlight}
                    </span>
                  </div>
                </Reveal>

                <div className="timeline__node" aria-hidden="true">
                  <span className="timeline__node-ring" />
                  <span className="timeline__node-core" />
                </div>

                <Reveal className="timeline__meta" y={20} delay={0.1}>
                  <span className="timeline__date">{item.date}</span>
                  <span className="timeline__meta-org">{item.org}</span>
                  <span className="timeline__meta-line" aria-hidden="true" />
                  <span className="timeline__meta-index">{item.index} / 03</span>
                </Reveal>
              </article>
            )
          })}
        </div>

        <Reveal className="experience__footer" delay={0.1}>
          <p className="experience__footer-text">
            The throughline: show up, help where I can, and keep building.
          </p>
          <a
            className="experience__link"
            href="https://www.linkedin.com/in/mayuresh-devadiga/"
            target="_blank"
            rel="noreferrer noopener"
          >
            View the journey on LinkedIn
            <IconArrowUpRight />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
