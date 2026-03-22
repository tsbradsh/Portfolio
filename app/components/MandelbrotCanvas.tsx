'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import styles from './MandelbrotCanvas.module.css'

const FRAGMENT_SHADER = `
  precision highp float;
  precision highp int;

uniform vec2 uResolution;
uniform vec2 uPan;
uniform float uZoom;
uniform float uHueOffset;
uniform float uBreath;

int mandelbrot(vec2 c) {
  vec2 z = c;
  int maxIter = 160;
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
  float t = float(iter) / 160.0;
  vec3 color = hsv2rgb(vec3(mod(t + uHueOffset + uBreath, 1.0), 1.0, t < 1.0 ? 1.0 : 0.0));

  gl_FragColor = vec4(color, 1.0);
}`

export default function MandelbrotCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [webglAvailable, setWebglAvailable] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true })
    } catch {
      setWebglAvailable(false)
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const uniforms = {
      uZoom: { value: 1.0 },
      uPan: { value: new THREE.Vector2(-0.7435, 0.1312) },
      uHueOffset: { value: 0.0 },
      uBreath: { value: 0.0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }
    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({ uniforms, fragmentShader: FRAGMENT_SHADER })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    let zoom = 1.0
    let targetZoom = 1.0
    let hueOffset = 0.0
    let targetHueOffset = 0.0
    let breath = 0.0
    let animFrameId: number

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const onScroll = () => {
      const scrollY = window.scrollY
      targetZoom = Math.exp(scrollY / 1300)
      targetHueOffset = (scrollY / 15000) % 1
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    function animate() {
      animFrameId = requestAnimationFrame(animate)
      zoom += (targetZoom - zoom) * 0.05
      hueOffset += (targetHueOffset - hueOffset) * 0.01
      breath += 0.008
      uniforms.uZoom.value = zoom
      uniforms.uHueOffset.value = hueOffset
      uniforms.uBreath.value = Math.sin(breath) * 0.07
      renderer.render(scene, camera)
    }

    if (!prefersReducedMotion) {
      animate()
    } else {
      renderer.render(scene, camera)
    }

    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animFrameId)
      } else if (!prefersReducedMotion) {
        animate()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange)

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (!entry.isIntersecting) {
          cancelAnimationFrame(animFrameId)
        } else if (!prefersReducedMotion && !document.hidden) {
          animate()
        }
      },
      { threshold: 0 }
    )
    observer.observe(canvasRef.current)

    return () => {
      cancelAnimationFrame(animFrameId)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      observer.disconnect()
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  if (!webglAvailable) {
    return <div className={styles.fallback} aria-hidden="true" />
  }

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
