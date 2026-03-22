# Domain Pitfalls

**Domain:** Next.js + Three.js portfolio migration (vanilla HTML/CSS/JS → Next.js + TypeScript)
**Researched:** 2026-03-21
**Confidence:** HIGH (patterns verified against known Next.js/Three.js integration behavior and existing codebase specifics)

---

## Critical Pitfalls

Mistakes that cause rewrites, broken deployments, or silent failures.

---

### Pitfall 1: Three.js Runs at Module Scope — Guaranteed SSR Crash

**What goes wrong:** The current `scriptGL.js` executes `new THREE.Scene()`, `new THREE.WebGLRenderer()`, and `document.querySelectorAll()` at the top level of the file. In Next.js, every page module is imported and executed on the server during SSR/SSG. The server has no `window`, no `document`, no `WebGL` context. The import crashes immediately with `ReferenceError: document is not defined` or `ReferenceError: THREE is not defined`, and the build fails or the page hydrates with a white screen.

**Why it happens:** Next.js pre-renders pages server-side by default. Three.js and any DOM-accessing code are browser-only. The current code has zero separation between initialization logic and module scope — everything runs on `<script defer>` in vanilla land where the browser guarantees a DOM, but that contract does not exist in SSR.

**Consequences:** The canvas component either fails to build, fails to hydrate, or throws a React hydration mismatch that corrupts the entire page. This is the #1 cause of broken Three.js + Next.js projects.

**Prevention:**
1. Wrap all Three.js code in a React component that uses `useEffect` — effects only run on the client.
2. Import Three.js dynamically using Next.js `dynamic()` with `{ ssr: false }`.
3. Gate any `window`/`document` access behind `typeof window !== 'undefined'` checks or inside `useEffect`.
4. The canvas component must never be imported at the page level without `ssr: false` dynamic import.

```tsx
// Correct pattern
import dynamic from 'next/dynamic';
const MandelbrotCanvas = dynamic(() => import('@/components/MandelbrotCanvas'), { ssr: false });
```

**Detection warning signs:** Build log contains `ReferenceError: document is not defined` or `ReferenceError: window is not defined`. Hydration warnings in the browser console. Page content flashes or disappears on load.

**Phase:** Foundation / component scaffolding phase — must be solved before any other Three.js work.

---

### Pitfall 2: Netlify Forms Break with Next.js Static Export

**What goes wrong:** Netlify Forms work by detecting `netlify` or `data-netlify="true"` attributes on HTML `<form>` elements in the static HTML files that Netlify scans at deploy time. Next.js with `output: 'export'` does generate static HTML, but only if the form markup is present in the pre-rendered HTML. If the contact form is inside a client-only component (wrapped in `useEffect`, `dynamic` with `ssr: false`, or rendered only after hydration), Netlify's build-time bot will never see the form and will not process submissions. The form will silently fail with no error to the user.

**Why it happens:** Netlify's form detection is a pre-deploy static scan, not runtime. React components that render client-side only produce no HTML at build time. This is the exact conflict between Next.js client rendering and Netlify's bot scanning.

**Consequences:** Form submissions return 404 or are silently discarded. No error shown to user. Very difficult to debug post-deployment.

**Prevention:**
1. Keep the contact form as a server-side rendered (SSG) component — do NOT wrap it in `dynamic({ ssr: false })`.
2. Include `data-netlify="true"` and `name="contact"` on the `<form>` element so it appears in the static HTML output.
3. Add a hidden `<input type="hidden" name="form-name" value="contact" />` as required by Netlify.
4. Test with a local `next build && next export` and inspect the generated HTML to confirm the form markup is present.
5. If migrating to Vercel instead of Netlify, use a different form backend (Formspree, EmailJS, or a Next.js API route).

**Detection warning signs:** Form submits but no email received. Netlify dashboard shows no form entries. 404 on form POST URL.

**Phase:** Contact form integration phase — verify static HTML output before any form styling work.

---

### Pitfall 3: `output: 'export'` Breaks Next.js Features Silently

