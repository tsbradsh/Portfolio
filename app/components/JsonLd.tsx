export function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Tyler Bradshaw',
    jobTitle: 'Full-Stack Developer',
    url: 'https://tylerbradshaw.dev',
    sameAs: [
      'https://github.com/tsbradsh',
      'https://www.linkedin.com/in/tsbw/',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(personSchema).replace(/</g, '\\u003c'),
      }}
    />
  )
}
