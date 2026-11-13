import { Link } from 'react-router-dom'
import { IconArrowUpRight } from '../components/ui/Icons'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found — Mayuresh Devadiga')

  return (
    <main id="main" className="not-found">
      <div className="container not-found__inner">
        <span className="eyebrow">ERROR / 404</span>
        <h1 className="not-found__title">This world is uncharted.</h1>
        <p className="section-lede">
          The page you are looking for does not exist in this universe.
        </p>
        <Link className="btn btn--primary" to="/">
          Back to the homepage
          <IconArrowUpRight className="btn__icon" />
        </Link>
      </div>
    </main>
  )
}
