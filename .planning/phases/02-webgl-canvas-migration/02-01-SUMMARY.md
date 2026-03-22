---
phase: 02-webgl-canvas-migration
plan: 01
subsystem: webgl-canvas
tags: [three.js, webgl, react, use-client, ssr-safe, scroll-animation, fallback, accessibility]
dependency_graph:
  requires:
    - 01-01-SUMMARY.md  # Next.js scaffold, Three.js installed, globals.css design tokens
  provides:
    - MandelbrotCanvas component (use client, SSR-safe, scroll-animated)
    - .terminal-card utility class (globals.css)
    - page.tsx wired to render canvas
  affects:
    - app/page.tsx
    - app/globals.css
tech_stack:
  added:
    - Three.js WebGLRenderer used inside React useEffect (client-only)
    - IntersectionObserver for off-screen canvas pause
    - CSS Module with @keyframes animated gradient fallback
  patterns:
    - use client + useEffect for SSR boundary isolation
    - JSX ref passed to WebGLRenderer (not document.body.appendChild)
    - try/catch WebGL detection via Three.js constructor
    - Airtight cleanup: cancelAnimationFrame + dispose all Three.js resources
key_files:
  created:
    - app/components/MandelbrotCanvas.tsx
    - app/components/MandelbrotCanvas.module.css
  modified:
    - app/globals.css
    - app/page.tsx
decisions:
  - Used JSX canvas ref (not document.body.appendChild) per React patterns — avoids direct DOM manipulation
  - Single useEffect with all event listeners registered and cleaned up together
  - webglAvailable state initialized true so canvas renders immediately, fallback activates only on WebGL failure
  - npm run lint fails due to pre-existing Windows path parsing bug in Next.js CLI — ESLint passes when run directly (npx eslint app/ exits 0)
metrics:
  duration: ~15 minutes
  completed: 2026-03-22
  tasks_completed: 2
  files_created: 2
  files_modified: 2
---

# Phase 02 Plan 01: WebGL Canvas Migration Summary

**One-liner:** Three.js Mandelbrot fractal migrated into SSR-safe 'use client' React component with scroll-driven zoom/hue animation, IntersectionObserver pause, prefers-reduced-motion static frame, WebGL try/catch fallback, and .terminal-card utility class.

## What Was Built

### Task 1: MandelbrotCanvas component and CSS Module

**`app/components/MandelbrotCanvas.tsx`** — Complete 'use client' component:
- Begins with `'use client'` directive (SSR boundary isolation)
- `import * as THREE from 'three'` — Three.js installed via npm in Phase 01
- Single `useEffect([], [])` containing all Three.js lifecycle: renderer init, scene setup, event listeners, animation loop, cleanup
- WebGL detection via try/catch on `new THREE.WebGLRenderer(...)` — sets `webglAvailable(false)` on failure
- Fragment shader (`FRAGMENT_SHADER` const at module level) copied verbatim from `_archive/scriptGL.js` — includes `int mandelbrot(vec2 c)` and `vec3 hsv2rgb(vec3 c)` GLSL functions
- Scroll animation: `targetZoom = Math.exp(scrollY / 1300)`, `targetHueOffset = (scrollY / 15000) % 1` — original constants preserved exactly
- Lerp smoothing: zoom at 0.05/frame, hueOffset at 0.01/frame
- Mobile: `Math.min(window.devicePixelRatio, 1.5)` caps pixel ratio
- Accessibility: `prefers-reduced-motion` check inside useEffect renders single static frame instead of animation loop
- IntersectionObserver (threshold: 0) pauses rAF loop when canvas leaves viewport
- Visibility change handler pauses/resumes animation on tab switch
- Cleanup: `cancelAnimationFrame`, remove all event listeners, `observer.disconnect()`, `geometry.dispose()`, `material.dispose()`, `renderer.dispose()`

**`app/components/MandelbrotCanvas.module.css`** — CSS Module:
- `.canvas`: `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none`
- `.fallback`: Same fixed positioning + animated CSS gradient (`@keyframes gradientShift` 12s ease infinite) with dark base shifting between `--color-bg` and `#001a1a`
- `@media (prefers-reduced-motion: reduce)` disables fallback animation

### Task 2: terminal-card utility class and page wiring

**`app/globals.css`** — Appended `.terminal-card`:
```css
.terminal-card {
  background-color: var(--color-surface);
  border: 1px solid rgba(0, 255, 204, 0.3);
  box-shadow: var(--glow-teal);
  border-radius: var(--radius-card);
}
```
Uses only existing design tokens. No Windows 95 chrome. Global utility available to all Phase 3 components.

**`app/page.tsx`** — Updated to render MandelbrotCanvas as first child:
- `import MandelbrotCanvas from './components/MandelbrotCanvas'`
- `<MandelbrotCanvas />` as first child in Fragment
- `<main>` has `position: relative` to stack above fixed canvas
- Remains a Server Component — `'use client'` boundary handled at import

## Verification Results

| Check | Result |
|-------|--------|
| `npm run build` exits 0 | PASS |
| No `ReferenceError: document is not defined` | PASS |
| `renderer.dispose`, `geometry.dispose`, `material.dispose` all present (count=3) | PASS |
| `Math.exp(scrollY / 1300)` scroll zoom constant | PASS |
| `setWebglAvailable(false)` fallback path | PASS |
| `Math.min(window.devicePixelRatio, 1.5)` DPR cap | PASS |
| `new IntersectionObserver` off-screen pause | PASS |
| `.terminal-card` in globals.css | PASS |
| `npx tsc --noEmit` exits 0 | PASS |

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Known Issues (Pre-existing, Not Caused by This Plan)

**`npm run lint` fails on Windows with path parsing error**
- `next lint` incorrectly parses `lint` as a directory path on Windows: `Invalid project directory provided, no such directory: C:\...\Portfolio\lint`
- This is a pre-existing issue present before any changes in this plan (verified by running `npm run lint` on commit prior to Task 2)
- ESLint itself passes: `npx eslint app/` exits 0 with no errors
- Logged to deferred items — not caused by this plan's changes

## Known Stubs

None — MandelbrotCanvas is fully wired. page.tsx contains placeholder content (`Portfolio under construction.`) but this is intentional per plan spec: "The existing placeholder content is preserved for Phase 3 to replace."

## Self-Check: PASSED

- `app/components/MandelbrotCanvas.tsx` — FOUND
- `app/components/MandelbrotCanvas.module.css` — FOUND
- `app/globals.css` contains `.terminal-card` — FOUND
- `app/page.tsx` contains `MandelbrotCanvas` — FOUND
- Commit `6804071` (Task 1) — FOUND
- Commit `e78e85e` (Task 2) — FOUND
