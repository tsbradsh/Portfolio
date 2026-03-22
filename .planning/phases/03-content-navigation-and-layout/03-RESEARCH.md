# Phase 03: Content, Navigation and Layout - Research

**Researched:** 2026-03-22
**Domain:** React/Next.js 16 App Router component composition, IntersectionObserver, responsive nav, image serving
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Animation style: fade-in + upward drift — `opacity: 0 → 1`, `transform: translateY(24px) → translateY(0)`. No horizontal slide.
- **D-02:** Bidirectional — sections fade out (return to initial state) when scrolled past in either direction.
- **D-03:** Whole card animates as one unit — no child stagger, no sequencing within a card.
- **D-04:** Trigger threshold: ~15–20% (`threshold: 0.15`).
- **D-05:** Hamburger is the primary open/close trigger. Tapping the overlay (`#overlay`) is a second close trigger.
- **D-06:** Tapping any nav link automatically closes the mobile nav.
- **D-07:** Mobile nav flattens the Projects dropdown — no caret, no submenu. Direct links at same level.
- **D-08:** Desktop nav is sticky (`position: sticky; top: 0`).
- **D-09:** Each project card has a single-image-at-a-time gallery — one image visible, others accessible via prev/next.
- **D-10:** Project card headers use clean project names — no Windows-path chrome.
- **D-11:** Text content (descriptions) length and framing is Claude's discretion — optimize for recruiter hirability signal.
- **D-12:** Links that are not yet available (AI Music Tool live URL, Resume PDF) are hidden entirely — no disabled state, no "coming soon" label.
- **D-13:** Remove exploratory-only ML tools: Magenta, Magenta.js, TensorFlow, PyTorch.
- **D-14:** Add database skills: SQL++, NORMA, ORM.
- **D-15:** Adobe CC stays.
- **D-16:** Category names and structure are Claude's discretion — restructure to 3–4 categories.

### Claude's Discretion

- Exact `translateY` distance for reveal animation (suggested: 24px — confirmed in UI-SPEC)
- Transition duration and easing for reveal (suggested: 400ms ease — confirmed in UI-SPEC)
- Skills category names and grouping (chosen in UI-SPEC: Frontend / Backend & Data / Design & Motion / Workflow)
- Project card description copy (length, framing, outcomes) — provided verbatim in UI-SPEC copywriting contract
- Image gallery interaction pattern (confirmed: prev/next arrows + dot indicators)
- Which images from `assets/` to use per project (confirmed in UI-SPEC per-project table)

### Deferred Ideas (OUT OF SCOPE)

- Reduced motion preference for reveal animations — Phase 5 (ADV-02 v2)
- Shared scroll context (React Context for ScrollY) — not needed; IntersectionObserver is self-contained
- "Coming soon" / disabled state for missing links — rejected in favor of hiding entirely (D-12)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | All placeholder links replaced with real URLs: GitHub, LinkedIn, When You Sleep repo, Red Clover repo | URLs are locked in CONTEXT.md — wire as `<a href="...">` in Nav and ContactSection |
| CONT-02 | Each project card displays title, description (2–3 sentences), tech stack, and available links | UI-SPEC provides verbatim copy; gallery pattern researched below |
| CONT-03 | Identity/about section clearly communicates Tyler's name, role, and what he builds within 10 seconds | UI-SPEC provides verbatim hero copy; InfoSection is a static server component |
| CONT-04 | Skills section grouped by category (Languages / Frameworks / Tools) listing only production-ready skills | Category structure locked in UI-SPEC; implementation is a static server component |
| NAV-01 | Layout is fully responsive and functional on mobile phones | Breakpoints at 768px; hamburger nav pattern researched below |
| NAV-02 | Hamburger navigation opens, closes, and keyboard-navigates correctly on mobile | ARIA pattern, Escape key, overlay close, link auto-close — all researched below |
| NAV-03 | Section reveal animations implemented via Intersection Observer | `useRef` + `useEffect` custom hook pattern researched and documented below |
</phase_requirements>

---

## Summary

Phase 3 builds the full site: six section components (Info, Skills, three Project cards, Contact), a Nav component with hamburger mobile behavior, scroll-reveal animations, and image serving from the existing `assets/` directory.

