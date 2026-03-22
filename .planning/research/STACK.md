# Technology Stack

**Project:** Tyler Bradshaw Portfolio — Next.js + TypeScript Migration
**Researched:** 2026-03-21
**Sources:** Next.js official docs (v16.2.1 / Next.js 15), Netlify Next.js docs

---

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js | 15.x (latest) | React framework, SSG, routing | App Router is stable in v15; React 19 support; Turbopack dev stable; static export (`output: 'export'`) works cleanly for Netlify. Pages Router still supported but is the legacy path — no reason to use it for a greenfield migration. |
| React | 19.x | UI library | Bundled with Next.js 15. React Compiler is experimental but available. No need to pin to 18 unless encountering compatibility issues. |
| TypeScript | 5.x (latest stable) | Type safety | Built into `create-next-app`. Enables `next.config.ts`, typed routes, and full IntelliSense. Required for `async` Server Components (needs TS 5.1.3+). |

### Router Decision: App Router

**Use App Router.** Do not use Pages Router.

Rationale:
- App Router is the current and future default. Pages Router is in maintenance mode.
- App Router has better metadata API (`export const metadata`), which is the correct approach for SEO/Open Graph on this project.
- Server Components reduce JavaScript bundle size — the portfolio's content sections (project cards, skills) can be server-rendered with zero client JS.
- The Three.js WebGL component will be a Client Component regardless of router choice — the router choice does not complicate Three.js integration.
- Next.js 15 explicitly notes App Router uses React 19 while Pages Router uses React 18 — mixing is not recommended.

### Three.js + WebGL: SSR Strategy (Critical)

This is the most important technical decision in the stack.

**Problem:** Three.js accesses `window`, `document`, `WebGLRenderingContext`, and `HTMLCanvasElement` — none of which exist in the Node.js SSR environment. Importing Three.js at module level in a Next.js component will crash during build or server render.

**Solution: `'use client'` + `useEffect` initialization**

The Mandelbrot WebGL canvas component must:

1. Be a Client Component (`'use client'` directive at top of file)
2. Initialize the Three.js scene inside `useEffect` (runs only in browser)
3. Return a `<canvas>` element that Three.js renders into

This is the correct pattern per official Next.js docs. The docs explicitly state: "Browser-only APIs (window, localStorage, Navigator.geolocation, etc.) — use Client Components."

**Do NOT use `next/dynamic` with `ssr: false` for Three.js components.**

As of Next.js 15, `ssr: false` with `next/dynamic` is disallowed in Server Components and generates a build error. The pattern works only inside Client Components, where it adds unnecessary indirection. Since the WebGL canvas is already a Client Component with `useEffect`, there is no SSR concern to work around.

```tsx
// app/components/MandelbrotCanvas.tsx — correct pattern
'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function MandelbrotCanvas() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // All Three.js initialization here — runs only in browser
    const scene = new THREE.Scene()
    // ... fractal shader setup, animation loop
    return () => {
      // Cleanup: dispose renderer, cancel animation frame
    }
  }, [])

  return <div ref={mountRef} style={{ position: 'fixed', inset: 0, zIndex: 0 }} />
}
```

**Three.js installation:** Install via npm, not CDN. The existing CDN approach (`unpkg.com/three@0.158.0`) is incompatible with Next.js module bundling.

```bash
npm install three
npm install -D @types/three
```

**Three.js version:** Upgrade from 0.158.0 to the current stable (r168+ as of late 2024/early 2025 — verify with `npm view three version` before installing). The existing GLSL fragment shader embedded in `scriptGL.js` should be portable across versions since it uses basic `THREE.ShaderMaterial` with `PlaneGeometry`.

Confidence on upgrade safety: MEDIUM — Three.js has deprecation-heavy changelogs; verify no breaking changes to `THREE.ShaderMaterial`, `THREE.OrthographicCamera`, `THREE.WebGLRenderer` between 0.158 and current. The shader GLSL itself is unaffected by Three.js version changes.

### CSS Approach

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| CSS Modules | Built-in (Next.js) | Component-scoped styles | Zero dependencies. First-class Next.js support. Correct for a design-heavy portfolio where class names need to be controlled precisely. The existing `styles.css` can be decomposed into per-component `.module.css` files. |
| Global CSS | Built-in (Next.js) | Design tokens, reset, typography | CSS custom properties (`--color-bg`, `--accent`, etc.) and `@font-face` for Cascadia Code belong in `app/globals.css` imported once in `app/layout.tsx`. |

