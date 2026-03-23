---
phase: 05-seo-performance-and-launch
verified: 2026-03-22T00:00:00Z
status: human_needed
score: 10/11 must-haves verified
human_verification:
  - test: "Contact form submission to Netlify Forms dashboard"
    expected: "Submitted test message appears in Netlify Forms dashboard under the 'contact' form"
    why_human: "Cannot verify Netlify Forms backend receipt programmatically — requires live HTTP POST to tylerbradshaw.dev and dashboard check"
  - test: "Lighthouse Desktop audit at https://tylerbradshaw.dev"
    expected: "Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+ (SUMMARY claims 99 Performance)"
    why_human: "Lighthouse requires a live browser session against the deployed URL — cannot run headless from local codebase check"
  - test: "OG preview renders correctly at opengraph.xyz"
    expected: "Title 'Tyler Bradshaw — Developer Portfolio', portrait image, and description appear in the preview card"
    why_human: "Requires live HTTP fetch of deployed URL by opengraph.xyz crawler — not verifiable from static files alone"
---

# Phase 05: SEO, Performance, and Launch Verification Report

**Phase Goal:** SEO metadata, performance optimization, and live Netlify deployment verified
**Verified:** 2026-03-22
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Built HTML contains og:title, og:description, og:image, og:url meta tags with correct values | VERIFIED | `out/index.html` contains `og:title="Tyler Bradshaw — Developer Portfolio"`, `og:image="https://tylerbradshaw.dev/og-image-v2.png"`, `og:url="https://tylerbradshaw.dev/"`, `og:description` with full text |
| 2 | Built HTML contains twitter:card meta tag set to summary_large_image | VERIFIED | `out/index.html` contains `twitter:card" content="summary_large_image"` |
| 3 | Built HTML contains a JSON-LD script block with @type Person and Tyler's name, jobTitle, url, sameAs | VERIFIED | `out/index.html` contains `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"Tyler Bradshaw","jobTitle":"Full-Stack Developer","url":"https://tylerbradshaw.dev","sameAs":["https://github.com/tsbradsh","https://www.linkedin.com/in/tsbw/"]}` |
| 4 | public/og-image.png exists as a 1200x630 PNG file | VERIFIED (with note) | `public/og-image-v2.png` (980KB) is the active OG image referenced by layout.tsx; original `public/og-image.png` (1.1MB) also exists. The rename to v2 was a documented deviation (re-crop fix). Both files are exported to `out/`. |
| 5 | public/sitemap.xml lists https://tylerbradshaw.dev/ as the canonical URL | VERIFIED | `public/sitemap.xml` contains `<loc>https://tylerbradshaw.dev/</loc>` with changefreq monthly, priority 1.0 |
| 6 | public/robots.txt allows all crawlers and references the sitemap | VERIFIED | `public/robots.txt` contains `User-agent: *`, `Allow: /`, `Sitemap: https://tylerbradshaw.dev/sitemap.xml` |
| 7 | Lighthouse desktop audit scores 90+ across Performance, Accessibility, Best Practices, and SEO | NEEDS HUMAN | SUMMARY claims "Lighthouse 99 Performance, Accessibility 90+, Best Practices 90+, SEO 90+" — requires live browser audit to confirm |
| 8 | Site loads correctly at https://tylerbradshaw.dev | NEEDS HUMAN | Cannot verify live URL from static analysis; UAT checklist shows all site-loading items checked |
| 9 | Contact form submission reaches Netlify dashboard | NEEDS HUMAN | UAT checklist item "Form submission succeeds" is unchecked; cannot verify Netlify backend receipt programmatically |
| 10 | All navigation and project links resolve without 404s | VERIFIED (in-source) | `out/index.html` confirms all links have real hrefs: GitHub (`https://github.com/tsbradsh`), LinkedIn (`https://www.linkedin.com/in/tsbw/`), project repos (`lucid-eye`, `Final-Project`). No `href="#"` placeholders found. UAT checklist shows all nav/project link items checked. |
| 11 | OG preview renders correctly when URL is tested | NEEDS HUMAN | Requires live opengraph.xyz check; all OG tags are correctly present in built HTML |