The stack is completely locked: Next.js 16 App Router, React 19, TypeScript strict, CSS Modules, no external UI libraries. The key architectural question is which components need `'use client'` — only those with event handlers or browser APIs (Nav for hamburger state, ProjectCard for gallery index state, section wrappers for IntersectionObserver). All content-only sections (InfoSection, SkillsSection, ContactSection) can be server components with thin client wrappers for reveal animation.

The assets are already present at `assets/wys/`, `assets/AI/`, `assets/RCSS/`, `assets/1x/` in the project root — but they must be copied to `public/assets/` to be served by Next.js static export. The `next.config.ts` already has `images: { unoptimized: true }` which is the correct configuration for `output: 'export'`.

**Primary recommendation:** Use a `useReveal` custom hook (encapsulating IntersectionObserver) applied at the section level. Nav and ProjectCard are `'use client'` components. All other section components are server components. Copy assets from root `assets/` to `public/assets/` before wiring any `<img src>` paths.

---

## Standard Stack

### Core (already installed — no new installs needed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | ^16.2.1 | Framework, App Router, static export | Project constraint |
| react | ^19.0.0 | Component model | Project constraint |
| typescript | ^5 | Type safety | Project constraint |

**No new npm packages needed for Phase 3.** All functionality (IntersectionObserver, CSS transitions, image serving, hamburger nav) is implemented with browser APIs and the existing stack. The decision to hand-roll everything is a locked project constraint (no component libraries).

### Supporting (browser APIs — no install)

| API | Purpose | When to Use |
|-----|---------|-------------|
| `IntersectionObserver` | Detect when sections enter/exit viewport | Section reveal animations (NAV-03) |
| `useState` | Track nav open/closed, gallery current index | Nav, ProjectCard |
| `useRef` | Attach observer to DOM elements, ref nav elements | Section wrappers, Nav |
| `useEffect` | Register/cleanup IntersectionObserver, keyboard listeners | useReveal hook, Nav |

**Version verification:** No new packages to verify. `next@16.2.1`, `react@19.0.0` — confirmed in `package.json`.

---

## Architecture Patterns

### Recommended Project Structure

```
app/
├── components/
│   ├── Nav.tsx                    # 'use client' — hamburger state, dropdown
│   ├── Nav.module.css
│   ├── InfoSection.tsx            # server component — static content
│   ├── InfoSection.module.css
│   ├── SkillsSection.tsx          # server component — static content
│   ├── SkillsSection.module.css
│   ├── ProjectCard.tsx            # 'use client' — gallery index state
│   ├── ProjectCard.module.css
│   ├── ContactSection.tsx         # server component — static content + placeholder form
│   ├── ContactSection.module.css
│   ├── MandelbrotCanvas.tsx       # existing — 'use client'
│   └── MandelbrotCanvas.module.css
├── hooks/
│   └── useReveal.ts               # custom hook — IntersectionObserver + class toggle
├── layout.tsx                     # server component — imports Nav, sets sticky wrapper
├── page.tsx                       # server component — composes all sections
└── globals.css                    # add .section-hidden / .section-visible utility classes
public/
└── assets/
    ├── 1x/                        # logo, wordmark, Ty.jpg — copied from root assets/1x/
    ├── wys/                       # When You Sleep images
    ├── AI/                        # AI Music Tool images
    └── RCSS/                      # Red Clover Sugar Studio images
```

### Pattern 1: Server Component Layout with Client Component Nav Island

`layout.tsx` stays a server component. `Nav.tsx` is a `'use client'` component imported into it. This is the official Next.js pattern — server component wrapping a client island.

```tsx
// app/layout.tsx — server component (no 'use client')
import Nav from './components/Nav'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cascadiaCode.variable}>
      <body>
        <Nav />
        <div id="overlay" />
        {children}
      </body>
    </html>
  )
}
```

```tsx
// app/components/Nav.tsx — client component
'use client'
import { useState, useEffect, useRef } from 'react'
```

