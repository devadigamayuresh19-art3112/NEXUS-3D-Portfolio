import { Link } from 'react-router-dom'
import { projects } from '../../data/projects'
import ProjectVisual from '../ui/ProjectVisual'
import Reveal, { Parallax } from '../ui/Reveal'
import SectionHead from '../ui/SectionHead'
import { IconArrowUpRight } from '../ui/Icons'

function ProjectPanel({ project, index }) {
  const reversed = index % 2 === 1

  return (
    <article
      className={`project-panel ${reversed ? 'project-panel--reversed' : ''}`}
      data-camera={`project-${index}`}
      aria-labelledby={`project-title-${project.slug}`}
      style={{
        '--project-accent': project.accent,
        '--project-accent-secondary': project.accentSecondary,
      }}
    >
      <div className="container project-panel__grid">
        <Reveal className="project-panel__copy" y={40} stagger={0.07}>
          <div className="project-panel__meta" data-reveal-item>
            <span className="project-panel__index">{project.index}</span>
            <span className="project-panel__category">{project.category}</span>
            <span className="project-panel__status">{project.status}</span>
          </div>

          <p className="project-panel__name" data-reveal-item>
            {project.name}
          </p>

          <h3
            id={`project-title-${project.slug}`}
            className="project-panel__title"
            data-reveal-item
          >
            {project.title}
          </h3>

          <p className="project-panel__description" data-reveal-item>
            {project.description}
          </p>

          <div className="project-panel__tech" data-reveal-item>
            {project.tech.map((tech) => (
              <span className="chip" key={tech}>
                {tech}
              </span>
            ))}
          </div>

          <div className="project-panel__actions" data-reveal-item>
            <p className="project-panel__note">{project.linkNote}</p>
          </div>

          <Link
            to={`/projects/${project.slug}`}
            className="project-panel__detail"
            data-reveal-item
            data-cursor-label="OPEN"
          >
            Explore project file
            <IconArrowUpRight />
          </Link>
        </Reveal>

        <Reveal className="project-panel__visual" y={44} delay={0.1} clip>
          <Parallax speed={26}>
            <ProjectVisual project={project} />
          </Parallax>
        </Reveal>
      </div>
    </article>
  )
}

export default function Projects() {
  return (
    <section id="projects" className="projects">
      <div className="projects__intro container" data-camera="projects">
        <Reveal>
          <SectionHead
            index="03"
            eyebrow="Selected work"
            title={
              <>
                A few things I&apos;ve
                <br />
                <span className="text-gradient">been building.</span>
              </>
            }
            lede="None of these are finished products, but every one of them taught me something a tutorial could not."
            aside={
              <div className="section-head__meta">
                <span>04 PROJECTS</span>
                <span className="status-dot">Ongoing</span>
              </div>
            }
          />
        </Reveal>
        <div className="projects__intro-line" aria-hidden="true">
          <span>01</span>
          <i />
          <span>04</span>
        </div>
      </div>

      <div className="projects__list">
        {projects.map((project, index) => (
          <ProjectPanel key={project.slug} project={project} index={index} />
        ))}
      </div>

      <div className="projects__outro container">
        <Reveal>
          <p className="projects__outro-text">
            If one of these looks interesting, or you want to see how it was
            built, just ask.
          </p>
          <Link className="btn btn--ghost" to="/projects/trustcart">
            Open the project index
            <IconArrowUpRight className="btn__icon" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
