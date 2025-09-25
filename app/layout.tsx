import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'NextOpenImpact 4.0',
  description: 'A modern Next.js application for creating positive impact',
  keywords: 'Next.js, React, Impact, Open Source, Community',
  authors: [{ name: 'NextOpenImpact Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}