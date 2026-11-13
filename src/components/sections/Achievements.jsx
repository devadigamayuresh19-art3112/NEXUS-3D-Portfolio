import { achievements } from '../../data/projects'
import Reveal from '../ui/Reveal'
import SectionHead from '../ui/SectionHead'
import {
  IconCompass,
  IconDocument,
  IconShield,
  IconSpark,
  IconTrophy,
} from '../ui/Icons'

const achievementIcons = {
  rank: IconTrophy,
  shield: IconShield,
  spark: IconSpark,
  compass: IconCompass,
  document: IconDocument,
}

export default function Achievements() {
  return (
    <section
      id="achievements"
      className="section achievements"
      data-camera="achievements"
    >
      <div className="section-scrim" aria-hidden="true" />
      <div className="container">
        <Reveal>
          <SectionHead
            index="05"
            eyebrow="Milestones & recognition"
            title={
              <>
                A record of
                <br />
                <span className="text-gradient">first steps.</span>
              </>
            }
            lede="A handful of milestones from the last year. Only the ones I can actually point to."
            aside={
              <div className="section-head__meta">
                <span>05 MILESTONES</span>
                <span className="status-dot">Verified</span>
              </div>
            }
          />
        </Reveal>

        <div className="achievements__grid">
          {achievements.map((achievement, index) => {
            const Icon = achievementIcons[achievement.icon] || achievementIcons.spark
            return (
              <Reveal
                key={achievement.index}
                className={`achievement-card ${index === 0 ? 'achievement-card--feature' : ''}`}
                y={30}
                delay={index * 0.04}
              >
                <div className="achievement-card__glow" aria-hidden="true" />
                <div className="achievement-card__top">
                  <span className="achievement-card__index">{achievement.index}</span>
                  <span className="achievement-card__kind">{achievement.kind}</span>
                </div>
                <span className="achievement-card__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3 className="achievement-card__title">{achievement.title}</h3>
                <p className="achievement-card__issuer">{achievement.issuer}</p>
                <p className="achievement-card__detail">{achievement.detail}</p>
                <span className="achievement-card__foot">
                  <span className="achievement-card__dot" aria-hidden="true" />
                  Milestone recorded
                </span>
              </Reveal>
            )
          })}
        </div>

        <Reveal className="academic" y={36} delay={0.08}>
          <div className="academic__head">
            <span className="eyebrow eyebrow--plain">Academic record</span>
            <span className="mono text-dim">KITCOEK / FIRST YEAR</span>
          </div>
          <div className="academic__stats">
            <div className="academic__stat">
              <strong>9.81</strong>
              <span className="academic__unit">/ 10.00</span>
              <small>First-year CGPA</small>
            </div>
            <div className="academic__stat">
              <strong>88.00</strong>
              <span className="academic__unit">%</span>
              <small>Class XII</small>
            </div>
            <div className="academic__stat">
              <strong>94.20</strong>
              <span className="academic__unit">%</span>
              <small>Class X</small>
            </div>
          </div>
          <span className="academic__note">
            Currently in the second year at KITCOEK, Kolhapur.
          </span>
        </Reveal>
      </div>
    </section>
  )
}
