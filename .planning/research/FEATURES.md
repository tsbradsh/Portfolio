# Feature Landscape

**Domain:** Developer portfolio site — hirability-focused
**Project:** Tyler Bradshaw Portfolio (Next.js + TypeScript migration)
**Researched:** 2026-03-21
**Confidence note:** WebSearch unavailable during this session. Findings draw on training data (knowledge cutoff August 2025) and direct codebase analysis. Developer portfolio best practices are stable domain knowledge; confidence is MEDIUM-HIGH overall. Flag for validation if hiring-signal patterns feel stale.

---

## Table Stakes

Features users (recruiter, hiring manager, peer developer) expect. Missing = portfolio looks incomplete or amateurish.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| About / identity section | Recruiters need to know immediately who you are and what role you're targeting | Low | Must answer "who is this person, what do they do, what are they looking for" in 10 seconds |
| Project showcase with real links | Proof of work — abstract claims without evidence are worthless | Low | Every project needs: title, description, tech stack used, GitHub link, and live link if applicable |
| Skills / technology section | ATS systems and technical recruiters scan for keywords | Low | List languages, frameworks, tools you can actually use at work level |
| Working contact method | Recruiters must be able to reach you without friction | Low | Form, email, or both — non-functional contacts are disqualifying |
| GitHub and LinkedIn links | Social proof + ability to deep-dive your history | Low | Must be functional — placeholder `href="#"` links signal the portfolio itself is a demo artifact |
| Responsive mobile layout | Recruiters frequently screen on mobile; broken layout signals sloppy work | Medium | Tyler's current layout is broken on phones — this is a critical gap |
| HTTPS and production hosting | Security baseline; signals professionalism | Low | Netlify provides this; not a concern but must be verified post-deploy |
| Fast load time (under 3s on mobile) | Recruiters won't wait; slow sites suggest poor engineering judgment | Medium | Core Web Vitals matter — LCP, CLS, FID all affect perception |
| Readable typography and contrast | Information must actually be legible across devices and lighting conditions | Low | WCAG AA contrast ratio (4.5:1 for normal text) is a floor, not a ceiling |
| SEO basics (title, meta description, Open Graph) | Enables portfolio to be found and shared; OG tags make LinkedIn/Slack shares look professional | Low | Next.js Metadata API makes this straightforward |
| Semantic HTML structure | Search engines and screen readers depend on correct heading hierarchy, landmarks | Low | Heading levels (h1 → h2 → h3), nav, main, footer — not decorative |

---

## Differentiators

Features that set a portfolio apart. Not expected, but create strong positive signal with technical reviewers.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| WebGL / generative art background | Signals depth in graphics programming — rare, memorable, technically impressive | High | Tyler's Mandelbrot fractal is a strong differentiator IF it loads fast and doesn't impede content. Must not become a liability via jank or blocked render |
| Next.js + TypeScript as tech signal | The stack itself communicates: "I use industry-standard modern tools" | Medium | A portfolio built in vanilla HTML/CSS tells a different story than one in Next.js — the choice of tech is itself a portfolio piece |
| Terminal / hacker aesthetic done cleanly | Stands out from the sea of Tailwind-blue generic portfolios; signals strong design taste | Medium | The critical word is "done cleanly" — retro kitsch reads as junior. Elevated terminal (Vercel-dark aesthetic) reads as senior |
| Scroll-triggered animations | Shows JS / CSS animation competence without heavy framework | Medium | Must be subtle and performant — not every element should bounce in |
| Adaptive WebGL quality | Demonstrates awareness of performance tradeoffs; graceful degradation to non-WebGL devices | Medium | Intersection Observer + device pixel ratio capping + canvas pause when off-screen |
| Structured data / JSON-LD | Makes portfolio parseable by search engines as a "Person" entity; rare for portfolios | Low | Next.js makes this easy; few devs bother, which makes it a differentiator |
| Accessibility above WCAG AA | Technical hiring managers at mature companies explicitly check this; signals engineering discipline | Medium | Goes beyond table stakes compliance to intentional design |
| Lighthouse score 90+ across all categories | Shareable proof of engineering discipline — some hiring managers literally run Lighthouse on candidates' sites | Medium | Requires image optimization, proper font loading, Core Web Vitals attention |
| Resume download (when available) | Reduces recruiter friction — some won't reach out without a PDF to forward to their client | Low | Currently out of scope per PROJECT.md; flag as high-value when Tyler is ready |
| Source code of portfolio is itself clean and public | Peer developers will look at your portfolio's source — it's a code sample | Low | If hosting on GitHub Pages or linking the repo, the code is visible. Next.js + TS migration improves this signal significantly |

