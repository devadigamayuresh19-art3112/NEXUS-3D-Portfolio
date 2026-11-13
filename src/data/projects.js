export const projects = [
  {
    slug: 'trustcart',
    index: '01',
    name: 'TrustCart',
    title: 'Shop smarter. Trust better.',
    description:
      'A shopping intelligence platform designed to compare marketplace prices and analyse product reviews to help users make informed purchasing decisions.',
    shortDescription:
      'Marketplace price comparison and review intelligence in one decision surface.',
    tech: ['Python', 'PostgreSQL'],
    accent: '#37E6B0',
    accentSecondary: '#00CFFF',
    visual: 'trustcart',
    category: 'Commerce Intelligence',
    status: 'Platform concept',
    overview:
      'TrustCart is a shopping intelligence platform concept built around two questions: is this the right price, and is this the right product? It brings marketplace comparison and review analysis into a single research workflow.',
    problem:
      'Online shoppers move between multiple marketplaces, compare prices manually and read through large volumes of reviews before making a decision. TrustCart explores how that fragmented research can become one clearer, more informed purchasing experience.',
    features: [
      'Compare product prices across marketplaces.',
      'Analyse product reviews to surface useful buying signals.',
      'Bring price and review context together to support informed decisions.',
    ],
    approach:
      'The project is designed around Python for application and data-handling logic, with PostgreSQL used for structured product and review data. The core workflow centres on comparison and review analysis.',
    links: { demo: null, source: null },
    linkNote: 'Demo and repo links are coming soon.',
  },
  {
    slug: 'testpilot-ai',
    index: '02',
    name: 'TestPilot AI',
    title: 'An autonomous QA engineer.',
    description:
      'An autonomous software testing prototype that explores web pages, detects navigation and interface issues, and captures evidence for debugging.',
    shortDescription:
      'Autonomous web exploration, interface checks and evidence capture.',
    tech: ['Python', 'Playwright'],
    accent: '#00CFFF',
    accentSecondary: '#7857FF',
    visual: 'testpilot',
    category: 'Autonomous Testing',
    status: 'Autonomous testing prototype',
    overview:
      'TestPilot AI is a prototype for autonomous software testing. It explores web pages on its own, checks navigation and interface behaviour, and records evidence that helps a developer investigate what went wrong.',
    problem:
      'Repeated manual checks across web flows are slow, and interface or navigation issues can slip through between releases. TestPilot AI explores an autonomous approach to traversing pages and capturing the state of an issue.',
    features: [
      'Explore web pages autonomously.',
      'Detect navigation and interface issues.',
      'Capture evidence for debugging and review.',
    ],
    approach:
      'The prototype is built with Python and Playwright. Playwright provides browser automation while Python coordinates the exploration flow, issue detection and evidence capture described for the project.',
    links: { demo: null, source: null },
    linkNote: 'Demo and repo links are coming soon.',
  },
  {
    slug: 'sahayak',
    index: '03',
    name: 'Sahayak',
    title: 'Intelligence that helps.',
    description:
      'An AI-assisted inventory management application concept for local shops, focusing on product records and stock monitoring.',
    shortDescription:
      'A calmer, AI-assisted way for local shops to keep product records and watch stock.',
    tech: ['React', 'TypeScript', 'Firebase'],
    accent: '#A78BFA',
    accentSecondary: '#FFB86B',
    visual: 'sahayak',
    category: 'Assistive Commerce',
    status: 'Application concept',
    overview:
      'Sahayak is an application concept for local shops: a clear inventory workspace with an AI-assisted layer. It focuses on two fundamentals — dependable product records and visible stock levels — in an interface built for everyday use.',
    problem:
      'Small shops often track products and stock manually, which makes records harder to maintain and stock levels harder to see. Sahayak explores a simple digital workspace that keeps those essentials organised and accessible.',
    features: [
      'Maintain structured product records.',
      'Monitor stock levels from a single view.',
      'Explore an AI-assisted inventory workflow for local shops.',
    ],
    approach:
      'The concept is built with React and TypeScript for the interface and Firebase for application data. The design direction pairs a practical inventory workspace with an assistant-led experience.',
    links: { demo: null, source: null },
    linkNote: 'Demo and repo links are coming soon.',
  },
  {
    slug: 'github-repository-explorer-agent',
    index: '04',
    name: 'GitHub Repository Explorer Agent',
    title: 'Explore code intelligently.',
    description:
      'A Python-based agent using the GitHub API to explore repositories and retrieve information about issues and pull requests.',
    shortDescription:
      'A Python agent for navigating repositories, issues and pull requests.',
    tech: ['Python', 'GitHub API'],
    accent: '#8B9DFF',
    accentSecondary: '#37E6B0',
    visual: 'repo',
    category: 'Developer Intelligence',
    status: 'Python agent',
    overview:
      'GitHub Repository Explorer Agent is a Python-based agent that works with the GitHub API to explore repositories and retrieve information about their issues and pull requests. It is built to make repository context easier to reach.',
    problem:
      'Finding the right context inside a repository often means navigating issues, pull requests and project structure by hand. This agent explores a more direct, query-driven way to retrieve the information a developer needs.',
    features: [
      'Explore repositories through the GitHub API.',
      'Retrieve information about issues.',
      'Retrieve information about pull requests.',
    ],
    approach:
      'The agent is implemented in Python and communicates with the GitHub API. Its scope is focused on repository exploration and retrieving issue and pull-request information.',
    links: { demo: null, source: null },
    linkNote: 'Demo and repo links are coming soon.',
  },
]

