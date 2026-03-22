---
phase: 03
phase_name: content-navigation-and-layout
status: draft
created: 2026-03-22
tool: none
registry: not-applicable
---

# UI-SPEC: Phase 03 — Content, Navigation and Layout

> Visual and interaction contract for Phase 3. All downstream agents (planner, executor, auditor) treat this document as the authoritative design source of truth for this phase.

---

## 1. Design System

**Tool:** None (CSS Modules + CSS custom properties — no shadcn, no Tailwind)
**Source of truth:** `app/globals.css` — all tokens defined on `:root`, available globally
**Component pattern:** CSS Modules per component (follow `MandelbrotCanvas.module.css`)
**No new color values** — use existing tokens only (CONTEXT.md code_context, established in Phase 1)

---

## 2. Spacing

Scale: 8px grid with 4px half-step. Source: `globals.css` Phase 1 tokens.

| Token | Value | Use |
|-------|-------|-----|
| `--space-half` | 4px | Icon gaps, tight internal spacing |
| `--space-1` | 8px | Small internal padding, gap between inline elements |
| `--space-2` | 16px | Standard padding within card bodies |
| `--space-3` | 24px | Card section vertical rhythm, heading margin |
| `--space-4` | 32px | Card padding, section gap |
| `--space-6` | 48px | Between major sections on desktop |
| `--space-8` | 64px | Page-level vertical padding, hero area |
| `--space-10` | 80px | Nav height clearance (sticky nav offset) |
| `--space-16` | 128px | Not used in Phase 3 |

**Touch target exception:** Hamburger button minimum 44×44px. Nav link tap targets minimum 44px tall on mobile.

**Reveal animation offset:** `translateY(24px)` initial state — 24px chosen from Claude's discretion range specified in CONTEXT.md D-01.

---

## 3. Typography

**Font:** Cascadia Code via `--font-mono` CSS variable (loaded in `layout.tsx`, weight 400 + 600)
**Fallback stack:** Consolas, 'Courier New', monospace
**Body color:** `var(--color-teal)` — `#00ffcc`
**Secondary text color:** `var(--color-blue)` — `#7dd3fc` (section labels, metadata)

### Sizes (4 declared — use tokens only)

| Token | Value | Role |
|-------|-------|------|
| `--text-sm` | 14px | Nav links, metadata labels, tech stack tags, footer |
| `--text-base` | 16px | Body copy, form labels, card body text |
| `--text-lg` | 20px | Section subheadings (h3), project title labels |
| `--text-xl` | 32px | Hero name (h1), not used in section cards |

### Weights (2 declared)

| Weight | Value | Use |
|--------|-------|-----|
| Regular | 400 | All body copy, nav links, descriptions |
| Semibold | 600 | Section label keys (`NAME:`, `TECH STACK:`), hero name, button text |

### Line heights

- Body: `1.5` (established in `globals.css` body rule)
- Headings: `1.2` (applied via component CSS Modules)
- Nav links: `1` (single-line, vertically centered via flexbox)

---

## 4. Color

**Source:** `globals.css` Phase 1 tokens. No new values permitted.

### 60/30/10 Split

| Role | Token | Hex | Applied To |
|------|-------|-----|-----------|
| 60% dominant | `--color-bg` | `#0a0a0a` | Page background, fractal canvas backdrop |
| 30% secondary | `--color-surface` | `#111111` | All `.terminal-card` section card backgrounds |
| 10% accent | `--color-teal` | `#00ffcc` | Nav border, focus rings, key label text, CTA button borders, hamburger bars, active states |

### Accent Reserved-For List

`--color-teal` is used ONLY for:
- Nav bottom border + glow
- Hamburger button border and bar color
- Card border (`rgba(0, 255, 204, 0.3)` via `.terminal-card`)
- Card glow (`--glow-teal`)
- Focus-visible outline (`2px solid var(--color-teal)`)
- Section label keys in terminal style (`NAME:`, `TECH STACK:`, `BACKGROUND:`)
- CTA button border and hover fill
- Body and nav text (default color on `#0a0a0a`)

### Secondary Semantic Color

