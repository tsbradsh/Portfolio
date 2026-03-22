# Technology Stack

**Analysis Date:** 2026-03-21

## Languages

**Primary:**
- HTML5 - Semantic markup for portfolio structure
- CSS3 - Layout, animations, and responsive design
- JavaScript (ES6+) - DOM manipulation and interactive features

**Secondary:**
- GLSL - Fragment shaders for WebGL Mandelbrot fractal rendering

## Runtime

**Environment:**
- Browser-based (client-side only)
- No server-side runtime or backend requirements

**Package Manager:**
- None - No npm/package.json detected
- All dependencies loaded via CDN

## Frameworks & Libraries

**Core Graphics:**
- Three.js 0.158.0 - 3D graphics library for WebGL rendering
  - Loaded via: `https://unpkg.com/three@0.158.0/build/three.min.js`
  - Used for Mandelbrot fractal visualization

**Static Site:**
- No framework - Pure HTML/CSS/JavaScript
- Statically hosted portfolio site

## Key Dependencies

**Critical:**
- Three.js 0.158.0 (via CDN) - WebGL rendering engine for animated fractal background
  - Required for `scriptGL.js` shader rendering
  - No fallback if CDN unavailable

## Configuration

**Environment:**
- No environment variables or .env configuration
- No build step required
- Direct file serving

**Deployment:**
- Static file hosting only
- No build process or compilation
- Can be deployed to any static host (Netlify, Vercel, GitHub Pages, etc.)

## Platform Requirements

**Development:**
- No build tools required
- Text editor sufficient for development
- Any modern browser for testing (Chrome, Firefox, Safari, Edge)
- WebGL support required in browser

**Production:**
- Static hosting (Netlify, Vercel, GitHub Pages, etc.)
- HTTPS recommended for security
- WebGL-capable browsers required for Mandelbrot animation
- Fallback experience not implemented for non-WebGL browsers

## File Structure

**Entry Point:**
- `index.html` - Main portfolio page

**Script Files:**
- `scriptGL.js` - JavaScript logic for DOM interactions and Three.js WebGL setup
- `shader.glsl` - Fragment shader for Mandelbrot fractal (embedded in `scriptGL.js`)

**Styles:**
- `styles.css` - All styling, animations, responsive design

**Assets:**
- `assets/1x/` - Logo, wordmark, self-portrait
- `assets/wys/` - "When You Sleep" project screenshots
- `assets/AI/` - AI Music Tool project diagrams
- `assets/RCSS/` - Red Clover Sugar Studio project screenshots

## External Resources

**CDN Dependencies:**
- Three.js 0.158.0 from unpkg.com
- Google Fonts (via CSS, if any) - Not detected in analysis

**Image Optimization:**
- No image optimization/compression pipeline
- Local asset directory with multiple resolutions (1x noted in path)

## Accessibility & Performance Features

**Fonts:**
- Cascadia Code (monospace) - Primary font stack
- Segoe UI Mono, Consolas as fallbacks
- System sans-serif for some headings

**Performance Considerations:**
- WebGL animation runs on canvas element positioned fixed/behind content
- No lazy loading detected for images
- requestAnimationFrame used for smooth animation
- Animation pauses when tab is hidden (visibilitychange listener)

---

*Stack analysis: 2026-03-21*
