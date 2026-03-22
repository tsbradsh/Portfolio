<!-- GSD:project-start source:PROJECT.md -->
## Project

**Tyler Bradshaw Portfolio**

A personal developer portfolio for Tyler Bradshaw, migrating from a vanilla HTML/CSS/JS codebase to a Next.js + TypeScript application. The site features a distinctive WebGL Mandelbrot fractal background and an elevated terminal aesthetic — monospace type, dark palette, teal accents — modernized to feel intentional and polished rather than retro. Goal is maximum hirability: impressive tech stack, real links, fast load times, and a design that stands out.

**Core Value:** The portfolio must signal technical competence and design sensibility simultaneously — the WebGL fractal and terminal identity must coexist with professional polish that holds up to recruiter scrutiny.

### Constraints

- **Tech Stack:** Next.js + TypeScript — chosen for SSG/SEO, industry hirability signal, and clean component architecture
- **3D/Graphics:** Three.js retained — WebGL fractal is a core identity element, not optional
- **Hosting:** Must remain Netlify-compatible (Next.js static export) or migrate to Vercel
- **Design System:** Must preserve elevated terminal aesthetic — no neutral/minimal pivot
- **Content:** Resume link and AI Music Tool live URL are placeholder until user provides them
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- HTML5 - Semantic markup for portfolio structure
- CSS3 - Layout, animations, and responsive design
- JavaScript (ES6+) - DOM manipulation and interactive features
- GLSL - Fragment shaders for WebGL Mandelbrot fractal rendering
## Runtime
- Browser-based (client-side only)
- No server-side runtime or backend requirements
- None - No npm/package.json detected
- All dependencies loaded via CDN
## Frameworks & Libraries
- Three.js 0.158.0 - 3D graphics library for WebGL rendering
- No framework - Pure HTML/CSS/JavaScript
- Statically hosted portfolio site
## Key Dependencies
- Three.js 0.158.0 (via CDN) - WebGL rendering engine for animated fractal background
## Configuration
- No environment variables or .env configuration
- No build step required
- Direct file serving
- Static file hosting only
- No build process or compilation
- Can be deployed to any static host (Netlify, Vercel, GitHub Pages, etc.)
## Platform Requirements
- No build tools required
- Text editor sufficient for development
- Any modern browser for testing (Chrome, Firefox, Safari, Edge)
- WebGL support required in browser
- Static hosting (Netlify, Vercel, GitHub Pages, etc.)
- HTTPS recommended for security
- WebGL-capable browsers required for Mandelbrot animation
- Fallback experience not implemented for non-WebGL browsers
## File Structure
- `index.html` - Main portfolio page
- `scriptGL.js` - JavaScript logic for DOM interactions and Three.js WebGL setup
- `shader.glsl` - Fragment shader for Mandelbrot fractal (embedded in `scriptGL.js`)
- `styles.css` - All styling, animations, responsive design
- `assets/1x/` - Logo, wordmark, self-portrait
- `assets/wys/` - "When You Sleep" project screenshots
- `assets/AI/` - AI Music Tool project diagrams
- `assets/RCSS/` - Red Clover Sugar Studio project screenshots
## External Resources
- Three.js 0.158.0 from unpkg.com
- Google Fonts (via CSS, if any) - Not detected in analysis
- No image optimization/compression pipeline
- Local asset directory with multiple resolutions (1x noted in path)
## Accessibility & Performance Features
- Cascadia Code (monospace) - Primary font stack
- Segoe UI Mono, Consolas as fallbacks
- System sans-serif for some headings
- WebGL animation runs on canvas element positioned fixed/behind content
- No lazy loading detected for images
- requestAnimationFrame used for smooth animation
- Animation pauses when tab is hidden (visibilitychange listener)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- JavaScript: camelCase with descriptive names (`scriptGL.js`)
- CSS: kebab-case with semantic naming (`styles.css`)
- HTML: semantic naming reflecting content structure (`index.html`)
- camelCase for regular functions (`openDropdown()`, `closeDropdown()`, `animate()`)
- Descriptive verb-first naming pattern (`toggleDropdown()`, `preventDefault()`)
- Utility functions use lowercase: `mandelbrot()`, `hsv2rgb()`
- camelCase for all variables (`targetZoom`, `animFrameId`, `navToggle`, `navLinks`)
- Prefixed targeting with specific meaning: `target*` for animation targets (`targetZoom`, `targetHueOffset`)
- DOM element references use semantic names tied to functionality (`navToggle`, `projectDropdown`, `caretIcon`)
- kebab-case for HTML classes (`.win-terminal`, `.nav-toggle`, `.dropdown-content`)
- camelCase for CSS variable names in JavaScript access
- ID attributes use semantic naming (`#logo`, `#links`, `#overlay`, `#main-content`)
- Utility classes use semantic names: `.sr-only` (screen reader only), `.skip-link`
- Component classes use kebab-case: `.win-terminal`, `.win-terminal-header`, `.terminal-content`
- State classes use specific keywords: `.visible`, `.open` for active states
## Code Style
- No automatic formatter detected (no `.prettierrc`, `biome.json`, or Prettier config)
- Manual formatting observed with consistent spacing
- 2-space indentation implied in CSS and HTML
- Line lengths vary but generally reasonable for readability
- No linting configuration detected (no `.eslintrc`, ESLint config, or similar)
- Code follows general JavaScript conventions without strict enforcement
- CSS lacks formal linting rules but maintains visual consistency
- Consistent spacing around operators in JavaScript
- HTML attributes properly spaced
- CSS properties indented consistently within rule blocks
## Import Organization
- Three.js imported via CDN: `<script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>`
- No module system used (vanilla JavaScript with global scope)
- Script loading deferred: `<script src="scriptGL.js" defer></script>`
- All JavaScript functionality in single file `scriptGL.js`
- CSS organized in single stylesheet `styles.css`
- No path aliases or module imports needed (monolithic design)
## Error Handling
- Minimal explicit error handling observed
- Relies on browser defaults for error recovery
- No try-catch blocks in codebase
- Graceful degradation through feature detection (visibility API, resize events)
- DOM queries checked implicitly before use (`document.querySelectorAll()`)
- Event listeners attached only after DOMContentLoaded
- Animation frame cancellation on visibility change prevents errors when tab hidden
## Logging
- No explicit logging statements found in code
- No console.log or debugging output in production code
- Relies on browser DevTools for debugging
## Comments
- Comments used sparingly but strategically
- Inline comments mark significant sections: `/* Mandelbrot Fractal Shader */`, `/* Terminal Reveal on Scroll */`, `/* Pause animation when tab is not visible */`
- Comments explain "why" more than "what": "// Ensure child images also become visible"
- No JSDoc comments found
- No TypeScript used; vanilla JavaScript throughout
- Function purpose implicit in naming
## Function Design
- `openDropdown()` - 2 lines
- `closeDropdown()` - 2 lines
- `toggleDropdown()` - 4 lines
- `animate()` - 8 lines
- Minimal parameters passed; most functions use closure scope
- DOM elements passed via closures after initial query
- Event objects used directly in listeners
- Most functions return undefined or void
- No explicit return statements in event handlers
- Animation function (`animate()`) calls recursively via `requestAnimationFrame()`
## Module Design
- No exports or module pattern used
- All code in global scope
- Functions and variables accessible throughout page lifetime
- DOM initialization wrapped in `DOMContentLoaded` event listener
- Three.js scene and renderer initialized immediately at script load
- Event listeners attached after DOM ready
- Three.js WebGL handling: lines 1-126 (`scriptGL.js`)
- DOM interactions and scroll logic: lines 128-201 (`scriptGL.js`)
- Navigation and dropdown logic: lines 128-201 (`scriptGL.js`)
- Clear visual sections marked with comments
## DOM Manipulation
- `document.querySelector()` for single elements
- `document.querySelectorAll()` for collections
- `document.getElementById()` for ID-based access
- `element.classList` for state management (`.add()`, `.remove()`, `.toggle()`)
- ARIA attributes managed via `setAttribute()`: `aria-expanded`, `aria-label`, `aria-disabled`, `aria-haspopup`
- Accessibility prioritized with proper ARIA roles and labels
## HTML Conventions
- Semantic HTML elements used: `<nav>`, `<main>`, `<footer>`, `<section>`
- Proper heading hierarchy (`<h1>`, `<h2>`, `<h3>`)
- Accessible form inputs with associated labels
- Accessibility features: skip links, screen-reader only content (`.sr-only`)
- Alt text for all images
- ARIA labels and roles for interactive elements
- `role="button"` for clickable SVGs
- `tabindex="0"` for keyboard navigation
## CSS Conventions
- Primarily class-based selectors
- Minimal ID selectors in CSS (only for high-specificity overrides when needed)
- Compound selectors for related elements: `li a`, `.nav-highlight:hover`
- No strict convention observed but generally logical grouping
- Positioning properties grouped together
- Color/visual properties grouped together
- Transition properties clustered
- Hex colors used consistently (`#00ffcc`, `#7dd3fc`, `#0a0a0a`)
- RGBA for transparency: `rgba(0, 255, 204, 0.15)`
- Color scheme: cyan/teal (`#00ffcc`) primary, light blue (`#7dd3fc`) secondary, dark (`#0a0a0a`) background
- Mobile-first media queries observed
- Breakpoints at 1200px, 1024px, 768px
- Specific styles for hamburger menu at 768px and below
## Class/Component Naming
- `.win-terminal` - main container
- `.win-terminal-header` - title bar styling
- `.win-terminal-body` - content area
- `.win-terminal-title` - title text within header
- `.wingrid` - two-column grid layout
- `.img-grid`, `.img-grid2` - image gallery grids
- `.container` - outer spacing container
- `.skills-grid` - responsive skill categories
- `.nav-toggle` - hamburger menu button
- `.dropdown` - dropdown container
- `.dropdown-content` - submenu content
- `.caret-icon` - toggle indicator
- `.visible` - opacity and transform reveal
- `.open` - display and expanded state
- Managed via `classList.add/remove/toggle()`
## Best Practices Observed
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Client-side rendering with semantic HTML structure
- WebGL canvas-based background with Mandelbrot fractal visualization
- Event-driven DOM manipulation and scroll-based animation
- No build step or framework dependency beyond Three.js library
- Static asset serving with Netlify form handling
## Layers
- Purpose: Render semantic HTML structure with accessibility features
- Location: `index.html`
- Contains: Navigation, content sections (info, skills, projects, contact), terminal-style UI components
- Depends on: Three.js library, CSS styles, JavaScript event handlers
- Used by: User browser, search engines
- Purpose: Visual presentation with responsive design and animated transitions
- Location: `styles.css`
- Contains: Typography, grid layouts, responsive breakpoints (1200px, 1024px, 768px), animation classes, color scheme (#00ffcc accent, #0a0a0a background)
- Depends on: HTML element structure, CSS custom properties
- Used by: Browser rendering engine
- Purpose: WebGL-based Mandelbrot fractal background visualization and animation loop
- Location: `scriptGL.js` (lines 1-111)
- Contains: Three.js scene setup, shader material uniforms, requestAnimationFrame animation loop, responsive canvas sizing
- Depends on: Three.js library, shader code (inline GLSL)
- Used by: Main animation system
- Purpose: Handle user input and DOM state management
- Location: `scriptGL.js` (lines 128-201)
- Contains: Navigation toggle, dropdown menu handling, scroll event listeners, keyboard accessibility
- Depends on: DOM selectors, CSS class toggles
- Used by: User events (click, scroll, keyboard)
## Data Flow
## Key Abstractions
- Purpose: Visual container representing Windows 95-style terminal windows with project/section content
- Examples: `.win-terminal` class applied to info, skills, projects, contact sections in `index.html`
- Pattern: CSS classes handle visibility/animation, JavaScript adds `.visible` on scroll trigger
- Purpose: Delayed reveal of project screenshots with staggered entrance animation
- Examples: `.terminal-img` elements within `.img-grid` and `.img-grid2` containers
- Pattern: `.visible` class applied via JavaScript enables transition: opacity 0→1, transform translateX(100px)→0
- Purpose: Visual feedback showing when content is in focus
- Examples: `#overlay` div positioned fixed with opacity transition
- Pattern: Opacity controlled by JavaScript based on terminal visibility
## Entry Points
- Location: `index.html`
- Triggers: Browser requests /
- Responsibilities: Structure content, define semantic hierarchy, link resources, provide skip-link for accessibility
- Location: `scriptGL.js` (executed with `defer` attribute)
- Triggers: DOM content fully loaded
- Responsibilities: Initialize WebGL, attach event listeners, start animation loop
- Location: `index.html` line 307 - `<form name="contact" netlify>`
- Triggers: User submits contact form
- Responsibilities: Submit form data to Netlify backend for processing
## Error Handling
- WebGL fallback: If Three.js fails to load, canvas remains empty but page remains functional
- Visibility change handling (line 114): Animation pauses when tab hidden, resumes on return
- Window resize handler (line 123): Canvas resizes without breaking animation loop or uniforms
## Cross-Cutting Concerns
- Skip link (`.skip-link`) allows keyboard users to jump to main content
- Screen reader only text (`.sr-only`) for h1 title
- ARIA labels on buttons and interactive elements (aria-label, aria-expanded, aria-controls)
- Keyboard navigation: Tab, Enter, Space, Escape work on nav and dropdown
- Semantic HTML: `<nav>`, `<main>`, `<footer>`, `<form>`, role="menu"
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
