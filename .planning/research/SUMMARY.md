# Project Research Summary

**Project:** Tyler Bradshaw Portfolio — Next.js + TypeScript Migration
**Domain:** Hirability-focused developer portfolio with WebGL generative art
**Researched:** 2026-03-21
**Confidence:** HIGH

## Executive Summary

This is a migration from a vanilla HTML/CSS/JS single-page portfolio to Next.js 15 + TypeScript, preserving an existing Three.js WebGL Mandelbrot fractal and a terminal aesthetic. The migration is motivated by hirability signal (modern stack), SEO (static generation + Metadata API), and maintainability (component architecture, typed data). The recommended approach is Next.js App Router with `output: 'export'` for Netlify static hosting, CSS Modules for component styles, `next/font/local` for Cascadia Code, and a single `'use client'` boundary around the WebGL canvas component initialized via `useEffect`. No server-side runtime features are required.

The most critical technical decision is the Three.js SSR boundary. Three.js accesses browser APIs (`window`, `document`, `WebGLRenderingContext`) that do not exist in Node.js, and the existing code initializes at module scope — a guaranteed crash in Next.js unless properly isolated. The correct pattern is `'use client'` + `useEffect` initialization, with `next/dynamic` (`ssr: false`) used at the page level as the import wrapper. This is the only architectural constraint that is non-negotiable; everything else is a quality-of-life decision.

The top risks are: (1) Netlify Forms failing silently if the contact form is rendered client-only rather than server-side, (2) hydration mismatches from scroll-state class toggles, and (3) mobile performance from unthrottled scroll events and uncapped shader GPU load. All three have clear, documented mitigations that must be implemented before launch. The portfolio is not a complex product — but it is a code sample, and the implementation quality is itself evaluated by technical hiring managers.

---

## Key Findings

### Recommended Stack

Next.js 15 App Router + TypeScript 5.x is the correct choice for this project. App Router is the current and future default; Pages Router is in maintenance mode. Static export (`output: 'export'`) keeps Netlify compatibility without requiring the OpenNext adapter, which is unnecessary for a portfolio with no runtime server requirements. Three.js should be installed via npm (not CDN) and upgraded from 0.158.0 to current stable to gain TypeScript types and module bundling. CSS Modules with a single `globals.css` for design tokens is the right CSS approach — Tailwind fights custom terminal aesthetics, and CSS-in-JS has documented compatibility issues with App Router.

**Core technologies:**
- **Next.js 15 (App Router):** React framework — Metadata API, SSG, static export. Pages Router is legacy; do not use it.
- **React 19:** Bundled with Next.js 15. No need to pin to 18.
- **TypeScript 5.x:** Built into `create-next-app`. Required for `async` Server Components; enables typed routes and full IntelliSense.
- **Three.js (latest stable via npm):** WebGL Mandelbrot fractal. Isolate entirely behind `'use client'` boundary.
- **CSS Modules + globals.css:** Component-scoped styles + design token layer. Zero additional dependencies.
- **`next/font/local`:** Self-hosted Cascadia Code — eliminates font load latency, prevents layout shift.
- **`next/image` (unoptimized):** Lazy loading and aspect ratio handling even without server-side optimization.
- **Netlify Forms:** Contact form backend — requires form HTML present in static output (App Router SSR satisfies this).
- **Turbopack:** Dev server — enabled with `next dev --turbo`; stable in Next.js 15.

See `.planning/research/STACK.md` for full rationale and alternatives considered.

### Expected Features

The research distinguishes three categories. Table stakes are non-negotiable for a hirability-focused portfolio; anti-features actively harm the hirability signal and must be explicitly avoided.

