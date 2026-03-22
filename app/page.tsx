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
        textAlign: 'center',
        padding: 'var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-blue)',
        position: 'relative',
      }}>
        Tyler Bradshaw &copy; {new Date().getFullYear()}
      </footer>
    </>
  )
}