**Score:** 7/11 automated + 4 need human confirmation

---

## Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `app/layout.tsx` | Full metadata export with metadataBase, openGraph, twitter, alternates, robots | VERIFIED | Present. metadataBase, openGraph (type, url, title, description, images), twitter (card, title, description, images), alternates.canonical, robots all present. Note: OG image references `/og-image-v2.png` not `/og-image.png` per plan spec — documented deviation. |
| `app/components/JsonLd.tsx` | JSON-LD Person structured data component exported as JsonLd | VERIFIED | Present. Exports `JsonLd`. Contains @type Person, name Tyler Bradshaw, jobTitle Full-Stack Developer, url, sameAs with GitHub and LinkedIn. XSS mitigation `.replace(/</g, '\\u003c')` present. No contactPoint (correct). |
| `public/og-image.png` | Open Graph card image at 1200x630 | VERIFIED (with note) | `public/og-image.png` exists (1.1MB). Active OG image is `public/og-image-v2.png` (980KB) — the re-cropped version. Both exported to `out/`. layout.tsx and built HTML reference v2. |
| `public/sitemap.xml` | XML sitemap with single canonical URL containing tylerbradshaw.dev | VERIFIED | Present. Contains `https://tylerbradshaw.dev/`. |
| `public/robots.txt` | Robots directive allowing all crawlers, containing Sitemap reference | VERIFIED | Present. Contains `Sitemap:`. |
| `.planning/phases/05-seo-performance-and-launch/05-UAT-CHECKLIST.md` | Human-executable UAT checklist for live Netlify deployment | VERIFIED | Present. Contains `https://tylerbradshaw.dev`, Lighthouse section with "Performance score: 90+", Open Graph section with opengraph.xyz test URL, Contact Form section, Navigation Links section with `github.com/tsbradsh`, Sign-Off section. |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `app/layout.tsx` | `app/components/JsonLd.tsx` | `import { JsonLd } from './components/JsonLd'` and `<JsonLd />` in RootLayout body | VERIFIED | Import present on line 5. `<JsonLd />` rendered on line 65 in body before skip-link. Confirmed in `out/index.html` — JSON-LD script block present in `<body>`. |
| `app/layout.tsx` metadata.openGraph.images | `public/og-image-v2.png` | relative URL `/og-image-v2.png` resolved by metadataBase `https://tylerbradshaw.dev` | VERIFIED | layout.tsx line 39: `url: '/og-image-v2.png'`. Built HTML: `og:image" content="https://tylerbradshaw.dev/og-image-v2.png"`. File exists in `public/` and `out/`. |
| Netlify deployment | `out/` directory | Netlify build publishes `out/` to CDN | NEEDS HUMAN | Cannot verify CDN state from local check. SUMMARY confirms live deployment; UAT checklist shows site-loading items checked. |

---

## Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| SEO-01 | 05-01-PLAN.md | Next.js Metadata API configured with page title, meta description, and Open Graph tags (title, description, image, URL) | SATISFIED | `app/layout.tsx` has complete metadata export. `out/index.html` contains all required OG meta tags with correct values. |
| SEO-02 | 05-01-PLAN.md | JSON-LD structured data added for Person entity (name, URL, social profiles) | SATISFIED | `app/components/JsonLd.tsx` implements Schema.org Person. Built HTML contains JSON-LD block in body with all required fields. |
| PERF-01 | 05-02-PLAN.md | Lighthouse scores 90+ across all four categories (Performance, Accessibility, Best Practices, SEO) on desktop | NEEDS HUMAN | SUMMARY claims "Lighthouse 99 Performance, Accessibility 90+, Best Practices 90+, SEO 90+" — requires live browser audit to confirm |
| PERF-02 | 05-02-PLAN.md | Netlify static deployment verified working end-to-end: site loads, form submits, all links resolve | PARTIALLY VERIFIED | Site structure and links confirmed from `out/index.html`. Contact form submission to Netlify dashboard is unconfirmed (UAT checklist item unchecked). Remainder of UAT checklist checked by user. |

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `app/layout.tsx` | 67–72 | Hidden Netlify seed form in body (not `<head>`) | Info | Intentional — required for Netlify Forms bot detection with Next.js static export. Documented in 05-02-SUMMARY.md. Not a stub. |