**Must have (table stakes):**
- About / identity section with clear role targeting — recruiters need 10-second comprehension
- Project showcase with real links — GitHub repos for lucid-eye and Final-Project are confirmed; AI Music Tool has no live URL yet
- Skills section grouped by category (not flat list) — ATS and technical recruiter scanning
- Working contact form — Netlify Forms integration; must be verified against static export output
- GitHub and LinkedIn links filled — tsbradsh / tsbw — no placeholder `href="#"` links in production
- Responsive mobile layout — currently broken on phones; this is a critical launch blocker
- Fast load time (under 3s mobile) — Core Web Vitals matter for perception of engineering quality
- SEO basics: title, description, Open Graph — Next.js Metadata API makes this low-cost

**Should have (differentiators):**
- WebGL Mandelbrot background — strong differentiator IF performant; liability if it causes jank
- Next.js + TypeScript stack choice — the stack itself is a portfolio piece
- Scroll-triggered section reveal animations — competence signal; must be subtle
- Adaptive WebGL quality — DPR cap + reduced shader iterations on mobile
- Lighthouse 90+ across all categories — shareable proof of engineering discipline
- Accessibility above WCAG AA — mature companies explicitly check this
- Structured data / JSON-LD — rare for portfolios; easy to add via App Router

**Defer (post-launch):**
- Resume PDF download — out of scope until Tyler has a PDF ready
- Full adaptive WebGL quality with device-capability detection — unblock launch with DPR cap first
- JSON-LD structured data — valuable but not launch-blocking
- AI Music Tool live URL — add when project goes live

See `.planning/research/FEATURES.md` for hirability-specific analysis by audience (recruiter, technical hiring manager, peer developer).

### Architecture Approach

The site is a scrolling single page rendered by one `app/page.tsx`. No client-side routing is needed. The key structural decision is where to draw the `'use client'` boundary: push it as far down the component tree as possible, limiting it to `MandelbrotCanvas`, `Nav`, `ContactSection`, `ScrollProvider`, and `Overlay`. All content sections (`InfoSection`, `SkillsSection`, `ProjectCard`, `TerminalWindow`) are Server Components that render with zero client JS. Scroll-triggered reveal animations use `IntersectionObserver` via a custom hook — this replaces the fragile `offsetTop` scroll calculations in the existing code and avoids hydration mismatches. Scroll position for WebGL shader uniforms flows through a rAF-throttled `ScrollProvider` context consumed only by `MandelbrotCanvas`.

**Major components:**
1. `MandelbrotCanvas` (Client) — Three.js WebGL, `useEffect` initialization, `useScrollShader` hook for zoom/hue uniforms, full cleanup on unmount
2. `ScrollProvider` (Client) — rAF-throttled `window.scrollY` via React context; replaces unthrottled raw scroll listener
3. `TerminalWindow` (Server + `useIntersectionReveal` hook) — reusable terminal chrome wrapper; drives reveal animation via `IntersectionObserver`
4. `Nav` (Client) — sticky nav with hamburger/dropdown state; local `useState` only
5. `ContactSection` (Client, SSR-rendered) — Netlify form with proper labels; renders in static HTML for Netlify bot detection
6. Section components: `InfoSection`, `SkillsSection`, `ProjectsSection` (Server) — static content, no client JS
7. `lib/projectData.ts` + `lib/skillsData.ts` — typed static data arrays; adding a project means adding one object

Build order: scaffold → globals.css + tokens → `TerminalWindow` → data files → `MandelbrotCanvas` + `ScrollProvider` (parallelizable) → section components + `Nav` (parallelizable) → assemble `layout.tsx` + `page.tsx` → metadata/SEO pass.

See `.planning/research/ARCHITECTURE.md` for full component tree, data flow diagram, and build dependency order.

### Critical Pitfalls

1. **Three.js module-scope initialization crashes SSR** — The existing `scriptGL.js` runs `new THREE.Scene()` and `document.querySelectorAll()` at module scope. In Next.js this causes `ReferenceError: document is not defined` at build time. Prevention: all Three.js code inside `'use client'` + `useEffect`; import the component via `next/dynamic` with `ssr: false` at the page level. This must be resolved before any other Three.js work begins.

