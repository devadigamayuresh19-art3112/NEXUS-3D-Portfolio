import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import Reveal from '../ui/Reveal'
import SectionHead from '../ui/SectionHead'
import { skills } from '../../data/projects'
import { IconLayers } from '../ui/Icons'

const SkillsCanvas = lazy(() => import('../3d/SkillsCanvas'))

export default function Skills() {
  const visualRef = useRef(null)
  const [shouldMount, setShouldMount] = useState(false)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('All')

  const allTech = useMemo(
    () =>
      skills.flatMap((group) =>
        group.items.map((tech) => ({
          ...tech,
          group: group.group,
          color: group.color,
        })),
      ),
    [],
  )

  useEffect(() => {
    const element = visualRef.current
    if (!element) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setShouldMount(true)
      },
      { rootMargin: '300px 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const activeTech = hovered || selected
  const groups = ['All', ...skills.map((group) => group.group)]

  const handleSelect = (tech) => {
    setSelected((current) =>
      current && current.name === tech.name && current.group === tech.group
        ? null
        : tech,
    )
  }

  const handleFilter = (group) => {
    setFilter(group)
    if (selected && group !== 'All' && selected.group !== group) {
      setSelected(null)
    }
  }

  return (
    <section id="skills" className="section skills" data-camera="skills">
      <div className="section-scrim" aria-hidden="true" />
      <div className="container">
        <Reveal>
          <SectionHead
            index="02"
            eyebrow="The technology matrix"
            title={
              <>
                What I build
                <br />
                <span className="text-gradient">things with.</span>
              </>
            }
            lede="The languages, frameworks and tools I actually reach for, grouped by what I use them for. Hover or tap a node to see where it fits."
            aside={
              <div className="section-head__meta">
                <span>{allTech.length} TECHNOLOGIES</span>
                <span className="status-dot">All in use</span>
              </div>
            }
          />
        </Reveal>

        <div className="skills__layout">
          <Reveal className="skills__panel" y={36}>
            <div className="skills__panel-top">
              <div className="skills__panel-title">
                <IconLayers />
                <span>Capability index</span>
              </div>
              <span className="mono text-dim">05 / ORBITS</span>
            </div>

            <div className="skills__tabs" role="group" aria-label="Filter technologies">
              {groups.map((group) => (
                <button
                  key={group}
                  type="button"
                  className={`skills__tab ${filter === group ? 'is-active' : ''}`}
                  onClick={() => handleFilter(group)}
                  aria-pressed={filter === group}
                >
                  {group === 'All' ? 'All systems' : group}
                </button>
              ))}
            </div>

            <div className="skills__info panel" aria-live="polite">
              <span className="panel__corner panel__corner--tl" aria-hidden="true" />
              <span className="panel__corner panel__corner--br" aria-hidden="true" />
              {activeTech ? (
                <>
                  <span
                    className="skills__info-group"
                    style={{ color: activeTech.color }}
                  >
                    {activeTech.group}
                  </span>
                  <h3 className="skills__info-name">{activeTech.name}</h3>
                  <p className="skills__info-note">{activeTech.note}</p>
                  <span className="skills__info-state">
                    {selected?.name === activeTech.name
                      ? 'Signal pinned'
                      : 'Signal detected'}
                  </span>
                </>
              ) : (
                <>
                  <span className="skills__info-group">PICK ONE</span>
                  <h3 className="skills__info-name">Hover or tap a node.</h3>
                  <p className="skills__info-note">
                    Each dot is a tool. Tap one to pin it while you read the
                    note.
                  </p>
                  <span className="skills__info-state">Ready</span>
                </>
              )}
            </div>

            <div className="skills__list" aria-label="All technologies">
              {skills.map((group) => {
                const items =
                  filter === 'All' || filter === group.group ? group.items : []
                if (!items.length) return null
                return (
                  <div className="skills__group" key={group.group}>
                    <span
                      className="skills__group-label"
                      style={{ '--group-color': group.color }}
                    >
                      {group.group}
                    </span>
                    <div className="skills__group-items">
                      {items.map((tech) => {
                        const techObject = allTech.find(
                          (item) =>
                            item.name === tech.name &&
                            item.group === group.group,
                        )
                        const isActive =
                          selected?.name === tech.name &&
                          selected?.group === group.group
                        return (
                          <button
                            key={tech.name}
                            type="button"
                            className={`skills__item ${isActive ? 'is-active' : ''}`}
                            onMouseEnter={() => setHovered(techObject)}
                            onMouseLeave={() => setHovered(null)}
                            onFocus={() => setHovered(techObject)}
                            onBlur={() => setHovered(null)}
                            onClick={() => handleSelect(techObject)}
                            aria-pressed={isActive}
                          >
                            <span
                              className="skills__item-dot"
                              style={{ background: group.color }}
                              aria-hidden="true"
                            />
                            {tech.name}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="skills__hint">
              <span className="status-dot">Interactive</span>
              Tap or hover a node to pin it.
            </p>
          </Reveal>

          <Reveal className="skills__visual" y={44} delay={0.1}>
            <div className="skills__visual-head">
              <span className="mono">Interactive map</span>
              <span className="mono text-dim">Hover or tap</span>
            </div>
            <div
              className="skills__canvas"
              ref={visualRef}
              aria-label="Interactive 3D technology constellation. Technologies are also listed in the capability index."
            >
              {shouldMount ? (
                <Suspense
                  fallback={
                    <div className="skills__matrix-loading">
                      <span className="skills__loader" aria-hidden="true" />
                      Initialising matrix
                    </div>
                  }
                >
                  <SkillsCanvas
                    inView={inView}
                    hovered={hovered}
                    selected={selected}
                    filter={filter}
                    onHover={setHovered}
                    onSelect={handleSelect}
                  />
                </Suspense>
              ) : (
                <div className="skills__matrix-loading">
                  <span className="skills__loader" aria-hidden="true" />
                  Matrix standing by
                </div>
              )}
              <span className="skills__crosshair skills__crosshair--tl" aria-hidden="true" />
              <span className="skills__crosshair skills__crosshair--tr" aria-hidden="true" />
              <span className="skills__crosshair skills__crosshair--bl" aria-hidden="true" />
              <span className="skills__crosshair skills__crosshair--br" aria-hidden="true" />
            </div>
            <div className="skills__visual-footer">
              <span>{allTech.length} TECHNOLOGIES / 05 ORBITS</span>
              <span>HOVER OR TAP · PIN</span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