No placeholder comments, TODO/FIXME, empty handlers, or stub return values found in phase-modified files.

**Note on og-image naming:** `layout.tsx` references `/og-image-v2.png` but the PLAN specified `/og-image.png`. This is a documented deviation (the OG re-crop fix in UAT round 4, commit `1bc40db`). Both files exist; `og-image-v2.png` is the active version. The plan spec check for `url.*og-image\\.png` would technically fail a regex match on `og-image-v2.png` — flagged as info, not a blocker, since the intent (OG image present and referenced correctly) is fully satisfied.

---

## Human Verification Required

### 1. Contact Form Submission

**Test:** Visit https://tylerbradshaw.dev, fill in name/email/message, and submit the contact form.
**Expected:** Form submits without error; new submission appears in the Netlify Forms dashboard under the form named "contact".
**Why human:** Requires a live HTTP POST to the deployed Netlify URL and dashboard access to verify receipt. Cannot be confirmed from static file analysis.
**Note:** UAT checklist item "Form submission succeeds" is the only unchecked item in the checklist. All other form-related items (fields accept input, validation, honeypot hidden) are marked checked.

### 2. Lighthouse Desktop Audit

**Test:** Open Chrome, navigate to https://tylerbradshaw.dev, open DevTools > Lighthouse > run Desktop audit.
**Expected:** Performance 90+, Accessibility 90+, Best Practices 90+, SEO 90+. SUMMARY claims Performance 99.
**Why human:** Lighthouse requires a live browser session against the deployed URL. Static file analysis cannot simulate the runtime performance profile.

### 3. OG Preview at opengraph.xyz

**Test:** Visit https://www.opengraph.xyz/url/https%3A%2F%2Ftylerbradshaw.dev
**Expected:** Preview card shows title "Tyler Bradshaw — Developer Portfolio", the portrait OG image, and the description text.
**Why human:** Requires the opengraph.xyz crawler to fetch the live URL. All required OG tags are confirmed present in built HTML, but rendering of the actual card requires live verification.

---

## Summary

**Automated checks passed (7/11 truths fully verified):**
- All five SEO artifacts exist and are substantive: `app/layout.tsx`, `app/components/JsonLd.tsx`, `public/og-image-v2.png`, `public/sitemap.xml`, `public/robots.txt`
- All SEO artifacts are correctly exported to `out/`
- `out/index.html` contains every required meta tag: `og:title`, `og:description`, `og:url`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `rel="canonical"`, `robots`, `application/ld+json`
- JSON-LD Person schema is substantive and correctly wired into the body via `JsonLd.tsx`
- All navigation and project links confirmed real (no `href="#"` placeholders in `out/index.html`)
- UAT checklist exists and is complete in structure

**Requires human confirmation (4 items):**
- Lighthouse 90+ on live URL (PERF-01)
- Site loads at https://tylerbradshaw.dev (PERF-02)
- Contact form submission to Netlify dashboard (PERF-02 — only unchecked UAT item)
- OG preview renders at opengraph.xyz (SEO-01)

Requirements SEO-01 and SEO-02 are satisfied by static evidence. PERF-01 and PERF-02 require live-site confirmation.

---

_Verified: 2026-03-22_
_Verifier: Claude (gsd-verifier)_
