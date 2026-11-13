import { socials } from '../../data/projects'
import { IconGithub, IconLinkedin, IconMail } from './Icons'

export default function SocialLinks({ className = '' }) {
  return (
    <div className={`social-row ${className}`.trim()} aria-label="Social links">
      <a
        className="icon-link"
        href={socials.github}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="GitHub profile"
        data-cursor-label="GITHUB"
      >
        <IconGithub />
      </a>
      <a
        className="icon-link"
        href={socials.linkedin}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="LinkedIn profile"
        data-cursor-label="LINKEDIN"
      >
        <IconLinkedin />
      </a>
      <span className="social-row__divider" aria-hidden="true" />
      <a
        className="icon-link"
        href={`mailto:${socials.email}`}
        aria-label="Send an email"
        data-cursor-label="EMAIL"
      >
        <IconMail />
      </a>
    </div>
  )
}