| Token | Hex | Reserved For |
|-------|-----|-------------|
| `--color-blue` | `#7dd3fc` | Section titles in card headers, secondary metadata, `RESUME` nav item (distinct from primary CTA) |
| `--color-surface-nav` | `rgba(10,10,10,0.95)` | Sticky nav background with blur |
| `--color-teal-subtle` | `rgba(0,255,204,0.15)` | Hover states on nav links, hamburger hover |
| `--color-error` | `#ff4d4d` | Not used in Phase 3 (form validation is Phase 4) |

### Overlay

`#overlay` element: `position: fixed`, full-screen, `background: rgba(0,0,0,0.5)`, `z-index` below mobile nav drawer but above page content. Visible when mobile nav is open; tap to close.

---

## 5. Component Inventory

All section cards MUST use `.terminal-card` utility class from `globals.css`.

### Nav Component (`app/layout.tsx` or `app/components/Nav.tsx`)

- `position: sticky; top: 0; z-index: 100`
- Height: `var(--space-10)` (80px)
- Background: `var(--color-surface-nav)` with `backdrop-filter: blur(8px)`
- Bottom border: `1px solid var(--color-teal)`
- Box-shadow: `var(--glow-teal-nav)`
- Logo: `assets/1x/logocolor.png` (height 70px)
- Wordmark: `assets/1x/wordmark.png` (height 50px)
- Desktop nav links: `border: 1px solid var(--color-teal)`, padding `var(--space-2)`, `font-size: var(--text-sm)`, color white, hover fills `--color-teal` with black text
- Social icons (GitHub, LinkedIn): smaller border box, `font-size: var(--text-sm)`
- Hamburger: `display: none` on desktop, visible at `≤768px`, `border: 1px solid var(--color-teal)`, 3 bars `background: var(--color-teal)`, animates to X on open

**Desktop dropdown (Projects):** Caret button triggers submenu with: When You Sleep, AI Music Tool, Red Clover Sugar Studio. Note: caret uses native `<button>` — SVG-as-button from archive is NOT reproduced (Phase 4 fixes accessibility; Phase 3 implements new clean version from the start).

**Mobile nav (≤768px):** Full-width overlay drawer. Projects dropdown flattened — all three project links appear as direct siblings to other nav items (D-07). Tapping any link closes nav (D-06). Overlay tap closes nav (D-05).

### Info / About Section (`app/components/InfoSection.tsx`)

Structure:
- Outer: `<section id="info">` with `.terminal-card` + reveal class
- Layout: two-column grid on desktop (text left, portrait right), single column on mobile
- Text column: name label, about paragraphs
- Portrait: `assets/1x/Ty.jpg`, `alt="Photo of Tyler Bradshaw"`
- Card header: clean project label, NOT a Windows path (D-10)

### Skills Section (`app/components/SkillsSection.tsx`)

