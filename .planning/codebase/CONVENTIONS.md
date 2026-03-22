# Coding Conventions

**Analysis Date:** 2026-03-21

## Naming Patterns

**Files:**
- JavaScript: camelCase with descriptive names (`scriptGL.js`)
- CSS: kebab-case with semantic naming (`styles.css`)
- HTML: semantic naming reflecting content structure (`index.html`)

**Functions:**
- camelCase for regular functions (`openDropdown()`, `closeDropdown()`, `animate()`)
- Descriptive verb-first naming pattern (`toggleDropdown()`, `preventDefault()`)
- Utility functions use lowercase: `mandelbrot()`, `hsv2rgb()`

**Variables:**
- camelCase for all variables (`targetZoom`, `animFrameId`, `navToggle`, `navLinks`)
- Prefixed targeting with specific meaning: `target*` for animation targets (`targetZoom`, `targetHueOffset`)
- DOM element references use semantic names tied to functionality (`navToggle`, `projectDropdown`, `caretIcon`)

**Classes/IDs:**
- kebab-case for HTML classes (`.win-terminal`, `.nav-toggle`, `.dropdown-content`)
- camelCase for CSS variable names in JavaScript access
- ID attributes use semantic naming (`#logo`, `#links`, `#overlay`, `#main-content`)

**CSS Custom Classes:**
- Utility classes use semantic names: `.sr-only` (screen reader only), `.skip-link`
- Component classes use kebab-case: `.win-terminal`, `.win-terminal-header`, `.terminal-content`
- State classes use specific keywords: `.visible`, `.open` for active states

## Code Style

**Formatting:**
- No automatic formatter detected (no `.prettierrc`, `biome.json`, or Prettier config)
- Manual formatting observed with consistent spacing
- 2-space indentation implied in CSS and HTML
- Line lengths vary but generally reasonable for readability

**Linting:**
- No linting configuration detected (no `.eslintrc`, ESLint config, or similar)
- Code follows general JavaScript conventions without strict enforcement
- CSS lacks formal linting rules but maintains visual consistency

**Spacing & Indentation:**
- Consistent spacing around operators in JavaScript
- HTML attributes properly spaced
- CSS properties indented consistently within rule blocks

## Import Organization

**External Libraries:**
- Three.js imported via CDN: `<script src="https://unpkg.com/three@0.158.0/build/three.min.js"></script>`
- No module system used (vanilla JavaScript with global scope)
- Script loading deferred: `<script src="scriptGL.js" defer></script>`

**Internal Organization:**
- All JavaScript functionality in single file `scriptGL.js`
- CSS organized in single stylesheet `styles.css`
- No path aliases or module imports needed (monolithic design)

## Error Handling

**Patterns:**
- Minimal explicit error handling observed
- Relies on browser defaults for error recovery
- No try-catch blocks in codebase
- Graceful degradation through feature detection (visibility API, resize events)

**Error Prevention:**
- DOM queries checked implicitly before use (`document.querySelectorAll()`)
- Event listeners attached only after DOMContentLoaded
- Animation frame cancellation on visibility change prevents errors when tab hidden

## Logging

**Framework:** console (implicit)

**Patterns:**
- No explicit logging statements found in code
- No console.log or debugging output in production code
- Relies on browser DevTools for debugging

## Comments

**When to Comment:**
- Comments used sparingly but strategically
- Inline comments mark significant sections: `/* Mandelbrot Fractal Shader */`, `/* Terminal Reveal on Scroll */`, `/* Pause animation when tab is not visible */`
- Comments explain "why" more than "what": "// Ensure child images also become visible"

**JSDoc/TSDoc:**
- No JSDoc comments found
- No TypeScript used; vanilla JavaScript throughout
- Function purpose implicit in naming

## Function Design

**Size:** Functions generally small (5-20 lines)

**Examples from codebase:**
- `openDropdown()` - 2 lines
- `closeDropdown()` - 2 lines
- `toggleDropdown()` - 4 lines
- `animate()` - 8 lines