2. **Netlify Forms bot misses client-rendered form markup** — Netlify detects forms by static HTML scan at deploy time. If the contact form renders only client-side, submissions silently fail. Prevention: keep `ContactSection` as an SSR component (do NOT wrap in `dynamic({ ssr: false })`); verify the form element appears in the `next build` HTML output before any form styling work.

3. **Hydration mismatch from scroll-state class toggles** — The existing scroll handler sets `.visible` classes, but the server renders with no scroll state. Prevention: never set scroll-derived state during render; use `IntersectionObserver` in `useEffect` only, so class changes happen post-hydration.

4. **Three.js memory leaks from missing cleanup** — Every `useEffect` that sets up a renderer, geometry, material, or event listener must return a cleanup function calling `renderer.dispose()`, `geometry.dispose()`, `material.dispose()`, `cancelAnimationFrame()`, and `removeEventListener()`. React Strict Mode's double-invoke in development will expose missing cleanup immediately.

5. **Mobile WebGL performance from uncapped DPR** — Rendering at full `devicePixelRatio` on 3x mobile screens triples GPU work for the 400-iteration Mandelbrot shader. Prevention: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` and reduce `maxIter` on mobile. Test on a real device, not Chrome DevTools emulation.

See `.planning/research/PITFALLS.md` for 14 pitfalls with detection warning signs and phase-specific warnings table.

---

## Implications for Roadmap

Based on the dependency order in ARCHITECTURE.md, the hirability priority ranking in FEATURES.md, and the phase-specific pitfall warnings in PITFALLS.md, the following phase structure is recommended.

### Phase 1: Infrastructure and Foundation

**Rationale:** Every subsequent phase depends on the Next.js scaffold, static export config, and global CSS tokens being in place. Hosting strategy must be locked in before writing any page code — `output: 'export'` limitations cascade to image handling, form handling, and deployment. This phase establishes the decisions that cannot be changed later without rewrites.

**Delivers:** Working Next.js 15 App Router project; `next.config.ts` with `output: 'export'` and `images: { unoptimized: true }`; `globals.css` with design tokens (colors, typography, terminal chrome base styles); Cascadia Code via `next/font/local`; `tsconfig.json`; Netlify deploy verified.

**Addresses:** SEO basics (metadata export scaffolded), fast load foundation (font preloading), Netlify compatibility.

**Avoids:** Pitfall 3 (`output: 'export'` feature limitations discovered late); Pitfall 6 (wrong CSS approach cascades); Pitfall 12 (font flicker).

**Research flag:** Standard patterns — skip `research-phase`. Next.js scaffold and static export are well-documented with official sources at HIGH confidence.

---

### Phase 2: WebGL Canvas Migration

**Rationale:** The Three.js component is the highest-risk element technically and the highest-value element visually. Isolating it early means the SSR boundary is established before any section components are written, preventing accidental server-component contamination. It can be built independently of content sections.

**Delivers:** `MandelbrotCanvas.tsx` (`'use client'`, `useEffect`, full cleanup); `useMandelbrot.ts` hook; `useScrollShader.ts` hook; `ScrollProvider` context (rAF-throttled); `next/dynamic` import in `page.tsx`; DPR capped at 2; graceful fallback for non-WebGL devices.

**Addresses:** WebGL graceful fallback requirement; adaptive WebGL quality (differentiator); performance optimization (scroll throttling).

**Avoids:** Pitfall 1 (SSR crash); Pitfall 4 (React hydration mismatch from scroll); Pitfall 5 (mobile DPR GPU overload); Pitfall 8 (memory leaks from missing cleanup); Pitfall 10 (TypeScript typing Three.js refs and uniforms).

**Research flag:** Needs careful implementation validation — `next/dynamic` with `ssr: false` pattern is documented but the scroll-shader coordination and cleanup discipline require test on real devices. Not a research-phase candidate; implementation-level verification is what matters.

---

### Phase 3: Content Sections and Navigation

**Rationale:** With the foundation and WebGL component in place, all content sections can be built in parallel. These are the lowest-risk phase items — Server Components rendering static typed data, using `TerminalWindow` as the shared wrapper. This phase also fills all placeholder links, which is the highest-impact hirability fix for minimum effort.

**Delivers:** `TerminalWindow` + `TerminalImage` reusable components; `lib/projectData.ts` + `lib/skillsData.ts` typed arrays; `InfoSection`, `SkillsSection`, `ProjectsSection`, `ProjectCard` (Server Components); `Nav` with hamburger/dropdown (Client Component); `HeroSection` with sr-only h1; all placeholder GitHub/LinkedIn/project links filled.

**Addresses:** About/identity section; project showcase with real links; skills section; GitHub + LinkedIn links; semantic HTML structure.

**Avoids:** Pitfall 7 (`offsetTop` scroll calculations — replaced with IntersectionObserver in `TerminalWindow`); anti-feature of placeholder/broken links.

**Research flag:** Standard patterns — skip `research-phase`. Server Components with typed data and IntersectionObserver reveals are established patterns at HIGH confidence.

---

### Phase 4: Contact Form and Accessibility

**Rationale:** Contact form is treated as its own phase because of the Netlify Forms + static export integration risk and the accessibility rebuild requirement. Doing it last (after section components are stable) means the form can be inspected in the actual static HTML output before any styling work begins.

**Delivers:** `ContactSection` with proper `<label htmlFor>` elements; `data-netlify="true"` + hidden `form-name` input; client-side validation with visible error states; WCAG 2.1 AA compliance on form; verified Netlify form detection in static output.

**Addresses:** Working contact method; accessibility fixes (form labels, semantic buttons); WCAG 2.1 AA compliance.

**Avoids:** Pitfall 2 (Netlify Forms silent failure); Pitfall 14 (contact form accessibility regression).

**Research flag:** Netlify Forms + Next.js static export combination is MEDIUM confidence — the pattern is documented but must be validated by inspecting the actual `out/` directory HTML. Plan a verification checkpoint before any styling work on the form.

---

### Phase 5: Mobile Responsive and Polish

**Rationale:** Mobile responsive work and performance/Lighthouse polishing are grouped together because they share the same testing environment (real devices) and feedback loop (Lighthouse audit). This phase finishes the portfolio to a launch-ready state. The mobile layout is currently broken and is a critical launch blocker, but it depends on content sections being stable.

**Delivers:** Responsive layout fixed across all breakpoints; `100dvh` with `100vh` fallback replacing `100vh` for canvas/hero; reduced Mandelbrot `maxIter` on mobile; Lighthouse 90+ target across all categories; Open Graph tags and metadata finalized; alt text audit; color contrast audit; structured data (JSON-LD) if time permits.

**Addresses:** Responsive mobile layout (critical launch blocker); fast load time (under 3s mobile); accessibility above WCAG AA; Lighthouse 90+ (differentiator); SEO and Open Graph.

**Avoids:** Pitfall 5 (mobile DPR — verify DPR cap is effective on real hardware); Pitfall 9 (iOS Safari `100vh` viewport jump); anti-feature of low contrast text.

**Research flag:** Standard patterns — skip `research-phase`. CSS responsive patterns and Lighthouse optimization are well-documented. Real-device testing is the key validation step, not research.

---

### Phase Ordering Rationale

- **Foundation must come first** because `output: 'export'` is an architectural constraint that affects every other phase decision (images, forms, routing). Changing it after content is built would require rewrites.
- **WebGL second** because it is the highest-risk component and benefits from being isolated before any section components are written. The `'use client'` boundary established here prevents accidental SSR contamination of content sections.
- **Content sections third** because they depend on `TerminalWindow` (Phase 1/2 foundation) and typed data structures, but are themselves dependencies for mobile responsive work (Phase 5). Building them before the form avoids coupling.
- **Contact form fourth** because it requires the static HTML output to be verifiable, which is only meaningful once the site structure is stable. Placing it here also isolates the Netlify Forms risk to a single phase.
- **Mobile + polish last** because responsive work and performance auditing are iterative and depend on stable content to audit against.

### Research Flags

Needs validation during implementation (not pre-phase research, but verification checkpoints):
- **Phase 2:** Three.js cleanup discipline and `useScrollShader` uniform updates — validate with real-device testing and React Strict Mode during development
- **Phase 4:** Netlify Forms detection — inspect the `out/` directory HTML after `next build` before any form styling; do not assume it works

Standard patterns (skip research-phase):
- **Phase 1:** Next.js 15 App Router scaffold with static export — official docs, HIGH confidence
- **Phase 3:** Server Components, IntersectionObserver reveals, typed data — well-established patterns
- **Phase 5:** CSS responsive patterns, Lighthouse optimization — standard domain knowledge

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Next.js 15 official docs verified; Three.js npm pattern confirmed; CSS Modules + static export is well-documented; only Three.js version upgrade (0.158 → latest) is MEDIUM due to changelog review needed |
| Features | MEDIUM-HIGH | Developer portfolio best practices are stable domain knowledge; WebSearch unavailable during research session; recommend spot-check against current industry sources before finalizing roadmap |
| Architecture | HIGH | App Router component boundaries, `next/dynamic` with `ssr: false`, IntersectionObserver, rAF throttle — all verified against official Next.js and MDN documentation |
| Pitfalls | HIGH | SSR/hydration pitfalls are deterministic and reproducible; Netlify Forms constraint is documented; mobile DPR performance is MEDIUM (device-dependent) |

**Overall confidence:** HIGH

### Gaps to Address

- **Three.js version upgrade (0.158 → latest):** Review changelog for breaking changes to `THREE.ShaderMaterial`, `THREE.OrthographicCamera`, and `THREE.WebGLRenderer` before upgrading. MEDIUM confidence on upgrade safety. Perform during Phase 2 setup.
- **Netlify Forms + static export validation:** The combination is documented but not verified against the specific Next.js 15 App Router + `output: 'export'` stack for this project. Validate by inspecting `out/index.html` after `next build` in Phase 4.
- **Developer portfolio best practices currency:** Research draws on training data (cutoff August 2025); WebSearch was unavailable. Hiring signal patterns are stable but worth a quick spot-check before roadmap is finalized.
- **AI Music Tool project entry:** No live URL available. Decision needed on how to handle in the project showcase (screenshots + GitHub link only, or "coming soon" treatment). Content decision, not a technical gap.

---

## Sources

### Primary (HIGH confidence)
- Next.js 15 official docs (nextjs.org/docs v16.2.1) — App Router, static exports, dynamic imports, CSS, Metadata API, TypeScript config, `next/font`
- Next.js 15 Blog Post (nextjs.org/blog/next-15) — App Router stability, React 19 bundling
- Netlify Next.js Support docs (docs.netlify.com/frameworks/next-js/overview/) — static export Netlify compatibility
- MDN — IntersectionObserver API; `dvh` CSS unit; `100vh` iOS Safari behavior
- Codebase direct analysis — `scriptGL.js`, `index.html`, `styles.css`, `.planning/codebase/CONCERNS.md`
- Project requirements — `.planning/PROJECT.md`

### Secondary (MEDIUM confidence)
- Three.js npm (npmjs.com/package/three) — version and install instructions
- WCAG 2.1 specification — contrast ratios and form label requirements (stable spec, HIGH on WCAG itself; MEDIUM on specific portfolio application)
- Developer portfolio best practices — training data (knowledge cutoff August 2025); WebSearch unavailable; recommend current-year validation

### Tertiary (LOW confidence)
- R3F bundle size (~200KB overhead) — community reports, approximate figure; not independently verified
- Netlify Forms + Next.js App Router static export combination — documented pattern, not validated against this exact stack version

---
*Research completed: 2026-03-21*
*Ready for roadmap: yes*
