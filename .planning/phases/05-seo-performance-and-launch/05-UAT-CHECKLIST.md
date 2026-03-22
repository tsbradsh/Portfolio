# Phase 05 — UAT Checklist (Live Netlify Deployment)

**Date:** 2026-03-22
**Target URL:** https://tylerbradshaw.dev

## Pre-Deployment

- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes
- [ ] `out/` directory contains: index.html, og-image.png, sitemap.xml, robots.txt

## Site Loading

- [ ] https://tylerbradshaw.dev loads without errors
- [ ] WebGL Mandelbrot fractal renders as background
- [ ] Cascadia Code font loads (no fallback flash visible)
- [ ] All terminal card sections are visible on scroll

## Navigation Links

- [ ] GitHub link resolves to https://github.com/tsbradsh
- [ ] LinkedIn link resolves to https://www.linkedin.com/in/tsbw/
- [ ] All nav section anchors scroll to correct sections
- [ ] Hamburger menu works on mobile viewport

## Project Links

- [ ] When You Sleep repo link resolves to https://github.com/tsbradsh/lucid-eye
- [ ] Red Clover repo link resolves to https://github.com/tsbradsh/Final-Project
- [ ] No href="#" placeholder links remain

## Contact Form

- [ ] Contact form fields accept input (name, email, message)
- [ ] Form submission succeeds (check Netlify dashboard for new submission)
- [ ] Validation prevents empty submissions
- [ ] Honeypot field is hidden from visual users

## SEO / Open Graph

- [ ] Test URL at https://www.opengraph.xyz/url/https%3A%2F%2Ftylerbradshaw.dev — title, description, and image preview render correctly
- [ ] Page source contains <meta property="og:title"> with "Tyler Bradshaw"
- [ ] Page source contains <meta property="og:image"> with full URL to og-image.png
- [ ] Page source contains <script type="application/ld+json"> with Person schema
- [ ] https://tylerbradshaw.dev/sitemap.xml loads valid XML
- [ ] https://tylerbradshaw.dev/robots.txt loads with correct content

## Lighthouse Audit

- [ ] Run Chrome Lighthouse on https://tylerbradshaw.dev (Desktop mode)
- [ ] Performance score: 90+
- [ ] Accessibility score: 90+
- [ ] Best Practices score: 90+
- [ ] SEO score: 90+

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
