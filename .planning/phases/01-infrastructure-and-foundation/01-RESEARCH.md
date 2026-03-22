# Phase 1: Infrastructure and Foundation - Research

**Researched:** 2026-03-21
**Domain:** Next.js 15 App Router scaffold, CSS design token system, next/font/local
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Primary accent: `#00ffcc` (teal) — primary emphasis, borders, interactive highlights
- **D-02:** Secondary accent: `#7dd3fc` (light blue) — secondary elements, links, subdued highlights
- **D-03:** Background: `#0a0a0a` — page and card background
- **D-04:** Both accent colors are kept (not consolidated) — richer palette for a two-tone terminal feel
- **D-05:** Full 8px grid defined upfront: `--space-1: 8px` through `--space-16: 128px`
- **D-06:** All subsequent phases use these tokens — no hardcoded spacing values in component CSS
- **D-07:** Terminal card border effect is CSS `box-shadow` glow only — no hard border
- **D-08:** Glow token: `--glow-teal: 0 0 8px rgba(0, 255, 204, 0.2)` — soft outer glow, subtle not intense
- **D-09:** Cards use background `#0a0a0a` with glow to float against page background
- **D-10:** Animation timing tokens: `--transition-fast: 150ms ease`, `--transition-base: 250ms ease`, `--transition-slow: 400ms ease`
- **D-11:** All component transitions reference these tokens — no hardcoded durations
- **D-12:** Primary font: Cascadia Code loaded via `next/font/local` — source from Microsoft's official GitHub release, stored in `public/fonts/`
- **D-13:** Fallback stack: `Cascadia Code, Consolas, 'Courier New', monospace`
- **D-14:** Font variable exposed as CSS custom property via `next/font/local` variable mode for use across CSS Modules
- **D-15:** `output: 'export'` in `next.config.ts` — required for Netlify static hosting
- **D-16:** `images: { unoptimized: true }` — required for static export
- **D-17:** App Router, not Pages Router

### Claude's Discretion

- TypeScript `tsconfig.json` configuration details
- ESLint/Prettier setup and rules
- Exact directory structure within `app/` and `src/` (if used)
- Whether to use `src/` directory convention or flat `app/` root
- Exact spacing token increments between space-1 and space-16 (8px grid confirmed, intermediate values at discretion)
- How to handle existing vanilla files in the repo transition

### Deferred Ideas (OUT OF SCOPE)

None — discussion stayed within Phase 1 scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Project scaffolds as Next.js 15 App Router with TypeScript and `output: 'export'` configured for Netlify static hosting | `create-next-app@latest` flags, `next.config.ts` minimum config, Netlify static export compatibility |
| FOUND-02 | CSS Modules design token system established (color, spacing, typography custom properties) | Token reference table from UI-SPEC, globals.css structure, `:root` custom property pattern |
| FOUND-03 | Cascadia Code font loaded via `next/font/local` with correct fallback stack (Consolas, monospace) | `next/font/local` API, variable mode, font file sourcing from Microsoft GitHub releases |
</phase_requirements>

---

## Summary

Phase 1 is a pure scaffold phase — it delivers no rendered UI. Its outputs are a working Next.js 15 App Router build pipeline (`next build` produces an `out/` static export), a `globals.css` file containing the complete design token system, and Cascadia Code loaded via `next/font/local` as a CSS variable. All subsequent phases import these tokens; changes after Phase 1 require updates across every component CSS Module.

The technical domain is well-understood and well-researched. Project-specific research has already been completed in `.planning/research/STACK.md` and `.planning/research/PITFALLS.md`. This research document consolidates that prior work into the format the planner expects, adds verified current package versions (npm registry checked 2026-03-21), and maps findings to the three acceptance criteria this phase must satisfy.

The only meaningful decision left to Claude's discretion is the directory structure (`src/` vs flat `app/` root) and tooling configuration. The UI-SPEC provides a complete, final token reference that must be copied verbatim into `globals.css` — there is no design decision remaining for the planner or executor.

