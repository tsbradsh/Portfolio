# Phase 5: SEO, Performance and Launch - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Add SEO metadata (Open Graph, JSON-LD Person entity), generate sitemap.xml and robots.txt, optimize page load performance to hit Lighthouse 90+ across all four categories, and verify the site end-to-end on Netlify at the live domain. Does NOT include new content, redesign, or changes to WebGL quality.

</domain>

<decisions>
## Implementation Decisions

### Canonical URL
- **D-01:** `https://tylerbradshaw.dev` is the canonical domain — used in OG `url`, canonical link tag, sitemap, and JSON-LD Person `url` field.

### SEO Metadata
- **D-02:** Extend `app/layout.tsx` `metadata` export with full Open Graph block: `type: 'website'`, `url`, `title`, `description`, `images` (og-image.png).
- **D-03:** Add Twitter/X card metadata: `card: 'summary_large_image'`, `title`, `description`, `images`.
- **D-04:** Add `metadataBase` set to `https://tylerbradshaw.dev` so Next.js resolves relative image paths correctly in OG tags.
- **D-05:** Meta description: `"Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript."` (approx 100 chars, keyword-rich).

### OG Image
- **D-06:** Use `Ty.jpg` (self-portrait from `public/assets/1x/`) as the OG image — resize/crop to 1200×630 PNG, saved as `public/og-image.png`.
- **D-07:** Static file approach — `public/og-image.png` exports correctly with `output: 'export'`. No `next/opengraph-image` runtime generation (incompatible with static export).

### Sitemap & Robots
- **D-08:** Generate `public/sitemap.xml` — static file listing `https://tylerbradshaw.dev/` as the single canonical URL with `lastmod` and `changefreq: monthly`.
- **D-09:** Generate `public/robots.txt` — allow all crawlers, reference sitemap URL.

### JSON-LD Person Entity
- **D-10:** Add JSON-LD `<script type="application/ld+json">` in `app/layout.tsx` (or a dedicated `JsonLd` component rendered in layout).
- **D-11:** Person schema fields:
  - `@type: "Person"`
  - `name: "Tyler Bradshaw"`
  - `jobTitle: "Full-Stack Developer"`
  - `url: "https://tylerbradshaw.dev"`
  - `sameAs: ["https://github.com/tsbradsh", "https://www.linkedin.com/in/tsbw/"]`
- **D-12:** No `contactPoint` email in schema (not exposing email in structured data).

### Lighthouse Performance Strategy
- **D-13:** Only non-visual optimizations — do NOT reduce WebGL shader iterations or visual quality.
- **D-14:** Acceptable optimization targets: image format/size optimization (Ty.jpg, project screenshots), font preload hints, defer non-critical JS, verify Cascadia Code preload is wired correctly.
- **D-15:** WebGL runs post-load inside `useEffect` — does not block LCP. No changes to fractal render loop.
- **D-16:** `next/image` is not usable (static export with `images: { unoptimized: true }`). Image optimization must be manual (sharp CLI or equivalent, or serve already-optimized assets).

### End-to-End Netlify Verification
- **D-17:** Phase includes a human-executable UAT checklist for the live Netlify deployment — not automated. Planner should include a task that documents this checklist.
- **D-18:** Checklist must cover: site loads at `https://tylerbradshaw.dev`, contact form submits to Netlify dashboard, all nav links resolve, all project links resolve, OG preview renders correctly (test via opengraph.xyz or similar), Lighthouse run on live URL.

### Claude's Discretion
- Exact image resize method for og-image.png (sharp CLI, manual export, or canvas — any approach that produces a valid 1200×630 PNG)
- Whether JSON-LD is inlined in layout.tsx or extracted to a `JsonLd.tsx` component
- robots.txt crawl-delay settings

</decisions>

<specifics>
## Specific Ideas

- OG image is `Ty.jpg` (self-portrait) — puts a face to the name for recruiters on Slack/LinkedIn previews.
- Sitemap has only one URL (single-page portfolio) — keep it minimal.
- JSON-LD sameAs uses the exact profile URLs already wired in the nav: `https://github.com/tsbradsh` and `https://www.linkedin.com/in/tsbw/`.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context
- `.planning/REQUIREMENTS.md` — SEO-01, SEO-02, PERF-01, PERF-02 definitions and acceptance criteria
- `.planning/PROJECT.md` — Core value, constraints, confirmed social URLs

### Existing implementation
- `app/layout.tsx` — Current metadata stub to extend; font loading; JSON-LD injection point
- `next.config.ts` — `output: 'export'` and `images: { unoptimized: true }` constraints
- `public/assets/1x/Ty.jpg` — Source image for OG card
- `public/contact.html` — Netlify seed form (already deployed pattern to understand)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `app/layout.tsx` `metadata` export: already has `title` and `description` — extend in-place with OG, Twitter, metadataBase
- `public/assets/1x/Ty.jpg`: self-portrait, source for og-image.png
- `public/fonts/CascadiaCode.woff2`: already loaded via `next/font/local` with `display: 'swap'` — preload hint is handled automatically by Next.js

### Established Patterns
- Static files in `public/` export directly to `out/` — sitemap.xml, robots.txt, og-image.png all belong here
- `output: 'export'` means no server-side rendering or API routes — all SEO must be static
- Netlify Forms detection requires the seed form in `public/` (already done in Phase 4)

### Integration Points
- JSON-LD script tag goes in `<head>` via `layout.tsx` — either `dangerouslySetInnerHTML` in a component or Next.js `<Script>` with `strategy="beforeInteractive"`
- OG image at `public/og-image.png` → referenced as `/og-image.png` in metadata, resolved to full URL via `metadataBase`

</code_context>

<deferred>
## Deferred Ideas

- Analytics (Plausible or similar) — v2 requirement (ANAL-01, ANAL-02), out of scope for Phase 5
- Dark/light mode — v2 requirement (ADV-01)
- Resume PDF download — user will add when available (RESUME-01, RESUME-02)
- AI Music Tool live URL — not available yet (AI-01)

</deferred>

---

*Phase: 05-seo-performance-and-launch*
*Context gathered: 2026-03-22*
