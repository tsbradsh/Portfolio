'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { navLinks, projects } from '../data/projects'
import styles from './Nav.module.css'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const hamburgerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLLIElement>(null)

  // Close mobile nav on Escape, return focus to hamburger
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Body scroll lock when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close desktop dropdown on click outside
  useEffect(() => {
    if (!dropOpen) return
    const handleMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [dropOpen])

  const close = () => setIsOpen(false)

  return (
    <nav className={styles.nav} aria-label="Main navigation">
      <div className={styles.logoGroup}>
        <Image
          src="/assets/1x/logocolor.png"
          alt="Tyler Bradshaw logo"
          height={70}
          width={70}
          className={styles.logo}
        />
        <Image
          src="/assets/1x/wordmark.png"
          alt="Tyler Bradshaw"
          height={50}
          width={160}
          className={styles.wordmark}
        />
      </div>

      <button
        ref={hamburgerRef}
        className={styles.hamburger}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        aria-controls="links"
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className={isOpen ? styles.barTopOpen : styles.bar} />
        <span className={isOpen ? styles.barMidOpen : styles.bar} />
        <span className={isOpen ? styles.barBotOpen : styles.bar} />
      </button>

      {isOpen && (
        <div className={styles.overlay} onClick={close} aria-hidden="true" />
      )}

      <ul
        id="links"
        className={`${styles.links} ${isOpen ? styles.open : ''}`}
        role="list"
      >
        <li><a href="#info" className={styles.link} onClick={close}>INFO</a></li>
        <li><a href="#skills" className={styles.link} onClick={close}>SKILLS</a></li>

        {/* Desktop Projects dropdown */}
        <li className={styles.dropdownWrapper} ref={dropdownRef}>
          <button
            className={`${styles.link} ${styles.dropdownTrigger}`}
            aria-expanded={dropOpen}
            aria-haspopup="true"
            onClick={() => setDropOpen(prev => !prev)}
          >
            PROJECTS <span className={styles.caret}>▾</span>
          </button>
          <div className={`${styles.dropdownMenu} ${dropOpen ? styles.dropdownOpen : ''}`}>
            {projects.map(project => (
              <a
                key={project.id}
                href={`#${project.id}`}
                className={styles.dropdownItem}
                onClick={() => { setDropOpen(false); close() }}
              >
                {project.title}
              </a>
            ))}
          </div>
        </li>

        {/* Mobile-only flat project links */}
        {projects.map(project => (
          <li key={`mobile-${project.id}`} className={styles.mobileProjectLink}>
            <a href={`#${project.id}`} className={styles.link} onClick={close}>
              {project.title}
            </a>
          </li>
        ))}

        <li><a href="#connect" className={styles.link} onClick={close}>CONNECT</a></li>
        <li>
          <a
            href={navLinks.github}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            [ GITHUB ]
          </a>
        </li>
        <li>
          <a
            href={navLinks.linkedin}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
          >
            [ LINKEDIN ]
          </a>
        </li>
      </ul>
    </nav>
  )
}