---

## Anti-Features

Features that hurt hirability. Common mistakes to explicitly avoid.

| Anti-Feature | Why It Hurts | What to Do Instead |
|--------------|--------------|-------------------|
| Placeholder / broken links | Communicates: "I ship incomplete work." Nothing undermines competence signal faster. | Fill every link before launch; use `coming-soon` styling if a link genuinely isn't available yet, not `href="#"` |
| Under-construction sections | Same signal as broken links — portfolio should only contain finished things | Either remove or build them; "coming soon" for live project URLs is acceptable IF clearly labeled |
| Overwhelming animation / animation on every element | Fatigues viewer; obscures content; signals poor judgment about UX | Animate selectively — entrance animation on sections, not on individual words or icons |
| WebGL that causes frame drops or blocks text | Technical showcase becomes a performance liability; recruiter can't read about you | Performance budget: 60fps on mid-range mobile, zero layout shift from canvas, canvas must not block interactivity |
| Wall of text in project descriptions | Recruiters spend 30–60 seconds on a portfolio; dense paragraphs won't be read | Use bullet points or 2–3 sentences max per project: what was the problem, what did you build, what tech did you use |
| Skills section with every technology ever touched | Dilutes signal; makes you appear unfocused | Tier skills: "proficient" vs "familiar" or group by category; list only what you can interview on |
| No indication of what role you want | Recruiters work by role; if they can't tell what you're targeting, they'll move on | Headline or tagline that clearly states your focus: "Full-stack developer" or "Frontend engineer specializing in React" |
| Images without alt text | Fails accessibility; fails SEO; signals inattention to detail | Every `<img>` gets meaningful alt text |
| Auto-playing audio / video with sound | Universally disliked; immediate close-tab trigger | If video is needed, autoplay muted only |
| Pop-ups or cookie consent banners (on a static portfolio) | Annoying and unnecessary for a static site with no analytics requiring consent | Don't add analytics requiring GDPR banners unless you need data |
| Low contrast text for aesthetic reasons | Terminal aesthetic tempts dim-on-dark choices that fail WCAG | Test every text/background combination with a contrast checker; dark themes require extra care |
| Font loading causing layout shift | CLS hurts performance scores and visual polish | Use `font-display: swap` with a closely matched fallback font; Cascadia Code → Consolas → monospace is a good stack |
| Deploying on GitHub Pages with a username path (`username.github.io/portfolio`) | Signals you don't own your online presence; looks less professional | Use a custom domain or at minimum `username.github.io` root domain |

---

## Feature Dependencies

```
Real project links → Project showcase section
  (showcase without links is incomplete)

Mobile responsive layout → Contact form usability
  (broken mobile = broken recruiter contact path)

WebGL graceful fallback → Performance budget
  (fallback enables capping quality for low-end devices)

Open Graph meta tags → SEO basics
  (OG requires title/description to be set first)

Next.js static export → Netlify/Vercel hosting
  (export config must be set before deployment works)

Lighthouse 90+ → Image optimization + font loading + Core Web Vitals
  (score is a composite — each subcategory has prerequisites)

Accessibility (WCAG AA) → Semantic HTML + proper labels + color contrast
  (labels and contrast must be fixed before ARIA layering makes sense)

Structured data (JSON-LD) → SEO basics
  (layered on top of baseline meta tags)

Resume download → File hosted somewhere
  (out of scope until Tyler has a resume PDF ready)
```

