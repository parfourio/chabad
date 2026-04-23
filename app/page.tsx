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
    <div className="bg-chabad-cream">

      {/* HERO — full photo with overlay */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://w2.chabad.org/media/images/1294/Jdkn12942782.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-chabad-text/80 via-chabad-text/50 to-transparent" />
        <div className="relative z-10 px-8 md:px-16 max-w-2xl">
          <div className="inline-block bg-chabad-amber/25 border border-chabad-amber/60 text-chabad-gold text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded mb-6">
            Sonoma Valley · Est. 2007
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5">
            Everyone is<br />
            <span className="text-chabad-gold italic">Welcome Here.</span>
          </h1>
          <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-md">
            A warm, open-door community for every Jewish person in the Sonoma Valley, regardless of background, philosophy, or level of observance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/events"
              className="px-7 py-3.5 bg-chabad-amber text-white font-bold rounded hover:bg-chabad-dark transition">
              Upcoming Events
            </Link>
            <Link href="/about"
              className="px-7 py-3.5 border-2 border-white/60 text-white font-semibold rounded hover:border-white hover:bg-white/10 transition">
              Meet the Rabbi
            </Link>
          </div>
        </div>
      </section>

      {/* SHABBAT TIMES — wine strip */}
      {shabbat && (
        <section className="bg-chabad-brown">
          <div className="max-w-5xl mx-auto px-6 py-8">
            <p className="text-chabad-gold text-xs tracking-widest uppercase text-center mb-6 font-bold">
              This Week&apos;s Shabbat Times — {shabbat.location}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-chabad-gold text-xl mb-1">✦</div>
                <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Parasha</div>
                <div className="text-white font-bold font-serif text-lg">{shabbat.parasha}</div>
              </div>
              <div>
                <div className="text-xl mb-1">🕯</div>
                <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Candle Lighting</div>
                <div className="text-white font-bold font-serif text-lg">{shabbat.candleLighting}</div>
                <div className="text-xs text-white/50">{shabbat.candleLightingDate}</div>
              </div>
              <div>
                <div className="text-xl mb-1">⭐</div>
                <div className="text-xs text-white/60 uppercase tracking-wider mb-1">Havdalah</div>
                <div className="text-white font-bold font-serif text-lg">{shabbat.havdalah}</div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <Link href="/donate"
                  className="px-5 py-2.5 bg-chabad-amber text-white text-sm font-bold rounded hover:bg-chabad-dark transition">
                  Join Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* UPCOMING EVENTS — cream background */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <p className="text-chabad-amber text-xs tracking-widest uppercase font-bold mb-2">What&apos;s Coming Up</p>
          <h2 className="text-3xl font-bold text-chabad-brown mb-2 font-serif">Upcoming Events</h2>
          <div className="w-12 h-0.5 bg-chabad-amber mb-10" />
          <div className="grid md:grid-cols-2 gap-6">
            {EVENTS.map((e) => (
              <div key={e.name}
                className="border border-chabad-brown/15 rounded-xl p-6 hover:border-chabad-amber/50 hover:shadow-md transition bg-chabad-cream">
                <div className="text-xs text-chabad-amber uppercase tracking-widest font-bold mb-3">Upcoming</div>
                <h3 className="text-xl font-bold text-chabad-brown mb-2 font-serif">{e.name}</h3>
                <p className="text-sm text-chabad-text-muted mb-1">📅 {e.date}</p>
                <p className="text-sm text-chabad-text-muted mb-1">🕐 {e.time}</p>
                <p className="text-sm text-chabad-text-muted mb-3">📍 {e.venue}</p>
                <p className="text-sm text-chabad-text-mid leading-relaxed mb-4">{e.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-chabad-brown font-bold">{e.price}</span>
                  <Link href="/events"
                    className="px-4 py-2 bg-chabad-brown text-white text-sm font-bold rounded hover:bg-chabad-dark transition">
                    Register
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE ANNOUNCEMENTS */}
      <LiveAnnouncements initial={announcements} />

      {/* CTA — gold-pale background */}
      <section className="bg-chabad-ltgold border-y border-chabad-amber/20">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <div className="text-chabad-amber text-4xl mb-4">✦</div>
          <h2 className="text-3xl font-bold text-chabad-brown mb-4 font-serif">Support Our Community</h2>
          <p className="text-chabad-text-mid mb-8 max-w-xl mx-auto leading-relaxed">
            Your generosity makes every Shabbat dinner, holiday celebration, and moment of connection possible.
          </p>
          <Link href="/donate"
            className="inline-block px-10 py-4 bg-chabad-brown text-white font-bold text-lg rounded hover:bg-chabad-dark transition">
            Make a Donation
          </Link>
        </div>
      </section>

    </div>
  )
}
