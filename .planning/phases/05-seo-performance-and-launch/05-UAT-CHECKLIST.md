# Phase 05 — UAT Checklist (Live Netlify Deployment)

**Date:** 2026-03-22
**Target URL:** https://tylerbradshaw.dev

## Pre-Deployment

- [x] `npm run build` completes without errors
- [x] `npm run lint` passes
- [x] `out/` directory contains: index.html, og-image.png, sitemap.xml, robots.txt

## Site Loading

- [x] https://tylerbradshaw.dev loads without errors
- [x] WebGL Mandelbrot fractal renders as background
- [x] Cascadia Code font loads (no fallback flash visible)
- [x] All terminal card sections are visible on scroll

## Navigation Links

- [x] GitHub link resolves to https://github.com/tsbradsh
- [x] LinkedIn link resolves to https://www.linkedin.com/in/tsbw/
- [x] All nav section anchors scroll to correct sections
- [x] Hamburger menu works on mobile viewport

## Project Links

- [x] When You Sleep repo link resolves to https://github.com/tsbradsh/lucid-eye
- [x] Red Clover repo link resolves to https://github.com/tsbradsh/Final-Project
- [x] No href="#" placeholder links remain

## Contact Form

- [x] Contact form fields accept input (name, email, message)
- [ ] Form submission succeeds (check Netlify dashboard for new submission)
- [x] Validation prevents empty submissions
- [x] Honeypot field is hidden from visual users

## SEO / Open Graph

- [x] Test URL at https://www.opengraph.xyz/url/https%3A%2F%2Ftylerbradshaw.dev — title, description, and image preview render correctly
- [x] Page source contains <meta property="og:title"> with "Tyler Bradshaw"
- [x] Page source contains <meta property="og:image"> with full URL to og-image.png
- [x] Page source contains <script type="application/ld+json"> with Person schema
- [x] https://tylerbradshaw.dev/sitemap.xml loads valid XML
- [x] https://tylerbradshaw.dev/robots.txt loads with correct content

## Lighthouse Audit

- [x] Run Chrome Lighthouse on https://tylerbradshaw.dev (Desktop mode)
- [x] Performance score: 90+
- [x] Accessibility score: 90+
- [x] Best Practices score: 90+
- [x] SEO score: 90+

## Sign-Off

- [ ] All checks above pass
- [ ] Phase 05 complete — portfolio is launch-ready

---

## Notes (Pre-Deployment Findings)

**Local build status:** `npm run build` passes cleanly (TypeScript + static export confirmed).

**Meta tags verified in out/index.html:**
- `og:title` — present
- `og:image` — present (8 references including width/height/alt)
- `twitter:card` — present
- `application/ld+json` — present (Person schema)
- `rel="preload"` — present (7 preload hints, including Cascadia Code font via next/font/local)

**Image sizes (potential optimization targets — manual action required if Lighthouse Performance < 90):**
- `public/assets/1x/Ty.jpg` — 4.3 MB (source portrait; og-image.png already cropped to 1200x630)
- `public/assets/wys/mockup.png` — 1.7 MB
- `public/assets/wys/wys.png` — 1.5 MB
- `public/assets/AI/Wireframe.png` — 673 KB
- `public/assets/RCSS/Home.png` — 645 KB
- `public/assets/wys/wireframe.jpg` — 642 KB

Per D-16: `next/image` is not usable with static export. If Lighthouse Performance misses 90+ due to image sizes, manual optimization (e.g., converting PNGs to WebP via sharp) is the remediation path.
