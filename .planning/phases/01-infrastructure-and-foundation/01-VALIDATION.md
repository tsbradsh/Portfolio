---
phase: 1
slug: infrastructure-and-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None — Phase 1 is a scaffold phase; build + type check serve as validation |
| **Config file** | none — Wave 0 installs via `create-next-app` |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build && npx tsc --noEmit` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build && npx tsc --noEmit`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | FOUND-01 | build smoke | `npm run build` | ❌ Wave 0 | ⬜ pending |
| 1-01-02 | 01 | 1 | FOUND-01 | config check | `npx tsc --noEmit` | ❌ Wave 0 | ⬜ pending |
| 1-01-03 | 01 | 1 | FOUND-03 | build smoke | `npm run build` | ❌ Wave 0 | ⬜ pending |
| 1-02-01 | 02 | 1 | FOUND-02 | token check | `grep -c "var(--" app/globals.css` | ❌ Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `package.json` — created by `create-next-app` scaffold task (Wave 0)
- [ ] `next.config.ts` — must have `output: 'export'` and `images: { unoptimized: true }` before first build
- [ ] `public/fonts/CascadiaCode.woff2` — must be downloaded from Microsoft GitHub releases before font task
- [ ] `app/layout.tsx` — font variable applied to `<html>` element here
- [ ] `app/globals.css` — all 22 design tokens defined here

*No separate test files needed for Phase 1. Build success is the test.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Cascadia Code renders in browser (no font flash / CLS) | FOUND-03 | Visual font rendering cannot be verified by CLI | Open `out/index.html` in browser via local server; observe that monospace font loads immediately with no flash to fallback |
| `out/` directory exists after build and contains valid HTML | FOUND-01 | File system output verification | Run `npm run build`; check that `out/index.html` exists and contains `<!DOCTYPE html>` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
