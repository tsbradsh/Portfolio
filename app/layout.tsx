import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import Nav from './components/Nav'
import { JsonLd } from './components/JsonLd'

const cascadiaCode = localFont({
  src: [
    {
      path: '../public/fonts/CascadiaCode.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/CascadiaCode-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://tylerbradshaw.dev'),
  title: 'Tyler Bradshaw — Developer Portfolio',
  description: 'Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://tylerbradshaw.dev',
    title: 'Tyler Bradshaw — Developer Portfolio',
    description: 'Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tyler Bradshaw — Full-Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tyler Bradshaw — Developer Portfolio',
    description: 'Full-Stack Developer portfolio — Tyler Bradshaw. WebGL, React, Next.js, TypeScript.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cascadiaCode.variable}>
      <body>
        <JsonLd />
        {/* Hidden form for Netlify Forms detection — required for JS-framework AJAX submissions */}
        <form name="contact" data-netlify="true" netlify-honeypot="bot-field" hidden aria-hidden="true">
          <input type="text" name="name" />
          <input type="email" name="email" />
          <textarea name="message" />
          <input type="text" name="bot-field" />
        </form>
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <Nav />
        {children}
      </body>
    </html>
  )
}
