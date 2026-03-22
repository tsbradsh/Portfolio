import MandelbrotCanvas from './components/MandelbrotCanvas'
import ParallaxMain from './components/ParallaxMain'
import InfoSection from './components/InfoSection'
import SkillsSection from './components/SkillsSection'
import ProjectCard from './components/ProjectCard'
import ContactSection from './components/ContactSection'
import { projects } from './data/projects'

export default function Home() {
  return (
    <>
      <MandelbrotCanvas />
      <ParallaxMain>
        <InfoSection />
        <SkillsSection />
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
        <ContactSection />
      </ParallaxMain>
      <footer style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        textAlign: 'center',
        padding: 'var(--space-2) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-blue)',
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(6px)',
        borderTop: '1px solid rgba(0, 255, 204, 0.1)',
        zIndex: 90,
      }}>
        Tyler Bradshaw &copy; {new Date().getFullYear()}
      </footer>
    </>
  )
}
