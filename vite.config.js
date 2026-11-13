import { statSync } from 'node:fs'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { projects } from './src/data/projects.js'

// Set SITE_URL (for example https://mayuresh.dev) in the build environment so
// the canonical link, Open Graph image and sitemap use absolute URLs. Without
// it the site still builds and falls back to relative URLs.
const siteUrl = (process.env.SITE_URL || '').replace(/\/+$/, '')

const ROUTES = ['/', ...projects.map((project) => `/projects/${project.slug}`)]

const CV_PATH = fileURLToPath(
  new URL('./public/assets/mayuresh-resume.pdf', import.meta.url),
)

function readCvMeta() {
  try {
    const stat = statSync(CV_PATH)
    return { bytes: stat.size, updated: stat.mtime.toISOString() }
  } catch {
    return { bytes: null, updated: null }
  }
}

// Keeps the CV label ("PDF · 55 KB · Nov 2026") honest without hand-editing it
// every time the file is replaced.
function cvMeta() {
  return {
    name: 'cv-meta',
    configureServer(server) {
      server.middlewares.use('/cv-meta.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.setHeader('Cache-Control', 'no-store')
        res.end(JSON.stringify(readCvMeta()))
      })
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'cv-meta.json',
        source: `${JSON.stringify(readCvMeta())}\n`,
      })
    },
  }
}

function seoFiles() {
  return {
    name: 'seo-files',
    transformIndexHtml(html) {
      return html.replaceAll('__SITE_URL__', siteUrl)
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: [
          'User-agent: *',
          'Allow: /',
          ...(siteUrl ? ['', `Sitemap: ${siteUrl}/sitemap.xml`] : []),
          '',
        ].join('\n'),
      })

      if (!siteUrl) return

      const urls = ROUTES.map(
        (route) => `  <url><loc>${siteUrl}${route}</loc></url>`,
      ).join('\n')

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoFiles(), cvMeta()],
})