**Do NOT use Tailwind CSS for this project.**

Rationale: The portfolio has a highly specific terminal aesthetic with custom teal glow effects, monospace typography, and precise dark card borders. Tailwind's utility classes work against this — you end up fighting the framework's conventions to express custom design tokens. CSS Modules with CSS custom properties gives direct control. This is not a generic product UI; it is a hand-crafted design identity.

**Do NOT use styled-components or Emotion (CSS-in-JS).**

Rationale: CSS-in-JS has limited support in Next.js App Router. The official docs specifically warn about conflicts with Suspense and streaming. The `app` directory discourages CSS-in-JS for Server Components. Not worth the complexity for a single-page portfolio.

### Font Loading

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `next/font/local` | Built-in (Next.js) | Cascadia Code loading | Eliminates Google Fonts external request. Self-hosted fonts load faster and avoid the privacy/GDPR exposure of third-party font CDNs. The `next/font` system automatically applies `font-display: swap` and generates CSS variables. |

```tsx
// app/layout.tsx
import localFont from 'next/font/local'

const cascadiaCode = localFont({
  src: '../public/fonts/CascadiaCode.woff2',
  variable: '--font-mono',
  display: 'swap',
})
```

The Cascadia Code font file must be added to `public/fonts/`. Download from the official Microsoft Cascadia Code GitHub releases.

### Image Optimization

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| `next/image` | Built-in (Next.js) | Project screenshots, portrait | Automatic WebP conversion, lazy loading, prevents Cumulative Layout Shift via required `width`/`height`. |

**Static export image constraint:** With `output: 'export'`, Next.js's default image optimizer (which requires a Node.js server) is unavailable. Two options:

- Option A (recommended): Use `unoptimized: true` in `next.config.ts` `images` config. Images serve as-is. Simple and sufficient for a portfolio.
- Option B: Configure a custom loader (e.g., Cloudinary). Adds dependency and complexity not justified for a portfolio.

```ts
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
}
```

### SEO and Metadata

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Next.js Metadata API | Built-in (Next.js 13+) | Title, description, Open Graph | Server-side metadata export in `app/layout.tsx` and `app/page.tsx`. Cleaner than `next/head`. No additional package needed. Supports title templates, Open Graph, Twitter cards, robots, canonical URLs. |

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL('https://tylerbradshaw.dev'), // replace with actual domain
  title: { default: 'Tyler Bradshaw', template: '%s | Tyler Bradshaw' },
  description: 'Full-stack developer portfolio...',
  openGraph: { /* ... */ },
}
```

### Contact Form

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Netlify Forms | Platform feature | Contact form submission | Already in use. Works with static export. Requires `data-netlify="true"` attribute on the form element. No backend or serverless function needed. |

**Netlify Forms + Next.js caveat:** Netlify Forms detects forms at deploy-time by scanning HTML. With Next.js (client-side rendered forms), Netlify may not detect the form automatically. The fix is to include a hidden static HTML form in `public/` as a form "seed" for Netlify's crawler, or use Netlify's JavaScript form submission API. This is a known integration point requiring careful implementation.

### Hosting

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Netlify | Current | Static hosting | Already in use. Netlify fully supports Next.js 15 App Router via OpenNext adapter (zero config). Alternatively: `output: 'export'` produces a plain static `out/` folder that Netlify can serve without the adapter — simpler, no server-side features needed for a portfolio. |

**Hosting recommendation:** Use `output: 'export'` (static export) rather than the OpenNext adapter. The portfolio has no SSR requirements at runtime — no server actions, no dynamic routes, no cookies. Static export is simpler, faster to deploy, and eliminates adapter dependency. The only loss is runtime image optimization, which is handled by `unoptimized: true`.

### Development Tooling

| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Turbopack | Bundled (Next.js 15) | Dev server bundler | Stable in Next.js 15 (`next dev --turbo`). Up to 76.7% faster cold start vs Webpack. Use it. |
| ESLint | 9.x | Linting | Next.js 15 includes ESLint 9 support. Use `eslint-config-next`. |
| Prettier | Latest | Code formatting | Standard formatter. Does not conflict with ESLint when configured correctly (use `eslint-config-prettier`). |

---

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Router | App Router | Pages Router | Pages Router is legacy; no new features. App Router has better metadata API, Server Components, and is the documented future. |
| CSS | CSS Modules + Global CSS | Tailwind CSS | Portfolio has custom terminal design identity — Tailwind fights custom aesthetics. Adds build dependency without benefit. |
| CSS | CSS Modules + Global CSS | styled-components / Emotion | Limited App Router support; conflicts with Suspense/streaming in official docs. Runtime CSS-in-JS adds unnecessary JS overhead. |
| Three.js SSR | `'use client'` + `useEffect` | `next/dynamic` with `ssr: false` | `ssr: false` is disallowed in Server Components as of Next.js 15. The `'use client'` + `useEffect` pattern is simpler and correct. |
| Three.js SSR | `'use client'` + `useEffect` | CDN script tag in `<head>` | CDN loading is incompatible with TypeScript types, tree-shaking, and module bundling. Eliminates `@types/three`. |
| Fonts | `next/font/local` | Google Fonts CSS import | External font CDN adds latency and third-party dependency. `next/font/local` is faster and privacy-preserving. |
| Images | `next/image` (unoptimized) | Raw `<img>` tags | `next/image` still handles lazy loading, aspect ratio placeholders, and responsive `srcset` even with `unoptimized: true`. |
| Hosting | Static export (`output: 'export'`) | OpenNext adapter on Netlify | No runtime server features needed for a portfolio. Static export is simpler and removes adapter as a dependency. |
| Hosting | Netlify (static) | Vercel | Either works. Netlify stays on existing hosting — no migration needed. Vercel would add native image optimization but requires changing hosting provider. |

---

## Installation

```bash
# Scaffold new Next.js project
npx create-next-app@latest . --typescript --eslint --app --no-tailwind --no-src-dir --import-alias "@/*"