**What goes wrong:** Next.js static export (`output: 'export'` in `next.config.ts`) disables server-side features: API routes, middleware, `getServerSideProps`, Image Optimization (next/image), and incremental static regeneration. Developers often scaffold a Next.js project, add `next/image` for the project screenshots, write an API route for the contact form, then discover at deploy time that none of these work on Netlify's static hosting.

**Why it happens:** Netlify's static hosting has no Node.js runtime. The Next.js runtime adapter is only available if using Netlify's Next.js plugin — and even then `next/image` optimization requires the Netlify Next.js Runtime (not purely static export mode).

**Consequences:** Build succeeds locally but deploy silently breaks. Images 404. API routes return 404. Netlify form workaround becomes necessary.

**Prevention:**
1. Decide the hosting strategy first: pure static Netlify (`output: 'export'`) vs. Vercel (full Next.js features) vs. Netlify + Next.js Runtime plugin (partial features).
2. If staying on Netlify with `output: 'export'`: avoid API routes, avoid `next/image` optimization (use standard `<img>` with manual optimization or unoptimized prop), use Netlify Forms for contact.
3. If migrating to Vercel: full Next.js features are available, use API routes for form, `next/image` works natively, but Netlify Forms are unavailable.
4. Recommendation: Migrate to Vercel. The portfolio is a static SSG site and Vercel's free tier is equivalent. This unblocks `next/image`, removes Netlify Forms gymnastics, and the hosting story matches the tech stack.

**Detection warning signs:** `next/image` produces broken images in production. API route POST returns 404 on live site but works locally. Netlify build log warns about unsupported features.

**Phase:** Infrastructure decision — must be locked in before writing any Next.js routing or form logic.

---

### Pitfall 4: React Hydration Mismatch from Scroll State

**What goes wrong:** The current scroll handler sets `.visible` CSS classes on `.win-terminal` elements based on `window.scrollY`. In Next.js, the server renders the page with no scroll state — all terminals have no `.visible` class. The client hydrates and React expects the DOM to match the server-rendered HTML. If any JavaScript runs before hydration completes and modifies the DOM (e.g., adds `.visible` to elements), React throws a hydration mismatch warning and may re-render everything, causing a flash of unstyled/invisible content.

**Why it happens:** Server has no `window.scrollY`. The initial render always has scroll = 0. If the user has scrolled before the page hydrates (e.g., on a slow mobile connection with cached scroll position), the client-side DOM differs from what the server sent.

**Consequences:** Hydration warnings in console. Sections flash from invisible to visible after hydration. On slow connections, content appears broken for 1-3 seconds.

**Prevention:**
1. Initialize all terminals as visible (or in their scroll-based class state) only after `useEffect` fires — never during render.
2. Use `suppressHydrationWarning` sparingly only on elements whose server/client mismatch is intentional.
3. Apply initial visibility state via CSS (e.g., terminals start with `opacity: 0; transform: translateY(20px)`) and add the `.visible` class only from scroll event handlers inside `useEffect`.
4. Consider using `IntersectionObserver` instead of scroll position calculations — it integrates more cleanly with React's lifecycle.

**Detection warning signs:** Console warning "Text content did not match" or "Hydration failed because the initial UI does not match". Sections of the page disappear or flash on load.

**Phase:** Scroll animation component phase.

---

## Moderate Pitfalls

---

### Pitfall 5: WebGL Canvas Resolution on High-DPI Mobile Devices

**What goes wrong:** The current code sets renderer size to `window.innerWidth, window.innerHeight` without accounting for `window.devicePixelRatio`. On Retina/OLED mobile screens (2x or 3x DPR), this means the canvas renders at half or one-third the physical pixel density, producing a blurry fractal on mobile — which directly contradicts the portfolio's goal of signaling technical polish.

Conversely, calling `renderer.setPixelRatio(window.devicePixelRatio)` without limiting it causes the 400-iteration Mandelbrot shader to run at 3x resolution on a 3x DPR device, tripling GPU work and causing severe frame drops on mobile GPUs.

