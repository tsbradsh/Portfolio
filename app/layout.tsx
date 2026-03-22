import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

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
  title: 'Tyler Bradshaw — Developer Portfolio',
  description: 'Developer portfolio for Tyler Bradshaw',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cascadiaCode.variable}>
      <body>{children}</body>
    </html>
  )
}
