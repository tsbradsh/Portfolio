# Codebase Structure

**Analysis Date:** 2026-03-21

## Directory Layout

```
Portfolio/
├── index.html              # Main HTML entry point with semantic structure
├── scriptGL.js             # WebGL animation and DOM interactivity
├── styles.css              # Responsive styling and animations
├── shader.glsl             # Fragment shader code (Mandelbrot fractal)
├── README.md               # Project documentation
├── .gitattributes          # Git configuration
├── assets/                 # Static images and media
│   ├── 1x/                 # Logo, wordmark, and profile assets
│   │   ├── logocolor.png
│   │   ├── wordmark.png
│   │   ├── Ty.jpg          # Profile photo
│   │   └── logo.png
│   ├── wys/                # When You Sleep project screenshots
│   │   ├── wys.png
│   │   ├── mockup.png
│   │   ├── events.png
│   │   └── wireframe.jpg
│   ├── AI/                 # AI Music Tool project assets
│   │   ├── Wireframe.png
│   │   ├── Map.png
│   │   ├── Flow.png
│   │   └── Concept.png
│   └── RCSS/               # Red Clover Sugar Studio project assets
│       ├── Home.png
│       ├── Palette.png
│       ├── Calculator.png
│       └── Ratio.png
├── .planning/              # Planning and documentation directory
│   └── codebase/           # Codebase analysis documents (this file)
├── .claude/                # Claude settings
│   └── settings.local.json
├── .vscode/                # VS Code configuration
│   └── launch.json
└── .git/                   # Git repository metadata
```

## Directory Purposes

**Root Directory:**
- Purpose: Contain all source code and assets for the portfolio website
- Contains: HTML entry point, main script, styles, images
- Key files: `index.html` (entry), `scriptGL.js` (logic), `styles.css` (presentation)

**`assets/`:**
- Purpose: Centralize static image assets by project
- Contains: PNG, JPG, and other media files organized by project
- Key files: Logo/branding in `1x/`, project screenshots in `wys/`, `AI/`, `RCSS/`

**`assets/1x/`:**
- Purpose: Store brand identity assets (logo, wordmark, profile)
- Contains: PNG images at 1x resolution and JPG profile photo
- Used by: Navigation (logo/wordmark), info section (profile photo)

**`assets/wys/`, `assets/AI/`, `assets/RCSS/`:**
- Purpose: Store project-specific screenshots, wireframes, and design assets
- Contains: Project documentation images referenced in project sections
- Used by: Image grids in project `.win-terminal` sections

**`.planning/codebase/`:**
- Purpose: Store architecture and codebase analysis documents
- Contains: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md
- Generated: Yes - created by GSD codebase mapping tool
- Committed: Yes - tracked in git for reference by other tools

**`.vscode/`:**
- Purpose: Store VS Code editor configuration
- Contains: Launch configuration for debugging
- Generated: Yes
- Committed: Yes

## Key File Locations

**Entry Points:**
- `index.html`: Main HTML document, contains semantic page structure with nav, sections, contact form

**Configuration:**
- `styles.css`: Responsive CSS with breakpoints at 1200px, 1024px, 768px
- `.vscode/launch.json`: Debug configuration for VS Code
- `.claude/settings.local.json`: Claude AI assistant settings

**Core Logic:**
- `scriptGL.js`: 202 lines - WebGL/Three.js rendering, DOM manipulation, event handling
- `shader.glsl`: 39 lines - Fragment shader for Mandelbrot fractal (also embedded in scriptGL.js as inline string)

**Static Assets:**
- `assets/1x/logocolor.png`: Brand logo (loaded in nav, 70px height)
- `assets/1x/wordmark.png`: Text wordmark (loaded in nav, hidden <1200px)
- `assets/1x/Ty.jpg`: Profile photo (Info section)
- Project screenshots: `assets/wys/`, `assets/AI/`, `assets/RCSS/` directories

**Documentation:**
- `README.md`: Project overview
- `.planning/codebase/ARCHITECTURE.md`: Architecture analysis
- `.planning/codebase/STRUCTURE.md`: This file

## Naming Conventions

