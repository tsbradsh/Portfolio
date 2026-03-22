import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tyler Bradshaw — Developer Portfolio',
  description: 'Developer portfolio for Tyler Bradshaw',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
