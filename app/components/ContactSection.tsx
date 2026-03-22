'use client'
import { useReveal } from '../hooks/useReveal'
import { navLinks } from '../data/projects'
import styles from './ContactSection.module.css'

export default function ContactSection() {
  const ref = useReveal<HTMLElement>()

  return (
    <section id="connect" ref={ref} className={`terminal-card section-hidden ${styles.contact}`}>
      <h2 className={styles.heading}>Connect</h2>

      <div className={styles.socialLinks}>
        <a
          href={navLinks.github}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          [ GITHUB ]
        </a>
        <a
          href={navLinks.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.cta}
        >
          [ LINKEDIN ]
        </a>
      </div>

      <form className={styles.form} name="contact" data-netlify="true" action="/">
        <input type="hidden" name="form-name" value="contact" />
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>Name</label>
          <input type="text" id="name" name="name" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>Email</label>
          <input type="email" id="email" name="email" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>Message</label>
          <textarea id="message" name="message" rows={5} className={styles.textarea} />
        </div>
        <button type="submit" className={styles.submit}>[ SEND MESSAGE ]</button>
      </form>
    </section>
  )
}
