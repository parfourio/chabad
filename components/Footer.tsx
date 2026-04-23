import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-chabad-brown/15 bg-chabad-brown mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl text-chabad-gold">✡</span>
            <div>
              <div className="font-bold text-white tracking-widest uppercase text-sm">Chabad</div>
              <div className="text-xs text-chabad-gold tracking-wider">Sonoma Valley</div>
            </div>
          </div>
          <p className="text-sm text-white/60 leading-relaxed">
            A warm, welcoming Jewish community in the heart of Sonoma wine country.
          </p>
        </div>

        <div>
          <h4 className="text-chabad-gold font-bold text-xs tracking-widest uppercase mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              ['/', 'Home'],
              ['/events', 'Events'],
              ['/about', 'About'],
              ['/donate', 'Donate'],
              ['/admin', 'Live Updates'],
            ].map(([href, label]) => (
              <Link key={href} href={href}
                className="text-sm text-white/60 hover:text-chabad-gold transition">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-chabad-gold font-bold text-xs tracking-widest uppercase mb-4">Contact</h4>
          <div className="text-sm text-white/60 space-y-2">
            <p>Rabbi Mendy Wenger</p>
            <p>858 3rd St W, Sonoma, CA 95476</p>
            <p>929-253-0820</p>
            <a href="mailto:info@svjewishcenter.com"
              className="hover:text-chabad-gold transition block">
              info@svjewishcenter.com
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 text-xs text-white/30">
        © {new Date().getFullYear()} Chabad Sonoma Valley · Built by Par4 Technologies
      </div>
    </footer>
  )
}