---

## Hirability-Specific Analysis

### What Recruiters (non-technical) need

Recruiters at agencies and in-house teams are screening for role fit, not technical depth. They need:

1. **Name and role** immediately visible — don't bury the lede
2. **Contact path** with zero friction — form or mailto link, no broken buttons
3. **LinkedIn link** — they will verify on LinkedIn regardless
4. **Resume PDF** — agencies forward PDFs to clients; without this they'll ask anyway
5. **Projects described in plain English** — not just tech stacks, what the project does

### What Technical Hiring Managers need

Technical reviewers will go deeper. They look for:

1. **Tech stack choices** — Next.js + TypeScript signals competence for frontend/full-stack roles
2. **Code quality signal** — if they visit the GitHub repo, the code is also a sample
3. **Complexity of work** — "I built a WebGL Mandelbrot fractal with adaptive zoom and scroll-driven animation" is a stronger signal than "I built a TODO app"
4. **Attention to detail** — missing alt text, broken links, layout shifts are red flags for production quality awareness
5. **Performance discipline** — Lighthouse, Core Web Vitals, frame rate stability
6. **Accessibility** — WCAG compliance signals understanding of production-grade web engineering

### What Peer Developers (senior devs who screen code tests) look for

1. **Source code architecture** — component structure, separation of concerns, TypeScript usage
2. **No amateur patterns** — `console.log` left in, commented-out code, inline styles, magic numbers
3. **Meaningful commit history** — visible on GitHub; tells a story about how you work
4. **Stack confidence** — using Next.js idiomatically (Metadata API, Image component, static export) vs just throwing React at a single HTML file

---

## MVP Recommendation

Prioritize these for the migration milestone:

1. **Fix all placeholder links** — GitHub, LinkedIn, project repos are known and documented in PROJECT.md. This is a one-line change per link but has massive impact.
2. **Responsive mobile layout** — currently broken; must be fixed before launch
3. **SEO meta tags** — Next.js Metadata API makes this low-effort, high-reward
4. **Working contact form** — Netlify Forms compatibility must be verified with Next.js static export (requires `next export` + form attribute handling)
5. **WebGL graceful fallback** — required before shipping to prevent blank-page failure on non-WebGL browsers
6. **Accessibility: form labels + semantic buttons** — documented gaps in CONCERNS.md; WCAG AA floor

Defer to later phases:

- **Structured data / JSON-LD** — valuable but not urgent for launch
- **Lighthouse 90+ across all categories** — pursue after core features are stable
- **Resume download** — out of scope until PDF is ready (per PROJECT.md)
- **Full adaptive WebGL quality** — progressive enhancement; fallback unblocks launch

---

## Content Recommendations (non-feature)

Even the best feature set fails without good content. The portfolio's content strategy should:

- **Tagline** — one sentence stating who Tyler is and what he builds. Not "passionate developer." Something specific: "Frontend engineer building fast, accessible web applications."
- **Project descriptions** — problem → solution → tech → outcome. Each in 2–3 sentences or bullets.
- **Skills** — group by area (Languages / Frameworks / Tools) rather than flat list. Remove anything you can't speak to confidently in an interview.
- **AI Music Tool** — even without a live URL, this project can be showcased with screenshots/diagrams and the GitHub repo. Describe what it does, why it's interesting, what tech was used.

---

## Sources

- Codebase analysis: `C:\Users\tybox\Documents\GitHub\Portfolio\.planning\codebase\CONCERNS.md` (2026-03-21)
- Project requirements: `C:\Users\tybox\Documents\GitHub\Portfolio\.planning\PROJECT.md` (2026-03-21)
- Developer portfolio best practices: training data (knowledge cutoff August 2025) — MEDIUM confidence; WebSearch unavailable for current-year verification. Recommend spot-checking against a current "developer portfolio best practices 2026" search before roadmap is finalized.
- WCAG 2.1 contrast and accessibility requirements: stable specification, HIGH confidence
- Next.js Metadata API and static export: stable Next.js 14/15 features, HIGH confidence based on training data
