import type { Metadata } from 'next'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Chabad Sonoma Valley',
  description: 'A warm, welcoming Jewish community in the heart of Sonoma wine country.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-chabad-dark">
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