# Three.js
npm install three
npm install -D @types/three

# No additional CSS dependencies needed (CSS Modules are built-in)
# No additional font dependencies needed (next/font is built-in)
```

`next.config.ts` minimum configuration:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

---

## Confidence Assessment

| Decision | Confidence | Notes |
|----------|------------|-------|
| Next.js 15 + App Router | HIGH | Official docs confirm App Router is stable current path; Pages Router is legacy |
| React 19 | HIGH | Bundled with Next.js 15 App Router |
| TypeScript 5.x | HIGH | Built into create-next-app; officially required for async Server Components |
| `'use client'` + `useEffect` for Three.js | HIGH | Official docs explicitly identify this as the pattern for browser-only APIs |
| `next/dynamic` `ssr: false` avoidance | HIGH | Official docs state `ssr: false` disallowed in Server Components in Next.js 15 |
| CSS Modules over Tailwind | HIGH | Consistent with the custom terminal design; verified CSS Modules are fully supported |
| `output: 'export'` for Netlify | HIGH | Official Next.js static export docs confirm Netlify compatibility |
| `next/font/local` for Cascadia Code | HIGH | Built-in Next.js feature; correct approach for local fonts |
| Three.js version upgrade (0.158 → latest) | MEDIUM | Upgrade is straightforward but changelog review needed for ShaderMaterial/WebGLRenderer API changes |
| Netlify Forms + Next.js integration | MEDIUM | Known pattern with documented workaround; requires hidden HTML seed form in `public/` |
| `images: { unoptimized: true }` | HIGH | Official docs explicitly document this as the static export image solution |

---

## Sources

- Next.js 15 Blog Post: https://nextjs.org/blog/next-15
- Next.js Server and Client Components (v16.2.1): https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js Lazy Loading / `next/dynamic` (v16.2.1): https://nextjs.org/docs/app/guides/lazy-loading
- Next.js Static Exports (v16.2.1): https://nextjs.org/docs/app/guides/static-exports
- Next.js CSS Guide (v16.2.1): https://nextjs.org/docs/app/getting-started/css
- Next.js Metadata API (v16.2.1): https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- Next.js TypeScript Configuration (v16.2.1): https://nextjs.org/docs/app/api-reference/config/typescript
- Netlify Next.js Support: https://docs.netlify.com/frameworks/next-js/overview/
- Three.js npm: https://www.npmjs.com/package/three
