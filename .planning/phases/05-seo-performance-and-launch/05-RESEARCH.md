# Phase 05: SEO, Performance and Launch - Research

**Researched:** 2026-03-22
**Domain:** Next.js Metadata API, JSON-LD structured data, static SEO files, Lighthouse optimization, Netlify deployment verification
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** `https://tylerbradshaw.dev` is the canonical domain — used in OG `url`, canonical link tag, sitemap, and JSON-LD Person `url` field.
- **D-02:** Extend `app/layout.tsx` `metadata` export with full Open Graph block: `type: 'website'`, `url`, `title`, `description`, `images` (og-image.png).
- **D-03:** Add Twitter/X card metadata: `card: 'summary_large_image'`, `title`, `description`, `images`.
- **D-04:** Add `metadataBase` set to `https://tylerbradshaw.dev` so Next.js resolves relative image paths correctly in OG tags.
- **D-05:** Meta description: `"Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript."` (approx 100 chars, keyword-rich).
- **D-06:** Use `Ty.jpg` (self-portrait from `public/assets/1x/`) as the OG image — resize/crop to 1200x630 PNG, saved as `public/og-image.png`.
- **D-07:** Static file approach — `public/og-image.png` exports correctly with `output: 'export'`. No `next/opengraph-image` runtime generation (incompatible with static export).
- **D-08:** Generate `public/sitemap.xml` — static file listing `https://tylerbradshaw.dev/` as the single canonical URL with `lastmod` and `changefreq: monthly`.
- **D-09:** Generate `public/robots.txt` — allow all crawlers, reference sitemap URL.
- **D-10:** Add JSON-LD `<script type="application/ld+json">` in `app/layout.tsx` (or a dedicated `JsonLd` component rendered in layout).
- **D-11:** Person schema fields: `@type: "Person"`, `name: "Tyler Bradshaw"`, `jobTitle: "Full-Stack Developer"`, `url: "https://tylerbradshaw.dev"`, `sameAs: ["https://github.com/tsbradsh", "https://www.linkedin.com/in/tsbw/"]`
- **D-12:** No `contactPoint` email in schema (not exposing email in structured data).
- **D-13:** Only non-visual optimizations — do NOT reduce WebGL shader iterations or visual quality.
- **D-14:** Acceptable optimization targets: image format/size optimization (Ty.jpg, project screenshots), font preload hints, defer non-critical JS, verify Cascadia Code preload is wired correctly.
- **D-15:** WebGL runs post-load inside `useEffect` — does not block LCP. No changes to fractal render loop.
- **D-16:** `next/image` is not usable (static export with `images: { unoptimized: true }`). Image optimization must be manual (sharp CLI or equivalent, or serve already-optimized assets).
- **D-17:** Phase includes a human-executable UAT checklist for the live Netlify deployment — not automated. Planner should include a task that documents this checklist.
- **D-18:** Checklist must cover: site loads at `https://tylerbradshaw.dev`, contact form submits to Netlify dashboard, all nav links resolve, all project links resolve, OG preview renders correctly (test via opengraph.xyz or similar), Lighthouse run on live URL.

### Claude's Discretion
- Exact image resize method for og-image.png (sharp CLI, manual export, or canvas — any approach that produces a valid 1200x630 PNG)
- Whether JSON-LD is inlined in layout.tsx or extracted to a `JsonLd.tsx` component
- robots.txt crawl-delay settings

