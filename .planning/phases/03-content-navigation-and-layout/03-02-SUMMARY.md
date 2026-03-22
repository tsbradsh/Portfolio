---
plan: 03-02
phase: 03-content-navigation-and-layout
status: complete
completed: 2026-03-22
---

# 03-02 Summary: Nav Component

## What Was Built

- **Nav.tsx** — `'use client'` component with sticky desktop nav, hamburger mobile nav, Projects dropdown, and GitHub/LinkedIn external links from `navLinks`
- **Nav.module.css** — Responsive CSS: sticky at z-index 100, `@media (max-width: 768px)` breakpoint, hamburger bar animation, 44px touch targets, fixed overlay
- **layout.tsx update** — Skip link + `<Nav />` wired into root layout (server component, Nav is client island)

## Key Behaviors

- Hamburger toggles mobile nav open/closed with body scroll lock
- Escape key closes nav and returns focus to hamburger button
- Overlay tap closes nav; every nav link has `onClick={close}`
- Desktop: Projects caret button opens dropdown with 3 project links
- Mobile: dropdown hidden, 3 flat project links shown directly (D-07)
- Click outside closes desktop dropdown via `dropdownRef.contains()`
- GitHub → `https://github.com/tsbradsh`, LinkedIn → `https://www.linkedin.com/in/tsbw/`

## Self-Check: PASSED

- `npx tsc --noEmit` — clean
- `npm run build` — exits 0, static pages generated
- All ARIA attributes present: `aria-expanded`, `aria-controls`, `aria-label`, `aria-haspopup`, `aria-hidden`
- Native `<button>` for dropdown caret (not SVG role="button")
- `navLinks.github` and `navLinks.linkedin` with `target="_blank" rel="noopener noreferrer"`
