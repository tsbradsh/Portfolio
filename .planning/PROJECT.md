# Tyler Bradshaw Portfolio

## What This Is

A personal developer portfolio for Tyler Bradshaw, migrating from a vanilla HTML/CSS/JS codebase to a Next.js + TypeScript application. The site features a distinctive WebGL Mandelbrot fractal background and an elevated terminal aesthetic — monospace type, dark palette, teal accents — modernized to feel intentional and polished rather than retro. Goal is maximum hirability: impressive tech stack, real links, fast load times, and a design that stands out.

## Core Value

The portfolio must signal technical competence and design sensibility simultaneously — the WebGL fractal and terminal identity must coexist with professional polish that holds up to recruiter scrutiny.

## Requirements

### Validated

- ✓ Mandelbrot fractal WebGL background animation (Three.js) — existing
- ✓ Project showcase sections (When You Sleep, AI Music Tool, Red Clover Sugar Studio) — existing
- ✓ Skills display section — existing
- ✓ Contact form with Netlify handling — existing
- ✓ Navigation with hamburger menu and dropdown — existing
- ✓ Scroll-triggered section reveal animations — existing
- ✓ Terminal-style visual aesthetic — existing

### Active

- [x] Full migration to Next.js + TypeScript (replace vanilla HTML/CSS/JS) — Validated in Phase 01: infrastructure-and-foundation
- [ ] Elevated terminal aesthetic: modern dark cards with subtle teal border glow, no Windows 95 chrome
- [ ] Fully responsive layout optimized for mobile (currently broken on phones)
- [ ] Fill all placeholder links: GitHub (https://github.com/tsbradsh), LinkedIn (https://www.linkedin.com/in/tsbw/), When You Sleep repo (https://github.com/tsbradsh/lucid-eye), Red Clover repo (https://github.com/tsbradsh/Final-Project)
- [ ] Performance optimization: scroll throttling, lazy loading, adaptive WebGL quality
- [ ] SEO and meta tags (Next.js head, Open Graph, structured data)
- [ ] WebGL graceful fallback for non-capable browsers and devices
- [ ] Accessibility fixes: proper form labels, semantic button elements, WCAG 2.1 AA compliance

### Out of Scope

- Resume PDF link — user will add manually when available
- AI Music Tool live demo URL — not available yet (planned as next project)
- Backend or authentication — static portfolio, no accounts needed
- Mobile-native app — web-first only
- Real-time features (chat, live notifications) — not relevant to portfolio

## Context

- **Current stack:** Next.js 16.2.1 App Router, TypeScript strict mode, static export (`output: 'export'`), Three.js 0.183.2 installed. Vanilla files archived to `_archive/`. Phase 01 complete.
- **Hosting:** Netlify (static), Netlify Forms for contact
- **Known mobile issues:** Layout breaks on phones; CSS grid breakpoints exist but are insufficient
- **Known performance concerns:** Unthrottled scroll handler, continuous WebGL render, 400-iteration shader per frame
- **Known accessibility gaps:** Form inputs lack visible labels, caret uses SVG role="button" instead of native button
- **Design direction:** Elevated terminal — Cascadia Code font, #0a0a0a background, #00ffcc teal accent, minimal bordered cards with subtle glow. Think Vercel/Linear/Raycast dark UI applied to a terminal identity.
- **Project links gathered:** GitHub: tsbradsh, LinkedIn: tsbw, lucid-eye repo (When You Sleep), Final-Project repo (Red Clover). AI Music Tool has no live link yet.

## Constraints

- **Tech Stack:** Next.js + TypeScript — chosen for SSG/SEO, industry hirability signal, and clean component architecture
- **3D/Graphics:** Three.js retained — WebGL fractal is a core identity element, not optional
- **Hosting:** Must remain Netlify-compatible (Next.js static export) or migrate to Vercel
- **Design System:** Must preserve elevated terminal aesthetic — no neutral/minimal pivot
- **Content:** Resume link and AI Music Tool live URL are placeholder until user provides them

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Full Next.js + TypeScript migration over hybrid approach | Clean architecture, proper React patterns, strong hiring signal | ✓ Completed Phase 01 |
| Keep WebGL Mandelbrot fractal | Technical depth signal, core visual identity | — Pending |
| Elevated terminal aesthetic (not neutral/minimal) | Distinctive AND polished — stands out vs. generic dev portfolios | — Pending |
| Next.js over Vite+React | SSG support = better SEO, industry standard for portfolios | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 — Phase 01 complete*
