# NEXUS — Mayuresh Devadiga Portfolio

An immersive 3D portfolio for Mayuresh Madhav Devadiga, built around a persistent
Nexus / Dreamscape universe: a chrome sphere, portals, floating islands, particles
and a camera that travels through each section as you scroll.

## Stack

- React 19 + Vite
- Three.js, React Three Fiber, Drei, postprocessing
- GSAP + ScrollTrigger, Lenis smooth scroll
- Framer Motion, React Router

## Run locally

Requires Node `20.19+` or `22.12+` (the range Vite 8 supports).

```bash
npm install
npm run dev      # or: npm start
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run lint
npm run build
npm run preview
```

The build output is written to `dist/`.

## Content and assets

- Portrait crops and the original source image live in `public/assets/`.
- The downloadable CV is `public/assets/mayuresh-resume.pdf` and is linked
  directly from the hero. No generated or substitute document is used.
- Project live/source links are intentionally marked as coming soon because no
  public URLs were supplied. Project detail pages use labelled visual
  placeholders instead of fabricated screenshots, and offer a mail link to ask
  for the code.
- The contact form has no backend. It composes a real `mailto:` message in the
  visitor's email client and clearly states that no data is sent to a server.

## Deployment note

Routing uses `BrowserRouter`. Configure the host to rewrite unknown paths to
`index.html` (SPA fallback) so project detail routes such as
`/projects/trustcart` resolve correctly. If deploying to a subpath, set Vite's
`base` option and the router `basename` to match.

Set `SITE_URL` in the build environment so canonical links, the Open Graph
image and the sitemap are absolute:

```bash
SITE_URL=https://your-domain.example npm run build
```

The build then emits `robots.txt` (always) and `sitemap.xml` (only when
`SITE_URL` is set) into `dist/`. The social preview image is
`public/assets/og-image.jpg` (1200×630); regenerate it if the copy or portrait
changes.
