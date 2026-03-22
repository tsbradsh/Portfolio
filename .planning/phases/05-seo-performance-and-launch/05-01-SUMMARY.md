---
phase: 05-seo-performance-and-launch
plan: "01"
subsystem: seo
tags: [seo, metadata, open-graph, json-ld, sitemap, robots]
dependency_graph:
  requires: []
  provides: [SEO-01, SEO-02]
  affects: [app/layout.tsx, app/components/JsonLd.tsx, public/og-image.png, public/sitemap.xml, public/robots.txt]
tech_stack:
  added: []
  patterns: [Next.js Metadata API, Schema.org Person JSON-LD, dangerouslySetInnerHTML XSS mitigation]
key_files:
  created:
    - app/components/JsonLd.tsx
    - public/og-image.png
    - public/sitemap.xml
    - public/robots.txt
  modified:
    - app/layout.tsx
decisions:
  - "Used sharp (Next.js transitive dep) via Node one-liner instead of sharp-cli to avoid version ambiguity"
  - "JsonLd extracted to dedicated component per plan spec for future reuse"
  - "og-image.png generated with fit=cover position=center crop from Ty.jpg portrait"
metrics:
  duration: "2 minutes"
  completed: "2026-03-22"
  tasks: 2
  files: 5
---

# Phase 05 Plan 01: SEO Metadata and Static Files Summary

**One-liner:** Full SEO metadata stack added — Open Graph, Twitter card, JSON-LD Person schema, sitemap.xml, robots.txt, and 1200x630 OG image via sharp.

## What Was Built

Extended `app/layout.tsx` with a complete Next.js Metadata API export including `metadataBase`, `openGraph`, `twitter`, `alternates.canonical`, and `robots`. Created a `JsonLd.tsx` Server Component rendering a Schema.org Person entity with XSS mitigation. Generated `public/og-image.png` by resizing `Ty.jpg` to 1200x630 PNG via sharp. Authored `public/sitemap.xml` (single canonical URL) and `public/robots.txt` (allow all crawlers, sitemap reference). All five files verified present in `out/` after `next build`.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Extend layout.tsx metadata and add JsonLd component | 846db88 | app/layout.tsx, app/components/JsonLd.tsx |
| 2 | Create OG image, sitemap.xml, and robots.txt | aa2450e | public/og-image.png, public/sitemap.xml, public/robots.txt |

## Verification

Build output confirms:
- `out/index.html` contains: `og:title`, `og:description`, `og:url`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `og:type`, `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`, `canonical`, `application/ld+json`
- `out/og-image.png` — 1.3MB PNG at 1200x630
- `out/sitemap.xml` — lists `https://tylerbradshaw.dev/`
- `out/robots.txt` — `User-agent: *`, `Allow: /`, `Sitemap:` reference

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written, except:

**1. [Rule 3 - Pragmatic] Used sharp Node API instead of sharp-cli**
- **Found during:** Task 2
- **Issue:** Research noted sharp-cli v5 syntax uncertainty; sharp is a transitive Next.js dependency already available
- **Fix:** Used `node -e "require('sharp')..."` one-liner directly — same result, no version ambiguity
- **Files modified:** None (just the generation method; output is identical)
- **Commit:** aa2450e

## Known Stubs

None — all metadata values are real and fully wired. OG image is the actual developer portrait.

## Self-Check: PASSED

- app/components/JsonLd.tsx: FOUND
- app/layout.tsx (metadataBase): FOUND
- public/og-image.png: FOUND
- public/sitemap.xml: FOUND
- public/robots.txt: FOUND
- commit 846db88: FOUND
- commit aa2450e: FOUND
- out/index.html og:title: FOUND
- out/index.html twitter:card: FOUND
- out/index.html application/ld+json: FOUND
- out/og-image.png: FOUND
- out/sitemap.xml: FOUND
- out/robots.txt: FOUND
