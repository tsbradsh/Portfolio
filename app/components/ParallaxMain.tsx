'use client'
import { useEffect, useRef } from 'react'

export default function ParallaxMain({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    let smooth = window.scrollY
    let raf: number

    function update() {
      // Lerp smooth position toward actual scroll — creates spring lag
      smooth += (window.scrollY - smooth) * 0.08

      // Lag = how far behind smooth is from actual scroll
      // Positive lag during scroll-down → push element down → appears slower
      const lag = Math.min(window.scrollY - smooth, 180)

      if (ref.current) {
        ref.current.style.transform = `translateY(${lag}px)`
      }

      raf = requestAnimationFrame(update)
    }

    raf = requestAnimationFrame(update)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <main
      id="main-content"
      ref={ref}
      style={{ position: 'relative', willChange: 'transform' }}
    >
      {children}
    </main>
  )
}
