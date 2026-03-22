'use client'
import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import type { Project } from '../data/projects'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project }: { project: Project }) {
  const ref = useReveal<HTMLElement>()
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((i) => Math.max(0, i - 1))
  const next = () => setCurrent((i) => Math.min(project.images.length - 1, i + 1))

  return (
    <section id={project.id} ref={ref} className={`terminal-card section-hidden ${styles.card}`}>
      <h2 className={styles.title}>{project.title}</h2>

      <div className={styles.grid}>
        <div className={styles.text}>
          <p><span className={styles.keyHeader}>BACKGROUND:</span></p>
          <p className={styles.body}>{project.background}</p>

          <p><span className={styles.key}>TECH STACK:</span> {project.techStack}</p>

          <p><span className={styles.keyHeader}>RESULTS:</span></p>
          <p className={styles.body}>{project.results}</p>

          {project.links.length > 0 && (
            <div className={styles.links}>
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.cta}
                >
                  [ {link.label} ]
                </a>
              ))}
            </div>
          )}
        </div>

        <div className={styles.gallery} aria-live="polite">
          <div className={styles.imageContainer}>
            <img
              src={project.images[current].src}
              alt={project.images[current].alt}
              className={styles.image}
            />
            <button
              onClick={prev}
              aria-label="Previous image"
              disabled={current === 0}
              className={`${styles.arrow} ${styles.arrowLeft}`}
            >
              &#8592;
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              disabled={current === project.images.length - 1}
              className={`${styles.arrow} ${styles.arrowRight}`}
            >
              &#8594;
            </button>
          </div>
          <div className={styles.dots}>
            {project.images.map((_, i) => (
              <span
                key={i}
                className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
