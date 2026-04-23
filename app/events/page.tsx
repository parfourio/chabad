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
    } catch (err: unknown) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="bg-chabad-cream min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-chabad-amber text-xs tracking-widest uppercase font-bold mb-2">What&apos;s Coming Up</p>
        <h1 className="text-4xl font-bold text-chabad-brown mb-3 font-serif">Upcoming Events</h1>
        <div className="w-12 h-0.5 bg-chabad-amber mb-10" />

        {/* Event cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {EVENTS.map(e => (
            <div key={e.id}
              className={`border rounded-xl p-6 transition cursor-pointer ${
                selectedEvent?.id === e.id
                  ? 'border-chabad-amber bg-chabad-ltgold shadow-md'
                  : 'border-chabad-brown/15 bg-white hover:border-chabad-amber/50 hover:shadow-sm'
              }`}
              onClick={() => selectEvent(e)}>
              <div className="text-xs text-chabad-amber uppercase tracking-widest font-bold mb-3">{e.spots}</div>
              <h2 className="text-xl font-bold text-chabad-brown mb-3 font-serif">{e.name}</h2>
              <p className="text-sm text-chabad-text-muted mb-1">📅 {e.date}</p>
              <p className="text-sm text-chabad-text-muted mb-1">🕐 {e.time}</p>
              <p className="text-sm text-chabad-text-muted mb-4">📍 {e.venue}</p>
              <p className="text-sm text-chabad-text-mid leading-relaxed mb-4">{e.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-chabad-brown font-bold text-lg">${e.price}/person</span>
                <button
                  className={`px-4 py-2 text-sm font-bold rounded transition ${
                    selectedEvent?.id === e.id
                      ? 'bg-chabad-amber text-white'
                      : 'bg-chabad-brown text-white hover:bg-chabad-dark'
                  }`}>
                  {selectedEvent?.id === e.id ? '✓ Selected' : 'Register'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Registration form */}
        {selectedEvent && (
          <div id="register" className="bg-white border border-chabad-brown/15 rounded-2xl p-8 max-w-xl mx-auto shadow-sm">
            <p className="text-chabad-amber text-xs tracking-widest uppercase font-bold mb-1">Registration</p>
            <h2 className="text-2xl font-bold text-chabad-brown mb-1 font-serif">Register for</h2>
            <p className="text-chabad-text-mid italic mb-6">{selectedEvent.name}</p>

            {state === 'success' ? (
              <div className="text-center py-8">
                <div className="text-chabad-amber text-5xl mb-4">✦</div>
                <h3 className="text-xl font-bold text-chabad-brown mb-2 font-serif">You&apos;re registered!</h3>
                <p className="text-chabad-text-mid mb-2">{message}</p>
                <p className="text-xs text-chabad-text-muted">
                  Your registration has been saved and a confirmation is on its way.
                </p>
                <button
                  onClick={() => { setState('idle'); setSelectedEvent(null) }}
                  className="mt-6 text-sm text-chabad-amber hover:text-chabad-brown underline">
                  Register for another event
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-chabad-text-muted uppercase tracking-wider block mb-1">First Name *</label>
                    <input required value={form.firstName}
                      onChange={e => setForm(f => ({...f, firstName: e.target.value}))}
                      className="w-full bg-white border border-chabad-brown/20 rounded px-3 py-2 text-chabad-text text-sm focus:border-chabad-amber outline-none" />
                  </div>
                  <div>
                    <label className="text-xs text-chabad-text-muted uppercase tracking-wider block mb-1">Last Name *</label>
                    <input required value={form.lastName}
                      onChange={e => setForm(f => ({...f, lastName: e.target.value}))}
                      className="w-full bg-white border border-chabad-brown/20 rounded px-3 py-2 text-chabad-text text-sm focus:border-chabad-amber outline-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-chabad-text-muted uppercase tracking-wider block mb-1">Email *</label>
                  <input required type="email" value={form.email}
                    onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    className="w-full bg-white border border-chabad-brown/20 rounded px-3 py-2 text-chabad-text text-sm focus:border-chabad-amber outline-none" />
                </div>

                <div>
                  <label className="text-xs text-chabad-text-muted uppercase tracking-wider block mb-1">Phone</label>
                  <input type="tel" value={form.phone}
                    onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                    className="w-full bg-white border border-chabad-brown/20 rounded px-3 py-2 text-chabad-text text-sm focus:border-chabad-amber outline-none" />
                </div>

                <div>
                  <label className="text-xs text-chabad-text-muted uppercase tracking-wider block mb-1">Number of Guests</label>
                  <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                    className="w-full bg-white border border-chabad-brown/20 rounded px-3 py-2 text-chabad-text text-sm focus:border-chabad-amber outline-none cursor-pointer">
                    {[1,2,3,4,5,6,7,8].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="bg-chabad-ltgold rounded-lg p-4 border border-chabad-amber/20">
                  <div className="flex justify-between text-sm text-chabad-text-mid mb-1">
                    <span>${selectedEvent.price} × {guests} guest{guests > 1 ? 's' : ''}</span>
                    <span className="font-bold text-chabad-brown">${selectedEvent.price * guests}</span>
                  </div>
                  <p className="text-xs text-chabad-text-muted">Payment collected at the door</p>
                </div>

                {state === 'error' && (
                  <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-4 py-3">
                    {message}
                  </p>
                )}

                <button type="submit" disabled={state === 'loading'}
                  className="w-full py-3.5 bg-chabad-brown text-white font-bold rounded hover:bg-chabad-dark disabled:opacity-50 transition">
                  {state === 'loading' ? 'Saving registration...' : `Reserve ${guests} ${guests === 1 ? 'Seat' : 'Seats'}`}
                </button>

                <p className="text-xs text-chabad-text-muted text-center">
                  Your info is saved directly to our Salesforce CRM.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
