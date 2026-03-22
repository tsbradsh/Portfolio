'use client'
import { useState, type FormEvent } from 'react'
import { useReveal } from '../hooks/useReveal'
import { navLinks } from '../data/projects'
import styles from './ContactSection.module.css'

function validate(form: FormData): { name?: string; email?: string; message?: string } {
  const errs: { name?: string; email?: string; message?: string } = {}
  if (!form.get('name')?.toString().trim()) errs.name = 'Name is required'
  const email = form.get('email')?.toString().trim() ?? ''
  if (!email) errs.email = 'Email is required'
  else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email required'
  if (!form.get('message')?.toString().trim()) errs.message = 'Message is required'
  return errs
}

export default function ContactSection() {
  const ref = useReveal<HTMLElement>()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)

    // Honeypot check — silently discard bot submissions
    if (form.get('bot-field')) {
      setStatus('success')
      return
    }

    const validationErrors = validate(form)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(form as unknown as Record<string, string>).toString(),
      })
      if (!response.ok) throw new Error('Submission failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const formElement = (
    <form
      className={styles.form}
      name="contact"
      data-netlify="true"
      netlify-honeypot="bot-field"
      method="POST"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="contact" />
      <p className={styles.honeypot}>
        <label>Don&apos;t fill this out: <input name="bot-field" /></label>
      </p>

      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <input
          type="text"
          id="name"
          name="name"
          className={styles.input}
          aria-describedby={errors.name ? 'name-error' : undefined}
          aria-invalid={errors.name ? true : undefined}
        />
        {errors.name && <span id="name-error" className={styles.fieldError}>{errors.name}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <input
          type="email"
          id="email"
          name="email"
          className={styles.input}
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={errors.email ? true : undefined}
        />
        {errors.email && <span id="email-error" className={styles.fieldError}>{errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.label}>Message</label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={styles.textarea}
          aria-describedby={errors.message ? 'message-error' : undefined}
          aria-invalid={errors.message ? true : undefined}
        />
        {errors.message && <span id="message-error" className={styles.fieldError}>{errors.message}</span>}
      </div>

      <button type="submit" className={styles.submit} disabled={status === 'submitting'}>
        {status === 'submitting' ? '[ SENDING... ]' : '[ SEND MESSAGE ]'}
      </button>
    </form>
  )

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

      {status === 'success' ? (
        <p className={styles.success}>[ MESSAGE SENT ] — I&apos;ll be in touch.</p>
      ) : status === 'error' ? (
        <>
          <p className={styles.errorMessage}>[ ERROR ] — Something went wrong. Try again or email me directly.</p>
          {formElement}
        </>
      ) : (
        formElement
      )}
    </section>
  )
}
