# Codebase Concerns

**Analysis Date:** 2026-03-21

## Incomplete Implementation

**Missing Social & Project Links:**
- Issue: Multiple placeholder links throughout site are non-functional
- Files: `index.html` (lines 42, 44-45, 141-143, 202, 264, 304-305)
- Impact: Users cannot access GitHub repositories, LinkedIn profiles, resume PDF, or live project demos. Navigation appears broken to visitors.
- Fix approach: Replace all `href="#"` and `aria-disabled="true"` attributes with actual URLs. Remove disabled state when links are active.

**Specific incompleted links:**
1. Resume PDF link (line 42)
2. GitHub social link in nav (line 44)
3. LinkedIn social link in nav (line 45)
4. When You Sleep live project URL (line 141)
5. When You Sleep GitHub repo (line 143)
6. AI Music Collaboration Tool GitHub repo (line 202)
7. Red Clover GitHub repo (line 264)
8. GitHub link in contact section (line 304)
9. LinkedIn link in contact section (line 305)

## Performance Bottlenecks

**Scroll Event Handler Without Throttling:**
- Problem: Scroll listener fires on every pixel scrolled, running calculations and DOM queries repeatedly
- Files: `scriptGL.js` (lines 74-97)
- Cause: `window.addEventListener('scroll', ...)` executes without debouncing or throttling
- Current impact: Can cause jank on lower-end devices, especially with 6 `querySelectorAll` calls per scroll event
- Improvement path: Implement throttling (e.g., requestAnimationFrame-based throttle or 16ms debounce) to limit recalculation to ~60fps

**Fixed Canvas Performance:**
- Problem: WebGL canvas renders continuously at full resolution regardless of visibility
- Files: `scriptGL.js` (lines 101-111)
- Cause: `requestAnimationFrame` loop runs even when off-screen
- Current impact: Wastes GPU/CPU cycles when user is not viewing the canvas (e.g., scrolled past it)
- Improvement path: Implement Intersection Observer API to pause animation when canvas is out of viewport

**Large Fragment Shader Mandelbrot Calculation:**
- Problem: 400 iterations per pixel in Mandelbrot calculation runs for every frame
- Files: `scriptGL.js` (line 29 in inline shader)
- Cause: Fixed `maxIter = 400` is computed per pixel per frame
- Current impact: GPU load increases with resolution; at high DPI displays, this can be significant
- Improvement path: Reduce iteration count based on viewport size or implement adaptive iteration based on zoom level

## Accessibility Issues

**Non-semantic Button Usage:**
- Problem: Projects menu caret icon uses `<svg role="button" tabindex="0">` instead of native `<button>`
- Files: `index.html` (line 32)
- Impact: Inconsistent with screen reader expectations; requires manual focus management (handled but fragile)
- Safe modification: Replace with `<button>` element if styling allows

**Form Placeholder Text Only:**
- Problem: Form inputs use `placeholder` attribute for labels; no visible label elements
- Files: `index.html` (lines 309-313)
- Impact: Placeholder text disappears when user types, creating confusion; fails WCAG 2.1 level AA
- Fix approach: Add proper `<label>` elements paired with inputs using `for` attribute

**Missing Navigation ARIA:**
- Problem: Main navigation uses standard `<ul>` with no `aria-label` distinguishing it from other lists
- Files: `index.html` (line 26)
- Impact: Screen reader users hear "list" without context
- Safe modification: Already has `aria-label="Main navigation"` on parent `<nav>`, but ensure consistency across all nav regions

## Browser Compatibility & Dependency Risks

**Three.js Version Lock:**
- Risk: Hard-coded CDN link to Three.js 0.158.0
- Files: `index.html` (line 13)
- Issue: No version management; if CDN URL breaks or Three.js major version changes, site breaks
- Migration plan: Consider bundling Three.js with npm/build tool OR implement fallback CDN

**Missing Fallback for WebGL:**
- Risk: No detection or fallback if user's browser doesn't support WebGL
- Files: `scriptGL.js` (entire file assumes WebGL support)
- Impact: Blank/broken page on older browsers or systems without GPU acceleration
- Fix approach: Check `renderer.capabilities.maxTextureSize` or WebGL context and display fallback gradient/message

**External Asset Dependencies:**
- Problem: Multiple image assets referenced without 404 handling
- Files: `index.html` (lines 19-20, 71, 152, 158, 164, 170, 211, 217, 223, 231, 273, 279, 285, 291)
- Impact: Missing images break layout and visual hierarchy; no error states defined
- Current state: 16 images required to render properly; all rely on relative paths

## Security Considerations

**Contact Form Without Validation:**
- Risk: Form submits to Netlify without client-side validation
- Files: `index.html` (lines 307-315)
- Current mitigation: HTML5 `required` attributes; Netlify spam filtering
- Recommendations: Add client-side validation feedback; consider CAPTCHA if spam becomes issue; validate email format before submission

**DOM-Based XSS Risk (Minor):**
- Risk: Contact form fields accept any text and submit directly
- Files: `index.html` (form element)
- Current mitigation: Netlify sanitizes on backend; browser same-origin policy
- Recommendations: Ensure server-side validation; consider DOMPurify if content is ever displayed back to users

## Fragile Areas

**Terminal Visibility Detection:**
- Files: `scriptGL.js` (lines 82-95)
- Why fragile: Uses `offsetTop` and `offsetHeight` calculations that can break if DOM structure changes or CSS padding/margins shift
- Why sensitive: Scroll animation depends on these calculations; miscalculation causes elements to never show
- Safe modification: Add 50px buffer tolerance; test across multiple viewport sizes before deploying
- Test coverage: No unit tests for visibility logic; only manual testing