**Why it happens:** Desktop development never exposes the DPR problem. The issue only manifests on physical mobile devices.

**Prevention:**
1. Cap pixel ratio: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` — 2x is sufficient for visual quality and keeps mobile GPU load manageable.
2. Pair with adaptive iteration count: reduce `maxIter` from 400 on mobile (detect via `navigator.hardwareConcurrency` or screen width heuristic).
3. Test on a real mobile device (not just Chrome DevTools emulation) — DevTools DPR simulation does not accurately test GPU load.

**Detection warning signs:** Fractal looks blurry on phone but sharp on desktop. Frame rate drops below 30fps on mobile. Battery drains unusually fast while viewing the portfolio.

**Phase:** WebGL optimization / mobile pass.

---

### Pitfall 6: CSS-in-JS vs CSS Modules — Wrong Choice Cascades

**What goes wrong:** The existing codebase has significant CSS specificity conflicts (duplicate `#Ty` rules), magic number percentages, and grid definitions scattered across 6 breakpoints. Migrating this into CSS-in-JS (styled-components or Emotion) adds a runtime dependency, increases bundle size, and complicates SSR (server must serialize styles to prevent FOUC). CSS Modules avoid SSR issues but require renaming all class selectors and breaking the existing global cascade.

Developers often pick styled-components because it looks clean, then discover hydration-style injection issues with Next.js App Router, or pick CSS Modules but don't account for global styles (body, canvas, etc.) needing a separate global stylesheet.

**Prevention:**
1. Use CSS Modules for component-scoped styles. Use a single `globals.css` for base resets, body background, canvas positioning, and font face declarations.
2. Avoid styled-components or Emotion unless the team already knows them — they add SSR complexity with no benefit for a single-developer portfolio.
3. Convert the existing `styles.css` magic numbers to CSS custom properties during migration rather than porting them as-is.
4. The canvas must be positioned with global CSS (`position: fixed`, `z-index: -1`) — this belongs in `globals.css`, not a CSS Module.

**Detection warning signs:** Styles flash on first load (FOUC). CSS class names like `[component]_className__hash` breaking specificity. Global canvas styles being scoped incorrectly.

**Phase:** Styling migration phase.

---

### Pitfall 7: `offsetTop` Scroll Calculations Break in React Component Trees

**What goes wrong:** The existing scroll handler uses `terminal.offsetTop` and `terminal.offsetHeight` to determine visibility. These values are relative to the offset parent, which can change depending on how React component trees are structured. If a terminal section is inside a `<main>` with `position: relative`, `offsetTop` returns a value relative to that element, not the page — breaking the scroll calculation entirely.

**Why it happens:** Vanilla HTML had a flat DOM where `offsetTop` was reliably relative to the document. React components introduce wrapper divs, layout containers, and context providers that alter the offset parent chain unexpectedly.

**Prevention:**
1. Replace `offsetTop`/`offsetHeight` calculations with `IntersectionObserver` — it is position-independent and works regardless of component nesting.
2. If scroll position is still needed, use `element.getBoundingClientRect().top` relative to `window.innerHeight`, not `offsetTop`.
3. The CONCERNS.md already flagged this as fragile — treat migration as an opportunity to replace the pattern entirely.

**Detection warning signs:** Terminal sections never become visible. Sections become visible immediately regardless of scroll position. Inconsistent behavior between viewport sizes.

**Phase:** Scroll animation component phase.

---

### Pitfall 8: Three.js Resize Handler Causes Memory Leaks in React

