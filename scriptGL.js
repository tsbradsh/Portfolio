/* Mandelbrot Fractal Shader */
const scene = new THREE.Scene(); 
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
  uniforms: {
    uZoom: { value: 1.0 },
    uPan: { value: new THREE.Vector2(-0.743, 0.11) },
    uHueOffset: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  },
  fragmentShader: `
  precision highp float;
  precision highp int;

uniform vec2 uResolution;
uniform vec2 uPan;
uniform float uZoom;
uniform float uHueOffset;

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

void main() {
  vec2 uv = (gl_FragCoord.xy / uResolution.xy - 0.5) * 2.0;
  uv.x *= uResolution.x / uResolution.y;

  vec2 c = uv / uZoom + uPan;

  int iter = mandelbrot(c);
  float t = float(iter) / 400.0;
  vec3 color = hsv2rgb(vec3(mod(t + uHueOffset, 1.0), 1.0, t < 1.0 ? 1.0 : 0.0));

  gl_FragColor = vec4(color, 1.0);
}`
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh)

let zoom = 1.0;
let targetZoom = 1.0;
let hueOffset = 0.0;
let targetHueOffset = 0.0;
const terminals = document.querySelectorAll('.win-terminal');
const lines = document.querySelectorAll('.terminal-line.clickable');
const images = document.querySelectorAll('.terminal-img');
const overlay = document.getElementById('overlay');

/* Zoom/Hue Offset, Overlay & Terminal Reveal */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  targetZoom = Math.exp(scrollY / 1300);
  targetHueOffset = (scrollY / 15000) % 1;

  const windowBottom = scrollY + window.innerHeight;
  let anyTerminalVisible = false;

  terminals.forEach((terminal) => {
    const terminalTop = terminal.offsetTop;
    const terminalBottom = terminalTop + terminal.offsetHeight;
    const isVisible = windowBottom > terminalTop && scrollY < terminalBottom;
    
    terminal.classList.toggle('visible', isVisible);

    if (isVisible) {
      anyTerminalVisible = true;
    }
  })
  overlay.style.opacity = anyTerminalVisible ? '1' : '0'
});

function animate() {
  requestAnimationFrame(animate);
  zoom += (targetZoom - zoom) * 0.05;
  hueOffset += (targetHueOffset - hueOffset) * 0.01;

  material.uniforms.uZoom.value = zoom;
  material.uniforms.uHueOffset.value = hueOffset;

  renderer.render(scene, camera);
}
animate();

/* Canvas Resizer */
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
});

/* Typewriter animation */
function typeText(element, text, speed = 5) {
  element.textContent = '';
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text[i];
    i++;
    if (i === text.length) clearInterval(interval);
  }, speed);
}


/* Image Reveal */

lines.forEach((line, index) => {
  const value = line.dataset.value;
  const reveal = line.nextElementSibling;
  const image = images[index];

  line.addEventListener('click', () => {
    if (reveal.style.display === 'block') {
      reveal.style.display = 'none';
      reveal.textContent = '';
      if (image) image.classList.remove('visible');
    } else {
      reveal.style.display = 'block';
      typeText(reveal, `> ${value}`);
      if (image) {
        image.classList.add('visible');
      }
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const projectDropdown = document.querySelector('.dropdown');
  const caretIcon = document.getElementById('projects-toggle');

  caretIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    projectDropdown.classList.toggle('open');
  });

  window.addEventListener('click', (e) => {
    if (!projectDropdown.contains(e.target)) {
      projectDropdown.classList.remove('open');
    }
  });
});
