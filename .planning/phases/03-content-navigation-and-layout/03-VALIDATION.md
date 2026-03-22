---
phase: 3
slug: content-navigation-and-layout
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None installed — manual browser verification only |
| **Config file** | None |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx serve out` |
| **Estimated runtime** | ~30 seconds (build) + manual browser check |

---

## Sampling Rate

- **After every task commit:** Run `npm run build` — confirms TypeScript compiles, no broken imports, no ESLint errors
- **After every plan wave:** Run `npm run build && npx serve out` — verify static export renders correctly in browser
- **Before `/gsd:verify-work`:** Full manual browser checklist must be complete
- **Max feedback latency:** 30 seconds (build gate)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| CONT-01 | TBD | TBD | CONT-01 | manual | Inspect `<a href>` in devtools | ❌ manual | ⬜ pending |
| CONT-02 | TBD | TBD | CONT-02 | manual | Visual inspection at `/` | ❌ manual | ⬜ pending |
| CONT-03 | TBD | TBD | CONT-03 | manual | Load `http://localhost:3000` | ❌ manual | ⬜ pending |
| CONT-04 | TBD | TBD | CONT-04 | manual | Visual inspection at `#skills` | ❌ manual | ⬜ pending |
| NAV-01 | TBD | TBD | NAV-01 | manual | Chrome devtools mobile emulation (375px) | ❌ manual | ⬜ pending |
| NAV-02 | TBD | TBD | NAV-02 | manual | Keyboard + touch test (Esc, Tab, link tap) | ❌ manual | ⬜ pending |
| NAV-03 | TBD | TBD | NAV-03 | manual | Scroll page, observe fade+drift transitions | ❌ manual | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

No automated test framework — this is acceptable for a portfolio with purely visual/interactive requirements. `npm run build` (TypeScript + ESLint strictness) serves as the automated structural gate.

*All phase behaviors require manual browser verification.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Nav links resolve to correct profiles | CONT-01 | Href values only verifiable visually | Click GitHub → github.com/tsbradsh; LinkedIn → linkedin.com/in/tsbw |
| Project cards render title, desc, tech, links | CONT-02 | Visual layout check | Inspect each card at desktop + mobile widths |
| Hero identity visible within 10s | CONT-03 | Perceptual/timing check | Cold load, observe above-fold content |
| Skills section categories correct | CONT-04 | Content accuracy check | Compare rendered skills vs locked list |
| Mobile layout unbroken at 375px | NAV-01 | Responsive layout check | Chrome devtools → iPhone SE viewport |
| Hamburger keyboard navigation | NAV-02 | Interactive behavior | Tab to hamburger, Enter open, Esc close, Tab through links |
| Section reveal animations | NAV-03 | Animation timing/direction | Scroll slowly, observe fade + translateY on entry/exit |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify (`npm run build`) or manual instructions
- [ ] Build gate applied after every task commit
- [ ] Full browser check applied after every wave
- [ ] No watch-mode flags
- [ ] `nyquist_compliant: true` set in frontmatter when complete

**Approval:** pending