**Why:** `layout.tsx` must not be marked `'use client'` — doing so makes the entire layout tree client-only, breaking RSC payload optimizations. Import client components into server layouts instead.

**Source:** Next.js official docs — "Server and Client Components" (nextjs.org, verified 2026-03-22, version 16.2.1)

### Pattern 2: useReveal Hook with IntersectionObserver

A custom hook centralizes the observer logic. Section components attach a `ref` and receive a `isVisible` boolean (or simply a class name) back.

```tsx
// app/hooks/useReveal.ts
'use client' // only needed if this hook uses browser APIs at module level — as a hook it's always client-side
import { useEffect, useRef } from 'react'

export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('section-visible')
          el.classList.remove('section-hidden')
        } else {
          el.classList.remove('section-visible')
          el.classList.add('section-hidden')
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}
```

**Usage in a section component (must be 'use client' to use the hook):**

```tsx
// app/components/InfoSection.tsx
'use client'
import { useReveal } from '../hooks/useReveal'

export default function InfoSection() {
  const ref = useReveal<HTMLElement>()
  return (
    <section id="info" ref={ref} className={`terminal-card section-hidden`}>
      {/* content */}
    </section>
  )
}
```

**Critical note:** Any component that uses `useReveal` must be `'use client'` because hooks cannot run in server components. Since all section content is static (no data fetching), the cost of marking sections `'use client'` is minimal — it doesn't prevent SSR of the HTML, it only hydrates event handling on the client.

**Bidirectional behavior:** The observer callback fires on both entry (`isIntersecting: true`) and exit (`isIntersecting: false`). Removing `section-visible` and re-adding `section-hidden` on exit achieves the bidirectional fade-out. This works because `threshold: 0.15` fires when 15% of the element crosses the boundary in either direction.

**Source:** MDN IntersectionObserver API (bidirectional firing confirmed — the callback fires on both intersection and dis-intersection). WebSearch verified pattern in Next.js context, 2025.

### Pattern 3: Mobile Nav State Management

```tsx
// app/components/Nav.tsx
'use client'
import { useState, useEffect, useCallback } from 'react'
import styles from './Nav.module.css'

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  const close = useCallback(() => setIsOpen(false), [])

  // Escape key closes nav
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, close])

  // Body scroll lock when nav is open on mobile
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <nav className={styles.nav}>
      {/* hamburger button */}
      <button
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
        aria-controls="links"
        className={styles.hamburger}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span className={isOpen ? styles.barTopOpen : styles.barTop} />
        <span className={isOpen ? styles.barMidOpen : styles.barMid} />
        <span className={isOpen ? styles.barBotOpen : styles.barBot} />
      </button>

      {/* overlay — tap to close */}
      {isOpen && (
        <div
          id="overlay"
          className={styles.overlay}
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* nav links */}
      <ul
        id="links"
        className={`${styles.links} ${isOpen ? styles.open : ''}`}
        role="list"
      >
        {/* nav items — each with onClick={close} for auto-close on mobile */}
      </ul>
    </nav>
  )
}
```

