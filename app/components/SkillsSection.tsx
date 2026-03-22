'use client'
import { useReveal } from '../hooks/useReveal'
import { skillCategories } from '../data/projects'
import styles from './SkillsSection.module.css'

export default function SkillsSection() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="skills" ref={ref} className={`terminal-card section-hidden ${styles.skills}`}>
      <h2 className={styles.heading}>Skills</h2>
      <div className={styles.grid}>
        {skillCategories.map((cat) => (
          <div key={cat.name} className={styles.category}>
            <h3 className={styles.categoryName}>{cat.name}</h3>
            <ul className={styles.list}>
              {cat.skills.map((skill) => (
                <li key={skill} className={styles.skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