**Parameters:**
- Minimal parameters passed; most functions use closure scope
- DOM elements passed via closures after initial query
- Event objects used directly in listeners

**Return Values:**
- Most functions return undefined or void
- No explicit return statements in event handlers
- Animation function (`animate()`) calls recursively via `requestAnimationFrame()`

## Module Design

**Exports:**
- No exports or module pattern used
- All code in global scope
- Functions and variables accessible throughout page lifetime

**Initialization Pattern:**
- DOM initialization wrapped in `DOMContentLoaded` event listener
- Three.js scene and renderer initialized immediately at script load
- Event listeners attached after DOM ready

**Separation of Concerns:**
- Three.js WebGL handling: lines 1-126 (`scriptGL.js`)
- DOM interactions and scroll logic: lines 128-201 (`scriptGL.js`)
- Navigation and dropdown logic: lines 128-201 (`scriptGL.js`)
- Clear visual sections marked with comments

## DOM Manipulation

**Selector Patterns:**
- `document.querySelector()` for single elements
- `document.querySelectorAll()` for collections
- `document.getElementById()` for ID-based access
- `element.classList` for state management (`.add()`, `.remove()`, `.toggle()`)

**Attribute Management:**
- ARIA attributes managed via `setAttribute()`: `aria-expanded`, `aria-label`, `aria-disabled`, `aria-haspopup`
- Accessibility prioritized with proper ARIA roles and labels

## HTML Conventions

**Semantics:**
- Semantic HTML elements used: `<nav>`, `<main>`, `<footer>`, `<section>`
- Proper heading hierarchy (`<h1>`, `<h2>`, `<h3>`)
- Accessible form inputs with associated labels
- Accessibility features: skip links, screen-reader only content (`.sr-only`)

**Attributes:**
- Alt text for all images
- ARIA labels and roles for interactive elements
- `role="button"` for clickable SVGs
- `tabindex="0"` for keyboard navigation

## CSS Conventions

**Selector Specificity:**
- Primarily class-based selectors
- Minimal ID selectors in CSS (only for high-specificity overrides when needed)
- Compound selectors for related elements: `li a`, `.nav-highlight:hover`

**Property Organization:**
- No strict convention observed but generally logical grouping
- Positioning properties grouped together
- Color/visual properties grouped together
- Transition properties clustered

**Color Values:**
- Hex colors used consistently (`#00ffcc`, `#7dd3fc`, `#0a0a0a`)
- RGBA for transparency: `rgba(0, 255, 204, 0.15)`
- Color scheme: cyan/teal (`#00ffcc`) primary, light blue (`#7dd3fc`) secondary, dark (`#0a0a0a`) background

**Responsive Design:**
- Mobile-first media queries observed
- Breakpoints at 1200px, 1024px, 768px
- Specific styles for hamburger menu at 768px and below

## Class/Component Naming

**Terminal Windows:**
- `.win-terminal` - main container
- `.win-terminal-header` - title bar styling
- `.win-terminal-body` - content area
- `.win-terminal-title` - title text within header

**Layout Components:**
- `.wingrid` - two-column grid layout
- `.img-grid`, `.img-grid2` - image gallery grids
- `.container` - outer spacing container
- `.skills-grid` - responsive skill categories

**Interactive Elements:**
- `.nav-toggle` - hamburger menu button
- `.dropdown` - dropdown container
- `.dropdown-content` - submenu content
- `.caret-icon` - toggle indicator

**State Classes:**
- `.visible` - opacity and transform reveal
- `.open` - display and expanded state
- Managed via `classList.add/remove/toggle()`

## Best Practices Observed

1. **Accessibility First:** ARIA attributes, semantic HTML, keyboard navigation support
2. **Mobile Responsive:** Media queries and flexible layouts
3. **Performance:** AnimationFrame for smooth animations, visibility detection for optimization
4. **Semantic Naming:** Classes and IDs describe purpose, not appearance
5. **Progressive Enhancement:** Works without JavaScript (basic HTML/CSS structure)
6. **Separation of Concerns:** Visual styling in CSS, behavior in JS, structure in HTML

---

*Convention analysis: 2026-03-21*
