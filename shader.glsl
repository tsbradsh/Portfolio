precision highp float;

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
  vec3 rgb = clamp(abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0,0.0,1.0);
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
}