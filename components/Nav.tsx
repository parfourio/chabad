'use client'
import Link from 'next/link'
import { useState } from 'react'

const links = [
  { href: '/',       label: 'Home' },
  { href: '/events', label: 'Events' },
  { href: '/about',  label: 'About' },
  { href: '/admin',  label: 'Live Updates' },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-chabad-brown/10 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-2xl text-chabad-amber">✡</span>
          <div>
            <div className="text-sm font-bold text-chabad-brown tracking-widest uppercase leading-none">
              Chabad
            </div>
            <div className="text-xs text-chabad-amber tracking-wider">Sonoma Valley</div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="text-sm text-chabad-text-mid hover:text-chabad-brown transition tracking-wide font-medium">
              {l.label}
            </Link>
          ))}
          <Link href="/donate"
            className="ml-2 px-5 py-2 bg-chabad-brown text-white text-sm font-bold rounded hover:bg-chabad-dark transition">
            Donate Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-chabad-brown text-xl" onClick={() => setOpen(!open)}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-chabad-brown/10 px-6 py-4 flex flex-col gap-4">
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="text-chabad-text-mid hover:text-chabad-brown transition font-medium">
              {l.label}
            </Link>
          ))}
          <Link href="/donate" onClick={() => setOpen(false)}
            className="text-chabad-brown font-bold">
            Donate Now
          </Link>
        </div>
      )}
    </nav>
  )
}