**What goes wrong:** The current code attaches `window.addEventListener('resize', ...)` at module scope. In a React component, this event listener must be registered in `useEffect` and cleaned up in the return function. If the cleanup is omitted, every time the component mounts (e.g., during React strict mode's double-invoke in development, or if the canvas component is conditionally rendered), a new listener is added without removing the old one. Over time this accumulates stale handlers that reference disposed Three.js objects, causing ghost renders and memory leaks.

Three.js itself also requires explicit disposal: `renderer.dispose()`, `geometry.dispose()`, `material.dispose()`. Omitting these causes GPU memory to leak on component unmount.

**Prevention:**
```tsx
useEffect(() => {
  // setup renderer, geometry, material, animate loop
  const handleResize = () => { /* ... */ };
  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
    cancelAnimationFrame(animFrameId);
    renderer.dispose();
    geometry.dispose();
    material.dispose();
  };
}, []);
```

**Detection warning signs:** Memory usage climbs in DevTools over repeated component mounts. Multiple resize events firing per scroll. `React StrictMode` causes double animation loop in development.

**Phase:** Three.js component migration phase.

---

### Pitfall 9: Mobile Viewport Height (`100vh`) Issues

**What goes wrong:** The existing CSS likely uses `100vh` for the full-screen canvas or hero sections. On iOS Safari and some Android browsers, `100vh` includes the browser chrome (address bar + navigation bar) when the page first loads. When the user scrolls and the browser chrome collapses, the viewport height changes, causing layout jumps. The canvas, which covers `100vw x 100vh`, visually shifts or clips.

This is a well-known mobile web bug that has caused entire redesigns in production portfolios.

**Prevention:**
1. Use `100dvh` (dynamic viewport height) where supported, with `100vh` as fallback.
2. For the Three.js canvas, use `window.innerHeight` for the renderer size (already done in the current code) rather than CSS `100vh` — this is the correct approach for WebGL.
3. Avoid relying on `100vh` for any element that must precisely fill the screen on mobile.

**Detection warning signs:** Canvas or background has a visible gap at the top on iOS Safari. Content jumps when scrolling starts on mobile. Address bar collapse causes layout reflow.

**Phase:** Mobile responsive pass.

---

### Pitfall 10: TypeScript Typing Three.js Uniforms and Refs

**What goes wrong:** When migrating the shader material to TypeScript, developers struggle with typing `useRef` for Three.js objects. Common mistakes: using `useRef<THREE.WebGLRenderer | null>(null)` but forgetting to null-check before calling renderer methods. Typing shader uniforms as `any` to avoid complexity, which defeats the purpose of TypeScript. Using generic `HTMLCanvasElement` ref without understanding that Three.js creates and appends its own canvas.

**Prevention:**
1. Type the renderer ref as `useRef<THREE.WebGLRenderer | null>(null)`.
2. Always null-check: `if (!rendererRef.current) return;` at the start of effects.
3. Type uniforms explicitly: create an interface for the uniform values rather than using `any`.
4. The Three.js canvas is appended by `renderer.domElement` — use a container div ref and append the canvas to it, rather than passing a canvas element ref to Three.js.

**Detection warning signs:** TypeScript errors on uniform access. `Cannot read properties of null` runtime errors. `any` types appearing in the Three.js component.

**Phase:** Three.js component migration phase.

---

## Minor Pitfalls

---

### Pitfall 11: Next.js Image Optimization vs Static Export Mismatch

**What goes wrong:** If `output: 'export'` is used with Netlify, `next/image` requires `unoptimized: true` in `next.config.ts` or the build fails. Developers add `next/image` for the project screenshots expecting automatic optimization, then get build errors or broken images in production.

**Prevention:** Either use Vercel (where `next/image` works natively) or set `images: { unoptimized: true }` in `next.config.ts` when using static export. Document this decision explicitly in the config file.

**Phase:** Infrastructure phase.

---

### Pitfall 12: Font Loading Flicker with Cascadia Code

**What goes wrong:** The terminal aesthetic depends on Cascadia Code as the monospace font. If the font is loaded via a CSS `@font-face` from a local file or Google Fonts `<link>`, there is a flash of fallback monospace font on first load — usually Courier New or system monospace — before Cascadia Code loads. On a terminal-aesthetic portfolio this is visually jarring.

**Prevention:**
1. Use `next/font` to load Cascadia Code (or its closest available equivalent). Next.js `next/font` eliminates layout shift by preloading fonts at build time.
2. If Cascadia Code is not available in Google Fonts, host the woff2 file locally and use `next/font/local`.
3. Set `font-display: swap` and choose a fallback monospace font with similar metrics (e.g., `'Cascadia Code', 'Fira Code', 'Consolas', monospace`).

**Detection warning signs:** Font flicker visible on slow connections. Lighthouse reports "Ensure text remains visible during webfont load".

**Phase:** Styling foundation phase.

---

### Pitfall 13: Scroll Throttle Implementation in React

**What goes wrong:** CONCERNS.md flags the unthrottled scroll handler. When migrating to React, developers often add `useCallback` to the scroll handler thinking it throttles execution — it does not. `useCallback` only memoizes the function reference; it does not rate-limit calls.

**Prevention:**
1. Use `requestAnimationFrame`-based throttling inside `useEffect`.
2. Or use `IntersectionObserver` entirely — this eliminates the scroll handler and its throttling problem simultaneously.
3. Do not use lodash `throttle` unless lodash is already a dependency — the `rAF` pattern achieves the same result with no additional bundle cost.

**Phase:** Scroll animation component phase.

---

### Pitfall 14: Contact Form Accessibility Regression During Migration

**What goes wrong:** CONCERNS.md documents that the existing form uses placeholder-only labels (fails WCAG 2.1 AA). When building the React form component, it is tempting to port the HTML as-is. This carries the accessibility debt forward and is a missed opportunity.

**Prevention:** When building the contact form component, treat it as a rewrite rather than a port. Add `<label htmlFor="...">` elements (React uses `htmlFor`, not `for`). Use `aria-describedby` for validation error messages. Add client-side validation with visible error states before Netlify/API submission.

**Phase:** Contact form component phase.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|---|---|---|
| Project scaffold / infra setup | `output: 'export'` feature limitations discovered late | Lock in Netlify vs Vercel decision before writing any page code |
| Three.js component migration | SSR crash (`document is not defined`) | Wrap entirely in `useEffect`, import with `ssr: false` |
| Three.js component migration | Memory leaks from missing cleanup | Always return cleanup function from `useEffect` with dispose calls |
| Scroll animation | `offsetTop` breaks in React tree | Replace with IntersectionObserver |
| Scroll animation | Hydration mismatch from scroll state | Never set scroll-derived state during render |
| Styling migration | Global canvas styles scoped to component | Canvas base styles go in `globals.css` |
| Styling migration | Font flicker | Use `next/font/local` for Cascadia Code |
| Contact form | Netlify form bot misses form markup | Confirm form HTML present in `next export` output |
| Contact form | Accessibility regression | Rebuild with proper labels, not ported as-is |
| Mobile responsive | `100vh` iOS Safari jump | Use `100dvh` with `100vh` fallback |
| Mobile responsive | Blurry fractal on Retina screens | Cap `devicePixelRatio` at 2, reduce shader iterations |
| TypeScript migration | Untyped Three.js refs and uniforms | Define explicit interfaces for shader uniforms |

---

## Sources

- Codebase analysis: `C:\Users\tybox\Documents\GitHub\Portfolio\.planning\codebase\CONCERNS.md`
- Project requirements: `C:\Users\tybox\Documents\GitHub\Portfolio\.planning\PROJECT.md`
- Direct code inspection: `scriptGL.js` (Three.js module-scope initialization, resize handler, scroll listener)
- Direct code inspection: `index.html` (Netlify form markup, canvas element, Three.js CDN import)
- Next.js SSR behavior: well-established pattern documented in Next.js official docs (dynamic imports with `ssr: false`)
- Netlify Forms detection: requires static HTML presence at build-time scan — documented in Netlify Forms docs
- Three.js React disposal pattern: documented in Three.js official documentation and community best practices
- iOS Safari `100vh` bug: documented in web.dev and MDN as motivation for `dvh` CSS unit (CSS Values Level 4)
- Confidence: HIGH for SSR/hydration pitfalls (reproducible, deterministic failures); HIGH for Netlify Forms (documented constraint); MEDIUM for mobile DPR/shader performance (device-dependent, tested pattern but hardware varies)