Structure:
- Outer: `<section id="skills">` with `.terminal-card` + reveal class
- Layout: CSS grid, 3–4 columns on desktop, 1–2 columns on mobile
- Category grouping (Claude's discretion, D-16): 4 categories — **Frontend**, **Backend & Data**, **Design & Motion**, **Workflow**
- Skills list per D-13/D-14/D-15 (ML tools removed, SQL++/NORMA/ORM added, Adobe CC retained)

**Skills content by category:**

| Category | Skills |
|----------|--------|
| Frontend | HTML5 / CSS3 / JavaScript (ES6+), React / Next.js / TypeScript, Three.js / WebGL / GLSL |
| Backend & Data | Python / Node.js, SQL++ / NORMA / ORM, API Development & Integration |
| Design & Motion | Adobe Creative Cloud (Design / Motion), Wireframing & UI Design, Brand Storytelling |
| Workflow | Git / GitHub, Netlify / Vercel / Deployment |

### Project Cards (3 components)

Pattern: `app/components/ProjectCard.tsx` (reusable) or three named components.

Each card:
- Outer: `<section id="{slug}">` with `.terminal-card` + reveal class
- Header: clean project name — no Windows paths
- Tech stack: inline label row
- Description: 2–3 sentences, outcome-focused (see Copywriting section)
- Image gallery: single image visible at a time, prev/next arrow controls (D-09)
- Project links: `<a>` styled as `[ LABEL ]` buttons with teal border; hidden entirely when URL unavailable (D-12)

**Image gallery interaction:**
- One image visible at a time
- Prev/Next arrow buttons: `<button>` elements, `aria-label="Previous image"` / `"Next image"`
- Current image index tracked via React state (`useState`)
- Arrow buttons: `border: 1px solid var(--color-teal)`, padding `var(--space-1)`, teal color, hover fill
- Dot indicators below image: current dot filled `--color-teal`, others `--color-surface` with teal border
- On mobile: full width, arrows positioned at left/right edges of image container

**Per-project image assets** (copy from `_archive/assets/` to `public/assets/`):

| Project | Images |
|---------|--------|
| When You Sleep | `wys/wys.png`, `wys/mockup.png`, `wys/events.png`, `wys/wireframe.jpg` — default: `wys.png` |
| AI Music Tool | `AI/Wireframe.png`, `AI/Map.png`, `AI/Flow.png`, `AI/Concept.png` — default: `AI/Wireframe.png` |
| Red Clover Sugar Studio | `RCSS/Home.png`, `RCSS/Palette.png`, `RCSS/Calculator.png`, `RCSS/Ratio.png` — default: `RCSS/Home.png` |

### Contact Section (`app/components/ContactSection.tsx`)

- Outer: `<section id="connect">` with `.terminal-card` + reveal class
- Social links: GitHub (`https://github.com/tsbradsh`) and LinkedIn (`https://www.linkedin.com/in/tsbw/`) as `[ GITHUB ]` / `[ LINKEDIN ]` styled links
- Form: placeholder only — no Netlify wiring (Phase 4). Render form fields with labels, no submit action. Button renders but is out of scope for functional wiring.
- Fields: Name, Email, Message (textarea)

---

## 6. Reveal Animation

**Source:** CONTEXT.md D-01 through D-04

| Property | Value | Source |
|----------|-------|--------|
| Initial state | `opacity: 0; transform: translateY(24px)` | D-01, Claude's discretion |
| Visible state | `opacity: 1; transform: translateY(0)` | D-01 |
| Direction | Upward drift only — no horizontal slide | D-01 |
| Bidirectional | Yes — exits to initial state when scrolled past in either direction | D-02 |
| Unit of animation | Whole card as one unit — no child stagger | D-03 |
| IntersectionObserver threshold | `0.15` (15%) | D-04 |
| Transition duration | `400ms` | `--transition-slow` token, Claude's discretion |
| Easing | `ease` | Claude's discretion |
| CSS class pattern | `.section-hidden` (initial) → `.section-visible` (observed) | Defined in `globals.css` or component module |
| Implementation | `'use client'` component or hook using `IntersectionObserver` | CONTEXT.md code_context |

**Reduced motion:** Deferred to Phase 5 (ADV-02 v2). Do not implement `prefers-reduced-motion` in Phase 3.

**CSS for reveal states** (add to `globals.css`):
```css
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

---

## 7. Responsive Breakpoints

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Desktop | > 1024px | Two-column card layout (text + image), full nav with dropdown |
| Tablet | 769px – 1024px | Two-column where space permits, full nav |
| Mobile | ≤ 768px | Single column, hamburger nav, flattened projects dropdown |

**Mobile specifics:**
- Nav: hamburger visible, `#links` hidden until open, `position: fixed` full-width overlay
- Section cards: full width, `padding: var(--space-3)`
- Image gallery: full width, arrows inside image container
- Skills grid: 2 columns max on mobile, 1 column on very small screens (≤ 480px)
- Container padding: `var(--space-3)` on mobile, `var(--space-4)` on desktop

---

## 8. Copywriting Contract

### Primary CTAs (button and link labels)

| Element | Label |
|---------|-------|
| View live project button | `[ VIEW LIVE PROJECT ]` |
| View code button | `[ VIEW CODE ]` |
| Send form button | `[ SEND MESSAGE ]` |
| GitHub nav/social link | `[ GITHUB ]` |
| LinkedIn nav/social link | `[ LINKEDIN ]` |

**CTA formatting:** Uppercase, monospace, wrapped in `[` `]` brackets — consistent with terminal aesthetic.

**Hidden links (D-12):** AI Music Tool live URL and Resume PDF are hidden entirely — no disabled state, no label.

### Hero / About Copy

**Identity statement** (above the fold, within 10 seconds — CONT-03):

```
NAME: "Tyler Bradshaw"
ROLE: Full-Stack Developer

ABOUT:
Artist-driven developer building tools and digital experiences for
independent musicians and creatives. I combine front-end craft,
WebGL graphics, and Python-based AI to ship work that serves
creative freedom — not corporate templates.
```

*(Tightened from archive's two paragraphs into one outcome-focused paragraph. Recruiter-scannable in <10 seconds.)*

### Project Description Copy

**When You Sleep** (CONT-02):
```
BACKGROUND:
Built a custom responsive site for the band When You Sleep — dark
dreamscape aesthetic, animated logo, embedded EP streaming, event
feed, and storefront links. Every detail authored from scratch.

TECH STACK: HTML, CSS, JavaScript, Three.js, Adobe Creative Cloud

RESULTS:
Site became the band's launch hub, demonstrating motion design,
front-end development, and brand storytelling working as a system.
```

**AI Music Collaboration Tool** (CONT-02):
```
BACKGROUND:
Self-directed project building a local-first AI assistant that
learns from a musician's own recordings — not generic datasets.
Goal: faster creative flow with personal voice preserved.

TECH STACK: Python, MusicGen, open-source transformer models

RESULTS:
Early prototype generates MIDI and lyric sketches aligned to past
writing style. Architecture maps out onboarding, training, and
visual feedback phases.
```

**Red Clover Sugar Studio** (CONT-02):
```
BACKGROUND:
Designed and built the studio's first professional web presence —
informational layout for a wellness business entering the market.

TECH STACK: HTML, CSS, JavaScript, Git

RESULTS:
Delivered a polished, client-ready site with a wax ratio
calculator, pre/post-care sections, and a contact form — ready
for future e-commerce or booking integrations.
```

### Empty States

| Context | Copy |
|---------|-------|
| Image gallery (load error) | `[ IMAGE UNAVAILABLE ]` |
| No projects shown | Not applicable — all three projects always render |

### Error States

| Context | Copy |
|---------|-------|
| Image load failure | Replace `<img>` with teal-bordered box: `[ IMAGE UNAVAILABLE ]` in `--text-sm`, color `--color-blue` |
| WebGL fallback (inherited from Phase 2) | CSS gradient background renders — no Phase 3 copy needed |

### Destructive Actions

No destructive actions exist in Phase 3. Contact form submit is Phase 4.

---

## 9. Interactive State Definitions

### Nav Links

| State | Visual |
|-------|--------|
| Default | White text, `border: 1px solid var(--color-teal)`, padding `var(--space-2)` |
| Hover | `background: var(--color-teal)`, color `#0a0a0a`, `border-color: #0a0a0a` |
| Focus-visible | `outline: 2px solid var(--color-teal)`, `outline-offset: 3px` |
| Active (current section) | Not implemented in Phase 3 — deferred |

### CTA Buttons / Links

| State | Visual |
|-------|--------|
| Default | `border: 1px solid var(--color-teal)`, color `var(--color-teal)`, background transparent |
| Hover | `background: var(--color-teal)`, color `#0a0a0a` |
| Focus-visible | `outline: 2px solid var(--color-teal)`, `outline-offset: 3px` |

### Hamburger Button

| State | Visual |
|-------|--------|
| Closed | 3 horizontal bars, `background: var(--color-teal)` |
| Open | Middle bar fades out, top/bottom rotate to X. Transition: `200ms ease` |
| Hover | `background: var(--color-teal-subtle)` on button |

### Gallery Arrows

| State | Visual |
|-------|--------|
| Default | `border: 1px solid var(--color-teal)`, color `var(--color-teal)`, background transparent |
| Hover | `background: var(--color-teal-subtle)` |
| Disabled (at first/last image) | `opacity: 0.3`, `cursor: default` |
| Focus-visible | `outline: 2px solid var(--color-teal)`, `outline-offset: 3px` |

### Gallery Dot Indicators

| State | Visual |
|-------|--------|
| Inactive | `border: 1px solid var(--color-teal)`, background transparent, 8×8px circle |
| Active | `background: var(--color-teal)`, no border, 8×8px circle |

---

## 10. Layout Patterns

### Page-Level Stack

```
<html>
  <body>
    <Nav />                  ← sticky, z-index 100
    <div id="overlay" />     ← fixed, z-index 50 (mobile only, behind nav)
    <MandelbrotCanvas />     ← fixed, z-index -1 (already rendered)
    <main>                   ← position: relative, z-index 0
      <InfoSection />
      <SkillsSection />
      <ProjectCard id="when-you-sleep" />
      <ProjectCard id="ai-music-tool" />
      <ProjectCard id="red-clover" />
      <ContactSection />
    </main>
    <footer />
  </body>
</html>
```

### Section Container

All sections use consistent outer padding:
- Desktop: `padding: var(--space-4)` on container, `margin-bottom: var(--space-6)` between sections
- Mobile: `padding: var(--space-3)`, `margin-bottom: var(--space-4)`

### Project Card Layout (Desktop)

Two columns via CSS Grid: `grid-template-columns: 1fr 1fr`
- Left: text content (label, description, tech stack, links)
- Right: image gallery

### Project Card Layout (Mobile)

Single column: image gallery stacks below text content.

---

## 11. Accessibility Contract

- All interactive elements reachable via keyboard (Tab, Enter, Space, Escape)
- Escape closes mobile nav
- Hamburger `<button>`: `aria-label="Open navigation"` / `"Close navigation"`, `aria-expanded` toggled
- Nav `<ul>`: `id="links"`, `aria-controls="links"` on hamburger
- Skip link: `<a href="#main-content" class="skip-link">Skip to main content</a>` — already in archive, port to layout
- Portrait image: `alt="Photo of Tyler Bradshaw"`
- Gallery arrows: `aria-label="Previous image"` / `"Next image"`
- Gallery: `aria-live="polite"` on image container for screen reader announcement of current image
- All project link `<a>` elements: descriptive text (not "click here"), e.g. `"[ VIEW CODE ]"` is acceptable
- Focus-visible: `2px solid var(--color-teal)`, `outline-offset: 3px` — defined in `globals.css` (already in archive, port to globals)

---

## 12. Registry

**Not applicable.** No shadcn, no third-party component registries. All components authored from scratch using CSS Modules and existing design tokens.

---

## 13. Pre-Population Sources

| Decision | Source |
|----------|--------|
| Spacing scale | `globals.css` Phase 1 tokens |
| Typography sizes + weights | `globals.css` Phase 1 tokens + `layout.tsx` font loading |
| Color palette | `globals.css` Phase 1 tokens |
| `.terminal-card` utility class | `globals.css` Phase 2 |
| Reveal animation: fade + upward drift, 0.15 threshold, bidirectional, whole-card | CONTEXT.md D-01 – D-04 |
| Mobile nav: hamburger primary, overlay secondary close, link auto-close, flat projects | CONTEXT.md D-05 – D-07 |
| Desktop nav: sticky | CONTEXT.md D-08 |
| Gallery: single image, prev/next | CONTEXT.md D-09 |
| Card headers: clean names, no Windows paths | CONTEXT.md D-10 |
| Copy framing: recruiter outcome-focused | CONTEXT.md D-11 |
| Hidden unavailable links | CONTEXT.md D-12 |
| Skills: ML tools removed, SQL++/NORMA/ORM added, Adobe CC kept | CONTEXT.md D-13 – D-15 |
| Skills categories: Claude's discretion | CONTEXT.md D-16 |
| Gallery transition duration 400ms, easing ease | Claude's discretion (CONTEXT.md range) |
| translateY 24px | Claude's discretion (CONTEXT.md suggestion confirmed) |
| Skills categories (Frontend / Backend & Data / Design & Motion / Workflow) | Claude's discretion |
| Project description copy | Claude's discretion (CONTEXT.md D-11) |
| Nav breakpoint ≤768px | `_archive/styles.css` |

---

*Phase: 03-content-navigation-and-layout*
*UI-SPEC created: 2026-03-22*
*Status: draft — awaiting gsd-ui-checker validation*
