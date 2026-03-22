# Phase 4: Contact Form and Accessibility - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire up the contact form to Netlify Forms with a static Next.js export, implement AJAX submission with inline success/error states, add form validation, and verify all WCAG 2.1 AA accessibility requirements. Contact form must deliver submissions to the Netlify dashboard on the live deployed site.

</domain>

<decisions>
## Implementation Decisions

### Pre-scouted: Already implemented in Phase 3 (no work needed)
- **D-00a:** FORM-02 (labels) — `ContactSection.tsx` already has `<label htmlFor="name/email/message">` properly paired via `id`. No changes needed.
- **D-00b:** FORM-03 (dropdown caret) — `Nav.tsx` already uses `<button>` for the dropdown trigger (line 92). No SVG acting as button. No changes needed.
- **D-00c:** FORM-04 (alt text) — All 12 project images in `projects.ts` have descriptive `alt` strings. `InfoSection.tsx` has `alt="Photo of Tyler Bradshaw"`. Nav logo/wordmark have alt text. No changes needed.

### Netlify Forms integration (FORM-01)
- **D-01:** Form must submit via `fetch()` (AJAX), not a standard HTML POST redirect. This enables inline success/error states without page navigation.
- **D-02:** A static seed form must exist at `public/contact.html` — a plain HTML file with a matching `<form name="contact" netlify>` and all field names. Netlify's bot scrapes `public/` during build to register the form; the React component is rendered client-side and would otherwise be invisible to the bot.
- **D-03:** The React form element keeps `data-netlify="true"`, `name="contact"`, and `method="POST"`. The `action` attribute is removed (AJAX handles submission). Hidden `<input type="hidden" name="form-name" value="contact" />` stays.
- **D-04:** After `next build`, inspect `out/index.html` to confirm the form fields are present. If not, the seed form in `public/contact.html` is the fallback detection mechanism.

### Post-submit UX
- **D-05:** On successful submission, replace the form fields with a terminal-style inline confirmation inside the same card. Copy: `[ MESSAGE SENT ] — I'll be in touch.` (teal monospace, centered).
- **D-06:** During submission, the button text changes to `[ SENDING... ]` and is disabled. Prevents double-submit.
- **D-07:** On submission failure (network error, non-2xx response), show an inline error message in the card: `[ ERROR ] — Something went wrong. Try again or email me directly.` The form remains interactive so the user can retry.
- **D-08:** Implementation: `status` state with values `'idle' | 'submitting' | 'success' | 'error'`. Conditionally render form vs. success/error message based on status.

### Form validation
- **D-09:** All three fields (Name, Email, Message) are required.
- **D-10:** Validation fires on submit only — not on blur, not on keystroke. No error nag while the user is still typing.
- **D-11:** Errors displayed as inline per-field messages below each input (e.g. `Name is required`, `Valid email required`). Styled to match terminal aesthetic — small teal or red text, monospace.
- **D-12:** Email field validated for format (`/\S+@\S+\.\S+/` or similar simple regex) in addition to presence check.

### Spam protection
- **D-13:** Netlify honeypot field — add `netlify-honeypot="bot-field"` to the form element and a hidden `<input name="bot-field" />` (visually hidden, not `display:none` — bots fill it in, humans don't). If `bot-field` has a value on submit, silently discard.
- **D-14:** No reCAPTCHA — zero friction for real users is the priority.

### Claude's Discretion
- Exact CSS for inline error messages (color, size, spacing) — use existing design tokens, no new colors
- Exact wording of per-field validation errors beyond what's specified above
- Whether to add `aria-describedby` linking inputs to their error messages (recommended for a11y — Claude's call)
- Transition/animation for the success/error state swap (suggested: reuse `--transition-slow`)

</decisions>

<specifics>
## Specific Ideas

- Success copy: `[ MESSAGE SENT ] — I'll be in touch.` — terminal bracket style, matches the `[ SEND MESSAGE ]` button aesthetic
- Loading state: button text changes to `[ SENDING... ]` — visually consistent, no spinner needed
- Error copy: `[ ERROR ] — Something went wrong. Try again or email me directly.`
- The seed form at `public/contact.html` is a Netlify-specific static export workaround — this is the documented approach for Next.js `output: 'export'` + Netlify Forms

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Current form implementation (primary integration target)
- `app/components/ContactSection.tsx` — Current form markup: `data-netlify="true"`, `name="contact"`, `action="/"`, labels, inputs. This is the file being modified.
- `app/components/ContactSection.module.css` — Existing form styles: `.form`, `.field`, `.label`, `.input`, `.textarea`, `.submit`. New states (error, success, loading) extend these.

### Design tokens and patterns (must follow)
- `app/globals.css` — Design tokens (`--color-teal`, `--color-bg`, `--font-mono`, `--transition-slow`, `--radius-card`). No new colors. Error state may use a red value — check what's already defined before adding.
- `app/components/ProjectCard.tsx` — Reference for how `'use client'` + `useState` is used in this codebase for interactive state.

### Requirements
- `.planning/REQUIREMENTS.md` — FORM-01 through FORM-04 (full text of all four requirements)
- `.planning/ROADMAP.md` — Phase 4 success criteria (4 items)

### Netlify Forms static export pattern
- No internal doc — this is a Netlify platform requirement: seed form must be a static HTML file in `public/` with matching `name` and field names so the Netlify build bot registers the form. The React component is invisible to the bot.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `useReveal` hook: already applied in `ContactSection.tsx` — no changes needed to the reveal animation.
- `status` state pattern: `useState<'idle' | 'submitting' | 'success' | 'error'>('idle')` — standard React pattern, no library needed.
- `.terminal-card` class: already on the `<section>` in `ContactSection.tsx` — success/error messages render inside this same card.

### Established Patterns
- `'use client'` + `useState` for interactive state — `ProjectCard.tsx` is the reference.
- CSS Modules for component styles — follow existing `ContactSection.module.css` pattern for new error/success/loading classes.
- No new color tokens without checking `globals.css` first.

### Integration Points
- `public/contact.html`: New static file. Plain HTML only — Netlify bot reads this to register the form. Must have `<form name="contact" netlify>` with `name`, `email`, `message` fields.
- `ContactSection.tsx`: Add `useState` for `status` and `errors`, convert `<form>` to use `onSubmit` handler with `fetch()`, add honeypot field, add validation logic, conditionally render success/error states.

</code_context>

<deferred>
## Deferred Ideas

- reCAPTCHA — rejected in favor of honeypot (D-14). Revisit if spam becomes a real issue post-launch.
- On-blur validation — deferred in favor of on-submit-only (D-10). Could add in a polish phase if user feedback warrants it.
- Custom `/success` page — not needed; inline state achieves the same goal with less code.

</deferred>

---

*Phase: 04-contact-form-and-accessibility*
*Context gathered: 2026-03-22*
