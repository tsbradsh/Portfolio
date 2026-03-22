# Phase 3: Content, Navigation and Layout - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Build all section components (Info/About, Skills, Projects x3, Contact placeholder), replace all placeholder links with real URLs, make the site fully usable on mobile phones, and implement scroll-triggered section reveal animations via Intersection Observer. Contact form logic is Phase 4. SEO and performance are Phase 5.

</domain>

<decisions>
## Implementation Decisions

### Section reveal animations
- **D-01:** Animation style: fade-in + upward drift — `opacity: 0 → 1`, `transform: translateY(24px) → translateY(0)`. No horizontal slide.
- **D-02:** Bidirectional — sections fade out (return to initial state) when scrolled past in either direction. IntersectionObserver `threshold` handles both entry and exit.
- **D-03:** Whole card animates as one unit — no child stagger, no sequencing within a card.
- **D-04:** Trigger threshold: ~15–20% (`threshold: 0.15`) — card begins entering viewport before animation fires. Early enough for a smooth lead-in, not so early it hides the Mandelbrot fractal while the page is fresh.

### Mobile navigation UX
- **D-05:** Hamburger is the primary open/close trigger. Tapping the overlay (`#overlay`) is a second close trigger.
- **D-06:** Tapping any nav link automatically closes the mobile nav.
- **D-07:** Mobile nav flattens the Projects dropdown — no caret, no submenu. When You Sleep, AI Music Tool, and Red Clover Sugar Studio appear as direct links at the same level as other nav items.
- **D-08:** Desktop nav is sticky (`position: sticky; top: 0`) — stays visible while scrolling.

### Project section layout
- **D-09:** Each project card has a single-image-at-a-time gallery — one image visible by default, others accessible (e.g. previous/next controls or thumbnail strip). Works at all viewport sizes including mobile.
- **D-10:** Project card headers use clean project names — no Windows-path chrome (`C:\Users\...`). Consistent with the elevated terminal aesthetic established in Phase 2.
- **D-11:** Text content (descriptions, background, process, results) length and framing is Claude's discretion — optimize for recruiter hirability signal, tight and outcome-focused.
- **D-12:** Links that are not yet available (AI Music Tool live URL, Resume PDF) are hidden entirely — no disabled state, no "coming soon" label.

### Skills content
- **D-13:** Remove exploratory-only ML tools: Magenta, Magenta.js, TensorFlow, PyTorch — not interview-ready.
- **D-14:** Add database skills: SQL++, NORMA, ORM (relational database integration with Python and other languages).
- **D-15:** Adobe CC stays — Tyler has substantial training and is comfortable discussing it in an interview. Signals design crossover intentionally.
- **D-16:** Category names and structure are Claude's discretion — restructure from the archive's "Frontend / Backend & AI / Tools" to whatever grouping best signals breadth and design sensibility. Aim for 3–4 categories.

### Claude's Discretion
- Exact `translateY` distance for reveal animation (suggested: 24px)
- Transition duration and easing for reveal (suggested: 400ms ease)
- Skills category names and grouping
- Project card description copy (length, framing, outcomes)
- Image gallery interaction pattern (prev/next arrows, thumbnail strip, dot indicators)
- Which images from `_archive/assets/` to use per project

</decisions>

<specifics>
## Specific Ideas

- Reveal animation: "faded up into view as the user scrolls down" — upward drift, not side-slide
- Mobile nav: individual project links instead of nested dropdown — cleaner for touch targets
- Project gallery: "one image set as default shown at a given time" — single-image gallery, not a grid
- Skills: SQL++, NORMA, ORM added — these tie Python and other languages to relational databases

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing source content (archive — reference, do not restore)
- `_archive/index.html` — Full HTML for all sections: Info/About copy, Skills list, all three project cards (descriptions, tech stacks), Contact section, Nav structure. Use as content source, not as code to port verbatim.
- `_archive/scriptGL.js` lines 128–201 — Original scroll reveal logic (`offsetTop` + `classList.toggle`) and nav/dropdown handlers. Understand the behavior, replace the mechanism with IntersectionObserver and React state.
- `_archive/styles.css` — Original responsive breakpoints (768px, 1024px, 1200px), grid layouts, animation classes. Reference for layout intent, not for copy-paste.