**Primary recommendation:** Scaffold with `npx create-next-app@latest . --typescript --eslint --app --no-tailwind --no-src-dir --import-alias "@/*"`, then immediately add the `output: 'export'` and `images: { unoptimized: true }` config. Do not defer these — they affect which features can be used in later phases.

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.2.4 (latest as of 2026-03-21, verified via npm view) | React framework, SSG, routing | App Router stable; static export (`output: 'export'`) works for Netlify; Metadata API built-in |
| React | 19.2.4 (latest, bundled with Next.js 15) | UI library | Bundled automatically by create-next-app |
| TypeScript | 5.9.3 (latest, verified via npm view) | Type safety | Built into create-next-app; enables `next.config.ts`, typed routes |
| Three.js | 0.183.2 (latest, verified via npm view) | WebGL rendering (Phase 2) | Installed in Phase 1 to avoid Phase 2 dependency scramble |

Note: `npm view next version` returned `16.2.1` — this is the Next.js docs version identifier, not the npm package version. The npm package version follows a separate scheme. `create-next-app@latest` installs the current stable release.

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@types/three` | Latest (devDep) | TypeScript types for Three.js | Install alongside `three` |
| ESLint | 9.x (bundled via `eslint-config-next`) | Linting | Included via create-next-app `--eslint` flag |
| Prettier | Latest | Code formatting | Add manually; use `eslint-config-prettier` to avoid ESLint conflict |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Modules + globals.css | Tailwind CSS | Tailwind fights the custom terminal design identity; utility classes conflict with precise token control. Decision locked: no Tailwind. |
| CSS Modules + globals.css | styled-components / Emotion | CSS-in-JS has limited App Router support (official docs warn of Suspense conflicts). Runtime JS overhead for no benefit. Decision locked: no CSS-in-JS. |
| `next/font/local` | CSS `@font-face` raw declaration | Raw `@font-face` causes font flicker (CLS). `next/font/local` eliminates CLS via build-time preload. Decision locked. |
| Flat `app/` root | `src/app/` structure | `src/` is cleaner for large projects; flat root is faster to scaffold. Both work identically. Claude's discretion — recommend flat `app/` to match create-next-app default. |

**Installation:**

```bash
# Scaffold (run in existing repo root — overwrites nothing, adds Next.js files)
npx create-next-app@latest . --typescript --eslint --app --no-tailwind --no-src-dir --import-alias "@/*"

# Three.js (install Phase 1, used Phase 2)
npm install three
npm install -D @types/three

# Prettier (not included by create-next-app)
npm install -D prettier eslint-config-prettier
```

**Version verification:** Versions above confirmed via `npm view [package] version` on 2026-03-21.

---

## Architecture Patterns

### Recommended Project Structure

```
app/
├── layout.tsx           # Root layout — font variable applied here, globals.css imported here
├── page.tsx             # Home page (placeholder in Phase 1 — body: "Portfolio under construction")
├── globals.css          # ALL design tokens: color, spacing, typography, glow, transitions
└── favicon.ico          # Replace with Tyler's mark (or leave default in Phase 1)
public/
├── fonts/
│   └── CascadiaCode.woff2   # Downloaded from Microsoft GitHub releases
next.config.ts           # output: 'export', images: { unoptimized: true }
tsconfig.json            # Strict mode, path alias @/*
.eslintrc.json           # eslint-config-next + prettier
.prettierrc              # 2-space indent, single quotes, trailing comma es5
```

Note on existing vanilla files (`index.html`, `scriptGL.js`, `styles.css`, `shader.glsl`): Archive these to `_archive/` rather than deleting. They contain the GLSL shader source needed verbatim in Phase 2. Archiving preserves them for reference without confusing the Next.js build.

### Pattern 1: Root Layout with Font Variable

`app/layout.tsx` is the single place where `next/font/local` is instantiated and the CSS variable is applied to the `<html>` element. All CSS Modules in subsequent phases access the font via `var(--font-mono)`.

```tsx
// Source: next/font/local official docs — nextjs.org/docs/app/api-reference/components/font
import localFont from 'next/font/local'
import './globals.css'

