# Phase 2: WebGL Canvas Migration - Research

**Researched:** 2026-03-22
**Domain:** Three.js / React `useEffect` / Next.js App Router SSR boundary / WebGL fallback / Intersection Observer
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Fixed full-screen canvas, behind all content — `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -1; pointer-events: none`
- **D-02:** Canvas fills the viewport and stays fixed while content scrolls over it — matches original behavior
- **D-03:** Scroll state lives inside `MandelbrotCanvas` only — self-contained, no shared context
- **D-04:** Scroll listener uses `useRef` for `targetZoom` and `targetHue` values (refs, not state — no re-renders). Passive listener: `window.addEventListener('scroll', onScroll, { passive: true })`
- **D-05:** Scroll listener registered inside the same `useEffect` that initializes Three.js. Removed in the same cleanup function
- **D-06:** Phase 3 section-reveal animations add their own scroll listeners separately — no coordination needed now
- **D-07:** Keep original constants from `_archive/scriptGL.js`: zoom = `Math.exp(scrollY / 1300)`, hue = `(scrollY / 15000) % 1`
- **D-08:** Lerp smoothing kept as-is: zoom lerps at 0.05, hueOffset at 0.01 per frame
- **D-09:** Airtight useEffect cleanup — dispose all Three.js resources in the return function: `cancelAnimationFrame(animFrameId)`, `renderer.dispose()`, `geometry.dispose()`, `material.dispose()`, remove canvas from DOM if appended manually
- **D-10:** Strict Mode stays enabled — cleanup must survive double-invoke (mount → unmount → remount) without WebGL context leaks
- **D-11:** `app/components/MandelbrotCanvas.tsx` — flat components directory at app level
- **D-12:** Accompanying CSS Module at `app/components/MandelbrotCanvas.module.css`
- **D-13:** Detection method: Trust Three.js — wrap `new THREE.WebGLRenderer(...)` in try/catch. On failure, set React state `webglAvailable = false`
- **D-14:** Fallback is an animated CSS gradient (not static) — uses `@keyframes` for slow hue cycling
- **D-15:** Fallback is clearly different from the fractal — minimal/flat gradient, dark base (`--color-bg`) with a slow-shifting blue/teal linear gradient
- **D-16:** `prefers-reduced-motion` → static fallback: canvas renders but animation is paused (no rAF loop), fallback gradient is static (no `@keyframes` animation)
- **D-17:** Use design tokens from `app/globals.css` — no new color values. Card background: `var(--color-surface)`, border: `1px solid var(--color-teal)` at low opacity, glow: `var(--glow-teal)`, border radius: `var(--radius-card)`
- **D-18:** No Windows 95 chrome — no title bars with close/minimize/maximize buttons, no inset borders, no grey gradients
- **D-19:** Cards defined as a reusable CSS class in `app/globals.css` or a shared CSS Module — available to all Phase 3 section components

### Claude's Discretion

- Exact `@keyframes` animation for the CSS fallback gradient (slow, subtle — not distracting)
- Whether the canvas element is appended to `document.body` or rendered as a React JSX element with a `ref`
- Mobile DPR implementation detail (cap via `Math.min(window.devicePixelRatio, 1.5)`)
- Intersection Observer threshold for canvas pause

### Deferred Ideas (OUT OF SCOPE)

- Shared scroll context (React Context for ScrollY) — deferred to Phase 3 if section-reveal animations need it
- `prefers-reduced-motion` respecting animation speed (halving speed) — Phase 2 uses static/paused approach instead
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| WEBGL-01 | Three.js migrated from CDN script tag to npm package, isolated in a `'use client'` component initialized inside `useEffect` | `'use client'` boundary prevents SSR execution; `useEffect` runs client-side only; Three.js 0.183.2 already installed |
| WEBGL-02 | Mandelbrot fragment shader preserved with full TypeScript types; renderer, geometry, and material disposed in `useEffect` cleanup | `@types/three` 0.183.1 provides full typings; disposal pattern verified from Three.js docs |
| WEBGL-03 | Scroll-driven zoom and hue animation implemented via rAF-throttled scroll context (replacing unthrottled scroll listener) | `useRef` for mutable animation values avoids re-renders; passive scroll listener pattern confirmed; original constants preserved |
| WEBGL-04 | WebGL graceful fallback renders CSS gradient background on non-capable browsers and devices | try/catch around `WebGLRenderer` constructor confirmed working; CSS `@keyframes` animated gradient pattern confirmed |
| WEBGL-05 | Adaptive quality implemented: device pixel ratio capped at 1.5 on mobile, canvas animation paused via Intersection Observer when off-screen | `Math.min(window.devicePixelRatio, 1.5)` pattern; Intersection Observer API natively available, no library needed |
| NAV-04 | Elevated terminal aesthetic applied — minimal dark cards with subtle teal border glow, no Windows 95 title bar chrome | Design tokens already in `app/globals.css`; `.terminal-card` utility class pattern confirmed |
</phase_requirements>

