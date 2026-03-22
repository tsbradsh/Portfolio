# Roadmap: Tyler Bradshaw Portfolio

## Overview

A migration from a vanilla HTML/CSS/JS single-page portfolio to Next.js 15 + TypeScript, delivering a hirability-ready site with a performant WebGL Mandelbrot fractal, elevated terminal aesthetic, working contact form, full mobile responsiveness, and Lighthouse 90+ across all categories. Phases flow from scaffolding through WebGL isolation, content delivery, accessibility, and launch validation.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Infrastructure and Foundation** - Scaffold Next.js 15 App Router with static export, design tokens, and Cascadia Code font
- [x] **Phase 2: WebGL Canvas Migration** - Isolate Three.js behind use client boundary, implement scroll animation and graceful fallback (completed 2026-03-22)
- [ ] **Phase 3: Content, Navigation and Layout** - Build all section components, fill placeholder links, fix mobile layout
- [ ] **Phase 4: Contact Form and Accessibility** - Netlify Forms integration, WCAG 2.1 AA compliance, semantic HTML fixes
- [ ] **Phase 5: SEO, Performance and Launch** - Metadata API, JSON-LD, Lighthouse 90+, verified Netlify deployment

## Phase Details

### Phase 1: Infrastructure and Foundation
**Goal**: A working Next.js 15 App Router project deploys successfully to Netlify with static export, design tokens, and self-hosted Cascadia Code font established as the shared foundation for all subsequent phases
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03
**Success Criteria** (what must be TRUE):
  1. Running `next build` produces an `out/` directory that deploys and loads correctly on Netlify
  2. CSS custom properties for color, spacing, and typography are defined and usable across all future components
  3. Cascadia Code renders in the browser with no visible font flash or layout shift on page load
  4. TypeScript compiles without errors from a clean checkout
**Plans**: 1 plan

Plans:
- [x] 01-01-PLAN.md — Scaffold Next.js 15 with static export, design tokens, and Cascadia Code font

### Phase 2: WebGL Canvas Migration
**Goal**: The Mandelbrot fractal background runs entirely within a React Client Component with no SSR exposure, performs acceptably on mobile, and degrades gracefully when WebGL is unavailable
**Depends on**: Phase 1
**Requirements**: WEBGL-01, WEBGL-02, WEBGL-03, WEBGL-04, WEBGL-05, NAV-04
**Success Criteria** (what must be TRUE):
  1. The site builds without `ReferenceError: document is not defined` — Three.js never executes during SSR
  2. Scrolling the page drives the fractal zoom and hue shift without perceptible frame drops on desktop
  3. On a mobile device, the canvas renders at capped pixel ratio and pauses rendering when scrolled off screen
  4. On a browser with WebGL disabled, a CSS gradient background renders in place of the canvas
  5. The elevated terminal aesthetic is visible — dark cards with teal border glow, no Windows 95 chrome
**Plans**: 1 plan

Plans:
- [x] 02-01-PLAN.md — Migrate Three.js Mandelbrot into use client component with scroll animation, fallback, and terminal card class

### Phase 3: Content, Navigation and Layout
**Goal**: All site content is present, all placeholder links are live, the site is fully usable on mobile phones, and section reveal animations work without fragile scroll calculations
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. Clicking GitHub and LinkedIn links in the nav or hero navigates to the correct profiles (tsbradsh, tsbw)
  2. Each project card shows title, description, tech stack, and working repo links — no `href="#"` placeholders remain
  3. A visitor can identify Tyler's name, role, and focus area within 10 seconds of landing on the page
  4. On a phone, all sections are readable and interactive — nothing overflows or breaks layout
  5. The hamburger menu opens, closes, and can be keyboard-navigated correctly on mobile
**Plans**: 3 plans

Plans:
- [ ] 03-01-PLAN.md — Copy assets, add reveal CSS utilities, create useReveal hook and project/skills data
- [ ] 03-02-PLAN.md — Build Nav component with hamburger and wire into layout
- [ ] 03-03-PLAN.md — Build all section components and compose full page

### Phase 4: Contact Form and Accessibility
**Goal**: The contact form accepts and delivers submissions via Netlify Forms, all form inputs meet WCAG 2.1 AA standards, and remaining semantic HTML issues are resolved
**Depends on**: Phase 3
**Requirements**: FORM-01, FORM-02, FORM-03, FORM-04
**Success Criteria** (what must be TRUE):
  1. Submitting the contact form on the live Netlify site results in a submission appearing in the Netlify dashboard
  2. All form fields have visible, correctly associated labels that screen readers can announce
  3. The project dropdown caret is a native button element — no SVG acting as a button
  4. All images on the page have meaningful alt text that describes the image content
**Plans**: TBD

### Phase 5: SEO, Performance and Launch
**Goal**: The deployed site scores 90+ on all four Lighthouse categories, is discoverable by search engines and social sharing, and is confirmed working end-to-end on Netlify
**Depends on**: Phase 4
**Requirements**: SEO-01, SEO-02, PERF-01, PERF-02
**Success Criteria** (what must be TRUE):
  1. Lighthouse desktop audit scores 90 or above across Performance, Accessibility, Best Practices, and SEO
  2. Sharing the portfolio URL on a platform that reads Open Graph tags (e.g., Slack, LinkedIn) renders a correct title, description, and image preview
  3. The page HTML includes a JSON-LD Person entity with Tyler's name, URL, and social profiles
  4. Contact form submission, all navigation links, and all project links resolve correctly on the live Netlify deployment
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure and Foundation | 0/1 | Planning complete | - |
| 2. WebGL Canvas Migration | 1/1 | Complete   | 2026-03-22 |
| 3. Content, Navigation and Layout | 0/3 | Planning complete | - |
| 4. Contact Form and Accessibility | 0/? | Not started | - |
| 5. SEO, Performance and Launch | 0/? | Not started | - |