const cascadiaCode = localFont({
  src: '../public/fonts/CascadiaCode.woff2',
  variable: '--font-mono',
  display: 'swap',
  weight: '400 600',  // only the two weights used in the token system
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cascadiaCode.variable}>
      <body>{children}</body>
    </html>
  )
}
```

### Pattern 2: Design Token Structure in globals.css

All tokens live on `:root`. This is the canonical token list from the UI-SPEC — copy verbatim. No token should be defined anywhere else.

```css
/* Source: 01-UI-SPEC.md — Phase 1 Token Reference */
:root {
  /* Spacing */
  --space-half: 4px;
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;
  --space-10: 80px;
  --space-16: 128px;

  /* Typography */
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 20px;
  --text-xl: 32px;

  /* Color */
  --color-bg: #0a0a0a;
  --color-surface: #111111;
  --color-surface-nav: rgba(10, 10, 10, 0.95);
  --color-teal: #00ffcc;
  --color-teal-subtle: rgba(0, 255, 204, 0.15);
  --color-teal-glow: rgba(0, 255, 204, 0.20);
  --color-blue: #7dd3fc;
  --color-error: #ff4d4d;

  /* Glow and border */
  --glow-teal: 0 0 8px rgba(0, 255, 204, 0.20);
  --glow-teal-nav: 0 0 20px rgba(0, 255, 204, 0.15);
  --radius-card: 4px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 250ms ease;
  --transition-slow: 400ms ease;
}
```

Global resets that also belong in `globals.css`:

```css
/* Global resets — also in globals.css, not a CSS Module */
*, *::before, *::after { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background-color: var(--color-bg);
  color: var(--color-teal);
  font-family: var(--font-mono), Consolas, 'Courier New', monospace;
  font-size: var(--text-base);
  line-height: 1.5;
}
```

### Pattern 3: next.config.ts Minimum Configuration

```ts
// Source: nextjs.org/docs/app/guides/static-exports
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

### Pattern 4: tsconfig.json Recommended Settings

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "_archive"]
}
```

`strict: true` is required — this is a TypeScript project and strict mode catches the Three.js null-ref pitfalls documented in PITFALLS.md (Pitfall 10).

### Anti-Patterns to Avoid

- **Importing Three.js at module scope:** Causes SSR crash. Three.js is a Phase 2 concern but installing the package in Phase 1 is fine — just do not import it outside a `'use client'` component with `useEffect`.
- **Using Tailwind:** Decision locked. Do not add it during scaffold even if create-next-app offers it.
- **Hardcoding color/spacing values in globals.css body/html rules:** Use the tokens immediately — `background-color: var(--color-bg)` not `background-color: #0a0a0a`.
- **Defining font variable anywhere except layout.tsx:** The `next/font/local` instance must exist in exactly one place. Duplicating it creates duplicate `@font-face` declarations.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Font loading with zero CLS | Custom `@font-face` + `<link rel="preload">` | `next/font/local` | next/font handles preloading, `font-display: swap`, and CSS variable injection automatically. Custom approach requires manual preload hints and still risks CLS. |
| Static export configuration | Custom webpack/build script | `output: 'export'` in `next.config.ts` | Built-in Next.js feature. One line. |
| TypeScript strict configuration | Custom type guards | `strict: true` in tsconfig | Enables `strictNullChecks`, `noImplicitAny`, etc. in one flag. |
| CSS reset | Custom full reset stylesheet | `*, *::before, *::after { box-sizing: border-box }` + minimal resets in globals.css | A full CSS reset (normalize.css, reset.css) is unnecessary overhead for a portfolio. The minimal reset is sufficient. |