**ARIA pattern verified:** `aria-expanded`, `aria-controls`, `aria-label` on hamburger button is the correct W3C pattern for disclosure navigation. No `role="dialog"` needed for a simple slide-out nav drawer (that's for modal dialogs). The nav list needs no special ARIA roles beyond `role="list"` because it's a `<ul>` inside a `<nav>`.

**Source:** W3C ARIA Authoring Practices — Disclosure Navigation Menu pattern. WebSearch confirmed pattern, 2025.

### Pattern 4: Single-Image Gallery with useState

```tsx
// Inside ProjectCard.tsx
'use client'
import { useState } from 'react'

const images = [
  { src: '/assets/wys/wys.png', alt: 'When You Sleep — homepage' },
  { src: '/assets/wys/mockup.png', alt: 'When You Sleep — mockup' },
  // ...
]

export default function ProjectCard() {
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent(i => Math.max(0, i - 1))
  const next = () => setCurrent(i => Math.min(images.length - 1, i + 1))

  return (
    <div className={styles.gallery} aria-live="polite">
      <img
        src={images[current].src}
        alt={images[current].alt}
        className={styles.image}
      />
      <button
        onClick={prev}
        aria-label="Previous image"
        disabled={current === 0}
        className={styles.arrowBtn}
      >&#8592;</button>
      <button
        onClick={next}
        aria-label="Next image"
        disabled={current === images.length - 1}
        className={styles.arrowBtn}
      >&#8594;</button>
      {/* dot indicators */}
      <div className={styles.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
```

**Note:** Use `<img>` (plain HTML) not `next/image` here. With `output: 'export'` and `images: { unoptimized: true }`, both work — but plain `<img>` is simpler and avoids the width/height requirement that `next/image` enforces.

### Pattern 5: Image Asset Serving

Assets currently live at `/assets/wys/`, `/assets/AI/`, `/assets/RCSS/`, `/assets/1x/` in the project root. Next.js only serves static files from `public/`. Files must be copied to `public/assets/` to be available at `/assets/...` URL paths.

```
Source:      assets/wys/wys.png
Destination: public/assets/wys/wys.png
URL in code: /assets/wys/wys.png
```

**Copy command:**
```bash
cp -r assets/* public/assets/
```

After copying, reference in components as `/assets/1x/Ty.jpg`, `/assets/wys/wys.png`, etc.

**Source:** Next.js official docs — "public Folder" (nextjs.org, verified 2026-03-22, version 16.2.1)

### Anti-Patterns to Avoid

- **Marking `layout.tsx` as `'use client'`:** Converts the entire layout tree to client-only rendering. Keep layout a server component; import client Nav as an island.
- **Registering IntersectionObserver directly in a server component:** Server components do not execute in the browser. Observer registration must be inside `useEffect` in a `'use client'` component.
- **Referencing `assets/` images without copying to `public/`:** Next.js static export does not serve files from the project root — only from `public/`. Images will 404 in production.
- **Using `next/image` without explicit `width` and `height` props:** With `unoptimized: true`, `next/image` still requires `width` and `height` or `fill` — use plain `<img>` for gallery images to avoid this constraint.
- **Attaching scroll event listeners for reveal animations:** `IntersectionObserver` is async, runs off the main thread, and does not require calculating `offsetTop`. Scroll listeners require throttling and manual position math — fragile and worse performance.
- **Adding `aria-expanded` to `<ul>` (the nav list):** `aria-expanded` belongs on the `<button>` trigger, not the controlled element. The `<ul>` uses `aria-controls` relationship via the button's `aria-controls` attribute.
- **Implementing a full focus trap for the hamburger nav:** A full focus trap (Tab cycling within nav) is only required for modal dialogs per WAI-ARIA. A slide-out nav drawer follows the Disclosure pattern — Escape closes it, focus returns to trigger, but Tab can move out of the nav.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll position tracking for reveal | Custom scroll listener with offsetTop math | `IntersectionObserver` browser API | Async, off-main-thread, handles bidirectional automatically, no position calculations |
| Image optimization | Custom sharp/imagemin pipeline | Plain `<img>` with `unoptimized: true` | Static export constraint; images are already appropriately sized |
| Hamburger animation | JS-based transform calculations | CSS class swap on `<span>` bars | `transform: rotate()` + `opacity` transitions in CSS are GPU-accelerated and simpler |

**Key insight:** This phase adds zero new npm dependencies. All patterns are browser APIs and CSS — the correct approach for a Next.js static portfolio with no external UI library constraint.

---

## Common Pitfalls

### Pitfall 1: Assets not copied to public/ before wiring image paths

**What goes wrong:** `<img src="/assets/wys/wys.png">` returns 404 in dev and after build because Next.js only serves `public/` directory contents as static files.

**Why it happens:** The root-level `assets/` directory is the original vanilla HTML project's asset location. Next.js does not serve the project root — only `public/`.

**How to avoid:** Copy `assets/*` to `public/assets/` as the first task in Wave 1. Wire all image paths after the copy is complete.

**Warning signs:** `GET /assets/... 404` in browser devtools during development.

### Pitfall 2: useReveal hook used in a server component

**What goes wrong:** TypeScript error or runtime crash — "useState/useEffect is not a function" or "Hooks can only be called inside a function component."

**Why it happens:** Server components do not run in the browser. Hooks (`useEffect`, `useRef`) are React client-side features.

**How to avoid:** Any component that calls `useReveal` must have `'use client'` at the top. Since all section components will use the hook, they all become client components. This is fine — their HTML is still pre-rendered during `next build`.

**Warning signs:** Build error: `Error: useEffect is not a function` or `You're importing a component that needs useState`.

### Pitfall 3: Bidirectional animation flicker at the 15% boundary

**What goes wrong:** When a card is ~15% visible at the viewport boundary, rapidly scrolling triggers rapid add/remove of `section-visible`/`section-hidden`, causing a visible flicker.

**Why it happens:** `IntersectionObserver` fires on both entry and exit at the same threshold. At the boundary, micro-scrolling can trigger multiple callbacks.

**How to avoid:** Use CSS transitions with `transition: opacity 400ms ease, transform 400ms ease` on the element. The 400ms duration absorbs micro-oscillations — the animation completes before the next callback fires in normal scrolling. Do not use JavaScript timers for this.

**Warning signs:** Visible flash when slowly scrolling a card in/out at the 15% boundary in Chrome devtools with slow scroll emulation.

### Pitfall 4: Desktop dropdown closes when clicking inside submenu

**What goes wrong:** The archive's `window.addEventListener('click', ...)` pattern catches all click events and closes the dropdown even when clicking dropdown items.

**Why it happens:** Event bubbling — clicks on dropdown items bubble up to `window`. The archive code checks `!projectDropdown.contains(e.target)` but this logic is easy to get wrong in React where re-renders create new elements.

**How to avoid:** In React, handle dropdown state with `useState` + `onBlur` or a `useClickOutside` hook that checks `ref.current.contains(event.target)`. Alternatively, use `onMouseLeave` to close on desktop where it's less likely to accidentally close. Per the UI-SPEC, the desktop dropdown uses a caret button — wire `onClick` on the caret to toggle, and close on outside click via `useEffect` with a document click listener that checks `ref.contains`.

**Warning signs:** User clicks a dropdown item and nothing happens because the dropdown closed before the link fired.

### Pitfall 5: Body scroll not locked when mobile nav is open

**What goes wrong:** When the mobile nav overlay is open, the page scrolls behind it. IntersectionObserver fires for sections behind the overlay, triggering reveal animations the user cannot see.

**Why it happens:** Fixed/overlay elements do not prevent scroll on `<body>` by default.

**How to avoid:** Toggle `document.body.style.overflow = 'hidden'` when the mobile nav opens. Restore it on close and on component unmount (useEffect cleanup).

**Warning signs:** Mobile nav opens, user can still scroll the page underneath.

### Pitfall 6: `next/image` with static export requires width + height or fill

**What goes wrong:** Build error — "Image with src '...' must use 'width' and 'height' properties or 'layout=fill'."

**Why it happens:** `next/image` enforces layout stability even when `unoptimized: true`. The component requires explicit dimensions for layout shift prevention.

**How to avoid:** Use plain `<img>` elements for gallery images where dimensions vary. For known fixed-size images (logo, wordmark, portrait), using `next/image` with explicit `width`/`height` is fine but not required. The project's `next.config.ts` already has `images: { unoptimized: true }` which handles the optimization block.

**Warning signs:** `next build` fails with `Error: Invalid src prop`.

---

## Code Examples

### CSS Reveal Animation Classes (add to globals.css)

```css
/* Source: 03-UI-SPEC.md Section 6 */
.section-hidden {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity var(--transition-slow), transform var(--transition-slow);
}

.section-visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Hamburger Bar Animation (CSS Modules)

```css
/* Nav.module.css */
.bar {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-teal);
  transition: transform 200ms ease, opacity 200ms ease;
  transform-origin: center;
}

