---
phase: 01-infrastructure-and-foundation
plan: 01
subsystem: build-pipeline
tags: [next.js, typescript, design-tokens, fonts, static-export]
dependency_graph:
  requires: []
  provides:
    - next.js-build-pipeline
    - design-token-system
    - cascadia-code-font-pipeline
    - three.js-dependency
  affects:
    - all-subsequent-phases
tech_stack:
  added:
    - next: "16.2.1"
    - react: "19"
    - three: "0.183.2"
    - typescript: "5"
    - prettier: "latest"
    - eslint-config-prettier: "latest"
    - "@types/three": "0.183.1"
  patterns:
    - Next.js App Router with static export (output: 'export')
    - CSS custom properties for design tokens on :root
    - next/font/local for self-hosted Cascadia Code
    - Flat ESLint config (eslint.config.mjs) with prettier integration
key_files:
  created:
    - next.config.ts
    - tsconfig.json
    - package.json
    - .prettierrc
    - eslint.config.mjs
    - .gitignore
    - app/globals.css
    - app/layout.tsx
    - app/page.tsx
    - public/fonts/CascadiaCode.woff2
    - public/fonts/CascadiaCode-SemiBold.woff2
    - _archive/index.html
    - _archive/scriptGL.js
    - _archive/styles.css
    - _archive/shader.glsl
  modified: []
decisions:
  - "Used manual package.json + npm install instead of create-next-app because directory name 'Portfolio' contains uppercase letters which npm rejects"
  - "Upgraded Next.js from 15.2.3 to 16.2.1 to patch CVE-2025-66478 security vulnerability"
  - "Used both variable font (CascadiaCode.woff2) and static SemiBold (CascadiaCode-SemiBold.woff2) from v2407.24 release"
  - "Created eslint.config.mjs (flat config) instead of .eslintrc.json because Next.js 16 uses flat ESLint config format"
metrics:
  duration: "9 minutes"
  completed: "2026-03-22"
  tasks_completed: 2
  files_created: 15
---

# Phase 1 Plan 1: Infrastructure and Foundation — Scaffold Summary

Next.js 16 App Router static export with 22-token CSS design system and self-hosted Cascadia Code font via next/font/local.

## Objective

Scaffold the complete Next.js 15+ App Router project with static export, establish the full design token system, and load Cascadia Code font — delivering the shared foundation that all subsequent phases inherit.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Scaffold Next.js 15 App Router with static export and tooling | 31f0822 | package.json, next.config.ts, tsconfig.json, .prettierrc, eslint.config.mjs, _archive/*, .gitignore |
| 2 | Design token system in globals.css and Cascadia Code font pipeline | 1faa549 | app/globals.css, app/layout.tsx, app/page.tsx, public/fonts/*.woff2 |

## What Was Built

### Build Pipeline
- Next.js 16.2.1 (App Router) with `output: 'export'` targeting Netlify static hosting
- TypeScript 5 with strict mode, `_archive/` excluded from compilation
- Prettier with project formatting rules (singleQuote, semi: false, trailingComma: es5)
- ESLint flat config extending next/core-web-vitals + prettier
- Three.js 0.183.2 + @types/three installed (used in Phase 2)

### Design Token System (globals.css)
22 CSS custom properties defined on `:root`:

**Spacing (9 tokens):** `--space-half` (4px) through `--space-16` (128px) on 8px grid

**Typography (4 tokens):** `--text-sm` (14px), `--text-base` (16px), `--text-lg` (20px), `--text-xl` (32px)

**Color (8 tokens):** `--color-bg` (#0a0a0a), `--color-surface` (#111111), `--color-surface-nav`, `--color-teal` (#00ffcc), `--color-teal-subtle`, `--color-teal-glow`, `--color-blue` (#7dd3fc), `--color-error` (#ff4d4d)

**Glow and border (3 tokens):** `--glow-teal`, `--glow-teal-nav`, `--radius-card` (4px)

**Transitions (3 tokens):** `--transition-fast` (150ms), `--transition-base` (250ms), `--transition-slow` (400ms)

### Font Pipeline
- Cascadia Code v2407.24 downloaded from Microsoft GitHub and self-hosted
- `public/fonts/CascadiaCode.woff2` — variable font (all weights including 400)
- `public/fonts/CascadiaCode-SemiBold.woff2` — static SemiBold (weight 600)
- `next/font/local` loads both weights, exposes `--font-mono` CSS variable
- `display: 'swap'` prevents font flash
- `cascadiaCode.variable` applied to `<html>` element so `--font-mono` is available everywhere

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] create-next-app rejected directory name "Portfolio"**
- **Found during:** Task 1, Step 2
- **Issue:** `npx create-next-app@latest .` failed with "name can no longer contain capital letters" because npm package names cannot contain uppercase
- **Fix:** Scaffolded manually — created package.json with `"name": "portfolio"` (lowercase), ran `npm install`, created all Next.js config files by hand
- **Files modified:** package.json (created manually), all other config files created manually
- **Commit:** 31f0822

**2. [Rule 1 - Bug / Security] Next.js 15.2.3 has critical security vulnerability CVE-2025-66478**
- **Found during:** Task 1, npm install
- **Issue:** npm reported critical severity vulnerability in next@15.2.3
- **Fix:** Ran `npm install next@latest` which upgraded to 16.2.1 (patched)
- **Files modified:** package.json, package-lock.json
- **Commit:** 31f0822

**3. [Rule 3 - Blocking] Next.js 16 uses flat ESLint config format, not .eslintrc.json**
- **Found during:** Task 1, Step 6
- **Issue:** Next.js 16 generates `eslint.config.mjs` (ESLint flat config) by default, not `.eslintrc.json`
- **Fix:** Created `eslint.config.mjs` with FlatCompat extending next/core-web-vitals and prettier (as noted in plan's NOTE about this possibility)
- **Files modified:** eslint.config.mjs (created)
- **Commit:** 31f0822

## Verification Results

All plan verification criteria passed:

- `npm run build` exits 0 and produces `out/` with `index.html` — PASS
- `npx tsc --noEmit` exits 0 with zero type errors — PASS
- `app/globals.css` contains all 22 tokens from UI-SPEC — PASS
- `app/layout.tsx` applies `cascadiaCode.variable` to `<html>` element — PASS
- `public/fonts/` contains Cascadia Code woff2 files — PASS
- `_archive/` contains all four original vanilla files — PASS
- `next.config.ts` has `output: 'export'` and `images: { unoptimized: true }` — PASS
- Three.js and @types/three in package.json — PASS

## Known Stubs

None — `app/page.tsx` is an intentional placeholder that correctly uses token variables (`var(--space-4)`, `var(--color-teal)`, `var(--text-xl)`). It will be replaced by Phase 3 (Navigation + Layout Shell).

## Self-Check: PASSED

All 15 created files verified present. Both task commits (31f0822, 1faa549) verified in git log.
