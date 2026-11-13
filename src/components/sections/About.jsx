import Reveal from '../ui/Reveal'
import SectionHead from '../ui/SectionHead'
import { scrollToSection } from '../../lib/motion'
import { useLenisInstance } from '../../lib/LenisContext'
import { IconArrowUpRight, IconCode, IconDatabase, IconLayers } from '../ui/Icons'

export default function About() {
  const lenis = useLenisInstance()

  return (
    <section id="about" className="section about" data-camera="about">
      <div className="section-scrim" aria-hidden="true" />
      <div className="container">
        <Reveal className="about__head">
          <SectionHead
            index="01"
            eyebrow="Who I am"
            title={
              <>
                The person behind
                <br />
                <span className="text-gradient">the screen.</span>
              </>
            }
            lede="A computer science student working at the meeting point of machine learning, software and interface design."
            aside={
              <div className="section-head__meta">
                <span>Mayuresh Devadiga</span>
                <span className="status-dot">In Kolhapur</span>
              </div>
            }
          />
        </Reveal>

        <div className="about__grid">
          <Reveal className="about__visual" y={44} delay={0.1} stagger={0.09}>
            <div className="about__orbital" aria-hidden="true">
              <span />
              <span />
            </div>

            <figure className="about__photo" data-reveal-item>
              <img
                src="/assets/portrait-about.webp"
                alt="Portrait of Mayuresh Madhav Devadiga"
                width="400"
                height="945"
                loading="lazy"
                decoding="async"
              />
              <span className="about__photo-fade" aria-hidden="true" />
            </figure>

            <div className="about__stat about__stat--cgpa" data-reveal-item>
              <span className="about__stat-kicker">First-year CGPA</span>
              <strong>
                9.81<span>/10.00</span>
              </strong>
              <span className="about__stat-bar" aria-hidden="true">
                <i />
              </span>
            </div>

            <div className="about__stat about__stat--grad" data-reveal-item>
              <span className="about__stat-kicker">Expected graduation</span>
              <strong>2029</strong>
              <span className="about__stat-note">KITCOEK</span>
            </div>

            <div className="about__visual-caption" data-reveal-item>
              <span className="mono">KITCOEK · Second year</span>
              <span className="mono">Kolhapur, IN</span>
            </div>
          </Reveal>

          <div className="about__content">
            <Reveal>
              <p className="about__lead">
                I&apos;m <span>Mayuresh Madhav Devadiga</span> — a second-year
                Computer Science student specialising in AI and Machine
                Learning.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="about__body">
                Most of what I know came from building things and then breaking
                them. I like problems that need both a model underneath and an
                interface someone can actually use, so I usually end up
                somewhere between a Python notebook and a browser tab. The work
                below is where that has taken me so far.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="about__education panel">
                <span className="panel__corner panel__corner--tl" aria-hidden="true" />
                <span className="panel__corner panel__corner--br" aria-hidden="true" />
                <div className="about__education-head">
                  <span className="eyebrow eyebrow--plain">Education</span>
                  <span className="mono text-dim">KITCOEK · 2029</span>
                </div>
                <dl className="about__education-list">
                  <div>
                    <dt>Degree</dt>
                    <dd>B.Tech Computer Science and Engineering (AI &amp; ML)</dd>
                  </div>
                  <div>
                    <dt>Institution</dt>
                    <dd>Kolhapur Institute of Technology (KITCOEK)</dd>
                  </div>
                  <div>
                    <dt>Graduating</dt>
                    <dd>2029</dd>
                  </div>
                  <div>
                    <dt>First-year CGPA</dt>
                    <dd>9.81 / 10.00</dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="about__pillars">
                <div className="about__pillar">
                  <IconCode />
                  <span>Intelligent systems</span>
                </div>
                <div className="about__pillar">
                  <IconLayers />
                  <span>Interfaces people can use</span>
                </div>
                <div className="about__pillar">
                  <IconDatabase />
                  <span>Strong fundamentals</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <a
                className="about__link"
                href="#skills"
                data-cursor-label="TOOLS"
                onClick={(event) => {
                  event.preventDefault()
                  scrollToSection(lenis, '#skills', -82)
                }}
              >
                See what I work with
                <IconArrowUpRight />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
