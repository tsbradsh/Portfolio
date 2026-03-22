# Architecture Patterns

**Domain:** Next.js + TypeScript developer portfolio with Three.js WebGL background
**Researched:** 2026-03-21
**Confidence:** HIGH (Next.js App Router + Three.js SSR patterns are well-established; codebase fully analyzed)

---

## Recommended Architecture

Single-page feel via Next.js App Router with one root `page.tsx` rendering all sections vertically. No client-side routing needed — the site is a scrolling single page, not a multi-page app. Static export (`output: 'export'`) keeps Netlify compatibility.

```
app/
  layout.tsx          ← RootLayout: fonts, metadata, body shell
  page.tsx            ← Assembles all sections in order
  globals.css         ← Global token styles (colors, typography)

components/
  canvas/
    MandelbrotCanvas.tsx   ← Three.js WebGL (client-only, dynamic import)
    useMandelbrot.ts       ← Hook: scene setup, animation loop, uniforms
    useScrollShader.ts     ← Hook: scroll → targetZoom/targetHueOffset → uniform updates
  layout/
    Nav.tsx                ← Sticky nav, hamburger state, dropdown
    Footer.tsx             ← Copyright line
    Overlay.tsx            ← Fixed overlay div (opacity driven by scroll context)
  sections/
    HeroSection.tsx        ← Scroll anchor target: #home (sr-only h1)
    InfoSection.tsx        ← About + profile photo
    SkillsSection.tsx      ← Skills grid (three categories)
    ProjectsSection.tsx    ← Wrapper, renders ProjectCard for each project
    ContactSection.tsx     ← Netlify form
  ui/
    TerminalWindow.tsx     ← Reusable terminal chrome (header bar + body slot)
    TerminalImage.tsx      ← Single image with terminal header path label
    ProjectCard.tsx        ← One project: body text + image grid
    SkillCategory.tsx      ← One column of skills list
    NavDropdown.tsx        ← Projects submenu
    HamburgerButton.tsx    ← Three-span button with aria-expanded
  providers/
    ScrollProvider.tsx     ← Context: scrollY, visibleSections set

lib/
  projectData.ts           ← Static data: projects array (name, desc, links, images)
  skillsData.ts            ← Static data: skill categories array
  constants.ts             ← Design tokens mirrored in TS (colors, breakpoints)

public/
  assets/                  ← Images moved here (Next.js static serving)
    1x/
    wys/
    AI/
    RCSS/
```

---

## The Three.js SSR Problem — Concrete Solution

**Why it breaks:** Next.js App Router renders components on the server by default. Three.js accesses `window`, `document`, and the WebGL API — none of which exist in Node.js. Importing Three.js in a server component causes a runtime crash on build.

**Solution: `next/dynamic` with `ssr: false` at the page boundary.**

This is the standard, well-supported pattern. The dynamic import wraps the entire canvas component so the module is never evaluated during SSR.

```typescript
// app/page.tsx
import dynamic from 'next/dynamic'

const MandelbrotCanvas = dynamic(
  () => import('@/components/canvas/MandelbrotCanvas'),
  {
    ssr: false,
    loading: () => null, // canvas appears after hydration — acceptable for a background
  }
)

export default function Page() {
  return (
    <>
      <MandelbrotCanvas />
      <Nav />
      <main id="main-content">
        <InfoSection />
        <SkillsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
```

**Inside `MandelbrotCanvas.tsx`:** Mark with `'use client'` at the top. Use `useEffect` for Three.js initialization (runs only in browser). Attach the canvas to a `<div ref={containerRef}>` rather than `document.body` to avoid hydration conflicts. Return a `<canvas>` element via JSX — do not use `renderer.domElement` appended imperatively to the body (the existing vanilla pattern).

```typescript
'use client'
// MandelbrotCanvas.tsx — simplified structure
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function MandelbrotCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    // Three.js init: renderer, scene, camera, geometry, shader material
    // Attach renderer.domElement to mount
    // Start animation loop
    // Return cleanup: cancelAnimationFrame, renderer.dispose()
  }, [])

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: 'fixed', inset: 0, zIndex: 0 }}
    />
  )
}
```

**Why not `useRef` on `<canvas>` directly:** The Three.js `WebGLRenderer` creates its own canvas element. Letting Three.js own the element and appending it to a container div is simpler than passing a ref and using `canvas` option on the constructor. Both work; container-div approach has less friction.