### Design tokens and utility classes (must use)
- `app/globals.css` — All design tokens (`--color-bg`, `--color-surface`, `--color-teal`, `--glow-teal`, `--radius-card`, spacing, transitions). `.terminal-card` utility class (background, border, glow, radius) — all section cards MUST use this class or its token values.

### Current app scaffold (integration points)
- `app/page.tsx` — Currently renders only `<MandelbrotCanvas />` + placeholder `<main>`. Phase 3 fills this with section components.
- `app/layout.tsx` — Root layout with Cascadia Code font variable (`--font-mono`), sticky nav goes here or in page.tsx.
- `app/components/MandelbrotCanvas.tsx` — Fixed full-screen canvas at `z-index: -1`. All new content renders above it via `position: relative` or `z-index >= 0`.

### Requirements (full text)
- `.planning/REQUIREMENTS.md` — CONT-01 through CONT-04, NAV-01 through NAV-03 (content, links, mobile, reveal animation requirements)
- `.planning/ROADMAP.md` — Phase 3 success criteria (5 items — verify all are met before phase complete)

### Project asset images
- `_archive/assets/wys/` — When You Sleep project screenshots
- `_archive/assets/AI/` — AI Music Tool diagrams/screenshots
- `_archive/assets/RCSS/` — Red Clover Sugar Studio screenshots
- `_archive/assets/1x/` — Logo, wordmark, self-portrait (Ty.jpg)

### Real URLs to wire (from REQUIREMENTS.md CONT-01)
- GitHub: `https://github.com/tsbradsh`
- LinkedIn: `https://www.linkedin.com/in/tsbw/`
- When You Sleep repo: `https://github.com/tsbradsh/lucid-eye`
- Red Clover repo: `https://github.com/tsbradsh/Final-Project`
- AI Music Tool: no URL yet — hide link per D-12
- Resume PDF: not available yet — hide link per D-12

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.terminal-card` (globals.css): Drop-in class for all section cards — surface color, teal border at 30% opacity, glow, 4px radius. All Phase 3 section components use this.
- `MandelbrotCanvas.tsx`: Already rendered in page.tsx. Phase 3 adds content siblings, not replacements.
- Design tokens: `--font-mono`, `--color-teal`, `--color-blue`, `--space-*`, `--text-*`, `--transition-slow` — all available globally.

### Established Patterns
- `'use client'` + `useEffect` for anything touching browser APIs (scroll, IntersectionObserver, window). Server components for static content.
- CSS Modules for component-scoped styles — follow `MandelbrotCanvas.module.css` pattern.
- No new color values — use existing tokens only.
- No Windows 95 chrome — clean headers, no title bars with path strings (Phase 2 decision).

### Integration Points
- `app/page.tsx`: Primary integration point — section components render here as children of `<main>`.
- `app/layout.tsx`: Nav component renders here (wraps all pages). Sticky positioning applied at layout level.
- `app/globals.css`: Add any new global utility classes here (e.g. reveal animation base styles).
- Assets: Copy images from `_archive/assets/` to `public/assets/` for Next.js static serving.

</code_context>

<deferred>
## Deferred Ideas

- Reduced motion preference for reveal animations — noted in Phase 2 deferred; revisit in Phase 5 polish (ADV-02 in v2 requirements)
- Shared scroll context (React Context for ScrollY) — not needed; IntersectionObserver is self-contained per component
- "Coming soon" / disabled state for missing links — rejected in favor of hiding entirely (D-12)

</deferred>

---

*Phase: 03-content-navigation-and-layout*
*Context gathered: 2026-03-22*