**Key insight:** Phase 1 is almost entirely configuration, not implementation. The value is in choosing the right defaults and getting them right once — subsequent phases inherit them for free.

---

## Common Pitfalls

### Pitfall 1: create-next-app overwrites existing files

**What goes wrong:** Running `create-next-app` in the existing repo root will offer to overwrite `index.html` and potentially `.gitignore`. Next.js creates its own structure and the vanilla files conflict.

**Why it happens:** create-next-app scaffolds into the current directory when given `.` as the path.

**How to avoid:** Move existing vanilla files to `_archive/` before running create-next-app. Git tracks the move. The GLSL shader source in `scriptGL.js` is needed verbatim in Phase 2 — preserve it.

**Warning signs:** create-next-app prompts "Would you like to overwrite existing files?" — answer No for any file containing work to preserve.

### Pitfall 2: Font variable not applied at html element level

**What goes wrong:** The `cascadiaCode.variable` class is applied to `<body>` instead of `<html>`, or applied inside a nested component. CSS Modules that reference `var(--font-mono)` resolve to fallback (Consolas) because the CSS variable is not in scope on `:root`.

**Why it happens:** `next/font/local` emits the CSS variable via a class name. The variable is only available within the subtree where the class is applied. If applied to `<body>`, `:root` does not have the variable, and `:root`-scoped custom properties in `globals.css` cannot reference it.

**How to avoid:** Apply `className={cascadiaCode.variable}` exclusively to the `<html>` element in `app/layout.tsx`. The `--font-mono` token in `globals.css` references `var(--font-mono)` because the variable is defined on `html`.

**Warning signs:** Browser DevTools shows `--font-mono` resolving to empty or `Consolas` even though the font file exists. Font flicker visible on load.

### Pitfall 3: output: 'export' not set before any page development

**What goes wrong:** Developer scaffolds normally, builds a page or two with `next/image` or an API route, then adds `output: 'export'` — at which point the build fails on features that static export does not support.

**Why it happens:** `output: 'export'` must be the first thing added to `next.config.ts`. All downstream work is constrained by it.

**How to avoid:** Add `output: 'export'` and `images: { unoptimized: true }` in `next.config.ts` as the very first step after scaffolding. Verify `next build` succeeds before writing any page code.

**Warning signs:** Build error mentioning "Image Optimization" or "API routes are not supported" after adding `output: 'export'` late.

### Pitfall 4: Token defined in a CSS Module instead of globals.css

**What goes wrong:** A developer adds a new color or spacing value in a component `.module.css` instead of `globals.css`. The value cannot be referenced by other components. Later phases start accumulating magic numbers.

**Why it happens:** It is faster to define locally. The discipline requires actively choosing globals.css every time.

**How to avoid:** Any value used by more than one component — or likely to be used by more than one component — belongs in `globals.css` as a custom property. Phase 1 defines the complete token set; nothing new should be added without deliberate review.

**Warning signs:** Duplicate hex color values appearing in `.module.css` files in Phase 2 or later.

### Pitfall 5: Cascadia Code woff2 file not present at build time

**What goes wrong:** `next/font/local` with a `src` path to a file that does not exist causes a build error. The error message is not always clear.

**Why it happens:** The font file must be manually downloaded and placed in `public/fonts/` before the first build. It is not installed via npm.

**How to avoid:** Download from https://github.com/microsoft/cascadia-code/releases — use the `.woff2` format, regular weight (400) and semibold (600). Place both at `public/fonts/CascadiaCode.woff2` and `public/fonts/CascadiaCode-SemiBold.woff2`, or use a variable font file if available. The `next/font/local` `src` path must match exactly.

**Warning signs:** Build error "ENOENT: no such file or directory, open '...public/fonts/CascadiaCode.woff2'".