---

## Summary

Phase 2 migrates the existing Three.js Mandelbrot fractal from a global CDN script (running immediately on page load, crashing under SSR) into a React Client Component that is safe for Next.js App Router's server-rendering pipeline. The strategy is established: `'use client'` marks the component as client-only, and `useEffect` guarantees Three.js never executes during the server render pass. This is a well-traveled pattern in the Next.js ecosystem with no ambiguity.

The original `_archive/scriptGL.js` contains the complete reference implementation — shader code, rAF loop, scroll math constants, resize handler, and visibility-change pause. All of these migrate directly into a single `useEffect` with a corresponding cleanup function. The critical discipline is React Strict Mode: in development, React intentionally mounts, unmounts, and remounts every component to verify cleanup is airtight. The cleanup must call `cancelAnimationFrame`, `renderer.dispose()`, `geometry.dispose()`, `material.dispose()`, and remove the scroll/resize/visibilitychange listeners. Failure here causes WebGL context leaks or double-animation in dev.

The design token system from Phase 1 is fully ready to consume: `app/globals.css` exposes 22 tokens including all card aesthetic values. NAV-04 requires adding a `.terminal-card` utility class — one block in `app/globals.css` using existing tokens.

**Primary recommendation:** Implement `MandelbrotCanvas` as a single `'use client'` component with `useRef` for the canvas element and all mutable animation values. All Three.js initialization lives in one `useEffect` with a complete cleanup return. No additional npm packages are needed.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| three | 0.183.2 | WebGL renderer, scene, shader material | Already installed; matches original CDN version lineage |
| @types/three | 0.183.1 | TypeScript typings for Three.js | Already installed; matches three version |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| React built-ins (`useRef`, `useEffect`, `useState`) | React 19 (installed) | Canvas ref, animation state, fallback flag | Always — no additional packages needed |
| Intersection Observer API | Browser native | Pause rAF when canvas off-screen | Available in all modern browsers; no package needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `useEffect` + Three.js | `@react-three/fiber` | Fiber abstracts away lifecycle management but adds a heavyweight dependency and requires restructuring the shader as a material component — not worth it for a single fullscreen canvas |
| `try/catch` on renderer construction | `WebGL.isWebGL2Available()` | Three.js `WebGL.isWebGL2Available()` is a utility method (not a standalone export in r163+); try/catch is simpler and catches both "no WebGL" and driver failures |
| Canvas rendered via JSX `ref` | `document.body.appendChild` | JSX `ref` pattern is idiomatic React, avoids manual DOM cleanup in the return function, and works cleanly with Strict Mode double-invoke |

**Installation:** Nothing to install. `three` and `@types/three` are already in `package.json`.

**Verified versions:** `npm view three version` → `0.183.2`, `npm view @types/three version` → `0.183.1`. These are current as of 2026-03-22.

---

## Architecture Patterns

### Recommended Project Structure
```
app/
├── components/
│   ├── MandelbrotCanvas.tsx      # 'use client' — Three.js init, rAF loop, scroll, resize
│   └── MandelbrotCanvas.module.css  # Fixed canvas positioning + fallback gradient
├── globals.css                   # Add .terminal-card utility class here (NAV-04)
└── page.tsx                      # Add <MandelbrotCanvas /> as first child
```

### Pattern 1: `'use client'` SSR Boundary

**What:** The `'use client'` directive at the top of a file marks it and all its imports as client-only code. Next.js will not execute this module during server rendering.

