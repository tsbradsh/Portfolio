# Testing Patterns

**Analysis Date:** 2026-03-21

## Test Framework

**Current Status:** No testing framework detected

**Test Files:** None found (no `.test.js`, `.spec.js`, `*.test.ts`, `*.spec.ts` files)

**Test Configuration:**
- No `jest.config.js`, `vitest.config.js`, `karma.conf.js`, or other test runner config
- No test dependencies in package.json (no package.json found)
- No test scripts in npm scripts

**Assertion Library:** N/A - No testing infrastructure present

**Run Commands:** Not applicable (testing not implemented)

## Testing Approach

This is a **frontend portfolio site with no automated testing**. The project is a single-page application with:
- Vanilla JavaScript
- No test infrastructure
- No test utilities or mocks

## Code Characteristics for Testing

### Testable Functions

The codebase contains several pure and side-effect functions that could be tested:

**Shader Calculation Functions (GLSL):**
```glsl
int mandelbrot(vec2 c) {
  vec2 z = c;
  int maxIter = 400;
  int i;

  for (i = 0; i < maxIter; i++) {
    if (dot(z, z) > 4.0) break;
    z = vec2(
      z.x*z.x - z.y*z.y + c.x,
      2.0*z.x*z.y + c.y
    );
  }
  return i;
}

vec3 hsv2rgb(vec3 c) {
  vec3 rgb = clamp(abs(mod(c.x*12.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0,0.0,1.0);
  return c.z * mix(vec3(1.0), rgb, c.y);
}
```

These functions compute the Mandelbrot set and HSV-to-RGB color conversion - both could benefit from unit tests if extracted to JavaScript.

**DOM Manipulation Functions (from `scriptGL.js`):**
```javascript
function openDropdown() {
  projectDropdown.classList.add('open');
  caretIcon.setAttribute('aria-expanded', 'true');
}

function closeDropdown() {
  projectDropdown.classList.remove('open');
  caretIcon.setAttribute('aria-expanded', 'false');
}

function toggleDropdown() {
  if (projectDropdown.classList.contains('open')) {
    closeDropdown();
  } else {
    openDropdown();
  }
}
```

These functions directly manipulate DOM state and ARIA attributes. Currently not isolated or testable.

## Code Structure Barriers to Testing

**Current Implementation Issues:**

1. **Tightly Coupled DOM:** Functions depend on global DOM references queried at module load
   - `const navToggle = document.querySelector('.nav-toggle');`
   - Makes unit testing impossible without mocking entire DOM

2. **Global Scope Pollution:** All variables and functions in global scope
   - No module boundaries
   - Side effects spread throughout code
   - Hard to test individual pieces

3. **Inline Event Listeners:** Business logic embedded in event handlers
   - Functions defined inline with closures over DOM elements
   - Cannot be imported and tested in isolation

4. **Three.js Tightly Integrated:** WebGL rendering mixed with scroll logic
   - Animation loop drives UI updates
   - Scene state entangled with page state

5. **No Dependency Injection:** All dependencies accessed globally
   - DOM elements queried directly in code
   - Cannot inject test doubles

## Where Testing Would Help

**High Value Testing Targets:**

1. **Dropdown Logic** (`scriptGL.js`, lines 148-191)
   - Complex state machine (open/closed)
   - Keyboard event handling (Enter, Space, Escape)
   - Click-outside detection
   - Could be extracted and tested independently

2. **Scroll-Based Animation Logic** (`scriptGL.js`, lines 73-97)
   - Visibility detection algorithm
   - Zoom calculation: `Math.exp(scrollY / 1300)`
   - Hue offset calculation: `(scrollY / 15000) % 1`
   - Could be unit tested with scroll values as inputs

3. **Navigation Toggle** (`scriptGL.js`, lines 128-146)
   - Button state management
   - ARIA attribute updates
   - Mobile drawer behavior
   - Could test state transitions

4. **Window Resize Handling** (`scriptGL.js`, lines 122-126)
   - Canvas resize calculations
   - Uniform updates to shader
   - Could verify canvas dimensions match window