export const projectBySlug = (slug) =>
  projects.find((project) => project.slug === slug)

export const nextProject = (slug) => {
  const index = projects.findIndex((project) => project.slug === slug)
  return projects[(index + 1) % projects.length]
}

export const skills = [
  {
    group: 'Programming',
    color: '#7857FF',
    items: [
      { name: 'C', note: 'Systems and programming fundamentals' },
      { name: 'Python', note: 'AI, automation and data' },
      { name: 'Java', note: 'Object-oriented programming' },
      { name: 'JavaScript', note: 'Interactive web experiences' },
    ],
  },
  {
    group: 'Web Development',
    color: '#00CFFF',
    items: [
      { name: 'HTML', note: 'Semantic structure' },
      { name: 'CSS', note: 'Visual systems and responsive layout' },
      { name: 'JavaScript', note: 'Interface behaviour' },
      { name: 'React', note: 'Component-driven interfaces' },
    ],
  },
  {
    group: 'Databases',
    color: '#37E6B0',
    items: [
      { name: 'PostgreSQL', note: 'Relational data' },
      { name: 'MongoDB', note: 'Document data' },
    ],
  },
  {
    group: 'AI & Emerging Technology',
    color: '#A78BFA',
    items: [
      { name: 'Artificial Intelligence', note: 'Intelligent systems' },
      { name: 'Machine Learning', note: 'Learning from data' },
      { name: 'Generative AI', note: 'Generative models and tools' },
      { name: 'Agentic AI', note: 'Goal-driven autonomous systems' },
    ],
  },
  {
    group: 'Tools & Platforms',
    color: '#8B9DFF',
    items: [
      { name: 'Git', note: 'Version control' },
      { name: 'GitHub', note: 'Collaboration and code hosting' },
      { name: 'Linux', note: 'Development environment' },
      { name: 'Ubuntu', note: 'Daily development OS' },
      { name: 'VS Code', note: 'Editing workflow' },
      { name: 'Cursor', note: 'AI-assisted development' },
      { name: 'Playwright', note: 'Browser automation and testing' },
    ],
  },
]

export const experience = [
  {
    index: '01',
    role: 'Global Campus Ambassador',
    org: 'Swytchcode',
    date: 'July 2026 – Present',
    description:
      'Ranked first on the Global Campus Ambassador leaderboard. Promoted platform initiatives and engaged with technology communities.',
    highlight: 'Rank 1 · Global leaderboard',
  },
  {
    index: '02',
    role: 'Student Partner',
    org: 'Internshala',
    date: '2026 – Present',
    description:
      'Represented Internshala on campus and promoted student career development and skill-building opportunities.',
    highlight: 'Campus representation',
  },
  {
    index: '03',
    role: 'Technical Associate',
    org: 'ACADS Club, KITCOEK',
    date: '2026 – Present',
    description:
      'Support technical initiatives and student engagement in technology-related activities.',
    highlight: 'Technical initiatives',
  },
]

export const achievements = [
  {
    index: '01',
    title: 'Global Campus Ambassador — Rank 1',
    issuer: 'Swytchcode',
    kind: 'Leaderboard',
    detail: 'Ranked first on the Global Campus Ambassador leaderboard.',
    icon: 'rank',
  },
  {
    index: '02',
    title: 'Introduction to Cybersecurity',
    issuer: 'Simplilearn',
    kind: 'Certification',
    detail: 'Completed the Introduction to Cybersecurity course.',
    icon: 'shield',
  },
  {
    index: '03',
    title: 'Pioneer',
    issuer: 'Idea Forged & Technexus',
    kind: 'Recognition',
    detail: 'Recognised at Idea Forged & Technexus.',
    icon: 'spark',
  },
  {
    index: '04',
    title: 'Meraki — Treasure Hunt',
    issuer: 'Meraki',
    kind: 'Event',
    detail: 'Participated in the Meraki Treasure Hunt.',
    icon: 'compass',
  },
  {
    index: '05',
    title: 'Beyond Resume',
    issuer: 'Beyond Resume',
    kind: 'Programme',
    detail: 'Part of the Beyond Resume programme.',
    icon: 'document',
  },
]

export const socials = {
  github: 'https://github.com/devadigamayuresh19-art3112',
  linkedin: 'https://www.linkedin.com/in/mayuresh-devadiga/',
  email: 'devadigamayuresh19@gmail.com',
}
