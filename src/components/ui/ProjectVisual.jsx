import { useRef } from 'react'

function Tilt({ children }) {
  const ref = useRef(null)

  const onMove = (event) => {
    const element = ref.current
    if (!element) return
    const rect = element.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    element.style.setProperty('--ry', `${x * 7}deg`)
    element.style.setProperty('--rx', `${-y * 7}deg`)
  }

  const onLeave = () => {
    const element = ref.current
    if (!element) return
    element.style.setProperty('--ry', '0deg')
    element.style.setProperty('--rx', '0deg')
  }

  return (
    <div
      className="project-visual__tilt"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {children}
    </div>
  )
}

function TrustCartVisual() {
  return (
    <div className="pv-trust">
      <div className="pv-trust__header">
        <div>
          <span className="pv-kicker">TrustCart / Compare</span>
          <h4>Buy with signal.</h4>
        </div>
        <span className="pv-live">Live index</span>
      </div>

      <div className="pv-trust__grid">
        <div className="pv-market">
          <span className="pv-market__name">Market A</span>
          <strong>₹ 24,990</strong>
          <span className="pv-market__bar"><i style={{ width: '68%' }} /></span>
          <span className="pv-market__delta pv-market__delta--warm">-4.2%</span>
        </div>
        <div className="pv-market pv-market--best">
          <span className="pv-market__name">Market B</span>
          <strong>₹ 23,450</strong>
          <span className="pv-market__bar"><i style={{ width: '88%' }} /></span>
          <span className="pv-market__delta">Best price</span>
        </div>
        <div className="pv-trust__score">
          <span className="pv-score-label">Trust index</span>
          <div className="pv-score-ring">
            <span>94</span>
          </div>
          <small>Review signal / strong</small>
        </div>
      </div>

      <div className="pv-chart">
        <span className="pv-chart__label">Price history / 30d</span>
        <svg viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="trust-chart" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 76 C 40 74, 52 58, 84 62 S 132 82, 164 66 S 212 40, 244 50 S 300 24, 332 32 S 372 18, 400 22 L 400 100 L 0 100 Z"
            fill="url(#trust-chart)"
          />
          <path
            d="M0 76 C 40 74, 52 58, 84 62 S 132 82, 164 66 S 212 40, 244 50 S 300 24, 332 32 S 372 18, 400 22"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1.4"
          />
          <circle cx="332" cy="32" r="3" fill="var(--accent)" />
        </svg>
      </div>

      <div className="pv-tags">
        <span>Price comparison</span>
        <span>Review analysis</span>
        <span>Decision support</span>
      </div>
    </div>
  )
}

function TestPilotVisual() {
  const steps = [
    { label: 'Open landing page', state: 'pass' },
    { label: 'Navigate checkout flow', state: 'pass' },
    { label: 'Validate interface states', state: 'active' },
    { label: 'Capture evidence', state: 'pending' },
  ]

  return (
    <div className="pv-test">
      <div className="pv-browser">
        <div className="pv-browser__bar">
          <span className="pv-browser__dots" aria-hidden="true">
            <i /> <i /> <i />
          </span>
          <span className="pv-browser__url">app.nexus / checkout-flow</span>
          <span className="pv-live">Autopilot</span>
        </div>
        <div className="pv-browser__body">
          <div className="pv-test__steps">
            <span className="pv-kicker">Run / 024</span>
            {steps.map((step) => (
              <div className={`pv-test__step is-${step.state}`} key={step.label}>
                <span className="pv-test__step-icon" aria-hidden="true" />
                <span>{step.label}</span>
                <small>{step.state === 'active' ? 'CHECK' : step.state === 'pass' ? 'PASS' : 'WAIT'}</small>
              </div>
            ))}
            <div className="pv-test__progress">
              <i />
            </div>
          </div>
          <div className="pv-test__viewport">
            <span className="pv-test__badge">Scanning</span>
            <span className="pv-test__scan" aria-hidden="true" />
            <div className="pv-test__skeleton">
              <span className="pv-test__line pv-test__line--short" />
              <span className="pv-test__line" />
              <span className="pv-test__block" />
              <span className="pv-test__line pv-test__line--mid" />
              <span className="pv-test__button" />
            </div>
            <span className="pv-test__corner pv-test__corner--tl" aria-hidden="true" />
            <span className="pv-test__corner pv-test__corner--br" aria-hidden="true" />
          </div>
        </div>
      </div>

      <div className="pv-code-stream" aria-hidden="true">
        <span><b>01</b> page.goto(<em>'/checkout'</em>)</span>
        <span><b>02</b> detectNavigationIssues()</span>
        <span><b>03</b> captureEvidence(<em>'state-024'</em>)</span>
      </div>

      <div className="pv-test__status">
        <span>Nav / pass</span>
        <span>UI / check</span>
        <span>Evidence / captured</span>
      </div>
    </div>
  )
}