**When to use:** Any component that uses `window`, `document`, `navigator`, WebGL, or browser event listeners.

**Why this is sufficient:** `useEffect` only runs in the browser. Three.js calls `document.createElement('canvas')` internally — this never executes on the server because `useEffect` is skipped during SSR. The directive alone prevents the import-time error.

```typescript
// Source: Next.js official docs — App Router client components
'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

export default function MandelbrotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglAvailable, setWebglAvailable] = useState(true)
  // ... all Three.js logic inside useEffect
}
```

### Pattern 2: Single `useEffect` with Complete Cleanup

**What:** One `useEffect` with empty dependency array `[]` handles all setup: renderer init, scene, rAF loop, scroll listener, resize listener, visibilitychange listener. The return function disposes everything.

**When to use:** Any Three.js component in React. Critical for Strict Mode survival.

**Why refs, not state for animation values:** `useRef` values are mutable without triggering re-renders. Writing `targetZoom.current = Math.exp(scrollY / 1300)` in a scroll handler is zero-cost — no React reconciliation overhead on every scroll event.

```typescript
// Source: Three.js docs (dispose), React docs (useEffect cleanup), verified pattern
useEffect(() => {
  if (!canvasRef.current) return

  const canvas = canvasRef.current
  let renderer: THREE.WebGLRenderer
  let animFrameId: number

  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  } catch {
    setWebglAvailable(false)
    return
  }

  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
  camera.position.z = 1

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

  const geometry = new THREE.PlaneGeometry(2, 2)
  const material = new THREE.ShaderMaterial({ /* ... */ })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // Mutable animation state — refs, not useState
  const zoomRef = { current: 1.0 }
  const targetZoomRef = { current: 1.0 }
  const hueRef = { current: 0.0 }
  const targetHueRef = { current: 0.0 }

  // Check prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const onScroll = () => {
    const scrollY = window.scrollY
    targetZoomRef.current = Math.exp(scrollY / 1300)
    targetHueRef.current = (scrollY / 15000) % 1
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
  }
  window.addEventListener('resize', onResize)

  function animate() {
    animFrameId = requestAnimationFrame(animate)
    zoomRef.current += (targetZoomRef.current - zoomRef.current) * 0.05
    hueRef.current += (targetHueRef.current - hueRef.current) * 0.01
    material.uniforms.uZoom.value = zoomRef.current
    material.uniforms.uHueOffset.value = hueRef.current
    renderer.render(scene, camera)
  }

  if (!prefersReducedMotion) {
    animate()
  } else {
    // Static render — one frame only
    renderer.render(scene, camera)
  }

  const onVisibilityChange = () => {
    if (document.hidden) {
      cancelAnimationFrame(animFrameId)
    } else if (!prefersReducedMotion) {
      animate()
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange)

  // Intersection Observer — pause when canvas off-screen
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(animFrameId)
        } else if (!prefersReducedMotion && !document.hidden) {
          animate()
        }
      })
    },
    { threshold: 0 }
  )
  observer.observe(canvas)

  return () => {
    cancelAnimationFrame(animFrameId)
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    observer.disconnect()
    geometry.dispose()
    material.dispose()
    renderer.dispose()
  }
}, []) // empty deps — run once on mount
```

### Pattern 3: Canvas via JSX `ref` (not `document.body.appendChild`)

**What:** Pass a `<canvas ref={canvasRef}>` element in JSX and pass `canvas: canvasRef.current` to the `WebGLRenderer` constructor.

**Why preferred over `document.body.appendChild`:** React manages the canvas element's lifecycle. No manual `removeChild` needed in cleanup — React removes it from the DOM when the component unmounts. Strict Mode double-invoke works cleanly because the JSX canvas element persists between the mount/unmount/remount cycle.

**Key detail:** Pass the canvas to the renderer constructor (`new THREE.WebGLRenderer({ canvas })`) rather than letting Three.js create its own canvas internally. This ensures the renderer uses the React-managed canvas element.

### Pattern 4: WebGL Fallback via try/catch

**What:** Wrap `new THREE.WebGLRenderer(...)` in a try/catch. On catch, set `webglAvailable` state to `false` and return early from the effect. The component renders a CSS gradient div instead.

