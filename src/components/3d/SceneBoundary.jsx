import { Component } from 'react'

/**
 * Catches a failed scene chunk (offline, stale deploy, blocked request) or a
 * renderer that throws on mount, and keeps the rest of the page intact by
 * swapping the canvas for the CSS backdrop. The boundary lives per-mount, so
 * navigating back to the home page gives the scene another chance.
 */
export default class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) {
      console.warn(
        '[nexus] 3D scene unavailable — showing the static backdrop.',
        error,
      )
    }
  }

  render() {
    if (this.state.failed) {
      return this.props.fallback ?? null
    }

    return this.props.children
  }
}
