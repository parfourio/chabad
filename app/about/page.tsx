import Image from 'next/image'
import Link from 'next/link'

export const metadata = { title: 'About Rabbi Mendy Wenger | Sonoma Valley Chabad' }

export default function AboutPage() {
  return (
    <div className="bg-chabad-cream min-h-screen">

      {/* HERO STRIP */}
      <section className="relative h-64 flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://w2.chabad.org/media/images/1294/Jdkn12942782.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-chabad-brown/80 via-chabad-brown/40 to-transparent" />
        <div className="relative z-10 px-8 md:px-16 pb-10">
          <p className="text-chabad-gold text-xs tracking-widest uppercase font-bold mb-2">About Us</p>
          <h1 className="text-4xl md:text-5xl font-bold text-white font-serif">Meet the Rabbi</h1>
        </div>
      </section>

      {/* RABBI SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Photo card */}
          <div className="bg-white border border-chabad-brown/15 rounded-2xl overflow-hidden shadow-lg">
            <div className="relative w-full h-96">
              <Image
                src="https://w2.chabad.org/media/images/1295/BFHW12953520.jpg"
                alt="Rabbi Mendy Wenger"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="p-7">
              <h2 className="text-2xl font-bold text-chabad-brown mb-1 font-serif">Rabbi Mendy Wenger</h2>
              <p className="text-chabad-amber text-xs font-bold tracking-widest uppercase mb-4">
                Rabbi · Sonoma Valley Chabad Jewish Center
              </p>
              <div className="flex flex-col gap-2 text-sm text-chabad-text-mid">
                <span>📍 858 3rd St W, Sonoma, CA 95476</span>
                <span>📞 929-253-0820</span>
                <span>🕍 Services every Saturday morning</span>
              </div>
              <Link href="/donate"
                className="mt-6 inline-block w-full text-center px-6 py-3 bg-chabad-brown text-white font-bold rounded hover:bg-chabad-dark transition">
                Support the Community
              </Link>
            </div>
          </div>

          {/* Bio */}
          <div>
            <p className="text-chabad-amber text-xs tracking-widest uppercase font-bold mb-3">Our Story</p>
            <h3 className="text-3xl font-bold text-chabad-brown mb-6 leading-snug font-serif">
              A Place That<br />Feels Like Home.
            </h3>
            <div className="w-12 h-0.5 bg-chabad-amber mb-8" />

            <div className="space-y-5 text-chabad-text-mid leading-relaxed">
              <p>
                Rabbi Mendy Wenger leads the Sonoma Valley Chabad Jewish Center with warmth, wisdom, and a deep commitment to every member of the community. Whether you are a lifelong observer or completely new to Jewish life, Rabbi Mendy&apos;s door is always open.
              </p>
              <p>
                Chabad of Sonoma Valley has been serving the Jewish community since 2007 — providing an open-door environment for strengthening and enhancing Jewish values and identity for every person, regardless of background, philosophy, or level of commitment.
              </p>
              <p>
                Whether you are looking to connect with your heritage, celebrate Shabbat with community, enroll your children in Jewish education, or simply explore, you belong here. No affiliation required, no expectations attached.
              </p>
            </div>

            {/* Pillars */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              {[
                { icon: '✡️', title: 'All Are Welcome', desc: 'No membership, no judgment — just community' },
                { icon: '📚', title: 'Jewish Education', desc: 'Classes and learning for every age and level' },
                { icon: '🕍', title: 'Shabbat & Holidays', desc: 'Weekly services, candle lighting, and community meals' },
                { icon: '👨‍👩‍👧', title: 'Youth Programs', desc: 'Engaging programming for children and teens' },
              ].map(p => (
                <div key={p.title} className="bg-white border border-chabad-brown/10 rounded-xl p-4 shadow-sm">
                  <div className="text-2xl mb-2">{p.icon}</div>
                  <p className="text-chabad-brown font-bold text-sm mb-1">{p.title}</p>
                  <p className="text-chabad-text-muted text-xs leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS PHOTO GRID */}
      <section className="bg-white border-y border-chabad-brown/10">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <p className="text-chabad-amber text-xs tracking-widest uppercase font-bold mb-3">What We Offer</p>
          <h3 className="text-3xl font-bold text-chabad-brown mb-8 font-serif">Programs & Community</h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: 'https://w2.chabad.org/media/images/1097/PgBS10976181.jpg', label: 'Shabbat & Holidays', tag: 'Weekly Services' },
              { src: 'https://w2.chabad.org/media/images/1097/cGxY10976222.jpg', label: 'Sonoma Jewish Academy', tag: 'Jewish Education' },
              { src: 'https://w2.chabad.org/media/images/1097/ggex10976226.jpg', label: 'Youth Center', tag: 'Children & Teens' },
              { src: 'https://w2.chabad.org/media/images/1097/tBBf10976224.jpg', label: 'Jewish Culture', tag: 'Arts & Learning' },
              { src: 'https://w2.chabad.org/media/images/1097/OITJ10976225.jpg', label: "Jewish Women's Circle", tag: 'Community' },
              { src: 'https://w2.chabad.org/media/images/1354/ELRP13547206.jpg', label: 'The Golden Circle', tag: 'Intergenerational' },
            ].map(item => (
              <div key={item.label} className="relative rounded-xl overflow-hidden h-44 group">
                <Image
                  src={item.src}
                  alt={item.label}
                  fill
                  className="object-cover group-hover:scale-105 transition duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chabad-brown/80 via-chabad-brown/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight">{item.label}</p>
                  <p className="text-chabad-gold text-xs font-bold tracking-wider uppercase mt-0.5">{item.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-chabad-ltgold border-t border-chabad-amber/20">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="text-chabad-amber text-4xl mb-4">✦</div>
          <h3 className="text-3xl font-bold text-chabad-brown mb-4 font-serif">Come Join Us</h3>
          <p className="text-chabad-text-mid mb-8 max-w-xl mx-auto leading-relaxed">
            Every Friday night and Saturday morning, our doors are open to everyone. No RSVP needed — just show up and you will be welcomed with open arms.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/events"
              className="px-8 py-3 bg-chabad-brown text-white font-bold rounded hover:bg-chabad-dark transition">
              Upcoming Events
            </Link>
            <Link href="/donate"
              className="px-8 py-3 border-2 border-chabad-brown/40 text-chabad-brown font-bold rounded hover:border-chabad-brown hover:bg-chabad-brown/5 transition">
              Support Our Work
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