**Why try/catch:** Three.js `WebGLRenderer` throws when it cannot create a WebGL2 context (Three.js r163+ only supports WebGL2). The throw propagates from the constructor — it is catchable. No separate detection API is needed.

**Note on WebGL1:** Three.js r163+ removed WebGL1 support. Browsers that support only WebGL1 (extremely rare in 2026) will hit the catch block and receive the fallback.

```typescript
// Fallback render path
if (!webglAvailable) {
  return <div className={styles.fallback} aria-hidden="true" />
}
return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
```

### Pattern 5: Terminal Card Utility Class (NAV-04)

**What:** A single `.terminal-card` class in `app/globals.css` using only existing design tokens. Available to every Phase 3 section component without importing a CSS Module.

```css
/* Source: app/globals.css — add to Phase 2 */
.terminal-card {
  background-color: var(--color-surface);
  border: 1px solid rgba(0, 255, 204, 0.3);
  box-shadow: var(--glow-teal);
  border-radius: var(--radius-card);
}
```

**Why globals.css, not a CSS Module:** Utility classes in CSS Modules are scoped and cannot be referenced directly by class name in JSX without importing the module. Since Phase 3 components will each use this class, a global utility is more appropriate.

### Anti-Patterns to Avoid

- **Calling `THREE.WebGLRenderer` outside `useEffect`:** Three.js accesses `document` at import-init time if the renderer is constructed at module scope. Always construct inside `useEffect`.
- **Using `useState` for `zoom` and `hueOffset`:** These change on every frame. `useState` triggers a re-render each time, destroying performance. Use plain object refs or `useRef`.
- **Forgetting to pass `canvas` to the renderer:** If Three.js creates its own canvas, it appends it to `document.body` — you lose React lifecycle management and need manual DOM cleanup.
- **Calling `animate()` without guarding `isActive`:** After cleanup runs, a stale `requestAnimationFrame` callback from the previous mount can fire. The `cancelAnimationFrame` in cleanup handles this, but only if `animFrameId` is a `let` variable captured in the effect closure (not a module-level variable).
- **Attaching resize/scroll listeners outside the effect:** Listeners attached in the component body (not inside `useEffect`) run on every render and accumulate.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| WebGL context detection | Manual `canvas.getContext('webgl2')` check | try/catch on `WebGLRenderer` constructor | Three.js surfaces driver failures and context limits that `getContext` alone does not catch |
| Responsive canvas sizing | Manual `window.innerWidth` polling | `window.addEventListener('resize', ...)` inside `useEffect` + `renderer.setSize()` | Already in reference implementation; handles all resize cases |
| Scroll performance throttling | Custom debounce/throttle | `{ passive: true }` on scroll listener + `useRef` for target values | Passive listener skips `preventDefault` cost; ref avoids React scheduling overhead |
| Off-screen pause | `setInterval` checking visibility | `IntersectionObserver` | Native browser API, zero polling cost, fires exactly when visibility changes |
| Animation loop with pause | Complex state machine | `requestAnimationFrame` + `cancelAnimationFrame` | Reference implementation already has this; visibilitychange handler included |

**Key insight:** The reference implementation in `_archive/scriptGL.js` lines 1–126 solves every performance and resource management problem correctly. The migration task is a structural port (global → component), not a rewrite.

---

## Common Pitfalls

### Pitfall 1: WebGL Context Leak on Strict Mode Double-Invoke

**What goes wrong:** React Strict Mode (development only) mounts → unmounts → remounts every component. If the cleanup function does not call `renderer.dispose()`, the first mount's WebGL context is never freed. Browsers allow a maximum of ~8–16 WebGL contexts per page — the page eventually silently stops rendering or logs "Too many active WebGL contexts."

**Why it happens:** `renderer.dispose()` frees GPU memory and the WebGL context. Without it, each remount creates a new context. In production this doesn't occur (single mount), but development breaks immediately.

**How to avoid:** Always call `renderer.dispose()` in the `useEffect` cleanup. Call `geometry.dispose()` and `material.dispose()` as well — these free GPU buffers independently.