**Files:**
- HTML: Singular lowercase (`index.html`)
- JavaScript: camelCase (`scriptGL.js`)
- CSS: Singular lowercase (`styles.css`)
- Images: PascalCase for descriptive names (`Ty.jpg`, `Wireframe.png`), mixed for generics (`wys.png`, `logo.png`)
- Directories: UPPERCASE for project acronyms (`AI`, `RCSS`, `wys` project uses lowercase)

**HTML Elements & Classes:**
- Container sections: `.container`
- Terminal styled boxes: `.win-terminal`, `.win-terminal-header`, `.win-terminal-body`, `.win-terminal-title`
- Image containers: `.terminal-img`, `.img-grid`, `.img-grid2`
- Button/link styling: `.btn`, `.nav-highlight`, `.submit`
- State classes: `.open` (nav/dropdown), `.visible` (fade-in animation)
- Semantic landmarks: `<nav>`, `<main>`, `<footer>`, `<form>`, `.container`

**CSS:**
- BEM-inspired but loose: `.win-terminal` with child selectors `.win-terminal-header`, `.win-terminal-body`
- State modifiers: `.visible`, `.open` added via JavaScript
- Responsive breakpoints: `@media (max-width: 1200px)`, `(max-width: 1024px)`, `(max-width: 768px)`

**JavaScript:**
- camelCase variables: `zoom`, `targetZoom`, `animFrameId`, `navToggle`, `scrollY`
- Query selectors stored in const: `const terminals = document.querySelectorAll()`
- Event handler functions: descriptive names like `openDropdown()`, `closeDropdown()`, `toggleDropdown()`

**Colors:**
- Accent color: `#00ffcc` (cyan, used consistently throughout)
- Background: `rgba(10, 10, 10, 0.9)` or `rgba(10, 10, 10, 1)` (near-black with transparency)
- Secondary accent: `#7dd3fc` (light blue, used for titles and highlights)
- Text: `#ffffff` (white) or `#00ffcc` (cyan accent)
- Disabled/muted: `#555` (dark gray)

## Where to Add New Code

**New Feature in Navigation:**
- Add `<li>` to `#links` list in `index.html`
- Style in `styles.css` following `.nav-highlight` or `li a` patterns
- JavaScript event handling in `scriptGL.js` DOMContentLoaded block (line 128+)

**New Project Section:**
- Create new `<div class="container">` with `<div class="win-terminal" id="project-id">`
- Copy structure from existing project section (info, skills, projects)
- Add images to `assets/` subdirectory
- Reference images in `.terminal-img` containers
- No JavaScript needed - scroll visibility handled by existing loop (line 82-95)

**New Animations/Effects:**
- Canvas-based: Modify shader in `scriptGL.js` fragment shader string (line 18-58)
- DOM-based: Add keyframes in `styles.css`, apply with `.visible` or similar class via JavaScript
- Scroll-based: Modify scroll event handler (line 74-97) to adjust `targetZoom`, `targetHueOffset`, or other uniforms

**Styling Updates:**
- Global styles: `styles.css` (no scoping, all classes are global)
- Color changes: Search for `#00ffcc` or `#7dd3fc` to update accent colors
- Typography: Font family in `body` is `'Cascadia Code'` (monospace system font stack)
- Responsive tweaks: Modify `@media` queries at bottom of `styles.css` (lines 580-728)

**Utilities & Helpers:**
- Accessibility: Patterns exist for skip-link, sr-only, focus-visible, aria labels
- No separate utilities file - all CSS in `styles.css`
- No utility functions - DOM manipulation inline in `scriptGL.js` event handlers

## Special Directories

**`.git/`:**
- Purpose: Git repository metadata
- Generated: Yes (created by git init)
- Committed: No (gitignored by default)

**`.vscode/`:**
- Purpose: Editor-specific configuration
- Generated: Yes (created by user or project setup)
- Committed: Yes (provides consistent developer experience)

**`.claude/`:**
- Purpose: Claude AI assistant settings and context
- Generated: Yes (created by Claude tools)
- Committed: Yes (team/tool configuration)

**`.planning/codebase/`:**
- Purpose: Codebase analysis documents for GSD tools
- Generated: Yes (created by GSD map-codebase)
- Committed: Yes (referenced by GSD plan-phase and execute-phase)

---

*Structure analysis: 2026-03-21*
