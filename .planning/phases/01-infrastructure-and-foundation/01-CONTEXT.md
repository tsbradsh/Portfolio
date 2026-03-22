# Phase 1: Infrastructure and Foundation - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Scaffold Next.js 15 App Router with TypeScript configured for `output: 'export'` (Netlify static hosting). Establish the CSS design token system in `globals.css` and load Cascadia Code via `next/font/local`. No visible content — this phase delivers a working build pipeline and the shared design foundation that all subsequent phases inherit.

</domain>

<decisions>
## Implementation Decisions

### Color Palette
- **D-01:** Primary accent: `#00ffcc` (teal) — used for primary emphasis, borders, interactive highlights
- **D-02:** Secondary accent: `#7dd3fc` (light blue) — used for secondary elements, links, subdued highlights
- **D-03:** Background: `#0a0a0a` — page and card background
- **D-04:** Both accent colors are kept (not consolidated) — richer palette for a two-tone terminal feel

### Spacing System
- **D-05:** Full 8px grid defined upfront in Phase 1: `--space-1: 8px` through `--space-16: 128px`
- **D-06:** All subsequent phases use these tokens — no hardcoded spacing values in component CSS

### Border & Glow Style
- **D-07:** Terminal card border effect is CSS `box-shadow` glow only — no hard border
- **D-08:** Glow token: `--glow-teal: 0 0 8px rgba(0, 255, 204, 0.2)` — soft outer glow, subtle not intense
- **D-09:** Cards themselves use background `#0a0a0a` with the glow to float against the page background

### Animation / Transition Tokens
- **D-10:** Animation timing tokens defined in Phase 1: `--transition-fast: 150ms ease`, `--transition-base: 250ms ease`, `--transition-slow: 400ms ease`
- **D-11:** All component transitions in subsequent phases reference these tokens — no hardcoded durations

### Typography
- **D-12:** Primary font: Cascadia Code loaded via `next/font/local` — source from Microsoft's official GitHub release, stored in `public/fonts/`
- **D-13:** Fallback stack: `Cascadia Code, Consolas, 'Courier New', monospace`
- **D-14:** Font variable exposed as CSS custom property via `next/font/local` variable mode for use across CSS Modules

### Next.js Configuration
- **D-15:** `output: 'export'` in `next.config.ts` — required for Netlify static hosting
- **D-16:** `images: { unoptimized: true }` — required for static export (no Next.js image optimization server)
- **D-17:** App Router, not Pages Router — App Router is the current Next.js standard

### Repo Transition (Claude's Discretion)
- Existing vanilla files (index.html, scriptGL.js, styles.css) are handled at Claude's discretion — archive, delete, or leave alongside. No user preference specified.

### Claude's Discretion
- TypeScript `tsconfig.json` configuration details
- ESLint/Prettier setup and rules
- Exact directory structure within `app/` and `src/` (if used)
- Whether to use `src/` directory convention or flat `app/` root
- Exact spacing token increments between space-1 and space-16 (8px grid is confirmed, intermediate values at discretion)
- How to handle existing vanilla files in the repo transition

</decisions>

<specifics>
## Specific Ideas

- Design direction reference: "Think Vercel/Linear/Raycast dark UI applied to a terminal identity" — modern, intentional, not Windows 95
- Glow should be subtle — the fractal background (Phase 2) provides the visual drama; cards should frame content, not compete
- Color reference from existing codebase: `rgba(0, 255, 204, 0.15)` used for hover states — the token system should support similar opacity variants

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project design decisions
- `.planning/PROJECT.md` — Core value, constraints, design direction, key decisions
- `.planning/REQUIREMENTS.md` — FOUND-01, FOUND-02, FOUND-03 acceptance criteria

### Phase roadmap
- `.planning/ROADMAP.md` — Phase 1 success criteria (must all be true for phase to be complete)

### Existing codebase (for reference, not to preserve)
- `.planning/codebase/CONVENTIONS.md` — Existing naming patterns to inform token naming consistency
- `.planning/codebase/STACK.md` — Current Three.js version and CDN approach (being replaced)

### Research findings
- `.planning/research/STACK.md` — Next.js 15 stack decisions, static export config, Netlify compatibility
- `.planning/research/PITFALLS.md` — Font loading CLS pitfall, `output: 'export'` limitations

No external specs beyond the above — requirements fully captured in decisions above.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Color values from `styles.css`: `#00ffcc`, `#7dd3fc`, `#0a0a0a`, `rgba(0, 255, 204, 0.15)` — carry forward into token system
- Breakpoints from `styles.css`: 1200px, 1024px, 768px — carry forward as responsive tokens

### Established Patterns
- kebab-case class naming (`.win-terminal`, `.nav-toggle`) — maintain convention in CSS Modules
- State classes `.visible` and `.open` — preserve these class names in the migrated system
- No formatter/linter configured — Phase 1 should add ESLint + Prettier for TypeScript

### Integration Points
- Phase 1 tokens are consumed by all subsequent phases — changes after Phase 1 require updates across all component CSS Modules
- Cascadia Code font variable must be applied at the `<html>` or `<body>` level in `app/layout.tsx`

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 1 scope.

</deferred>

---

*Phase: 01-infrastructure-and-foundation*
*Context gathered: 2026-03-21*