.barTopOpen {
  composes: bar;
  transform: translateY(6px) rotate(45deg);
}

.barMidOpen {
  composes: bar;
  opacity: 0;
}

.barBotOpen {
  composes: bar;
  transform: translateY(-6px) rotate(-45deg);
}
```

### Nav Link Auto-Close Pattern

```tsx
// Each nav link calls close() on click — works for both mobile and desktop
// In Nav.tsx
<a href="#info" onClick={() => setIsOpen(false)} className={styles.link}>
  INFO
</a>
```

### Desktop Projects Dropdown (click-outside close)

```tsx
// Nav.tsx — click outside to close dropdown
const dropdownRef = useRef<HTMLDivElement>(null)
const [dropOpen, setDropOpen] = useState(false)

useEffect(() => {
  if (!dropOpen) return
  const handler = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setDropOpen(false)
    }
  }
  document.addEventListener('mousedown', handler)
  return () => document.removeEventListener('mousedown', handler)
}, [dropOpen])
```

### Focus-Visible Global Rule (add to globals.css)

```css
/* Port from archive — applies to all interactive elements */
:focus-visible {
  outline: 2px solid var(--color-teal);
  outline-offset: 3px;
}
```

### Skip Link (add to layout.tsx body)

```tsx
{/* Skip link for keyboard accessibility — matches archive pattern */}
<a href="#main-content" className="skip-link">Skip to main content</a>
```

```css
/* globals.css */
.skip-link {
  position: absolute;
  top: -100%;
  left: var(--space-2);
  background: var(--color-teal);
  color: var(--color-bg);
  padding: var(--space-1) var(--space-2);
  z-index: 200;
  font-weight: 600;
}
.skip-link:focus {
  top: var(--space-2);
}
```

---

## State of the Art

| Old Approach (archive) | Current Approach (Phase 3) | When Changed | Impact |
|------------------------|----------------------------|--------------|--------|
| `offsetTop` + scroll event listener for reveal | `IntersectionObserver` with `threshold: 0.15` | ES2016 / browser support ~2017 | No position math, async, bidirectional with zero extra code |
| `window.addEventListener('click')` for dropdown close | `useEffect` + `document.addEventListener('mousedown')` with `ref.contains()` | React ecosystem pattern ~2019 | React-safe, cleans up on unmount |
| Vanilla JS `classList.toggle` | React `useState` + conditional className | React migration | Declarative — state drives DOM, not imperative mutations |
| CDN Three.js + `<script defer>` | npm `three` + `'use client'` + `useEffect` | Phase 2 complete | TypeScript types, tree-shaking, React lifecycle safety |
| `document.querySelector` for nav elements | `useRef<HTMLElement>` | React migration | React-idiomatic, avoids stale references |

**Deprecated/outdated:**
- `<svg role="button">` for caret: WCAG violation — use native `<button>` (UI-SPEC specifies this from the start, not porting the anti-pattern)
- Scroll event listeners for viewport detection: superseded by IntersectionObserver (97.9% global browser support as of 2025)

---

## Open Questions

1. **Focus management when mobile nav closes via Escape key**
   - What we know: Pressing Escape should close the nav and return focus to the hamburger button
   - What's unclear: The `useEffect` cleanup pattern for returning focus reliably across React re-renders
   - Recommendation: In the Escape handler, after calling `setIsOpen(false)`, also call `hamburgerRef.current?.focus()`. Use a `useRef` on the hamburger button.

2. **Overlay element placement — layout.tsx vs Nav.tsx**
   - What we know: UI-SPEC places `<div id="overlay">` in page-level stack, but mobile overlay is Nav state-dependent
   - What's unclear: Whether overlay lives in `layout.tsx` (always rendered, hidden via CSS) or inside `Nav.tsx` (conditionally rendered with React)
   - Recommendation: Render overlay inside `Nav.tsx` with conditional rendering `{isOpen && <div className={styles.overlay} onClick={close} />}`. Cleaner than CSS-hiding a persistent element. `z-index` must be 50 (between page content at 0 and nav at 100).

3. **ProjectCard: single component vs three named components**
   - What we know: UI-SPEC says "reusable ProjectCard.tsx or three named components"
   - What's unclear: Whether the image arrays and copy are data-driven props or hardcoded per-component
   - Recommendation: Single `ProjectCard.tsx` that accepts `images`, `title`, `description`, `techStack`, `links` as props. Data defined as typed constants in `page.tsx` or a `data/projects.ts` file. Avoids three near-identical files.

---

## Validation Architecture

**nyquist_validation is enabled.** No automated test framework (Jest, Vitest, Playwright) is installed in this project. This is a UI-heavy phase — all requirements are visual/interactive and verified through browser inspection, not automated tests.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None installed — manual browser verification only |
| Config file | None |
| Quick run command | `npm run dev` — inspect in browser |
| Full suite command | `npm run build && npx serve out` — verify production static export |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 | All nav + social links resolve to correct URLs | manual | Inspect `<a href>` in devtools | ❌ Wave 0 |
| CONT-02 | Project cards render title, description, tech stack, links | manual | Visual inspection at `/` | ❌ Wave 0 |
| CONT-03 | Hero copy visible above fold within 10 seconds | manual | Load `http://localhost:3000` | ❌ Wave 0 |
| CONT-04 | Skills section shows correct categories/skills | manual | Visual inspection at `#skills` | ❌ Wave 0 |
| NAV-01 | Site usable on 375px viewport | manual | Chrome devtools mobile emulation | ❌ Wave 0 |
| NAV-02 | Hamburger opens/closes, Escape works, link tap closes | manual | Keyboard + touch test | ❌ Wave 0 |
| NAV-03 | Sections fade in/out on scroll with 0.15 threshold | manual | Scroll page, observe transitions | ❌ Wave 0 |

