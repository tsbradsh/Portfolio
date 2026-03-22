import MandelbrotCanvas from './components/MandelbrotCanvas'

export default function Home() {
  return (
    <>
      <MandelbrotCanvas />
      <main style={{ padding: 'var(--space-4)', color: 'var(--color-teal)', position: 'relative' }}>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600 }}>Tyler Bradshaw</h1>
        <p>Portfolio under construction.</p>
      </main>
    </>
  )
}
