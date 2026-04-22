'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/',       label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/donate', label: 'Donate' },
  { href: '/admin',  label: 'Live Updates' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-chabad-dark/95 backdrop-blur border-b border-chabad-gold/20">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="text-2xl text-chabad-gold">✡</span>
          <div>
            <div className="text-sm font-bold text-chabad-cream tracking-widest uppercase leading-none">
              Chabad
            </div>
            <div className="text-xs text-chabad-ltgold tracking-wider">Sonoma Valley</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="text-sm text-chabad-cream/80 hover:text-chabad-ltgold transition tracking-wide">
              {l.label}
            </Link>
          ))}
          <Link href="/donate"
            className="ml-2 px-5 py-2 bg-chabad-amber text-chabad-dark text-sm font-bold rounded hover:bg-chabad-gold transition">
            Donate Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-chabad-cream" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-chabad-brown border-t border-chabad-gold/20 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-chabad-cream/80 hover:text-chabad-ltgold transition">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