## Recommended Testing Strategy

### Phase 1: Extract and Test Core Logic

**Extract pure functions from shader calculations:**
```javascript
// JavaScript version of mandelbrot calculation
function mandelbrotIterations(realPart, imagPart, maxIterations = 400) {
  let zReal = 0;
  let zImag = 0;

  for (let i = 0; i < maxIterations; i++) {
    if (zReal * zReal + zImag * zImag > 4.0) return i;
    const nextReal = zReal * zReal - zImag * zImag + realPart;
    const nextImag = 2 * zReal * zImag + imagPart;
    zReal = nextReal;
    zImag = nextImag;
  }
  return maxIterations;
}

// Test this function:
// mandelbrotIterations(0.0, 0.0) should return 400 (in set)
// mandelbrotIterations(2.0, 0.0) should return 0 (outside set)
```

### Phase 2: Create Test Infrastructure

**Add Vitest (lightweight, no config needed for this project):**
```bash
npm install --save-dev vitest
```

**Create test files alongside source:**
- `scriptGL.test.js` - Tests for animation and scroll logic
- `utils.test.js` - Tests for extracted utility functions

### Phase 3: Test DOM Interactions

**Use jsdom or happy-dom for DOM testing:**
```bash
npm install --save-dev vitest jsdom
```

**Test dropdown state machine:**
```javascript
// Example test structure
describe('Dropdown', () => {
  let dropdown;
  let caret;

  beforeEach(() => {
    // Setup DOM
    dropdown = createDropdownElement();
    caret = dropdown.querySelector('.caret-icon');
  });

  test('should toggle open class on click', () => {
    toggleDropdown();
    expect(dropdown.classList.contains('open')).toBe(true);
    expect(caret.getAttribute('aria-expanded')).toBe('true');
  });

  test('should close on escape key', () => {
    openDropdown();
    triggerKeydown('Escape');
    expect(dropdown.classList.contains('open')).toBe(false);
  });
});
```

### Phase 4: E2E Testing (Optional)

**Use Playwright or Cypress for full-page testing:**
- Verify scroll-triggered animations work
- Test responsive layout at different breakpoints
- Validate form submission
- Test keyboard navigation accessibility

## Testing Gaps

**Critical Areas Not Currently Tested:**

1. **Accessibility Features**
   - ARIA attributes not verified
   - Keyboard navigation not validated
   - Focus management not tested
   - Screen reader compatibility untested

2. **Responsive Behavior**
   - Mobile hamburger menu transitions
   - Tablet layout changes
   - Image grid responsive behavior
   - Form layout at different sizes

3. **Animation Correctness**
   - Smooth zoom transitions
   - Hue offset calculations
   - Terminal reveal timing
   - Canvas resize responsiveness

4. **Browser Compatibility**
   - Three.js WebGL support
   - CSS animations in older browsers
   - Form validation across browsers
   - LocalStorage/SessionStorage features

5. **Performance**
   - Animation frame rate
   - Scroll event throttling
   - Memory leaks on repeated animations
   - Canvas rendering performance

## Potential Testing Tools

**Recommended for this project:**

| Tool | Purpose | Fit |
|------|---------|-----|
| **Vitest** | Unit testing | High - Fast, zero-config for simple JS |
| **jsdom** | DOM simulation | High - Test DOM without browser |
| **Playwright** | E2E testing | Medium - Full browser testing for animations |
| **Lighthouse** | Performance/Accessibility | High - Audit PWA metrics |
| **axe DevTools** | Accessibility testing | High - WCAG compliance checking |

## Current Development Workflow

**Manual Testing:**
- Open browser and manually test functionality
- Scroll testing done by hand
- Keyboard navigation verified manually
- Responsive testing via browser DevTools

**TODO Items Related to Testing:**
- Multiple GitHub/LinkedIn URL placeholders (lines 42, 44, 45, 304, 305 in `index.html`)
- Resume PDF link not implemented
- Project live URLs not linked
- These suggest incomplete testing/verification before deployment

---

*Testing analysis: 2026-03-21*