**Warning signs:** Browser console logs "WebGL: too many active WebGL contexts, losing oldest context." Canvas renders black on second mount in dev.

### Pitfall 2: Stale `animFrameId` After Remount

**What goes wrong:** If `animFrameId` is declared outside the effect (module-level `let animFrameId`), the cleanup from the first Strict Mode mount cancels the correct frame ID but the remount's `animate()` reassigns a new ID. A second stale callback from the first mount cycle can still fire if `cancelAnimationFrame` was called before the callback ran.

**Why it happens:** `requestAnimationFrame` returns a new ID each call. The ID must be tracked inside the effect closure so each mount/unmount cycle tracks its own IDs.

**How to avoid:** Declare `let animFrameId: number` inside the `useEffect` body, not at module scope. The closure captures the per-mount ID correctly.

**Warning signs:** Two animation loops running simultaneously in dev — fractal animates at 2x speed or jitters.

### Pitfall 3: `prefers-reduced-motion` Read Outside Effect

**What goes wrong:** Reading `window.matchMedia(...)` at component render time (before `useEffect`) crashes during SSR because `window` does not exist on the server.

**Why it happens:** The component body executes during SSR even with `'use client'` — the directive prevents the module from being executed on the server, but React still calls the render function synchronously during hydration checks in some configurations.

**How to avoid:** Read `window.matchMedia` only inside `useEffect`, after confirming browser context. The ref/state pattern for `prefersReducedMotion` should be set inside the effect.

**Warning signs:** `ReferenceError: window is not defined` during `next build`.

### Pitfall 4: Canvas `ref` is `null` on First Effect Run

**What goes wrong:** The `useEffect` runs after the component renders. If the component returns `null` (e.g., before `webglAvailable` state is initialized) the canvas `ref` may be `null` on the first effect run.

**Why it happens:** `useState(true)` initializes `webglAvailable` as `true` synchronously, so the canvas element renders before the effect runs. But if initialization order changes this assumption, `canvasRef.current` will be `null`.

**How to avoid:** Guard at the start of the effect: `if (!canvasRef.current) return`. This is a safe no-op and the effect re-runs if dependencies change.

**Warning signs:** `TypeError: Cannot read properties of null (reading 'getContext')` in the browser console.

### Pitfall 5: Three.js Module Imports Executing at Server Render Time

**What goes wrong:** Even with `'use client'`, if Three.js is imported at the top of a Server Component or layout that doesn't have the directive, it will execute during SSR. Three.js accesses browser globals during initialization.

**Why it happens:** `'use client'` must be in the file that contains the import, not just the component file.

**How to avoid:** Keep Three.js imports inside `MandelbrotCanvas.tsx` which has `'use client'` at the top. `app/page.tsx` (a Server Component) imports `MandelbrotCanvas` as a component reference only — Next.js handles the client boundary automatically.

**Alternative:** If ever needed, `next/dynamic(() => import('./MandelbrotCanvas'), { ssr: false })` provides an additional safety layer, but with `'use client'` + `useEffect` it is not required.

**Warning signs:** `ReferenceError: document is not defined` during `next build` even with `'use client'`.

---

## Code Examples

Verified patterns from official sources:

### GLSL Fragment Shader — Verbatim from Reference Implementation
```glsl
// Source: _archive/scriptGL.js lines 18–58 — copy verbatim into TypeScript component
precision highp float;
precision highp int;

uniform vec2 uResolution;
uniform vec2 uPan;
uniform float uZoom;
uniform float uHueOffset;

int mandelbrot(vec2 c) {
  vec2 z = c;
  int maxIter = 400;
  int i;
  for (i = 0; i < maxIter; i++) {
    if (dot(z, z) > 4.0) break;
    z = vec2(z.x*z.x - z.y*z.y + c.x, 2.0*z.x*z.y + c.y);
  }
  return i;
}

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x*12.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
  return c.z * mix(vec3(1.0), rgb, c.y);
}

void main() {
  vec2 uv = (gl_FragCoord.xy / uResolution.xy - 0.5) * 2.0;
  uv.x *= uResolution.x / uResolution.y;
  vec2 c = uv / uZoom + uPan;
  int iter = mandelbrot(c);
  float t = float(iter) / 400.0;
  vec3 color = hsv2rgb(vec3(mod(t + uHueOffset, 1.0), 1.0, t < 1.0 ? 1.0 : 0.0));
  gl_FragColor = vec4(color, 1.0);
}
```