function SahayakVisual() {
  const stock = [
    { name: 'A4 Notebook', value: 28, state: 'low' },
    { name: 'Gel Pen / Blue', value: 74, state: 'ok' },
    { name: 'Desk Organiser', value: 46, state: 'mid' },
    { name: 'Sticky Notes', value: 62, state: 'ok' },
  ]

  return (
    <div className="pv-sahayak">
      <div className="pv-sahayak__head">
        <div>
          <span className="pv-kicker">Sahayak / Inventory</span>
          <h4>Everyday clarity.</h4>
        </div>
        <span className="pv-live">Assistant online</span>
      </div>

      <div className="pv-sahayak__grid">
        <div className="pv-inventory">
          <div className="pv-inventory__head">
            <span>Product record</span>
            <span>Stock</span>
          </div>
          {stock.map((item) => (
            <div className="pv-inventory__row" key={item.name}>
              <span className="pv-inventory__name">{item.name}</span>
              <span className="pv-inventory__bar">
                <i
                  className={`is-${item.state}`}
                  style={{ width: `${item.value}%` }}
                />
              </span>
              <span className="pv-inventory__value">{item.value}%</span>
            </div>
          ))}
        </div>

        <div className="pv-assistant">
          <div className="pv-assistant__orb" aria-hidden="true" />
          <span className="pv-kicker">Sahayak AI</span>
          <p>Stock for “A4 Notebook” is below the weekly threshold.</p>
          <div className="pv-assistant__chips">
            <span>Restock</span>
            <span>View record</span>
          </div>
          <div className="pv-assistant__input">
            <span>Ask Sahayak…</span>
            <i aria-hidden="true">↗</i>
          </div>
        </div>
      </div>

      <div className="pv-sahayak__cubes" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="pv-tags">
        <span>Product records</span>
        <span>Stock monitoring</span>
        <span>Assisted workflow</span>
      </div>
    </div>
  )
}

function RepoVisual() {
  return (
    <div className="pv-repo">
      <div className="pv-repo__head">
        <div>
          <span className="pv-kicker">Repository Explorer / GitHub API</span>
          <h4>Explore the graph.</h4>
        </div>
        <span className="pv-live">Connected</span>
      </div>

      <div className="pv-repo__body">
        <div className="pv-repo__graph">
          <svg viewBox="0 0 360 240" aria-hidden="true">
            <path d="M180 40 L96 104 L180 148 L264 96 L180 40" />
            <path d="M96 104 L56 184 L180 148" />
            <path d="M264 96 L312 176 L180 148" />
            <path d="M180 148 L180 218" />
            <circle cx="180" cy="40" r="8" />
            <circle cx="96" cy="104" r="6" />
            <circle cx="264" cy="96" r="6" />
            <circle cx="56" cy="184" r="5" />
            <circle cx="312" cy="176" r="5" />
            <circle cx="180" cy="148" r="10" />
            <circle cx="180" cy="218" r="5" />
          </svg>
          <span className="pv-repo__node-label pv-repo__node-label--root">repo</span>
          <span className="pv-repo__node-label pv-repo__node-label--issues">issues</span>
          <span className="pv-repo__node-label pv-repo__node-label--pulls">pulls</span>
        </div>

        <div className="pv-repo__panel">
          <span className="pv-kicker">Query result</span>
          <code>GET /repos/&#123;owner&#125;/&#123;repo&#125;</code>
          <div className="pv-repo__result">
            <span>Issue #142</span>
            <small>OPEN</small>
          </div>
          <div className="pv-repo__result">
            <span>Pull request #87</span>
            <small>MERGED</small>
          </div>
          <div className="pv-repo__result pv-repo__result--muted">
            <span>Repository metadata</span>
            <small>READY</small>
          </div>
          <div className="pv-repo__meter">
            <i />
          </div>
        </div>
      </div>

      <div className="pv-tags">
        <span>Repositories</span>
        <span>Issues</span>
        <span>Pull requests</span>
      </div>
    </div>
  )
}

const VISUALS = {
  trustcart: TrustCartVisual,
  testpilot: TestPilotVisual,
  sahayak: SahayakVisual,
  repo: RepoVisual,
}

export default function ProjectVisual({ project, className = '' }) {
  const Visual = VISUALS[project.visual] || TrustCartVisual

  return (
    <div
      className={`project-visual project-visual--${project.visual} ${className}`.trim()}
      style={{
        '--accent': project.accent,
        '--accent-2': project.accentSecondary,
      }}
    >
      <span className="project-visual__halo" aria-hidden="true" />
      <div className="project-visual__chrome">
        <div className="project-visual__topbar">
          <span className="project-visual__dots" aria-hidden="true">
            <i /> <i /> <i />
          </span>
          <span>NEXUS / PROJECT {project.index}</span>
          <span className="project-visual__status">CONCEPT</span>
        </div>
        <Tilt>
          <Visual />
        </Tilt>
        <div className="project-visual__bottombar">
          <span>Concept visual</span>
          <span>Actual UI screenshots pending</span>
        </div>
      </div>
    </div>
  )
}
