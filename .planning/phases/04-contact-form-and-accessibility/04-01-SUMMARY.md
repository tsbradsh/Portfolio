---
phase: 04-contact-form-and-accessibility
plan: "01"
subsystem: contact-form
tags: [netlify-forms, ajax, validation, accessibility, honeypot]
dependency_graph:
  requires: []
  provides: [working-contact-form, netlify-seed-form]
  affects: [app/components/ContactSection.tsx]
tech_stack:
  added: []
  patterns: [useState-status-machine, FormData-URLSearchParams-POST, per-field-inline-errors, honeypot-visually-hidden]
key_files:
  created:
    - public/contact.html
  modified:
    - app/components/ContactSection.tsx
    - app/components/ContactSection.module.css
decisions:
  - "Seed form placed in public/contact.html (not a Next.js route) so Netlify build bot detects the form during static export"
  - "Honeypot field uses CSS sr-only pattern (clip: rect, 1px) not display:none — bots that ignore display:none still get caught"
  - "Error state keeps form rendered below error banner so user can retry without page reload"
  - "formElement extracted to a local variable to avoid JSX duplication between idle/error branches"
metrics:
  duration: "3 minutes"
  completed_date: "2026-03-22"
  tasks_completed: 2
  files_changed: 3
---

# Phase 04 Plan 01: Contact Form AJAX + Netlify Seed Form Summary

AJAX Netlify Forms integration with per-field validation, honeypot spam protection, and seed HTML file for bot detection.

## What Was Built

**Task 1: Seed form + AJAX ContactSection**

- Created `public/contact.html` — minimal static form with `netlify` and `netlify-honeypot="bot-field"` attributes. Netlify's build bot scrapes this file during deploy to register the form endpoint. Users never visit this page.
- Rewrote `ContactSection.tsx` as a full `'use client'` interactive component with:
  - `useState<'idle' | 'submitting' | 'success' | 'error'>` status machine
  - `validate()` function with per-field error objects and email regex `/\S+@\S+\.\S+/`
  - `handleSubmit()` async handler: honeypot guard → validation → `fetch('/', { method: 'POST', ... })` → status update
  - `aria-describedby` / `aria-invalid` on all inputs for screen-reader error association
  - Three rendering branches: success message | error banner + form | idle form
  - Button shows `[ SENDING... ]` and becomes `disabled` while submitting
- Extended `ContactSection.module.css` with: `.honeypot`, `.fieldError`, `.success`, `.errorMessage`, `.submit:disabled`

**Task 2: Build output and accessibility verification**

- `npx next build` passes, `out/contact.html` contains `form name="contact"` with `netlify` attribute
- FORM-02 (labels): `htmlFor`/`id` pairs confirmed for name, email, message
- FORM-03 (dropdown button): `Nav.tsx` uses native `<button>` element for dropdown trigger
- FORM-04 (alt text): All 12 project images have non-empty alt strings; portrait has `alt="Photo of Tyler Bradshaw"`

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | `8878c12` | feat(04-01): AJAX contact form with validation, honeypot, and Netlify seed form |
| 2 | (no commit — verification only) | Build output and accessibility requirements verified as pre-satisfied |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

None — form submits to live Netlify Forms endpoint. Success/error states are fully wired.

## Requirements Satisfied

- **FORM-01**: Contact form submits via AJAX fetch to Netlify Forms without page redirect
- **FORM-02**: All form inputs have visible labels paired via `htmlFor`/`id` (pre-existing, verified)
- **FORM-03**: Project dropdown uses native button element (pre-existing, verified)
- **FORM-04**: All images have meaningful alt text (pre-existing, verified)

## Self-Check: PASSED

- `public/contact.html` — exists, contains `form name="contact"` and `netlify`
- `app/components/ContactSection.tsx` — contains `useState`, `handleSubmit`, `fetch`, `validate`, `aria-describedby`, `[ MESSAGE SENT ]`, `[ SENDING... ]`, `[ ERROR ]`
- `app/components/ContactSection.module.css` — contains `.honeypot`, `.fieldError`, `.success`, `.errorMessage`, `.submit:disabled`
- Commit `8878c12` — verified in git log
- `npx next build` — passes, `out/contact.html` seed form confirmed present