### Deferred Ideas (OUT OF SCOPE)
- Analytics (Plausible or similar) — v2 requirement (ANAL-01, ANAL-02)
- Dark/light mode — v2 requirement (ADV-01)
- Resume PDF download — user will add when available (RESUME-01, RESUME-02)
- AI Music Tool live URL — not available yet (AI-01)
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SEO-01 | Next.js Metadata API configured with page title, meta description, and Open Graph tags (title, description, image, URL) | Verified: `metadata` export with `metadataBase`, `openGraph`, `twitter` fields in `app/layout.tsx`. Official Next.js 16.2.1 docs confirm exact API surface. |
| SEO-02 | JSON-LD structured data added for Person entity (name, URL, social profiles) | Verified: `<script type="application/ld+json" dangerouslySetInnerHTML>` pattern in Server Component. Schema.org Person type confirmed. |
| PERF-01 | Lighthouse scores 90+ across all four categories on desktop | Verified: Lighthouse metric weights documented. TBT (30%) is highest-weight metric — WebGL in useEffect avoids main-thread blocking on load. Font preload handled by next/font automatically. |
| PERF-02 | Netlify static deployment verified working end-to-end: site loads, form submits, all links resolve | Addressed by UAT checklist task (D-17, D-18). Netlify Forms seed form already in place from Phase 4. |
</phase_requirements>

---

## Summary

Phase 05 is a finishing and polish phase with four focused domains: Next.js Metadata API extension, static file generation (sitemap + robots), image preparation (OG card), and deployment verification. All technical decisions are locked — the research below confirms the exact APIs and patterns to use without alternatives.

The core SEO work lives entirely in `app/layout.tsx`. The `metadata` export is extended in-place with `metadataBase`, `openGraph`, `twitter`, `alternates.canonical`, and a `robots` object. JSON-LD is injected as a raw `<script>` tag using `dangerouslySetInnerHTML` with XSS mitigation — this is the official Next.js recommendation (not `next/script`). The static files (`sitemap.xml`, `robots.txt`, `og-image.png`) are hand-authored and placed in `public/`, where they export to `out/` verbatim with `output: 'export'`.

Performance at Lighthouse 90+ is achievable without touching the WebGL layer. The highest-weight metric (TBT, 30%) is not impacted by WebGL running in `useEffect`. Cascadia Code is already loaded via `next/font/local` which handles preload automatically. The main optimization work is image file-size reduction. The Netlify verification task is a human-executable UAT checklist — no automation needed.

**Primary recommendation:** Extend `app/layout.tsx` metadata in one task, generate static SEO files in a second task, resize OG image in a third task, and write the UAT checklist as a final deliverable task.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js Metadata API | built-in (Next.js 16.2.1) | OG tags, Twitter card, canonical, robots | Zero-dependency, SSG-compatible, generates correct `<head>` tags automatically |
| schema.org Person | spec (no library) | JSON-LD structured data | Hand-authored JSON is the standard pattern; no library needed for a single entity |
| sharp-cli | 5.2.0 | Resize Ty.jpg to 1200x630 PNG | Official sharp wrapper, runs via npx — no global install required |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| schema-dts | latest | TypeScript types for JSON-LD | Use if TypeScript strictness is desired on the jsonLd object — optional |
| opengraph.xyz | web tool | Validate OG card rendering | Use during UAT to verify og:image appears correctly in link previews |
| Google Rich Results Test | web tool | Validate JSON-LD Person schema | Use during UAT at search.google.com/test/rich-results |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-authored `public/sitemap.xml` | `next-sitemap` npm package | next-sitemap adds a build step and dependency; unnecessary for a single-URL site |
| sharp-cli for OG image | Manual Photoshop/GIMP export | Either works — sharp-cli is reproducible and scriptable |
| Inline JSON-LD in layout.tsx | Separate `JsonLd.tsx` component | Component is cleaner for future reuse; inline is simpler for a single entity |

**Installation (only if sharp-cli needed):**
```bash
npx sharp-cli --version   # confirm available without install
# or install dev dep:
npm install --save-dev sharp-cli
```

**Version verification (confirmed 2026-03-22 via npm registry):**
- `sharp-cli`: 5.2.0
- `sharp` (underlying): 0.34.5

---

## Architecture Patterns

