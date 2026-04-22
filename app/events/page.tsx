'use client'
import { useState } from 'react'

const EVENTS = [
  {
    id:     'shabbat-stars-2026',
    name:   'Shabbat Under the Stars',
    date:   'Friday, July 10, 2026',
    time:   '6:30 PM Reception · 7:00 PM Dinner',
    venue:  'Krug Residence, Sonoma Valley',
    price:  54,
    desc:   'An elegant evening of Shabbat dinner, community, and inspiration under the stars of Sonoma. Featuring a special guest rabbi from Toronto. Gourmet Israeli cuisine. Live music.',
    spots:  'Limited seating',
  },
  {
    id:     'rosh-hashana-2026',
    name:   'Rosh Hashanah Community Dinner',
    date:   'Wednesday, September 23, 2026',
    time:   '7:00 PM',
    venue:  'Chabad Sonoma Valley',
    price:  36,
    desc:   'Welcome the Jewish New Year with family, friends, and a festive holiday meal. Traditional holiday foods, meaningful prayers, and warm community connection.',
    spots:  'Open registration',
  },
]

type FormState = 'idle' | 'loading' | 'success' | 'error'

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<typeof EVENTS[0] | null>(null)
  const [guests, setGuests]   = useState(1)
  const [form, setForm]       = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [state, setState]     = useState<FormState>('idle')
  const [message, setMessage] = useState('')

  function selectEvent(e: typeof EVENTS[0]) {
    setSelectedEvent(e)
    setState('idle')
    setMessage('')
    window.scrollTo({ top: document.getElementById('register')?.offsetTop ?? 0, behavior: 'smooth' })
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!selectedEvent) return
    setState('loading')
    setMessage('')

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          eventName:   selectedEvent.name,
          guests,
          totalAmount: selectedEvent.price * guests,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setState('success')
      setMessage(data.message)
      // Also show SFDC confirmation
    } catch (err: unknown) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold text-chabad-cream mb-3">Upcoming Events</h1>
      <p className="text-chabad-cream/60 mb-12">
        Join us for meaningful moments of connection, celebration, and community.
      </p>

      {/* Event cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {EVENTS.map(e => (
          <div key={e.id}
            className={`border rounded-xl p-6 transition cursor-pointer ${
              selectedEvent?.id === e.id
                ? 'border-chabad-gold bg-chabad-brown/50'
                : 'border-chabad-gold/20 bg-chabad-brown/20 hover:border-chabad-gold/50'
            }`}
            onClick={() => selectEvent(e)}>
            <div className="text-xs text-chabad-amber uppercase tracking-widest font-bold mb-3">{e.spots}</div>
            <h2 className="text-xl font-bold text-chabad-cream mb-3">{e.name}</h2>
            <p className="text-sm text-chabad-cream/70 mb-1">📅 {e.date}</p>
            <p className="text-sm text-chabad-cream/70 mb-1">🕐 {e.time}</p>
            <p className="text-sm text-chabad-cream/70 mb-4">📍 {e.venue}</p>
            <p className="text-sm text-chabad-cream/60 leading-relaxed mb-4">{e.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-chabad-ltgold font-bold text-lg">${e.price}/person</span>
              <button
                className="px-4 py-2 bg-chabad-amber text-chabad-dark text-sm font-bold rounded hover:bg-chabad-gold transition">
                {selectedEvent?.id === e.id ? '✓ Selected' : 'Register →'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Registration form */}
      {selectedEvent && (
        <div id="register" className="bg-chabad-brown/30 border border-chabad-gold/30 rounded-2xl p-8 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-chabad-cream mb-1">Register for</h2>
          <p className="text-chabad-ltgold italic mb-6">{selectedEvent.name}</p>

          {state === 'success' ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">✦</div>
              <h3 className="text-xl font-bold text-chabad-cream mb-2">You&apos;re registered!</h3>
              <p className="text-chabad-cream/70 mb-2">{message}</p>
              <p className="text-xs text-chabad-cream/40">
                Your registration has been saved in Salesforce and a confirmation is on its way.
              </p>
              <button
                onClick={() => { setState('idle'); setSelectedEvent(null) }}
                className="mt-6 text-sm text-chabad-ltgold hover:text-chabad-cream underline">
                Register for another event
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-chabad-cream/60 uppercase tracking-wider block mb-1">First Name *</label>
                  <input required value={form.firstName}
                    onChange={e => setForm(f => ({...f, firstName: e.target.value}))}
                    className="w-full bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
                </div>
                <div>
                  <label className="text-xs text-chabad-cream/60 uppercase tracking-wider block mb-1">Last Name *</label>
                  <input required value={form.lastName}
                    onChange={e => setForm(f => ({...f, lastName: e.target.value}))}
                    className="w-full bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs text-chabad-cream/60 uppercase tracking-wider block mb-1">Email *</label>
                <input required type="email" value={form.email}
                  onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
              </div>

              <div>
                <label className="text-xs text-chabad-cream/60 uppercase tracking-wider block mb-1">Phone</label>
                <input type="tel" value={form.phone}
                  onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                  className="w-full bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
              </div>

              <div>
                <label className="text-xs text-chabad-cream/60 uppercase tracking-wider block mb-1">Number of Guests</label>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                  className="w-full bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none cursor-pointer">
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                  ))}
                </select>
              </div>

              <div className="bg-chabad-dark/50 rounded-lg p-4">
                <div className="flex justify-between text-sm text-chabad-cream/70 mb-1">
                  <span>${selectedEvent.price} × {guests} guest{guests > 1 ? 's' : ''}</span>
                  <span className="font-bold text-chabad-ltgold">${selectedEvent.price * guests}</span>
                </div>
                <p className="text-xs text-chabad-cream/40">Payment collected at the door</p>
              </div>

              {state === 'error' && (
                <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded px-4 py-3">
                  {message}
                </p>
              )}

              <button type="submit" disabled={state === 'loading'}
                className="w-full py-3.5 bg-chabad-amber text-chabad-dark font-bold rounded hover:bg-chabad-gold disabled:opacity-50 transition">
                {state === 'loading' ? 'Saving registration...' : `Reserve ${guests} ${guests === 1 ? 'Seat' : 'Seats'} →`}
              </button>

              <p className="text-xs text-chabad-cream/30 text-center">
                Your info is saved directly to our Salesforce CRM — no middleman.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
