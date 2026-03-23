---
phase: 05-seo-performance-and-launch
plan: "02"
subsystem: infra
tags: [lighthouse, performance, uat, netlify, deployment, seo]

requires:
  - phase: 05-01
    provides: SEO metadata, OG image, sitemap.xml, robots.txt all present in out/

provides:
  - PERF-01 (Lighthouse 90+ verified on live deployment)
  - PERF-02 (Netlify E2E verification — all flows confirmed working)
  - UAT checklist document for phase 05

affects: []

tech-stack:
  added: []
  patterns:
    - "UAT checklist as .md artifact in phase directory alongside PLAN/SUMMARY"
    - "Netlify Forms seed via public/contact.html for bot detection in static export"
    - "trailingSlash: true in next.config.ts for Netlify path compatibility"

key-files:
  created:
    - .planning/phases/05-seo-performance-and-launch/05-UAT-CHECKLIST.md
  modified:
    - next.config.ts
    - app/components/ContactForm.tsx
    - public/contact.html
    - public/og-image.png

key-decisions:
  - "Enabled trailingSlash: true in next.config.ts — required for Netlify to resolve /index.html paths correctly"
  - "Netlify Forms detection fixed by adding explicit seed form to public/contact.html with matching field names"
  - "OG image re-cropped with corrected portrait offset to center Tyler's face in 1200x630 frame"
  - "WebP images converted to PNG/JPG for broad compatibility after Netlify served unexpected MIME types"

patterns-established:
  - "UAT checklist lives in phase directory as 05-UAT-CHECKLIST.md — one file per phase with live URL target"

requirements-completed: [PERF-01, PERF-02]

duration: "~60min (including UAT iteration rounds)"
completed: "2026-03-22"
---

# Phase 05 Plan 02: Performance Audit and Netlify UAT Summary

**Lighthouse 99 Performance score, Netlify Forms working, OG preview verified, and all nav/project links confirmed live at tylerbradshaw.dev after four UAT fix rounds.**

## Performance

- **Duration:** ~60 min (including iterative UAT fixes)
- **Started:** 2026-03-22
- **Completed:** 2026-03-22
- **Tasks:** 2 (Task 1 auto, Task 2 human-verify checkpoint — approved)
- **Files modified:** 5

## Accomplishments

- Local pre-check passed: `npm run build` clean, UAT checklist created at `.planning/phases/05-seo-performance-and-launch/05-UAT-CHECKLIST.md`
- All UAT checklist items verified on live Netlify deployment at https://tylerbradshaw.dev
- Lighthouse Desktop: Performance 99, Accessibility 90+, Best Practices 90+, SEO 90+
- Contact form submissions captured in Netlify Forms dashboard (after DNS/seed form fix)
- OG preview renders correctly with title, description, and portrait image
- All navigation links, section anchors, and project repo links resolve without 404s

## Task Commits

Each task was committed atomically:

1. **Task 1: Local pre-check and UAT checklist creation** - `5f8373c` (feat)
2. **Task 2: Human UAT — checkpoint approved** - (human verification, no code commit)

**UAT fix round commits (deviation work during human verification):**
- `b7e47c9` — fix(05-02): resolve UAT failures — Netlify form config, WebP images, OG rotation
- `c13306c` — fix(05-02): round 2 UAT fixes — form detection, portrait size, OG centering
- `2319cfb` — fix(05-02): form detection via _forms.html, explicit URLSearchParams, OG offset split
- `1bc40db` — fix(05-02): cache-bust OG image rename + corrected crop offset

## Files Created/Modified

- `.planning/phases/05-seo-performance-and-launch/05-UAT-CHECKLIST.md` - Human-executable UAT checklist targeting tylerbradshaw.dev
- `next.config.ts` - Added `trailingSlash: true` for Netlify path compatibility
- `app/components/ContactForm.tsx` - Fixed URLSearchParams submission format for Netlify Forms detection
- `public/contact.html` - Seed form added so Netlify build bot registers the form during static export
- `public/og-image.png` - Re-cropped with corrected vertical offset to center portrait

## Decisions Made

- **trailingSlash: true** — Netlify requires trailing slashes to correctly serve Next.js static export paths without 404s on direct navigation
- **Seed form in public/contact.html** — Netlify's build bot must find a static HTML form during the build scan; the React AJAX form is invisible to the bot, so a matching seed form in `/public` is required
- **OG image re-crop** — Initial crop cut off Tyler's face; corrected by splitting the sharp `top` offset from `left` and using the correct portrait center coordinates
- **WebP to PNG/JPG conversion** — Some project screenshots were WebP; converted to ensure broad browser and Slack/LinkedIn OG preview compatibility

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Netlify Forms not receiving submissions**
- **Found during:** Task 2 (Human UAT)
- **Issue:** Contact form submissions were not appearing in Netlify dashboard; form name mismatch between React component and seed form
- **Fix:** Added `public/contact.html` with matching field names and `netlify` attribute; updated `ContactForm.tsx` URLSearchParams to include `form-name` field
- **Files modified:** app/components/ContactForm.tsx, public/contact.html
- **Commit:** b7e47c9, 2319cfb

**2. [Rule 1 - Bug] OG image portrait cropped incorrectly**
- **Found during:** Task 2 (Human UAT — OG preview check)
- **Issue:** OG image showed top of head and background, not Tyler's face
- **Fix:** Re-ran sharp resize with corrected `top` offset to center the face in the 1200x630 crop
- **Files modified:** public/og-image.png
- **Commit:** c13306c, 1bc40db

**3. [Rule 3 - Blocking] trailingSlash required for Netlify path resolution**
- **Found during:** Task 2 (Human UAT — direct URL navigation)
- **Issue:** Navigating directly to page paths returned 404 on Netlify without trailing slash config
- **Fix:** Added `trailingSlash: true` to `next.config.ts`
- **Files modified:** next.config.ts
- **Commit:** a4d6021

---

**Total deviations:** 3 auto-fixed (2 bugs, 1 blocking)
**Impact on plan:** All fixes essential for the UAT to pass. Netlify Forms, OG image quality, and path resolution are core launch-gate items per PERF-02.

## Issues Encountered

- Netlify Forms detection required four iteration rounds across the UAT window — the interaction between Next.js static export, AJAX form submission, and Netlify's build-time form scan is non-obvious and not documented in Next.js guides
- OG image crop offset was trial-and-error; sharp's `top`/`left` split syntax resolved it

## User Setup Required

None — no external service configuration required beyond what was already set up in Phase 04 (Netlify site connected to GitHub main branch).

## Next Phase Readiness

Phase 05 is the final phase. All success criteria are met:

1. Lighthouse 99 Performance (exceeds 90+ target)
2. OG preview verified on opengraph.xyz — title, description, and portrait render correctly
3. JSON-LD Person entity present in page source (delivered by Phase 05 Plan 01)
4. Contact form, all navigation links, and all project links confirmed working on live Netlify deployment

**Portfolio is launch-ready. No further phases planned.**

## Known Stubs

None — all content is live, all links resolve, all form submissions reach the Netlify dashboard.

## Self-Check: PASSED

- .planning/phases/05-seo-performance-and-launch/05-02-SUMMARY.md: FOUND
- commit 5f8373c (Task 1): FOUND
- commit 1bc40db (UAT fix round 4): FOUND

---
*Phase: 05-seo-performance-and-launch*
*Completed: 2026-03-22*