**Build verification (automatable):**
```bash
npm run build
# Expect: exit 0, no TypeScript errors, no ESLint errors
```

### Sampling Rate

- **Per task commit:** `npm run build` — confirms TypeScript compiles and no broken imports
- **Per wave merge:** `npm run build && npx serve out` — verify static export renders correctly in browser
- **Phase gate:** Full manual browser checklist before `/gsd:verify-work`

### Wave 0 Gaps

- No automated test framework — this is acceptable for a portfolio with purely visual requirements. Manual verification via browser devtools covers all requirements.
- `npm run build` serves as the automated gate (TypeScript + ESLint strictness catches structural errors).

None — no test infrastructure to create. Manual browser verification is the appropriate validation approach for this phase.

---

## Sources

### Primary (HIGH confidence)

- Next.js official docs — "Server and Client Components" (nextjs.org, version 16.2.1, verified 2026-03-22)
- Next.js official docs — "public Folder" static asset serving (nextjs.org, version 16.2.1, verified 2026-03-22)
- Project codebase — `package.json`, `next.config.ts`, `app/globals.css`, `app/layout.tsx`, `app/page.tsx` (verified directly, 2026-03-22)
- Project UI-SPEC — `.planning/phases/03-content-navigation-and-layout/03-UI-SPEC.md` (authoritative design contract)
- Project CONTEXT.md — `.planning/phases/03-content-navigation-and-layout/03-CONTEXT.md` (locked decisions)

### Secondary (MEDIUM confidence)

- WebSearch: "Next.js 15 App Router IntersectionObserver useEffect scroll reveal animation 2025" — confirmed `useEffect` + `IntersectionObserver` hook pattern, multiple 2025 articles agree
- WebSearch: "Next.js App Router sticky nav layout.tsx server component client component pattern 2025" — confirmed server layout + client Nav island pattern
- WebSearch: "React hamburger nav mobile keyboard accessibility aria-expanded escape key focus trap 2025" — confirmed Disclosure pattern (not dialog ARIA), Escape key handler, aria-expanded on button

### Tertiary (LOW confidence)

- None — all critical claims verified against official docs or directly from codebase.

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified directly from package.json and next.config.ts
- Architecture patterns: HIGH — verified against Next.js 16.2.1 official docs
- Pitfalls: HIGH — most are directly derived from code inspection (assets/ not in public/, etc.)
- IntersectionObserver bidirectional: HIGH — MDN spec behavior, confirmed by multiple 2025 articles
- ARIA nav patterns: MEDIUM — WebSearch confirmed, not cross-checked against ARIA spec directly

**Research date:** 2026-03-22
**Valid until:** 2026-06-22 (stable APIs — IntersectionObserver, Next.js App Router patterns change slowly)
