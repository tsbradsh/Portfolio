# Architecture

**Analysis Date:** 2026-03-21

## Pattern Overview

**Overall:** Single-page application (SPA) with progressive enhancement using Three.js WebGL for background visualization and vanilla JavaScript for interactivity.

**Key Characteristics:**
- Client-side rendering with semantic HTML structure
- WebGL canvas-based background with Mandelbrot fractal visualization
- Event-driven DOM manipulation and scroll-based animation
- No build step or framework dependency beyond Three.js library
- Static asset serving with Netlify form handling

## Layers

**Presentation Layer:**
- Purpose: Render semantic HTML structure with accessibility features
- Location: `index.html`
- Contains: Navigation, content sections (info, skills, projects, contact), terminal-style UI components
- Depends on: Three.js library, CSS styles, JavaScript event handlers
- Used by: User browser, search engines

**Styling Layer:**
- Purpose: Visual presentation with responsive design and animated transitions
- Location: `styles.css`
- Contains: Typography, grid layouts, responsive breakpoints (1200px, 1024px, 768px), animation classes, color scheme (#00ffcc accent, #0a0a0a background)
- Depends on: HTML element structure, CSS custom properties
- Used by: Browser rendering engine

**Rendering Layer:**
- Purpose: WebGL-based Mandelbrot fractal background visualization and animation loop
- Location: `scriptGL.js` (lines 1-111)
- Contains: Three.js scene setup, shader material uniforms, requestAnimationFrame animation loop, responsive canvas sizing
- Depends on: Three.js library, shader code (inline GLSL)
- Used by: Main animation system

**Interaction Layer:**
- Purpose: Handle user input and DOM state management
- Location: `scriptGL.js` (lines 128-201)
- Contains: Navigation toggle, dropdown menu handling, scroll event listeners, keyboard accessibility
- Depends on: DOM selectors, CSS class toggles
- Used by: User events (click, scroll, keyboard)

## Data Flow

**Page Load Sequence:**

1. HTML parses and loads external resources (Three.js, styles)
2. `scriptGL.js` defers until DOM content loaded
3. Three.js initializes WebGL canvas, scene, camera, renderer
4. Shader material compiles with initial uniforms (zoom=1.0, pan=-0.743/0.11)
5. Animation loop starts with `requestAnimationFrame`
6. DOM event listeners attach to navigation, dropdown, and scroll
7. Page interactive and visible

**Scroll-Based Animation Flow:**

1. User scrolls page
2. `scroll` event fires (line 74)
3. Calculate `targetZoom` using exponential function: `Math.exp(scrollY / 1300)`
4. Calculate `targetHueOffset` using modulo: `(scrollY / 15000) % 1`
5. Check terminal visibility against scroll position
6. Add/remove `.visible` class on `.win-terminal` elements
7. Animation loop interpolates zoom/hue toward targets with easing (0.05, 0.01 factors)
8. WebGL material uniforms update, canvas re-renders

**User Interaction - Navigation Toggle:**

1. User clicks hamburger button (`.nav-toggle`)
2. Toggle `.open` class on `#links` nav list
3. Update `aria-expanded` attribute for accessibility
4. CSS `:not(.open)` or `.open` class controls display
5. Clicking nav link closes drawer automatically

**User Interaction - Projects Dropdown:**

1. User clicks caret icon (`.caret-icon`) or activates with keyboard (Enter/Space)
2. Toggle `.open` class on `.dropdown` container
3. CSS rule `.dropdown.open .dropdown-content { display: flex }` shows submenu
4. Caret icon rotates 180deg with `transform: rotate(180deg)`
5. Escape key closes and refocuses icon
6. Click outside closes menu

## Key Abstractions

**Terminal Windows:**
- Purpose: Visual container representing Windows 95-style terminal windows with project/section content
- Examples: `.win-terminal` class applied to info, skills, projects, contact sections in `index.html`
- Pattern: CSS classes handle visibility/animation, JavaScript adds `.visible` on scroll trigger

**Animated Images:**
- Purpose: Delayed reveal of project screenshots with staggered entrance animation
- Examples: `.terminal-img` elements within `.img-grid` and `.img-grid2` containers
- Pattern: `.visible` class applied via JavaScript enables transition: opacity 0→1, transform translateX(100px)→0

**Overlay Darkening:**
- Purpose: Visual feedback showing when content is in focus
- Examples: `#overlay` div positioned fixed with opacity transition
- Pattern: Opacity controlled by JavaScript based on terminal visibility

## Entry Points

**HTML Document:**
- Location: `index.html`
- Triggers: Browser requests /
- Responsibilities: Structure content, define semantic hierarchy, link resources, provide skip-link for accessibility

**Script Initialization:**
- Location: `scriptGL.js` (executed with `defer` attribute)
- Triggers: DOM content fully loaded
- Responsibilities: Initialize WebGL, attach event listeners, start animation loop

**Contact Form Submission:**
- Location: `index.html` line 307 - `<form name="contact" netlify>`
- Triggers: User submits contact form
- Responsibilities: Submit form data to Netlify backend for processing

## Error Handling

**Strategy:** Graceful degradation - canvas rendering errors don't break page, scroll and nav still work

**Patterns:**
- WebGL fallback: If Three.js fails to load, canvas remains empty but page remains functional
- Visibility change handling (line 114): Animation pauses when tab hidden, resumes on return
- Window resize handler (line 123): Canvas resizes without breaking animation loop or uniforms

## Cross-Cutting Concerns

**Logging:** Console debugging via browser DevTools (no explicit logging in code)

**Validation:** HTML5 native validation (required, type="email" on form inputs)

**Authentication:** None - static portfolio site, Netlify form handles submission security

**Accessibility:**
- Skip link (`.skip-link`) allows keyboard users to jump to main content
- Screen reader only text (`.sr-only`) for h1 title
- ARIA labels on buttons and interactive elements (aria-label, aria-expanded, aria-controls)
- Keyboard navigation: Tab, Enter, Space, Escape work on nav and dropdown
- Semantic HTML: `<nav>`, `<main>`, `<footer>`, `<form>`, role="menu"

---

*Architecture analysis: 2026-03-21*