**Why not R3F (React Three Fiber):** This portfolio has a single well-defined shader — no scene graph complexity, no interactive 3D objects. R3F adds ~200KB and significant API surface for zero benefit over raw Three.js. Avoid it here. [MEDIUM confidence — R3F bundle size is approximate from community reports]

---

## Component Boundaries

### What is a Server Component vs Client Component

| Component | Type | Reason |
|-----------|------|--------|
| `app/layout.tsx` | Server | Renders HTML shell, metadata only |
| `app/page.tsx` | Server | Assembles sections; delegates interactivity to children |
| `MandelbrotCanvas` | Client (`'use client'`) | WebGL, window, requestAnimationFrame |
| `Nav` | Client | useState for open/closed, hamburger toggle |
| `NavDropdown` | Client | useState for dropdown open state |
| `HamburgerButton` | Client | onClick, aria-expanded toggle |
| `Overlay` | Client | Reads scroll context |
| `ScrollProvider` | Client | window.addEventListener('scroll', ...) |
| `InfoSection` | Server | Static content, no interactivity |
| `SkillsSection` | Server | Static content |
| `ProjectCard` | Server | Static content + Next.js `<Image>` |
| `TerminalWindow` | Server | Pure layout wrapper |
| `TerminalImage` | Server | Pure layout wrapper |
| `ContactSection` | Client | Form state, Netlify submission |

Server components render faster and don't inflate the client JS bundle. Push `'use client'` as far down the tree as possible — specifically to the leaf components that actually need browser APIs.

---

## Scroll Animation Approach in React

**Do not use:** raw `window.addEventListener('scroll', ...)` scattered across components. That pattern does not compose in React and creates memory leak risk if cleanup is missed.

**Recommended approach: Intersection Observer API via a custom hook, with a ScrollProvider for shared state.**

### Why Intersection Observer over scroll events

The existing code uses a raw scroll listener that manually calculates `offsetTop` vs `scrollY`. In React this is fragile — component measurements change after hydration and layout shifts. Intersection Observer is:

- Browser-native (no library needed)
- Performance-optimized (browser calls callback off main thread)
- Simpler to wire in React via `useEffect` + `ref`
- Correct after hydration (fires when element enters viewport regardless of layout)

### Terminal reveal pattern (replacing `.visible` class toggle)

```typescript
// hooks/useIntersectionReveal.ts
import { useEffect, useRef, useState } from 'react'

export function useIntersectionReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}
```

Apply in `TerminalWindow`:

```typescript
// TerminalWindow renders with `isVisible` driving a CSS class
const { ref, isVisible } = useIntersectionReveal()
return (
  <div ref={ref} className={`win-terminal ${isVisible ? 'visible' : ''}`}>
    {children}
  </div>
)
```

This directly replaces the existing scroll loop in `scriptGL.js` lines 82–95.

### WebGL shader scroll (zoom + hue)

The fractal zoom/hue behavior requires continuous scroll position, not just entry detection. Use a `ScrollProvider` that exposes `scrollY` via context, consumed only by `MandelbrotCanvas`.

```typescript
// providers/ScrollProvider.tsx
'use client'
import { createContext, useContext, useEffect, useState } from 'react'

const ScrollContext = createContext({ scrollY: 0 })

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    let ticking = false
    const handler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return <ScrollContext.Provider value={{ scrollY }}>{children}</ScrollContext.Provider>
}

export const useScrollY = () => useContext(ScrollContext)
```

The `ticking` pattern (rAF-throttled scroll) replaces the unthrottled scroll listener — fixes the known performance concern in PROJECT.md.

**Do not use Framer Motion for this project.** The scroll animations here are CSS opacity/transform reveals and GLSL uniform updates. Framer Motion adds ~50KB for behaviors achievable with Intersection Observer + CSS transitions. If motion complexity grows in a future milestone, reconsider.

---

## Page / Layout Structure (App Router)

```
app/
  layout.tsx
    <html lang="en">
      <body>
        <ScrollProvider>        ← wraps everything that needs scrollY
          <Nav />
          <Overlay />
          {children}            ← page.tsx output
          <Footer />
        </ScrollProvider>
      </body>
    </html>

  page.tsx
    <MandelbrotCanvas />        ← dynamic import, ssr:false, fixed position
    <main id="main-content">
      <HeroSection />           ← sr-only h1 for SEO
      <InfoSection />
      <SkillsSection />
      <ProjectsSection />       ← maps over projectData array
      <ContactSection />
    </main>
```

