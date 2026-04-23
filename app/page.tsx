import { getShabbatTimes } from '@/lib/hebcal'
import { supabaseAdmin } from '@/lib/supabase-admin'
import Link from 'next/link'
import LiveAnnouncements from './components/LiveAnnouncements'

const EVENTS = [
  {
    name:   'Shabbat Under the Stars',
    date:   'Friday, July 10, 2026',
    time:   '6:30 PM Reception · 7:00 PM Dinner',
    venue:  'Krug Residence, Sonoma',
    price:  '$54/person',
    desc:   'An elegant evening of Shabbat dinner, community, and inspiration. Featuring a special guest rabbi from Toronto.',
  },
  {
    name:   'Rosh Hashanah Community Dinner',
    date:   'Wednesday, September 23, 2026',
    time:   '7:00 PM',
    venue:  'Chabad Sonoma Valley',
    price:  '$36/person',
    desc:   'Welcome the Jewish New Year with family, friends, and a festive holiday meal.',
  },
]

export const revalidate = 3600

export default async function Home() {
  let shabbat = null
  try { shabbat = await getShabbatTimes('95476') } catch {}

  let announcements: { id: string; title: string; content: string; type: string; created_at: string }[] = []
  try {
    const { data } = await supabaseAdmin
      .from('announcements')
      .select('id, title, content, type, created_at')
      .order('created_at', { ascending: false })
      .limit(3)
    announcements = data || []
  } catch {}

  return (
    <div>
      {/* HERO */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://w2.chabad.org/media/images/1294/Jdkn12942782.jpg')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-chabad-dark/85 via-chabad-dark/55 to-chabad-dark/25" />

        <div className="relative z-10 px-8 md:px-16 max-w-2xl">
          <div className="inline-block bg-chabad-amber/20 border border-chabad-amber/50 text-chabad-ltgold text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded mb-6">
            Sonoma Valley · Est. 2007
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Everyone is<br />
            <span className="text-chabad-ltgold italic">Welcome Here.</span>
          </h1>
          <p className="text-white/80 text-lg leading-relaxed mb-8 max-w-md">
            A warm, open-door community for every Jewish person in the Sonoma Valley — regardless of background, philosophy, or level of observance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/events"
              className="px-7 py-3.5 bg-chabad-amber text-chabad-dark font-bold rounded hover:bg-chabad-gold transition">
              Upcoming Events
            </Link>
            <Link href="/about"
              className="px-7 py-3.5 border-2 border-white/50 text-white font-semibold rounded hover:border-white hover:bg-white/10 transition">
              Meet the Rabbi
            </Link>
          </div>
        </div>
      </section>

      {/* SHABBAT TIMES */}
      {shabbat && (
        <section className="bg-chabad-brown/40 border-y border-chabad-gold/20">
          <div className="max-w-4xl mx-auto px-6 py-10">
            <p className="text-chabad-ltgold text-xs tracking-widest uppercase text-center mb-6">
              This Week&apos;s Shabbat Times — {shabbat.location}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-chabad-ltgold text-2xl mb-1">✦</div>
                <div className="text-xs text-chabad-cream/50 uppercase tracking-wider mb-1">Parasha</div>
                <div className="text-chabad-cream font-bold">{shabbat.parasha}</div>
              </div>
              <div>
                <div className="text-chabad-ltgold text-2xl mb-1">🕯</div>
                <div className="text-xs text-chabad-cream/50 uppercase tracking-wider mb-1">Candle Lighting</div>
                <div className="text-chabad-cream font-bold">{shabbat.candleLighting}</div>
                <div className="text-xs text-chabad-cream/40">{shabbat.candleLightingDate}</div>
              </div>
              <div>
                <div className="text-chabad-ltgold text-2xl mb-1">⭐</div>
                <div className="text-xs text-chabad-cream/50 uppercase tracking-wider mb-1">Havdalah</div>
                <div className="text-chabad-cream font-bold">{shabbat.havdalah}</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Link href="/donate"
                  className="px-5 py-2 bg-chabad-amber text-chabad-dark text-sm font-bold rounded hover:bg-chabad-gold transition">
                  Join Us →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING EVENTS */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-chabad-cream mb-2">Upcoming Events</h2>
        <p className="text-chabad-cream/50 mb-10">Join us for meaningful moments of connection and celebration.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {EVENTS.map((e) => (
            <div key={e.name}
              className="bg-chabad-brown/30 border border-chabad-gold/20 rounded-xl p-6 hover:border-chabad-gold/50 transition">
              <div className="text-xs text-chabad-amber uppercase tracking-widest font-bold mb-3">Upcoming</div>
              <h3 className="text-xl font-bold text-chabad-cream mb-2">{e.name}</h3>
              <p className="text-sm text-chabad-cream/60 mb-1">📅 {e.date}</p>
              <p className="text-sm text-chabad-cream/60 mb-1">🕐 {e.time}</p>
              <p className="text-sm text-chabad-cream/60 mb-3">📍 {e.venue}</p>
              <p className="text-sm text-chabad-cream/70 leading-relaxed mb-4">{e.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-chabad-ltgold font-bold">{e.price}</span>
                <Link href="/events"
                  className="px-4 py-2 bg-chabad-amber text-chabad-dark text-sm font-bold rounded hover:bg-chabad-gold transition">
                  Register →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LIVE ANNOUNCEMENTS — client component with Realtime subscription */}
      <LiveAnnouncements initial={announcements} />

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="text-chabad-ltgold text-4xl mb-4">✦</div>
        <h2 className="text-3xl font-bold text-chabad-cream mb-4">Support Our Community</h2>
        <p className="text-chabad-cream/60 mb-8 max-w-xl mx-auto">
          Your generosity makes every Shabbat dinner, holiday celebration, and moment of connection possible.
        </p>
        <Link href="/donate"
          className="inline-block px-10 py-4 bg-chabad-amber text-chabad-dark font-bold text-lg rounded hover:bg-chabad-gold transition">
          Make a Donation →
        </Link>
      </section>
    </div>
  )
}
