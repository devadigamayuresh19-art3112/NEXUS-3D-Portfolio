const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const IconArrowUpRight = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

export const IconArrowRight = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)

export const IconArrowLeft = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M20 12H4M10 6l-6 6 6 6" />
  </svg>
)

export const IconChevronDown = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const IconDownload = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 3v12M7 10l5 5 5-5M4 20h16" />
  </svg>
)

export const IconMail = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 6.5 8.5 6 8.5-6" />
  </svg>
)

export const IconGithub = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
    <path d="M12 .7a11.3 11.3 0 0 0-3.57 22.02c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.68.08-.68 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.43.11-2.98 0 0 .95-.3 3.1 1.15a10.7 10.7 0 0 1 5.64 0c2.15-1.46 3.1-1.15 3.1-1.15.61 1.55.23 2.7.11 2.98.72.79 1.16 1.79 1.16 3.02 0 4.33-2.63 5.28-5.14 5.56.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.78.54A11.3 11.3 0 0 0 12 .7Z" />
  </svg>
)

export const IconLinkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false" {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45Z" />
  </svg>
)

export const IconMenu = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M3 7h18M3 12h18M3 17h18" />
  </svg>
)

export const IconClose = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="m5 5 14 14M19 5 5 19" />
  </svg>
)

export const IconExternal = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
  </svg>
)

export const IconSend = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M21 3 10.5 13.5M21 3l-6.8 18-3.7-7.5L3 9.8 21 3Z" />
  </svg>
)

export const IconTrophy = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3M12 13v4M8 21h8M9 17h6" />
  </svg>
)

export const IconShield = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 3 4.5 6v5.5c0 4.5 3.2 7.7 7.5 9.5 4.3-1.8 7.5-5 7.5-9.5V6L12 3Z" />
    <path d="m8.8 11.8 2.2 2.2 4.3-4.4" />
  </svg>
)

export const IconSpark = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M12 2.5 14.4 9l6.6 2.4-6.6 2.4L12 20.5l-2.4-6.7L3 11.4 9.6 9 12 2.5Z" />
    <path d="M19 3v3M17.5 4.5h3" />
  </svg>
)

export const IconCompass = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m15.8 8.2-2.1 5.5-5.5 2.1 2.1-5.5 5.5-2.1Z" />
  </svg>
)

export const IconDocument = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="M6 3h8l4 4v14H6V3Z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
)

export const IconCode = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="m8 7-5 5 5 5M16 7l5 5-5 5M13 4l-2 16" />
  </svg>
)

export const IconLayers = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
  </svg>
)

export const IconDatabase = (props) => (
  <svg viewBox="0 0 24 24" {...base} {...props}>
    <ellipse cx="12" cy="5.5" rx="7.5" ry="3" />
    <path d="M4.5 5.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6M4.5 11.5v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
  </svg>
)

