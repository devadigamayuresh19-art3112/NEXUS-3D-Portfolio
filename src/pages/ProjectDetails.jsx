import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { nextProject, projectBySlug, projects } from '../data/projects'
import ProjectVisual from '../components/ui/ProjectVisual'
import Reveal from '../components/ui/Reveal'
import { IconArrowLeft, IconArrowUpRight, IconMail } from '../components/ui/Icons'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function ProjectDetails() {
  const { slug } = useParams()
  const project = projectBySlug(slug)

  useDocumentTitle(
    project
      ? `${project.name} — Mayuresh Devadiga`
      : 'Page not found — Mayuresh Devadiga',
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  if (!project) {
    return (
      <main id="main" className="not-found">
        <div className="container not-found__inner">
          <span className="eyebrow">ERROR / 404</span>
          <h1 className="not-found__title">This world is uncharted.</h1>
          <p className="section-lede">
            The project you are looking for does not exist in this universe.
          </p>
          <Link className="btn btn--primary" to="/">
            Back to the homepage
            <IconArrowUpRight className="btn__icon" />
          </Link>
        </div>
      </main>
    )
  }

  const next = nextProject(project.slug)

  return (
    <main
      id="main"
      className="project-detail"
      style={{
        '--accent': project.accent,
        '--accent-2': project.accentSecondary,
      }}
    >
      <div className="project-detail__bg" aria-hidden="true" />
      <div className="project-detail__grid-bg" aria-hidden="true" />

      <header className="project-detail__nav">
        <div className="container project-detail__nav-inner">
          <Link className="project-detail__logo" to="/" aria-label="Back to NEXUS home">
            MD<span>.</span>
          </Link>
          <Link className="project-detail__back" to="/">
            <IconArrowLeft />
            All projects
          </Link>
          <div className="project-detail__nav-next">
            <span className="mono text-dim">NEXT / {next.index}</span>
            <Link to={`/projects/${next.slug}`}>
              {next.name}
              <IconArrowUpRight />
            </Link>
          </div>
        </div>
      </header>

      <section className="project-detail__hero container">
        <Reveal className="project-detail__hero-copy" y={28}>
          <div className="project-detail__meta">
            <span className="project-detail__index">{project.index}</span>
            <span>{project.category}</span>
            <span>{project.status}</span>
          </div>

          <h1 className="project-detail__title">{project.name}</h1>
          <p className="project-detail__tagline">{project.title}</p>
          <p className="project-detail__description">{project.description}</p>

          <div className="project-detail__tech">
            {project.tech.map((tech) => (
              <span className="chip" key={tech}>
                {tech}
              </span>
            ))}
          </div>

          <div className="project-detail__actions">
            <a
              className="btn btn--primary"
              href={`mailto:devadigamayuresh19@gmail.com?subject=${encodeURIComponent(`Link request — ${project.name}`)}`}
            >
              Ask me for the code
              <IconMail className="btn__icon" />
            </a>
            <span className="mono text-dim">{project.linkNote}</span>
          </div>
        </Reveal>

        <Reveal className="project-detail__hero-visual" y={40} delay={0.1}>
          <ProjectVisual project={project} />
        </Reveal>
      </section>

      <div className="container project-detail__body">
        <aside className="project-detail__aside">
          <div className="project-detail__aside-block">
            <span className="mono text-dim">PROJECT TYPE</span>
            <strong>{project.category}</strong>
          </div>
          <div className="project-detail__aside-block">
            <span className="mono text-dim">STATUS</span>
            <strong>{project.status}</strong>
          </div>
          <div className="project-detail__aside-block">
            <span className="mono text-dim">STACK</span>
            <strong>{project.tech.join(' / ')}</strong>
          </div>
          <div className="project-detail__aside-block">
            <span className="mono text-dim">LINKS</span>
            <strong className="project-detail__pending">Pending publication</strong>
          </div>
          <div className="project-detail__aside-note">
            <span className="status-dot">Concept visual</span>
            <p>
              The interface shown is an art-directed concept. Actual UI
              screenshots are pending.
            </p>
          </div>
        </aside>

        <div className="project-detail__content">
          <Reveal as="section" className="project-detail__section">
            <span className="eyebrow">01 / Overview</span>
            <h2>What this project is.</h2>
            <p>{project.overview}</p>
          </Reveal>

          <Reveal as="section" className="project-detail__section" delay={0.05}>
            <span className="eyebrow">02 / Problem</span>
            <h2>The problem it explores.</h2>
            <p>{project.problem}</p>
          </Reveal>

          <Reveal as="section" className="project-detail__section" delay={0.05}>
            <span className="eyebrow">03 / Features</span>
            <h2>What it does.</h2>
            <ul className="project-detail__features">
              {project.features.map((feature) => (
                <li key={feature}>
                  <span aria-hidden="true">↗</span>
                  {feature}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="section" className="project-detail__section" delay={0.05}>
            <span className="eyebrow">04 / Technologies</span>
            <h2>The stack.</h2>
            <div className="project-detail__stack">
              {project.tech.map((tech) => (
                <span className="project-detail__stack-item" key={tech}>
                  <span aria-hidden="true" />
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal as="section" className="project-detail__section" delay={0.05}>
            <span className="eyebrow">05 / Development approach</span>
            <h2>How it was approached.</h2>
            <p>{project.approach}</p>
          </Reveal>

          <Reveal as="section" className="project-detail__section" delay={0.05}>
            <span className="eyebrow">06 / Screenshots</span>
            <h2>Interface evidence.</h2>
            <div className="project-detail__screens">
              <div className="project-detail__screen">
                <span className="mono">SCREENSHOT 01</span>
                <div className="project-detail__screen-empty">
                  <span>Pending</span>
                  <small>Actual project screenshot not supplied.</small>
                </div>
              </div>
              <div className="project-detail__screen">
                <span className="mono">SCREENSHOT 02</span>
                <div className="project-detail__screen-empty">
                  <span>Pending</span>
                  <small>Actual project screenshot not supplied.</small>
                </div>
              </div>
            </div>
            <p className="project-detail__note">
              Screenshots are intentionally left as labelled placeholders until
              real interface captures are available.
            </p>
          </Reveal>

          <Reveal as="section" className="project-detail__section" delay={0.05}>
            <span className="eyebrow">07 / Links</span>
            <h2>Live demo &amp; source.</h2>
            <div className="project-detail__links">
              <div className="project-detail__link-card is-disabled">
                <span className="mono">LIVE DEMO</span>
                <strong>Pending</strong>
                <small>{project.linkNote}</small>
              </div>
              <div className="project-detail__link-card is-disabled">
                <span className="mono">SOURCE CODE</span>
                <strong>Pending</strong>
                <small>{project.linkNote}</small>
              </div>
            </div>
            <p className="project-detail__note">
              No project URLs have been invented. When the real demo or
              repository is available, it will be published here.
            </p>
          </Reveal>
        </div>
      </div>

      <footer className="project-detail__footer">
        <div className="container project-detail__footer-inner">
          <div>
            <span className="mono text-dim">NEXT WORLD</span>
            <Link className="project-detail__next" to={`/projects/${next.slug}`}>
              {next.name}
              <IconArrowUpRight />
            </Link>
          </div>
          <Link className="btn btn--ghost" to="/">
            Back to the universe
            <IconArrowLeft className="btn__icon" />
          </Link>
        </div>
      </footer>

      <div className="project-detail__rail" aria-hidden="true">
        {projects.map((item) => (
          <span
            key={item.slug}
            className={item.slug === project.slug ? 'is-active' : ''}
          />
        ))}
      </div>
    </main>
  )
}