### TypeScript Shader Material Setup
```typescript
// Source: three@0.183.2 @types/three@0.183.1
import * as THREE from 'three'

const material = new THREE.ShaderMaterial({
  uniforms: {
    uZoom:       { value: 1.0 },
    uPan:        { value: new THREE.Vector2(-0.743, 0.11) },
    uHueOffset:  { value: 0.0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  },
  fragmentShader: FRAGMENT_SHADER, // string constant defined above
})
```

### CSS Module — Canvas Positioning and Fallback
```css
/* Source: D-01, D-14, D-15 from CONTEXT.md */
.canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
}

.fallback {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(135deg, var(--color-bg) 0%, #001a1a 50%, var(--color-bg) 100%);
  background-size: 300% 300%;
  animation: gradientShift 12s ease infinite;
}

@keyframes gradientShift {
  0%   { background-position: 0% 50%; }
  50%  { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (prefers-reduced-motion: reduce) {
  .fallback {
    animation: none;
    background-position: 0% 50%;
  }
}
```

### Terminal Card Utility Class — globals.css Addition
```css
/* Source: D-17, D-18, D-19 from CONTEXT.md — add to app/globals.css */
.terminal-card {
  background-color: var(--color-surface);
  border: 1px solid rgba(0, 255, 204, 0.3);
  box-shadow: var(--glow-teal);
  border-radius: var(--radius-card);
}
```

### Mobile DPR Cap
```typescript
// Source: WEBGL-05 requirement, D-16 discretion item
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
```