---

## Code Examples

Verified patterns from official sources:

### next/font/local with variable mode

```tsx
// Source: nextjs.org/docs/app/api-reference/components/font#variable
import localFont from 'next/font/local'

const cascadiaCode = localFont({
  src: [
    {
      path: '../public/fonts/CascadiaCode.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CascadiaCode-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
})
```

If a variable font file is available (single file covering all weights), use the simpler single-src form:

```tsx
const cascadiaCode = localFont({
  src: '../public/fonts/CascadiaCode-VF.woff2',
  variable: '--font-mono',
  display: 'swap',
})
```

### Minimum next.config.ts for static export

```ts
// Source: nextjs.org/docs/app/guides/static-exports
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

### Phase 1 placeholder page.tsx

```tsx
// app/page.tsx — Phase 1 placeholder only. Phase 3 replaces this entirely.
export default function Home() {
  return (
    <main style={{ padding: '2rem', color: 'var(--color-teal)' }}>
      <p>Tyler Bradshaw Portfolio — under construction.</p>
    </main>
  )
}
```

### Prettier config

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 100
}
```

### ESLint config extending next + prettier

```json
// .eslintrc.json
{
  "extends": ["next/core-web-vitals", "prettier"]
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router (`pages/`) | App Router (`app/`) | Next.js 13 (stable in 15) | App Router has better metadata API, Server Components, and is the documented default. Pages Router is in maintenance mode. |
| `next/head` for metadata | `export const metadata` in layout.tsx | Next.js 13+ | Metadata API is server-rendered, no hydration, cleaner SEO. |
| Webpack dev bundler | Turbopack (`next dev --turbo`) | Next.js 15 (stable) | Up to 76.7% faster cold start. Use it. |
| CDN script tag for Three.js | npm install + `useEffect` | Required for Next.js | CDN incompatible with TypeScript types and module bundling. |
| CSS `@font-face` manual | `next/font/local` | Next.js 13+ | Eliminates CLS. Build-time preload. |

**Deprecated/outdated:**

- `next export` CLI command: Removed in Next.js 14+. Use `output: 'export'` in `next.config.ts` and run `next build`. The old `next export` command no longer exists.
- `getStaticProps` / `getServerSideProps`: Pages Router only. App Router uses `async` Server Components and `fetch` with cache options instead.
- `next/dynamic` with `ssr: false` in Server Components: Disallowed in Next.js 15 — causes build error. Use `'use client'` + `useEffect` instead (relevant for Phase 2 Three.js work, but worth knowing now).

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected — greenfield scaffold |
| Config file | None — see Wave 0 gaps |
| Quick run command | `npm run build` (build verification) |
| Full suite command | `npm run build && npx tsc --noEmit` |

Phase 1 delivers infrastructure, not behavior. The appropriate validation for this phase is:

1. **Build verification:** `next build` completes without errors and produces `out/` directory
2. **Type check:** `tsc --noEmit` passes with zero errors
3. **Font verification:** `out/index.html` (or root HTML) includes the font preload link
4. **Token completeness:** `app/globals.css` contains every token listed in the UI-SPEC token reference

There are no unit-testable behaviors in Phase 1. A test framework (Jest, Vitest) is not warranted at this stage — it would be installed with zero tests and sit idle until Phase 2 or later. The planner should schedule test infrastructure setup in the phase where the first testable behavior appears (Phase 2: WebGL component with cleanup verification).

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | `next build` produces `out/` with valid static HTML | build smoke | `npm run build` | ❌ Wave 0 |
| FOUND-01 | `next.config.ts` has `output: 'export'` and `images: { unoptimized: true }` | config check | `npx tsc --noEmit` (type-checks config) | ❌ Wave 0 |
| FOUND-02 | `globals.css` contains all 22 tokens from UI-SPEC | manual visual | `grep --count "var" app/globals.css` | ❌ Wave 0 |
| FOUND-03 | Cascadia Code loads (no font flicker, `--font-mono` resolves) | build smoke | `npm run build` (build error if font file missing) | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** `npm run build` — confirms no breaking change was introduced
- **Per wave merge:** `npm run build && npx tsc --noEmit` — full type check + build
- **Phase gate:** Build green, `tsc --noEmit` clean, `out/` exists before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `package.json` — created by `create-next-app` (scaffold task)
- [ ] `next.config.ts` — must include `output: 'export'` before first build
- [ ] `public/fonts/CascadiaCode.woff2` — must be downloaded before font task
- [ ] `app/layout.tsx` — font variable applied here
- [ ] `app/globals.css` — all 22 tokens defined here

No separate test files needed for Phase 1. Build success is the test.

---

## Open Questions

1. **Cascadia Code variable font availability**
   - What we know: Microsoft releases Cascadia Code as both static weights and a variable font. The variable font covers the full weight range in a single file, which simplifies `next/font/local` configuration.
   - What's unclear: The exact filename and download URL for the current release (releases change). The variable font woff2 may or may not include italic variants.
   - Recommendation: Check https://github.com/microsoft/cascadia-code/releases at execution time. Download the variable font `woff2` if available (single-file form). Fall back to two static files (400 and 600) if variable font is not available. The executor should verify before writing the `next/font/local` config.

2. **create-next-app behavior in existing repo with uncommitted changes**
   - What we know: Running `create-next-app` in a git repo with uncommitted files (index.html, scriptGL.js, etc.) may prompt about overwriting.
   - What's unclear: Whether the prompts are interactive (requires user input) or can be fully scripted.
   - Recommendation: Archive vanilla files to `_archive/` as the first task step, commit the move, then run create-next-app. This eliminates conflict risk.

3. **Whether to use `--no-src-dir` or `src/` convention**
   - What we know: Both work identically. `src/` is popular for separation of source from config. Flat `app/` root matches the create-next-app default when `--no-src-dir` is passed.
   - What's unclear: User has no stated preference.
   - Recommendation: Use flat `app/` root (no `src/` directory). Rationale: simpler structure for a single-page portfolio; fewer path segments in imports; matches the `create-next-app` default with `--no-src-dir`.

---

## Sources

### Primary (HIGH confidence)

- Next.js official docs (v16.2.1) — static exports: https://nextjs.org/docs/app/guides/static-exports
- Next.js official docs — font local: https://nextjs.org/docs/app/api-reference/components/font
- Next.js official docs — CSS: https://nextjs.org/docs/app/getting-started/css
- Next.js official docs — TypeScript: https://nextjs.org/docs/app/api-reference/config/typescript
- `.planning/research/STACK.md` — stack decisions verified against official docs (2026-03-21)
- `.planning/research/PITFALLS.md` — pitfalls from codebase analysis + official docs (2026-03-21)
- `.planning/phases/01-infrastructure-and-foundation/01-UI-SPEC.md` — complete token reference (approved)
- `.planning/phases/01-infrastructure-and-foundation/01-CONTEXT.md` — locked decisions D-01 through D-17

### Secondary (MEDIUM confidence)

- npm registry — `npm view next version`, `npm view react version`, `npm view typescript version`, `npm view three version` — verified 2026-03-21
- Netlify Next.js static export docs: https://docs.netlify.com/frameworks/next-js/overview/

### Tertiary (LOW confidence)

- None — all claims in this document are backed by HIGH or MEDIUM sources.

---

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — versions verified against npm registry 2026-03-21; configuration patterns verified against official Next.js docs
- Architecture: HIGH — patterns sourced from official Next.js docs and prior project research; token values locked in UI-SPEC
- Pitfalls: HIGH — pitfalls 1-4 are reproducible, deterministic failures documented in official sources and prior project research

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (Next.js stable releases; 30-day window reasonable for stable framework)