### Metadata (Next.js App Router pattern)

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'Tyler Bradshaw — Development Portfolio',
  description: 'Artist-driven developer building tools...',
  openGraph: { ... },
  themeColor: '#0a0a0a',
}
```

This replaces the `<meta>` tags in `index.html` head. No `next/head` needed in App Router.

### Static Export for Netlify

```javascript
// next.config.ts
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }, // required for static export
}
```

Netlify Forms require the form HTML to be present in the deployed output. With `output: 'export'`, the form renders to static HTML at build time — Netlify can detect it. ContactSection must render its `<form name="contact" netlify>` as static server-side HTML (not dynamically added by JS). Since ContactSection renders on the server in App Router, this works correctly.

---

## Data Flow Direction

```
Static data (projectData.ts, skillsData.ts)
  → Page (server) → Section components (server) → TerminalWindow/ProjectCard (server)
  → Client hydration adds interactivity (Nav, ContactSection)

window.scrollY
  → ScrollProvider (client) → scrollY context
  → MandelbrotCanvas: targetZoom, targetHueOffset → Three.js uniforms → WebGL render
  → TerminalWindow (via Intersection Observer, independent of scroll context)

User input
  → Nav.tsx: hamburger/dropdown state (local useState, no context needed)
  → ContactSection: form state (local useState)
```

Data flows downward. No global state manager (Redux, Zustand) needed — the site has two isolated interactive concerns: nav state and scroll. Both are simple enough for local state or React context.

---

## Patterns to Follow

### Pattern 1: Compound terminal component

The `TerminalWindow` reusable component accepts a `title` prop (the fake path string) and `children`. Every section uses it. Prevents duplicating the chrome markup.

```typescript
interface TerminalWindowProps {
  title: string
  children: React.ReactNode
  className?: string
}

export function TerminalWindow({ title, children, className }: TerminalWindowProps) {
  const { ref, isVisible } = useIntersectionReveal()
  return (
    <div ref={ref} className={`win-terminal ${isVisible ? 'visible' : ''} ${className ?? ''}`}>
      <div className="win-terminal-header">
        <span className="win-terminal-title">{title}</span>
      </div>
      <div className="win-terminal-body">{children}</div>
    </div>
  )
}
```

### Pattern 2: Data-driven project sections

Define projects as a typed array in `lib/projectData.ts`. `ProjectsSection` maps over it. Adding a new project means adding one object — no new component file required.

```typescript
// lib/projectData.ts
export interface Project {
  id: string
  title: string
  terminalPath: string
  label: string
  techStack: string
  sections: { heading: string; body: string }[]
  links: { label: string; href: string; disabled?: boolean }[]
  images: { src: string; alt: string; terminalPath: string }[]
  imageGridVariant: 'grid' | 'grid2'
}

export const projects: Project[] = [ ... ]
```

### Pattern 3: `useEffect` cleanup discipline for Three.js

The animation loop and event listeners must clean up on unmount. The `MandelbrotCanvas` `useEffect` return must cancel the animation frame and call `renderer.dispose()`. Missing cleanup causes WebGL context leaks in development (hot reload triggers remount).

```typescript
useEffect(() => {
  // ... setup
  return () => {
    cancelAnimationFrame(animFrameId)
    renderer.dispose()
    mount.removeChild(renderer.domElement)
  }
}, [])
```

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Importing Three.js in a server component

**What:** `import * as THREE from 'three'` at the top of any file not behind `'use client'`
**Why bad:** Build fails with `ReferenceError: window is not defined`
**Instead:** Keep all Three.js code inside `MandelbrotCanvas.tsx` (client) and its hooks

### Anti-Pattern 2: Appending the renderer to `document.body`

**What:** `document.body.appendChild(renderer.domElement)` (current vanilla pattern, scriptGL.js line 8)
**Why bad:** Bypasses React's DOM reconciliation; causes hydration mismatches; difficult to clean up
**Instead:** Append to a ref-attached container div inside the component's JSX

### Anti-Pattern 3: Page-level `'use client'`

**What:** Adding `'use client'` to `app/page.tsx` or `app/layout.tsx`
**Why bad:** Converts the entire page to a client bundle; kills SSR benefits for SEO; inflates JS payload
**Instead:** Keep page/layout as server components; push client boundary to leaf components only

### Anti-Pattern 4: Unthrottled scroll listener

**What:** `window.addEventListener('scroll', handler)` firing synchronously on every scroll event
**Why bad:** Causes jank on low-end devices; existing code acknowledges this concern
**Instead:** rAF-throttled listener in ScrollProvider (pattern shown above)

### Anti-Pattern 5: CSS Modules for global terminal tokens

**What:** Scoping terminal window chrome in CSS Modules files
**Why bad:** The `.visible` animation class and terminal chrome styles must be globally accessible (used by Intersection Observer class toggle, applied across many components)
**Instead:** Global CSS in `globals.css` for design tokens and animation states; CSS Modules only for component-specific layout overrides if needed

---

## Build Order Dependencies

The following order is required — later items depend on earlier items being in place:

```
1. Project scaffold
   next.config.ts (output: 'export'), tsconfig.json, package.json
   → Required before any component can be written or tested