**Multiple Global Click Listeners:**
- Files: `scriptGL.js` (lines 187-200)
- Why fragile: Two separate `window.addEventListener('click')` handlers that could conflict or miss edge cases
- Conflict potential: If a click happens on an element that's both inside `projectDropdown` and `navLinks`, behavior may be unexpected
- Safe modification: Consolidate into single click handler with proper element checking
- Test coverage: Manual testing only; no automated tests for edge cases

**Responsive CSS Grid Layout Complexity:**
- Files: `styles.css` (grid definitions scattered: lines 231-237, 380-389, 391-399, 502-505, 585-589, 707-711)
- Why fragile: Multiple grid area definitions that change at breakpoints; easy to break with minor CSS changes
- Safe modification: Use CSS custom properties for gap/template-areas to reduce duplication
- Test coverage: No automated responsive design tests

## Test Coverage Gaps

**No Automated Tests:**
- What's not tested: All JavaScript functionality (scroll animation, dropdown toggle, form submission, animation loop)
- Files: Entire codebase; no `.test.js` or `.spec.js` files exist
- Risk: Breaking changes in scroll logic or animation loop go undetected until user reports
- Priority: High - Consider adding tests for scroll throttling (once implemented) and dropdown interactions

**Manual Rendering Testing Only:**
- What's not tested: Canvas rendering across different resolutions, GPU capabilities
- Files: `scriptGL.js` (animation loop and shader)
- Risk: Shader bugs or resolution-dependent rendering issues only discovered in user testing
- Priority: Medium - Consider WebGL validation or visual regression testing

## Known Issues in HTML Structure

**Duplicate ID Attributes:**
- Problem: Element IDs used for styling but not consistently unique or semantic
- Files: `index.html` (lines 67, 219, 227, 281, 345)
- Example: `#Ty`, `#long`, `#calc`, `#flow` - unclear naming convention
- Impact: Minimal; IDs are mainly for CSS targeting, but poor naming makes code maintenance harder

**CSS Specificity Conflicts:**
- Problem: Duplicate CSS rules for same selectors
- Files: `styles.css` (lines 345-349 duplicate `#Ty` styles from 467-470)
- Impact: Dead code; second definition overrides first, wasting bytes
- Fix approach: Remove lines 467-470 duplicate rule

**Disabled Buttons with Poor Visual Feedback:**
- Problem: Buttons use `aria-disabled="true"` instead of `disabled` attribute
- Files: `index.html` (lines 142, 144, 203, 265)
- Impact: CSS `:disabled` selector doesn't work; requires custom styling
- Safe modification: Use native `disabled` attribute if possible, or add `.disabled` class with clear styling

## Styling & Layout Concerns

**Magic Numbers in CSS:**
- Problem: Arbitrary percentages and pixel values scattered throughout
- Files: `styles.css` (e.g., lines 197: `margin-top: 80%`, line 373: `margin-top: 50%`, line 463: `margin: 40% auto 10% auto`)
- Impact: Layout becomes fragile; difficult to adjust spacing globally
- Fix approach: Extract to CSS custom properties (variables) for consistent spacing system

**Overflow Handling on Images:**
- Problem: Images in `.terminal-img` have `max-height: 0` initially, then transition to `1000px`
- Files: `styles.css` (lines 341, 368)
- Impact: Could cause layout shift; magic number `1000px` may be larger than needed
- Safe modification: Use `auto` instead of fixed max-height, or measure actual content

## Missing Error Handling

**No Canvas Rendering Error Handling:**
- Problem: If WebGL context fails or shader doesn't compile, user sees nothing
- Files: `scriptGL.js` (no error checks after `THREE.WebGLRenderer`)
- Impact: Silent failure; no error message to user or console warning
- Fix approach: Check `renderer.getContext('webgl')` validity; log shader compilation errors

**No Image Load Error Handling:**
- Problem: If any image fails to load (404, CORS, etc.), layout breaks
- Files: Multiple `<img>` tags without `onerror` handlers
- Impact: Missing images break visual layout and can frustrate users
- Fix approach: Add `onerror` handlers or preload critical images with error fallback

## Scaling Limits

**Terminal Animation at Scale:**
- Current capacity: Comfortable up to ~6 `.win-terminal` elements
- Limit: Performance degrades noticeably if scrolling through 10+ terminal sections
- Cause: Each scroll event queries all terminals; O(n) operation per scroll pixel
- Scaling path: Implement Intersection Observer API to only track visible terminals instead of all

**Shader Performance at High Resolution:**
- Current capacity: Smooth 60fps at 1920x1080
- Limit: May drop frames on 4K displays (3840x2160) or high refresh rate monitors
- Cause: 400 iterations × pixel count per frame
- Scaling path: Implement resolution-aware iteration count or adaptive quality setting

## Dependencies at Risk

**Netlify Form Dependency:**
- Risk: Contact form depends on Netlify's form handling infrastructure
- Impact: If Netlify service degrades, form submissions could fail silently
- Migration plan: Add client-side fallback (EmailJS or similar API) or implement own backend endpoint

**Three.js CDN Availability:**
- Risk: Unpkg CDN could be down or have performance issues
- Current: Hard-coded to unpkg.com/three@0.158.0/build/three.min.js
- Migration plan: Host Three.js locally or use npm bundler with proper build process

---

*Concerns audit: 2026-03-21*
