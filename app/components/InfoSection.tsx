'use client'
import { useReveal } from '../hooks/useReveal'
import styles from './InfoSection.module.css'

export default function InfoSection() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="info" ref={ref} className={`terminal-card section-hidden ${styles.info}`}>
      <div className={styles.grid}>
        <div className={styles.text}>
          <p className={styles.label}>
            <span className={styles.key}>NAME:</span> Tyler Bradshaw
          </p>
          <p className={styles.label}>
            <span className={styles.key}>ROLE:</span> Full-Stack Developer
          </p>
          <div className={styles.about}>
            <p className={styles.key}>ABOUT:</p>
            <p>
              Artist-driven developer building tools and digital experiences for
              independent musicians and creatives. I combine front-end craft,
              WebGL graphics, and Python-based AI to ship work that serves
              creative freedom — not corporate templates.
            </p>
          </div>
        </div>
        <div className={styles.portrait}>
          <img
            src="/assets/1x/Ty.jpg"
            alt="Photo of Tyler Bradshaw"
            className={styles.portraitImg}
          />
        </div>
      </div>
    </section>
  )
}