2. globals.css + design tokens
   Color variables, typography (Cascadia Code), terminal chrome base styles
   → Required before any component renders correctly

3. TerminalWindow + TerminalImage (ui/)
   The reusable wrappers used by every section
   → Required before any section component can be built

4. lib/projectData.ts + lib/skillsData.ts
   Static data shapes typed with interfaces
   → Required before ProjectsSection and SkillsSection can render

5. MandelbrotCanvas + hooks (canvas/)
   Three.js client component, useMandelbrot hook, useScrollShader hook
   → Independent of section components; can be built in parallel with step 4
   → Requires dynamic import wrapper in page.tsx to test

6. ScrollProvider (providers/)
   → Required before MandelbrotCanvas can consume scrollY
   → Required before Overlay opacity behavior works

7. Section components (sections/)
   InfoSection, SkillsSection, ProjectsSection, ContactSection
   → Each requires TerminalWindow (step 3) and data (step 4)
   → Can be built in parallel with each other after steps 3-4

8. Nav + HamburgerButton + NavDropdown (layout/)
   → Independent of section components
   → Requires globals.css for styling

9. app/layout.tsx + app/page.tsx
   Assembles everything; imports MandelbrotCanvas via dynamic()
   → Last to finalize, though scaffolded early

10. Metadata, SEO, Open Graph, structured data
    → Fills in layout.tsx metadata export after content is confirmed
```

**Parallelizable:** Steps 5, 7, and 8 can proceed simultaneously after steps 1-4 are complete.

---

## Scalability Considerations

This is a static portfolio — scalability is not a performance concern. The relevant "scale" question is maintainability as more projects are added.

| Concern | Current approach | Next.js approach |
|---------|-----------------|-----------------|
| Adding a project | Edit index.html, add duplicate HTML block | Add one object to `projectData.ts` |
| Changing terminal chrome | Edit every section's HTML | Edit `TerminalWindow.tsx` once |
| Responsive fixes | Edit CSS breakpoints globally | Same (globals.css retained) |
| Image optimization | Manual (plain `<img>`) | Next.js `<Image>` with lazy loading built in |
| WebGL on mobile | No fallback, continuous render | `useEffect` can check `navigator.maxTouchPoints` or a media query; skip canvas init on low-power hint |

---

## Sources

- Next.js App Router documentation (nextjs.org/docs) — `output: 'export'`, dynamic imports, metadata API, server/client component boundary rules [HIGH confidence — verified against known Next.js 14/15 App Router stable API]
- Three.js r158 (the version already in use) — WebGLRenderer, ShaderMaterial, uniforms API [HIGH confidence — directly read from scriptGL.js]
- Intersection Observer API — MDN standard, supported in all modern browsers including iOS Safari 12.2+ [HIGH confidence]
- `next/dynamic` with `ssr: false` — documented Next.js pattern for browser-only modules [HIGH confidence]
- rAF-throttled scroll listener pattern — well-established browser performance pattern [HIGH confidence]
- React `useEffect` cleanup for WebGL — standard React pattern for imperative resources [HIGH confidence]
- Netlify Forms with static export — requires form HTML in static output; App Router server rendering satisfies this [MEDIUM confidence — Netlify Forms + Next.js static export combination should be validated during ContactSection phase]
