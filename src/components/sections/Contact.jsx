import { useState } from 'react'
import { socials } from '../../data/projects'
import Magnetic from '../ui/Magnetic'
import Reveal from '../ui/Reveal'
import Scribble from '../ui/Scribble'
import SocialLinks from '../ui/SocialLinks'
import useLocalTime from '../../hooks/useLocalTime'
import {
  IconArrowUpRight,
  IconGithub,
  IconLinkedin,
  IconMail,
  IconSend,
} from '../ui/Icons'
import { useLenisInstance } from '../../lib/LenisContext'

const initialForm = {
  name: '',
  email: '',
  subject: '',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('')
  const lenis = useLenisInstance()
  const localTime = useLocalTime()

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (status) setStatus('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const subject = encodeURIComponent(
      form.subject.trim() || `Portfolio contact from ${form.name.trim()}`,
    )
    const body = encodeURIComponent(
      `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`,
    )
    window.location.href = `mailto:${socials.email}?subject=${subject}&body=${body}`
    setStatus(
      'Opening your email client. If nothing happens, use the direct email link below.',
    )
  }

  return (
    <section id="contact" className="section contact" data-camera="contact">
      <div className="contact__portal-glow" aria-hidden="true" />
      <div className="section-scrim" aria-hidden="true" />
      <div className="container">
        <div className="contact__layout">
          <Reveal className="contact__content">
            <span className="eyebrow">
              <span className="index">06</span>
              Contact portal
            </span>
            <h2 className="contact__title">
              Let&apos;s make
              <br />
              something
              <br />
              <span className="text-gradient contact__accent">
                good together.
                <Scribble />
              </span>
            </h2>
            <p className="section-lede contact__lede">
              An internship, a side project, or just a question about something
              I built — my inbox is open.
            </p>

            <div className="contact__actions">
              <Magnetic>
                <a
                  className="btn btn--primary"
                  href={`mailto:${socials.email}`}
                  data-cursor-label="EMAIL"
                >
                  Email me
                  <IconMail className="btn__icon" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  className="btn btn--ghost"
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-label="LINKEDIN"
                >
                  LinkedIn
                  <IconLinkedin className="btn__icon" />
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  className="btn btn--ghost"
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor-label="GITHUB"
                >
                  GitHub
                  <IconGithub className="btn__icon" />
                </a>
              </Magnetic>
            </div>

            <div className="contact__direct">
              <span className="mono text-dim">EMAIL</span>
              <a href={`mailto:${socials.email}`}>{socials.email}</a>
            </div>

            <div className="contact__meta">
              <span className="status-dot">Open to opportunities</span>
              <span className="mono text-dim">
                {localTime} IST in Kolhapur
              </span>
            </div>

            <SocialLinks className="contact__socials" />
          </Reveal>

          <Reveal className="contact__form-wrap" y={40} delay={0.1}>
            <div className="contact__form-panel panel">
              <span className="panel__corner panel__corner--tl" aria-hidden="true" />
              <span className="panel__corner panel__corner--br" aria-hidden="true" />
              <div className="contact__form-head">
                <div>
                  <span className="eyebrow eyebrow--plain">Send a message</span>
                  <h3>Say hello.</h3>
                </div>
                <span className="mono text-dim">EMAIL</span>
              </div>

              <form className="contact__form" onSubmit={handleSubmit}>
                <div className="contact__field">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    placeholder="What are we building?"
                    value={form.subject}
                    onChange={updateField}
                    required
                  />
                </div>

                <div className="contact__field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows="5"
                    placeholder="Tell me about the idea, role or project…"
                    value={form.message}
                    onChange={updateField}
                    required
                  />
                </div>

                <button type="submit" className="btn btn--primary btn--block">
                  Send message
                  <IconSend className="btn__icon" />
                </button>

                <p className="contact__note">
                  This form opens your email client with the message
                  pre-filled. No data is sent to a server. Prefer direct email?{' '}
                  <a href={`mailto:${socials.email}`}>Write to me here.</a>
                </p>

                <p className="contact__status" role="status" aria-live="polite">
                  {status}
                </p>
              </form>
            </div>
          </Reveal>
        </div>

        <footer className="footer">
          <div className="footer__main">
            <a
              href="#home"
              className="footer__logo"
              onClick={(event) => {
                event.preventDefault()
                if (lenis) lenis.scrollTo(0, { duration: 1.4 })
                else window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              aria-label="Back to top"
            >
              MD<span>.</span>
            </a>
            <p className="footer__note">
              Designed and built by Mayuresh Madhav Devadiga.
              <br />
              Kolhapur, India — 2026.
            </p>
          </div>
          <div className="footer__side">
            <a
              className="footer__top"
              href="#home"
              onClick={(event) => {
                event.preventDefault()
                if (lenis) lenis.scrollTo(0, { duration: 1.4 })
                else window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            >
              Back to the top
              <IconArrowUpRight />
            </a>
            <div className="footer__meta">
              <span>PORTFOLIO / 2026</span>
              <span>BUILT WITH REACT &amp; THREE.JS</span>
            </div>
          </div>
        </footer>
      </div>
    </section>
  )
}