### Recommended Project Structure for This Phase
```
public/
├── og-image.png          # NEW: 1200x630 OG card image (resized from Ty.jpg)
├── sitemap.xml           # NEW: single-URL sitemap
├── robots.txt            # NEW: allow-all + sitemap reference
├── assets/1x/Ty.jpg      # EXISTING: source for og-image.png
├── contact.html          # EXISTING: Netlify Forms seed
└── fonts/                # EXISTING: Cascadia Code woff2

app/
├── layout.tsx            # MODIFY: extend metadata export + add JsonLd component
└── components/
    └── JsonLd.tsx        # NEW (optional): isolated JSON-LD script component
```

### Pattern 1: Full Metadata Export in layout.tsx
**What:** Export a complete `Metadata` object from the root layout with `metadataBase`, `openGraph`, `twitter`, `alternates.canonical`, and `robots`.
**When to use:** Always — this is the only metadata definition point for a single-page portfolio.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://tylerbradshaw.dev'),
  title: 'Tyler Bradshaw — Developer Portfolio',
  description: 'Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://tylerbradshaw.dev',
    title: 'Tyler Bradshaw — Developer Portfolio',
    description: 'Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript.',
    images: [
      {
        url: '/og-image.png',   // resolved to https://tylerbradshaw.dev/og-image.png via metadataBase
        width: 1200,
        height: 630,
        alt: 'Tyler Bradshaw — Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tyler Bradshaw — Developer Portfolio',
    description: 'Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### Pattern 2: JSON-LD via Server Component Script Tag
**What:** Inject JSON-LD as a `<script type="application/ld+json">` using `dangerouslySetInnerHTML` inside a Server Component rendered in layout.
**When to use:** Always — `next/script` is for executable JS, not structured data. This is the official Next.js guidance.
**Example:**
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
// app/components/JsonLd.tsx  (or inline in layout.tsx)
export function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tyler Bradshaw',
    jobTitle: 'Full-Stack Developer',
    url: 'https://tylerbradshaw.dev',
    sameAs: [
      'https://github.com/tsbradsh',
      'https://www.linkedin.com/in/tsbw/',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```
Then render `<JsonLd />` inside the `<head>` or `<body>` of `RootLayout`. In App Router, placing it anywhere in the Server Component tree injects it correctly.

### Pattern 3: Static sitemap.xml
**What:** Hand-authored XML file placed in `public/sitemap.xml`. With `output: 'export'`, Next.js copies `public/` verbatim to `out/`.
**Example:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tylerbradshaw.dev/</loc>
    <lastmod>2026-03-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### Pattern 4: robots.txt
**What:** Plain text file in `public/robots.txt`.
**Example:**
```
User-agent: *
Allow: /

Sitemap: https://tylerbradshaw.dev/sitemap.xml
```

### Pattern 5: OG Image Resize via sharp-cli
**What:** One-time CLI command to resize `Ty.jpg` to 1200x630 PNG, cover mode.
**Example:**
```bash
npx sharp-cli -i public/assets/1x/Ty.jpg -o public/og-image.png resize 1200 630
```
Note: `sharp-cli` v5.x uses `resize` as a subcommand. Cover (center crop) is the default fit mode.

### Anti-Patterns to Avoid
- **Using `next/opengraph-image` route convention:** Requires a Node.js runtime at request time — incompatible with `output: 'export'`. Static PNG in `public/` is the correct approach.
- **Using `next/script` for JSON-LD:** `next/script` adds loading optimization for executable JS. JSON-LD is data, not script — use a raw `<script>` tag in a Server Component.
- **Setting `metadataBase` with a trailing slash:** `new URL('https://tylerbradshaw.dev')` (no trailing slash) is the correct form; Next.js normalizes slashes internally.
- **Omitting `width`/`height` on OG image object:** Social crawlers use these to size the preview; always include them.
- **Placing sitemap/robots in `app/` as route handlers:** Route handlers with `output: 'export'` require `generateStaticParams`. Static files in `public/` are simpler and equally correct for a single-URL site.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| OG/Twitter meta tags | Custom `<head>` with `<meta>` tags | Next.js `metadata` export | Next.js handles deduplication, ordering, and correct property names automatically |
| Structured data injection | `next/script` with JSON-LD | Raw `<script dangerouslySetInnerHTML>` in Server Component | `next/script` adds unnecessary loading overhead for data that must be synchronous |
| Sitemap generation | Custom Node.js script with `next-sitemap` | Hand-authored `public/sitemap.xml` | Single URL; a package adds zero value over 8 lines of XML |
| Image resizing | Manual ImageMagick command or custom Node script | `npx sharp-cli` | sharp is already a transitive dependency of Next.js — available without installation |

**Key insight:** For a static, single-URL portfolio, every "generator" tool solves a problem that doesn't exist here. Static files beat programmatic generation at every step.

---

## Common Pitfalls

### Pitfall 1: metadataBase Missing — OG Image URL Stays Relative
**What goes wrong:** Without `metadataBase`, setting `openGraph.images: [{ url: '/og-image.png' }]` generates a relative URL in the `og:image` tag. Social crawlers cannot resolve relative URLs — the image does not appear in link previews.
**Why it happens:** The Next.js metadata system needs `metadataBase` to compose the full URL from a relative path.
**How to avoid:** Always set `metadataBase: new URL('https://tylerbradshaw.dev')` at the root layout level.
**Warning signs:** `og:image` meta tag in page source contains a relative path like `/og-image.png` instead of `https://tylerbradshaw.dev/og-image.png`.

### Pitfall 2: next/opengraph-image Attempted with Static Export
**What goes wrong:** Creating `app/opengraph-image.tsx` using `ImageResponse` from `next/og` — build fails with an error about the Edge runtime being unavailable in static export mode.
**Why it happens:** `ImageResponse` requires a server runtime to generate images on-demand.
**How to avoid:** Use a pre-built static PNG in `public/og-image.png` referenced via the `metadata` object. This is locked by D-07.
**Warning signs:** Build error mentioning "opengraph-image" or "Edge runtime" or "API routes are not supported with output: export".

### Pitfall 3: JSON-LD XSS via Unescaped `<` Characters
**What goes wrong:** If any JSON-LD field value contains a `<` character (e.g., in a description), it breaks out of the `<script>` tag, creating an XSS vector or a parse error.
**Why it happens:** Browsers parse `</script>` inside script tags, ending the script block early.
**How to avoid:** Always apply `.replace(/</g, '\\u003c')` to the `JSON.stringify()` output before passing to `dangerouslySetInnerHTML.__html`. The official Next.js JSON-LD guide mandates this.
**Warning signs:** Structured data validation fails or browser console shows script parse errors.

### Pitfall 4: CLS from Font Swap Before Preload Resolves
**What goes wrong:** Lighthouse reports a CLS score penalty if the monospace font loads late, causing text reflow.
**Why it happens:** `display: 'swap'` in `next/font/local` shows fallback font first, then swaps — if the font loads slowly, layout shifts occur.
**How to avoid:** `next/font/local` automatically adds a `<link rel="preload">` for the woff2 file in the `<head>`. Verify in built `out/index.html` that the preload link is present. No manual action needed unless the preload is missing.
**Warning signs:** CLS > 0.1 in Lighthouse. Check `out/index.html` `<head>` for `rel="preload" as="font"`.

### Pitfall 5: Lighthouse Run on `localhost` vs Live URL
**What goes wrong:** Running Lighthouse on the local dev server (`next dev`) gives different scores than on the live Netlify URL due to local network latency, no CDN, and dev-mode overhead.
**Why it happens:** `next dev` does not apply production optimizations (no minification, no static export).
**How to avoid:** Run final Lighthouse audit on `https://tylerbradshaw.dev` after deployment. For local testing, use `next build && npx serve out` and then audit `localhost:3000`.
**Warning signs:** Wildly different scores between local and live. Always report against the live URL for acceptance.

### Pitfall 6: Netlify Redirect Missing for SPA Fallback
**What goes wrong:** Netlify returns 404 on page refresh for paths that aren't explicit HTML files.
**Why it happens:** This is a Next.js static export — `output: 'export'` generates `index.html`. The portfolio is single-page, so this should not apply. But if a `_redirects` file is needed for edge cases, it belongs in `public/`.
**How to avoid:** Single-page portfolio with `output: 'export'` generates `out/index.html` — Netlify serves this correctly at `/` with no redirect config needed. Do not add unnecessary redirect rules.
**Warning signs:** Non-root paths (e.g., `/contact`) returning 404 — not applicable here since all content is on a single page.

---

## Code Examples

Verified patterns from official sources:

### Full metadata export with metadataBase
```typescript
// Source: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
// app/layout.tsx — replace existing minimal metadata export
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://tylerbradshaw.dev'),
  title: 'Tyler Bradshaw — Developer Portfolio',
  description: 'Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://tylerbradshaw.dev',
    title: 'Tyler Bradshaw — Developer Portfolio',
    description: 'Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tyler Bradshaw — Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tyler Bradshaw — Developer Portfolio',
    description: 'Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

### JsonLd component (recommended extraction)
```typescript
// Source: https://nextjs.org/docs/app/guides/json-ld
// app/components/JsonLd.tsx
export function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tyler Bradshaw',
    jobTitle: 'Full-Stack Developer',
    url: 'https://tylerbradshaw.dev',
    sameAs: [
      'https://github.com/tsbradsh',
      'https://www.linkedin.com/in/tsbw/',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
```

### Render JsonLd in RootLayout
```typescript
// app/layout.tsx — add inside <body> before Nav or at end
import { JsonLd } from './components/JsonLd'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cascadiaCode.variable}>
      <body>
        <JsonLd />
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Nav />
        {children}
      </body>
    </html>
  )
}
```

### OG image resize command
```bash
# Source: https://github.com/vseventer/sharp-cli (v5.2.0)
# Run once to produce public/og-image.png
npx sharp-cli -i public/assets/1x/Ty.jpg -o public/og-image.png resize 1200 630
```

### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tylerbradshaw.dev/</loc>
    <lastmod>2026-03-22</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

### robots.txt
```
User-agent: *
Allow: /

Sitemap: https://tylerbradshaw.dev/sitemap.xml
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `<Head>` from `next/head` (Pages Router) | `metadata` export from layout/page (App Router) | Next.js 13 | Static metadata is now a plain JS object, not JSX |
| `themeColor` in `metadata` object | `viewport` export from `generateViewport` | Next.js 14 | Separate export required for viewport/themeColor — don't use deprecated `metadata.viewport` |
| `colorScheme` in `metadata` object | `viewport` export from `generateViewport` | Next.js 14 | Same deprecation as `themeColor` |
| `next/script` for JSON-LD | Raw `<script dangerouslySetInnerHTML>` in Server Component | Ongoing recommendation | `next/script` defers/lazy-loads — structured data must be synchronous |
| File-based `app/opengraph-image.tsx` | Static `public/og-image.png` | Always | Static export incompatible with runtime image generation |

**Deprecated/outdated:**
- `metadata.viewport`: Replaced by `generateViewport` — do not set viewport inside the `metadata` export
- `metadata.themeColor`: Same — use `generateViewport`
- `<Head>` from `next/head`: Pages Router only, not applicable in App Router

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected |
| Config file | None — see Wave 0 |
| Quick run command | `npm run build` (build smoke test only) |
| Full suite command | `npm run build && npm run lint` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SEO-01 | OG/Twitter meta tags present in built HTML | manual-only | Inspect `out/index.html` after `next build` | N/A |
| SEO-02 | JSON-LD script tag present with correct Person schema | manual-only | Inspect `out/index.html` after `next build`; validate at search.google.com/test/rich-results | N/A |
| PERF-01 | Lighthouse 90+ on live URL | manual-only | Run Chrome Lighthouse on `https://tylerbradshaw.dev` | N/A |
| PERF-02 | Netlify deployment works end-to-end | manual-only | Execute UAT checklist on live site | N/A |

**Justification for manual-only:** SEO meta tags and Lighthouse scores require browser execution and/or live network conditions. No unit-testable behavior exists for this phase — all acceptance criteria are observable in the built artifact or on the live URL. The `npm run build` smoke test catches syntax errors and missing exports before human review.

### Sampling Rate
- **Per task commit:** `npm run build` — verifies no TypeScript/compile errors introduced
- **Per wave merge:** `npm run build && npm run lint` — full static analysis
- **Phase gate:** Human UAT checklist complete + Lighthouse 90+ verified before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] No automated test infrastructure for SEO meta tags — manual inspection of `out/index.html` is the acceptance method
- [ ] No Lighthouse CI configured — PERF-01 acceptance is a manual human run

