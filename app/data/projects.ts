export interface ProjectImage {
  src: string
  alt: string
}

export interface ProjectLink {
  label: string
  url: string
}

export interface Project {
  id: string
  title: string
  background: string
  techStack: string
  results: string
  images: ProjectImage[]
  links: ProjectLink[]
}

export interface SkillCategory {
  name: string
  skills: string[]
}

export const projects: Project[] = [
  {
    id: 'when-you-sleep',
    title: 'When You Sleep',
    background: 'Built a custom responsive site for the band When You Sleep — dark dreamscape aesthetic, animated logo, embedded EP streaming, event feed, and storefront links. Every detail authored from scratch.',
    techStack: 'HTML, CSS, JavaScript, Three.js, Adobe Creative Cloud',
    results: 'Site became the band\'s launch hub, demonstrating motion design, front-end development, and brand storytelling working as a system.',
    images: [
      { src: '/assets/wys/wys.png', alt: 'When You Sleep — homepage' },
      { src: '/assets/wys/mockup.png', alt: 'When You Sleep — mockup' },
      { src: '/assets/wys/events.png', alt: 'When You Sleep — events page' },
      { src: '/assets/wys/wireframe.jpg', alt: 'When You Sleep — wireframe' },
    ],
    links: [
      { label: 'VIEW CODE', url: 'https://github.com/tsbradsh/lucid-eye' },
    ],
  },
  {
    id: 'ai-music-tool',
    title: 'AI Music Collaboration Tool',
    background: 'Self-directed project building a local-first AI assistant that learns from a musician\'s own recordings — not generic datasets. Goal: faster creative flow with personal voice preserved.',
    techStack: 'Python, MusicGen, open-source transformer models',
    results: 'Early prototype generates MIDI and lyric sketches aligned to past writing style. Architecture maps out onboarding, training, and visual feedback phases.',
    images: [
      { src: '/assets/AI/Wireframe.png', alt: 'AI Music Tool — wireframe' },
      { src: '/assets/AI/Map.png', alt: 'AI Music Tool — architecture map' },
      { src: '/assets/AI/Flow.png', alt: 'AI Music Tool — user flow' },
      { src: '/assets/AI/Concept.png', alt: 'AI Music Tool — concept diagram' },
    ],
    links: [],  // No URL available — hidden per D-12
  },
  {
    id: 'red-clover',
    title: 'Red Clover Sugar Studio',
    background: 'Designed and built the studio\'s first professional web presence — informational layout for a wellness business entering the market.',
    techStack: 'HTML, CSS, JavaScript, Git',
    results: 'Delivered a polished, client-ready site with a wax ratio calculator, pre/post-care sections, and a contact form — ready for future e-commerce or booking integrations.',
    images: [
      { src: '/assets/RCSS/Home.png', alt: 'Red Clover Sugar Studio — homepage' },
      { src: '/assets/RCSS/Palette.png', alt: 'Red Clover Sugar Studio — color palette' },
      { src: '/assets/RCSS/Calculator.png', alt: 'Red Clover Sugar Studio — ratio calculator' },
      { src: '/assets/RCSS/Ratio.png', alt: 'Red Clover Sugar Studio — ratio display' },
    ],
    links: [
      { label: 'VIEW CODE', url: 'https://github.com/tsbradsh/Final-Project' },
    ],
  },
]

// Skills categories per D-13, D-14, D-15, D-16
export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      'HTML5 / CSS3 / JavaScript (ES6+)',
      'React / Next.js / TypeScript',
      'Three.js / WebGL / GLSL',
    ],
  },
  {
    name: 'Backend & Data',
    skills: [
      'Python / Node.js',
      'SQL++ / NORMA / ORM',
      'API Development & Integration',
    ],
  },
  {
    name: 'Design & Motion',
    skills: [
      'Adobe Creative Cloud (Design / Motion)',
      'Wireframing & UI Design',
      'Brand Storytelling',
    ],
  },
  {
    name: 'Workflow',
    skills: [
      'Git / GitHub',
      'Netlify / Vercel / Deployment',
    ],
  },
]

// Nav links — real URLs per CONT-01
export const navLinks = {
  github: 'https://github.com/tsbradsh',
  linkedin: 'https://www.linkedin.com/in/tsbw/',
} as const
