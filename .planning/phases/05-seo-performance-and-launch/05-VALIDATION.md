---
phase: 05
slug: seo-performance-and-launch
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 05 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (static export — no unit test framework for SEO/perf) |
| **Config file** | None — Wave 0 not required |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npm run lint` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` — verifies no TypeScript/compile errors introduced
- **After every plan wave:** Run `npm run build && npm run lint` — full static analysis
- **Before `/gsd:verify-work`:** Human UAT checklist complete + Lighthouse 90+ verified on live URL
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | SEO-01 | manual | Inspect `out/index.html` for OG tags after `npm run build` | N/A | ⬜ pending |
| 05-01-02 | 01 | 1 | SEO-02 | manual | Inspect `out/index.html` for JSON-LD script tag | N/A | ⬜ pending |
| 05-01-03 | 01 | 1 | SEO-01 | build-smoke | `npm run build` passes | N/A | ⬜ pending |
| 05-01-04 | 01 | 1 | PERF-01 | manual | Run Lighthouse on live URL | N/A | ⬜ pending |
| 05-01-05 | 01 | 1 | PERF-02 | manual | Execute Netlify UAT checklist | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*No Wave 0 required — no automated test infrastructure to install. All acceptance criteria for this phase are verified by build smoke test + human inspection.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| OG/Twitter meta tags present in built HTML | SEO-01 | Requires browser or HTML inspection of built output | Run `npm run build`, inspect `out/index.html` for `<meta property="og:title">`, `og:image`, `twitter:card` |
| JSON-LD Person entity with correct schema | SEO-02 | Requires structured data validation tool or browser | Inspect `out/index.html` for `<script type="application/ld+json">` with correct name/jobTitle/sameAs; validate at search.google.com/test/rich-results |
| Lighthouse 90+ on live URL | PERF-01 | Requires Chrome DevTools / PageSpeed Insights on deployed site | Run Lighthouse on `https://tylerbradshaw.dev` in Chrome; all four categories must score 90+ |
| Netlify end-to-end verification | PERF-02 | Requires live deployment and manual interaction | Execute UAT checklist: site loads, form submits, nav links resolve, project links resolve, OG preview renders |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