*(These are intentional: the cost of wiring Lighthouse CI exceeds the benefit for a static portfolio phase. Manual verification is the correct approach.)*

---

## Open Questions

1. **sharp-cli v5 exact subcommand syntax**
   - What we know: `sharp -i input -o output resize W H` is the documented pattern for sharp-cli v1.x; v5.x may differ
   - What's unclear: Whether the CLI interface changed in v5 vs v1
   - Recommendation: Confirm with `npx sharp-cli --help` before writing the resize task. If syntax has changed, fall back to a small Node.js script using the `sharp` npm API directly, which is stable and fully documented.

2. **Ty.jpg dimensions and crop behavior**
   - What we know: The file exists at `public/assets/1x/Ty.jpg` — dimensions unverified
   - What's unclear: Whether a simple resize produces a well-framed 1200x630 or crops awkwardly
   - Recommendation: Inspect the image visually after resize. The planner should note that the OG image task includes a visual review step before committing.

---

## Sources

### Primary (HIGH confidence)
- Next.js 16.2.1 official docs (nextjs.org/docs/app/api-reference/functions/generate-metadata) — `metadata` export, `metadataBase`, `openGraph`, `twitter` fields
- Next.js 16.2.1 official docs (nextjs.org/docs/app/guides/json-ld) — JSON-LD injection pattern, XSS mitigation, `dangerouslySetInnerHTML` guidance
- Next.js 16.2.1 official docs (nextjs.org/docs/app/getting-started/metadata-and-og-images) — static OG image vs runtime generation; file-based metadata conventions
- Schema.org Person (schema.org/Person) — `name`, `jobTitle`, `url`, `sameAs` property definitions
- Chrome for Developers Lighthouse docs — performance metric weights (TBT 30%, LCP 25%, CLS 25%, FCP 10%, SI 10%)

### Secondary (MEDIUM confidence)
- npm registry (npm view sharp-cli version, npm view sharp version) — sharp-cli 5.2.0, sharp 0.34.5 (verified 2026-03-22)
- sharp-cli GitHub (github.com/vseventer/sharp-cli) — CLI command syntax

### Tertiary (LOW confidence)
- WebSearch results on Lighthouse Next.js optimization — general patterns, not Next.js-16-specific

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — verified against official Next.js 16.2.1 docs and npm registry
- Architecture: HIGH — patterns directly from official Next.js documentation with code examples
- Pitfalls: HIGH for metadataBase and JSON-LD (official docs); MEDIUM for Lighthouse specifics (official Chrome docs but not Next.js 16 specific)

**Research date:** 2026-03-22
**Valid until:** 2026-06-22 (stable APIs — Next.js metadata API has been stable since v13.2; 90-day window reasonable)
