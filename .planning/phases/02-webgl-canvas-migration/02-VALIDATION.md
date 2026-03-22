---
phase: 2
slug: webgl-canvas-migration
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest (via Next.js) |
| **Config file** | vitest.config.ts or none — Wave 0 installs |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx playwright test` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npx playwright test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | WEBGL-01 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 2-01-02 | 01 | 1 | WEBGL-02 | build+manual | `npm run build` | ❌ W0 | ⬜ pending |
| 2-01-03 | 01 | 1 | WEBGL-03 | manual | — | N/A | ⬜ pending |
| 2-01-04 | 01 | 2 | WEBGL-04 | manual | — | N/A | ⬜ pending |
| 2-01-05 | 01 | 2 | WEBGL-05 | build | `npm run build` | ❌ W0 | ⬜ pending |
| 2-01-06 | 01 | 2 | NAV-04 | build | `npm run build` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `app/components/__tests__/MandelbrotCanvas.test.tsx` — stubs for WEBGL-01, WEBGL-02, WEBGL-05
- [ ] Build passes without SSR errors — WEBGL-01 gate

*Existing infrastructure: Next.js build is the primary automated gate. No additional test runner required for this phase.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Scroll drives fractal zoom/hue shift | WEBGL-02 | Requires browser animation inspection | Open dev build, scroll slowly, observe canvas uniform changes in real time |
| Mobile canvas pauses off-screen | WEBGL-03 | Requires mobile device or DevTools throttle | Use Chrome DevTools mobile emulation, scroll canvas out of view, verify rAF stops |
| WebGL disabled fallback gradient | WEBGL-04 | Requires browser WebGL disabled | Open chrome://flags, disable WebGL, reload page, verify CSS gradient renders |
| Terminal aesthetic visible | NAV-04 (visual) | Subjective visual check | Verify dark cards with teal border glow, no Windows 95 chrome visible |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
