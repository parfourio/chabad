import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-chabad-gold/20 bg-chabad-dark mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl text-chabad-gold">✡</span>
            <div>
              <div className="font-bold text-chabad-cream tracking-widest uppercase text-sm">Chabad</div>
              <div className="text-xs text-chabad-ltgold tracking-wider">Sonoma Valley</div>
            </div>
          </div>
          <p className="text-sm text-chabad-cream/60 leading-relaxed">
            A warm, welcoming Jewish community in the heart of Sonoma wine country.
          </p>
        </div>

        <div>
          <h4 className="text-chabad-ltgold font-bold text-xs tracking-widest uppercase mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2">
            {[
              ['/', 'Home'],
              ['/events', 'Events'],
              ['/donate', 'Donate'],
              ['/admin', 'Live Updates'],
            ].map(([href, label]) => (
              <Link key={href} href={href}
                className="text-sm text-chabad-cream/60 hover:text-chabad-ltgold transition">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-chabad-ltgold font-bold text-xs tracking-widest uppercase mb-4">Contact</h4>
          <div className="text-sm text-chabad-cream/60 space-y-2">
            <p>Rabbi Mendy Wenger</p>
            <p>Sonoma Valley, CA</p>
            <a href="mailto:info@svjewishcenter.com"
              className="hover:text-chabad-ltgold transition block">
              info@svjewishcenter.com
            </a>
            <a href="https://svjewishcenter.com/shabbat"
              className="hover:text-chabad-ltgold transition block">
              svjewishcenter.com/shabbat
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-chabad-gold/10 text-center py-4 text-xs text-chabad-cream/30">
        © {new Date().getFullYear()} Chabad Sonoma Valley · Built by Par4 Technologies
      </div>
    </footer>
  )
}