### Intersection Observer — Pause Off-Screen
```typescript
// Source: MDN Intersection Observer API — no library needed
const observer = new IntersectionObserver(
  (entries) => {
    const [entry] = entries
    if (!entry.isIntersecting) {
      cancelAnimationFrame(animFrameId)
    } else if (!prefersReducedMotion && !document.hidden) {
      animate()
    }
  },
  { threshold: 0 } // fires as soon as any pixel leaves viewport
)
observer.observe(canvasRef.current)
// In cleanup:
observer.disconnect()
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| CDN script tag `<script src="...three.min.js">` | npm package `import * as THREE from 'three'` | Three.js r100+ (2019) | Tree-shaking, TypeScript, no global namespace pollution |
| `document.body.appendChild(renderer.domElement)` | Pass `canvas` element via React `ref` to `WebGLRenderer({ canvas })` | Became standard with React hooks (2019) | React manages element lifecycle; no manual removeChild |
| `WebGL1` renderer | `WebGL2` only (r163+) | Three.js r163 (2023) | Simplified renderer; very old devices (pre-2017) lose support |
| Global `let animFrameId` at module scope | `let animFrameId: number` inside `useEffect` closure | React 18 Strict Mode (2022) | Prevents Strict Mode context leaks |
| `@react-three/fiber` for all React + Three.js work | Bare Three.js in `useEffect` for single-canvas use cases | Ongoing | Fiber is powerful but heavy; for a single fullscreen canvas, direct API is simpler and faster to load |

**Deprecated/outdated:**
- `WebGL.isWebGLAvailable()` / `WebGL.isWebGL2Available()`: The `WebGL` namespace utilities were removed or restructured in recent Three.js versions. try/catch is the reliable detection method.
- Module-level `renderer` variable in React components: Causes Strict Mode leaks. Must be scoped to `useEffect` closure.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — no jest, vitest, or @testing-library/react in package.json |
| Config file | None — Wave 0 gap |
| Quick run command | N/A until framework installed |
| Full suite command | N/A until framework installed |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| WEBGL-01 | `next build` completes without `ReferenceError: document is not defined` | smoke | `npm run build` | N/A — build script exists |
| WEBGL-01 | MandelbrotCanvas has `'use client'` directive | lint/static | TypeScript compile check via `npm run build` | N/A |
| WEBGL-02 | Fragment shader string preserved exactly (spot-check specific uniform names) | manual | Review source | N/A |
| WEBGL-02 | `useEffect` cleanup disposes renderer/geometry/material | unit | Requires test framework | Wave 0 gap |
| WEBGL-03 | Scroll event updates targetZoom/targetHue refs | unit | Requires test framework | Wave 0 gap |
| WEBGL-04 | Fallback div renders when `webglAvailable=false` | unit | Requires test framework | Wave 0 gap |
| WEBGL-05 | DPR capped at 1.5 | unit | Requires test framework | Wave 0 gap |
| WEBGL-05 | Intersection Observer disconnected on unmount | unit | Requires test framework | Wave 0 gap |
| NAV-04 | `.terminal-card` class present in globals.css | static | `grep .terminal-card app/globals.css` | Wave 0 gap |

### Sampling Rate
- **Per task commit:** `npm run build` (catches SSR crashes) + `npm run lint`
- **Per wave merge:** `npm run build` full clean build
- **Phase gate:** Build passes, no console errors in `next dev`, visual smoke check in browser

### Wave 0 Gaps

- [ ] No test framework installed — `npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom` or vitest equivalent needed before unit tests can run
- [ ] `WEBGL-01` is covered by `npm run build` (already works — no new setup needed)
- [ ] `NAV-04` can be verified with a grep command — no framework needed

**Assessment:** The most critical requirement (WEBGL-01 — no SSR crash) is verifiable with the existing `npm run build` script. Unit tests for cleanup and Intersection Observer behavior require a test framework not yet installed. Given the visual/browser nature of WebGL, the primary verification gate is a clean build + browser smoke test.

---

## Open Questions

1. **Should `MandelbrotCanvas` render in `app/page.tsx` or `app/layout.tsx`?**
   - What we know: CONTEXT.md says "MandelbrotCanvas rendered in `app/page.tsx` (or `app/layout.tsx` body) as the first child"
   - What's unclear: `layout.tsx` would persist the canvas across all routes (better for perf if future routes exist); `page.tsx` is simpler and sufficient for a single-page portfolio
   - Recommendation: Use `app/page.tsx` for Phase 2 — the portfolio is a single page. Placing it in layout is premature optimization with no current benefit. This is within Claude's discretion.

2. **Should `prefersReducedMotion` be checked via `useEffect` state or read inline inside the effect?**
   - What we know: Must not read `window.matchMedia` outside `useEffect`; the value doesn't change during the component's lifetime in practice
   - What's unclear: Whether to store it in a ref, a local variable, or subscribe to changes via `addEventListener('change', ...)`
   - Recommendation: Read it as a local `const` inside the `useEffect` body. No need to subscribe to changes — the component remounts on hard navigation, picking up any system change then.

---

## Sources

### Primary (HIGH confidence)
- Three.js official docs (threejs.org/docs) — WebGLRenderer constructor options, dispose method
- `_archive/scriptGL.js` — Reference implementation; all scroll constants, shader code, rAF/cleanup patterns verified by direct inspection
- `app/globals.css` — Design tokens verified by direct file read; all 22 tokens confirmed present
- `package.json` — Three.js 0.183.2 and @types/three 0.183.1 confirmed via `npm view`
- Next.js official docs (nextjs.org/docs) — `next/dynamic` with `ssr: false`, `'use client'` boundary behavior

### Secondary (MEDIUM confidence)
- React docs / community (github.com/facebook/react issue #24455) — Strict Mode double-invoke behavior confirmed; `useEffect` cleanup runs between mount/unmount/remount
- Three.js forum discourse (discourse.threejs.org) — WebGL context limit warning patterns, renderer disposal patterns
- MDN Web Docs — Intersection Observer API, `prefers-reduced-motion` media query behavior

### Tertiary (LOW confidence)
- DEV Community articles on Three.js + React patterns — general structural guidance; not cited for specific API claims

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified via npm registry; already installed
- Architecture: HIGH — patterns verified against Three.js docs, Next.js docs, and direct inspection of reference implementation
- Pitfalls: HIGH — Strict Mode double-invoke is documented React behavior; WebGL context limits are documented browser behavior; all patterns trace to authoritative sources

**Research date:** 2026-03-22
**Valid until:** 2026-09-22 (Three.js releases frequently; verify r183 API still current if >6 months elapse)
