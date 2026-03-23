# Requirements: Tyler Bradshaw Portfolio

**Defined:** 2026-03-21
**Core Value:** The portfolio must signal technical competence and design sensibility simultaneously — the WebGL fractal and terminal identity must coexist with professional polish that holds up to recruiter scrutiny.

## v1 Requirements

### Foundation

- [x] **FOUND-01**: Project scaffolds as Next.js 15 App Router with TypeScript and `output: 'export'` configured for Netlify static hosting
- [x] **FOUND-02**: CSS Modules design token system established (color, spacing, typography custom properties)
- [x] **FOUND-03**: Cascadia Code font loaded via `next/font/local` with correct fallback stack (Consolas, monospace)

### WebGL

- [x] **WEBGL-01**: Three.js migrated from CDN script tag to npm package, isolated in a `'use client'` component initialized inside `useEffect`
- [x] **WEBGL-02**: Mandelbrot fragment shader preserved with full TypeScript types; renderer, geometry, and material disposed in `useEffect` cleanup
- [x] **WEBGL-03**: Scroll-driven zoom and hue animation implemented via rAF-throttled scroll context (replacing unthrottled scroll listener)
- [x] **WEBGL-04**: WebGL graceful fallback renders CSS gradient background on non-capable browsers and devices
- [x] **WEBGL-05**: Adaptive quality implemented: device pixel ratio capped at 1.5 on mobile, canvas animation paused via Intersection Observer when off-screen

### Content & Links

- [ ] **CONT-01**: All placeholder links replaced with real URLs: GitHub (https://github.com/tsbradsh), LinkedIn (https://www.linkedin.com/in/tsbw/), When You Sleep repo (https://github.com/tsbradsh/lucid-eye), Red Clover repo (https://github.com/tsbradsh/Final-Project)
- [ ] **CONT-02**: Each project card displays title, plain-English description (2–3 sentences), tech stack used, and available links (GitHub repo, live URL where applicable)
- [ ] **CONT-03**: Identity/about section clearly communicates Tyler's name, role, and what he builds within 10 seconds of landing
- [ ] **CONT-04**: Skills section grouped by category (Languages / Frameworks / Tools) listing only production-ready skills

### Navigation & Layout

- [ ] **NAV-01**: Layout is fully responsive and functional on mobile phones (fixes current broken mobile layout)
- [ ] **NAV-02**: Hamburger navigation opens, closes, and keyboard-navigates correctly on mobile
- [ ] **NAV-03**: Section reveal animations implemented via Intersection Observer (replacing fragile `offsetTop` calculations)
- [x] **NAV-04**: Elevated terminal aesthetic applied — minimal dark cards with subtle teal border glow, no Windows 95 title bar chrome

### Contact & Accessibility

- [x] **FORM-01**: Contact form submits correctly via Netlify Forms with static Next.js export (hidden seed form in `public/` for Netlify bot detection)
- [x] **FORM-02**: All form inputs have visible `<label>` elements paired via `for` attribute (WCAG 2.1 AA compliance)
- [x] **FORM-03**: Project dropdown caret replaced with native `<button>` element (removes `<svg role="button">` pattern)
- [x] **FORM-04**: All images have meaningful `alt` text

### SEO & Performance

- [x] **SEO-01**: Next.js Metadata API configured with page title, meta description, and Open Graph tags (title, description, image, URL)
- [x] **SEO-02**: JSON-LD structured data added for Person entity (name, URL, social profiles)
- [x] **PERF-01**: Lighthouse scores 90+ across all four categories (Performance, Accessibility, Best Practices, SEO) on desktop
- [x] **PERF-02**: Netlify static deployment verified working end-to-end: site loads, form submits, all links resolve

## v2 Requirements

### Resume

- **RESUME-01**: Resume PDF downloadable directly from site
- **RESUME-02**: Resume link in nav and contact section activated

### AI Music Tool

- **AI-01**: AI Music Collaboration Tool live demo URL linked once project is deployed

### Analytics

- **ANAL-01**: Privacy-respecting analytics (Plausible or similar) to track visitor sources
- **ANAL-02**: Conversion event tracking on contact form submissions

### Advanced Polish

- **ADV-01**: Dark/light mode toggle
- **ADV-02**: Reduced motion preference respected for scroll animations and WebGL

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend / authentication | Static portfolio — no user accounts needed |
| Real-time features | Not relevant to portfolio purpose |
| Mobile-native app | Web-first only |
| Auto-playing audio/video | Anti-feature — hurts hirability |
| Cookie consent / analytics banners | No GDPR-requiring analytics planned for v1 |
| Resume PDF | User will add when available (v2) |
| AI Music Tool live URL | Not available until next project (v2) |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Complete |
| FOUND-02 | Phase 1 | Complete |
| FOUND-03 | Phase 1 | Complete |
| WEBGL-01 | Phase 2 | Complete |
| WEBGL-02 | Phase 2 | Complete |
| WEBGL-03 | Phase 2 | Complete |
| WEBGL-04 | Phase 2 | Complete |
| WEBGL-05 | Phase 2 | Complete |
| NAV-04 | Phase 2 | Complete |
| CONT-01 | Phase 3 | Pending |
| CONT-02 | Phase 3 | Pending |
| CONT-03 | Phase 3 | Pending |
| CONT-04 | Phase 3 | Pending |
| NAV-01 | Phase 3 | Pending |
| NAV-02 | Phase 3 | Pending |
| NAV-03 | Phase 3 | Pending |
| FORM-01 | Phase 4 | Complete |
| FORM-02 | Phase 4 | Complete |
| FORM-03 | Phase 4 | Complete |
| FORM-04 | Phase 4 | Complete |
| SEO-01 | Phase 5 | Complete |
| SEO-02 | Phase 5 | Complete |
| PERF-01 | Phase 5 | Complete |
| PERF-02 | Phase 5 | Complete |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 24
- Unmapped: 0

---
*Requirements defined: 2026-03-21*
*Last updated: 2026-03-21 after roadmap creation*
