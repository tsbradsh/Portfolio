# External Integrations

**Analysis Date:** 2026-03-21

## APIs & External Services

**None Detected** - This is a static portfolio site with no external API integrations.

## Data Storage

**Databases:**
- Not used - No backend database

**File Storage:**
- Local filesystem only
- Assets stored in `/assets/` directory:
  - `assets/1x/` - Logo, wordmark, profile image
  - `assets/wys/` - Project screenshots (When You Sleep)
  - `assets/AI/` - Project diagrams (AI Music Tool)
  - `assets/RCSS/` - Project screenshots (Red Clover Sugar Studio)

**Caching:**
- Browser cache (implicit via HTTP headers)
- No explicit caching strategy implemented
- No service workers detected

## Authentication & Identity

**Auth Provider:**
- Not used - No authentication system

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service integrated

**Logs:**
- Browser console only (for development)
- No server-side logging or analytics detected

## CI/CD & Deployment

**Hosting:**
- Static hosting platform (likely Netlify based on form attributes)
- No backend server required

**CI Pipeline:**
- Not detected - No GitHub Actions, GitLab CI, or similar found

**Deployment:**
- Manual or platform-triggered deployments
- No automated testing or build pipeline

## Environment Configuration

**Required Environment Variables:**
- None - No environment configuration needed

**Secrets Location:**
- Not applicable - No secrets or credentials required

**Configuration Files:**
- `.vscode/launch.json` - VS Code debug configuration (development only)
- `.claude/settings.local.json` - Claude IDE settings (development only)

## Form Handling

**Contact Form:**
- Location: `index.html` lines 307-316
- Framework: Netlify Forms
- Attributes: `<form name="contact" netlify>`
- Fields:
  - `name` (text, required)
  - `email` (email, required)
  - `message` (textarea, required)
- Submission: Server-side form processing via Netlify

**Netlify Integration:**
- Form data captured by Netlify's form service
- No custom backend form handler
- Netlify requires account for form submissions

## Webhooks & Callbacks

**Incoming:**
- Netlify form submissions - Contact form data sent to Netlify service

**Outgoing:**
- Not implemented - No outgoing webhooks detected

## Third-Party Services Summary

**Integrated:**
1. **Netlify Forms** - Contact form submission handling
   - Required: Netlify hosting account
   - No API key needed (automatic with form attribute)

2. **unpkg.com (CDN)** - Three.js library delivery
   - URL: `https://unpkg.com/three@0.158.0/build/three.min.js`
   - Required: Internet connectivity and unpkg service availability

## Potential Integration Points (Incomplete/TODO)

Several placeholders exist in HTML for future integrations:

**Social Links:**
- GitHub - `<!-- TODO: GitHub URL -->` (line 44)
  - Placeholder: `.social-placeholder` with text "GH"
- LinkedIn - `<!-- TODO: LinkedIn URL -->` (line 45)
  - Placeholder: `.social-placeholder` with text "LI"

**Project Links:**
- When You Sleep Live Project - Currently disabled with `aria-disabled="true"` (line 142)
- When You Sleep Code Repository - Currently disabled (line 144)
- AI Music Tool Code - Currently disabled (line 203)
- Red Clover Sugar Studio Code - Currently disabled (line 265)

**Other TODOs:**
- Resume PDF link - `<!-- TODO: link to resume PDF -->` (line 42)
- Contact form currently functional via Netlify

## Security Considerations

**CORS & Cross-Origin:**
- CDN-hosted Three.js loaded from unpkg.com (third-party origin)
- No CORS policy restrictions visible

**Form Security:**
- Contact form relies on Netlify's spam protection
- No CSRF token or custom validation implemented

**Data Privacy:**
- Form data submitted to Netlify
- User should review Netlify's privacy policy for GDPR/data retention

---

*Integration audit: 2026-03-21*
