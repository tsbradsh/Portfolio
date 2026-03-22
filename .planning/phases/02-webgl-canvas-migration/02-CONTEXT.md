# Phase 2: WebGL Canvas Migration - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Isolate the Three.js Mandelbrot fractal behind a React `'use client'` boundary so the site builds without SSR errors. Implement scroll-driven zoom + hue animation, mobile adaptive quality (DPR cap + Intersection Observer pause), and a CSS gradient fallback for non-WebGL environments. Apply the elevated terminal card aesthetic (NAV-04) — dark cards with teal border glow, no Windows 95 chrome. Content, navigation, and full layout are Phase 3.

</domain>

<decisions>
## Implementation Decisions

### Canvas positioning
- **D-01:** Fixed full-screen canvas, behind all content — `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none`
- **D-02:** Canvas fills the viewport and stays fixed while content scrolls over it — matches original behavior

### Scroll state architecture
- **D-03:** Scroll state lives inside `MandelbrotCanvas` only — self-contained, no shared context
- **D-04:** Scroll listener uses `useRef` for `targetZoom` and `targetHue` values (refs, not state — no re-renders). Passive listener: `window.addEventListener('scroll', onScroll, { passive: true })`
- **D-05:** Scroll listener registered inside the same `useEffect` that initializes Three.js. Removed in the same cleanup function
- **D-06:** Phase 3 section-reveal animations add their own scroll listeners separately — no coordination needed now

### Scroll animation constants
- **D-07:** Keep original constants from `_archive/scriptGL.js`: zoom = `Math.exp(scrollY / 1300)`, hue = `(scrollY / 15000) % 1`
- **D-08:** Lerp smoothing kept as-is: zoom lerps at 0.05, hueOffset at 0.01 per frame

### React Strict Mode cleanup
- **D-09:** Airtight useEffect cleanup — dispose all Three.js resources in the return function:
  - `cancelAnimationFrame(animFrameId)`
  - `renderer.dispose()`
  - `geometry.dispose()`
  - `material.dispose()`
  - Remove canvas from DOM if appended manually
- **D-10:** Strict Mode stays enabled — cleanup must survive double-invoke (mount → unmount → remount) without WebGL context leaks

### Component location
- **D-11:** `app/components/MandelbrotCanvas.tsx` — flat components directory at app level
- **D-12:** Accompanying CSS Module at `app/components/MandelbrotCanvas.module.css`

### WebGL fallback
- **D-13:** Detection method: Trust Three.js — wrap `new THREE.WebGLRenderer(...)` in try/catch. On failure, set React state `webglAvailable = false`
- **D-14:** Fallback is an **animated CSS gradient** (not static) — uses `@keyframes` for slow hue cycling
- **D-15:** Fallback is **clearly different** from the fractal — minimal/flat gradient, not mimicking the Mandelbrot look. Dark base (`--color-bg`) with a slow-shifting blue/teal linear gradient
- **D-16:** `prefers-reduced-motion` → static fallback: canvas renders but animation is paused (no rAF loop), fallback gradient is static (no @keyframes animation)

### Terminal card aesthetic (NAV-04)
- **D-17:** Use design tokens from `app/globals.css` — no new color values
  - Card background: `var(--color-surface)` (`#111111`)
  - Border: `1px solid var(--color-teal)` at low opacity (`rgba(0, 255, 204, 0.3)`)
  - Glow: `box-shadow: var(--glow-teal)` (`0 0 8px rgba(0, 255, 204, 0.20)`)
  - Border radius: `var(--radius-card)` (`4px`)
- **D-18:** No Windows 95 chrome — no title bars with close/minimize/maximize buttons, no inset borders, no grey gradients
- **D-19:** Cards defined as a reusable CSS class in `app/globals.css` or a shared CSS Module — available to all Phase 3 section components

### Claude's Discretion
- Exact `@keyframes` animation for the CSS fallback gradient (slow, subtle — not distracting)
- Whether the canvas element is appended to `document.body` or rendered as a React JSX element with a `ref`
- Mobile DPR implementation detail (cap via `Math.min(window.devicePixelRatio, 1.5)`)
- Intersection Observer threshold for canvas pause

</decisions>

<specifics>
## Specific Ideas

- Scroll listener pattern from discussion: `targetZoom.current = Math.exp(window.scrollY / 1300)` / `targetHue.current = (window.scrollY / 15000) % 1` — preserve original constants exactly
- Canvas CSS: `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none` — verbatim from discussion
- Fallback gradient: animated, clearly different from fractal, dark + slow blue/teal shift

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Original WebGL source (reference implementation)
- `_archive/scriptGL.js` — Original Three.js setup, shader code, scroll animation logic, rAF loop, cleanup pattern. Lines 1–126 are the WebGL portion to migrate.

### Design tokens (must use, not duplicate)
- `app/globals.css` — All 22 design tokens: `--color-bg`, `--color-surface`, `--color-teal`, `--color-teal-subtle`, `--color-teal-glow`, `--glow-teal`, `--radius-card`, transition tokens. Card aesthetic MUST use these.

### Next.js scaffold (Phase 1 output)
- `app/layout.tsx` — Root layout with Cascadia Code font variable; `--font-mono` is active on `<html>`. Canvas component renders inside `<body>`.
- `app/page.tsx` — Current placeholder page; Phase 2 adds `<MandelbrotCanvas />` here (or in layout).

### Phase 1 plan (what was built)
- `.planning/phases/01-infrastructure-and-foundation/01-01-PLAN.md` — Three.js already installed (`package.json` has `"three"` + `"@types/three"`). Do not reinstall.

### Requirements
- `.planning/REQUIREMENTS.md` — WEBGL-01 through WEBGL-05, NAV-04 (full requirement text)
- `.planning/ROADMAP.md` — Phase 2 success criteria (5 items)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `_archive/scriptGL.js` lines 1–59: Complete Three.js scene setup + GLSL fragment shader (Mandelbrot + hsv2rgb) — copy shader string verbatim into TypeScript component
- `_archive/scriptGL.js` lines 61–126: rAF loop, scroll listener, resize handler, visibility change handler — all patterns to migrate into `useEffect`
- `app/globals.css`: 22 design tokens ready to consume — card aesthetic uses `--color-surface`, `--glow-teal`, `--radius-card`, `--color-teal`

### Established Patterns
- `app/layout.tsx`: `localFont` with `variable: '--font-mono'` — Phase 2 follows same pattern if adding fonts; does not modify layout.tsx
- Phase 1 used CSS Modules for component styles — MandelbrotCanvas follows same pattern (`MandelbrotCanvas.module.css`)

### Integration Points
- `MandelbrotCanvas` rendered in `app/page.tsx` (or `app/layout.tsx` body) as the first child, fixed behind content
- `app/globals.css` gets a `.terminal-card` utility class for NAV-04 (or defined in a shared module)
- `next.config.ts` has `output: 'export'` — no server-side APIs available; all detection/initialization must be client-side

</code_context>

<deferred>
## Deferred Ideas

- Shared scroll context (React Context for ScrollY) — deferred to Phase 3 if section-reveal animations need it; Phase 2 uses self-contained scroll in MandelbrotCanvas
- `prefers-reduced-motion` respecting animation speed (halving speed) — Phase 2 uses static/paused approach instead; may revisit in Phase 5 polish

</deferred>

---

*Phase: 02-webgl-canvas-migration*
*Context gathered: 2026-03-22*
