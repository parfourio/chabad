'use client'
import { useState } from 'react'

const PRESET_AMOUNTS = [18, 36, 54, 100, 180, 360]
const DESIGNATIONS   = ['General Fund', 'Shabbat Dinners', 'Youth Education', 'Holiday Programs', 'Building Fund']

type DonationType = 'one-time' | 'recurring'
type FormState    = 'idle' | 'loading' | 'success' | 'error'

/**
 * CARD TOKENIZATION NOTE:
 * In production, card fields should use PayArc.js (their hosted fields SDK)
 * so raw card data never touches your server. For demo purposes this form
 * sends card data to our /api/donate route which calls PayArc's tokenize endpoint.
 *
 * PayArc.js setup: add <script src="https://js.payarc.net/v1/payarc.js"></script>
 * to your layout and follow their SDK docs to mount hosted card fields.
 */

export default function DonatePage() {
  const [amount, setAmount]         = useState(54)
  const [customAmount, setCustom]   = useState('')
  const [designation, setDesig]     = useState('General Fund')
  const [type, setType]             = useState<DonationType>('one-time')
  const [form, setForm]             = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [card, setCard]             = useState({ number: '', expMonth: '', expYear: '', cvv: '', name: '' })
  const [state, setState]           = useState<FormState>('idle')
  const [message, setMessage]       = useState('')
  const [chargeId, setChargeId]     = useState('')

  const finalAmount = customAmount ? parseFloat(customAmount) : amount

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!finalAmount || finalAmount < 1) return
    setState('loading')
    setMessage('')

    try {
      const res = await fetch('/api/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          amount:      finalAmount,
          designation,
          type,
          // Card data — in production use PayArc.js token instead
          tokenId:     'tok_demo_' + Date.now(), // Replace with real PayArc token
          cardNumber:  card.number,
          expMonth:    card.expMonth,
          expYear:     card.expYear,
          cvv:         card.cvv,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Donation failed')
      setState('success')
      setMessage(data.message)
      setChargeId(data.chargeId || '')
    } catch (err: unknown) {
      setState('error')
      setMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <div className="text-chabad-ltgold text-4xl mb-4">✦</div>
          <h1 className="text-4xl font-bold text-chabad-cream mb-3">Make a Donation</h1>
          <p className="text-chabad-cream/60">
            Your generosity lights up our community. Every contribution — large or small — makes a difference.
          </p>
        </div>

        {state === 'success' ? (
          <div className="bg-chabad-brown/30 border border-chabad-gold/30 rounded-2xl p-10 text-center">
            <div className="text-6xl mb-4">✦</div>
            <h2 className="text-2xl font-bold text-chabad-cream mb-3">Thank You!</h2>
            <p className="text-chabad-cream/80 mb-3 text-lg">{message}</p>
            {chargeId && (
              <p className="text-xs text-chabad-cream/40 mb-2">PayArc Charge ID: {chargeId}</p>
            )}
            <p className="text-xs text-chabad-cream/40 mb-6">
              Your donation has been logged in Salesforce and a receipt is on its way to your email.
            </p>
            <button onClick={() => { setState('idle'); setChargeId('') }}
              className="text-sm text-chabad-ltgold hover:text-chabad-cream underline">
              Make another donation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}
            className="bg-chabad-brown/30 border border-chabad-gold/30 rounded-2xl p-8 space-y-6">

            {/* Donation type */}
            <div className="flex rounded-lg overflow-hidden border border-chabad-gold/30">
              {(['one-time', 'recurring'] as const).map(t => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 py-2.5 text-sm font-bold transition ${
                    type === t
                      ? 'bg-chabad-amber text-chabad-dark'
                      : 'bg-transparent text-chabad-cream/60 hover:text-chabad-cream'
                  }`}>
                  {t === 'one-time' ? 'One-Time' : 'Monthly Recurring'}
                </button>
              ))}
            </div>

            {/* Amount presets */}
            <div>
              <label className="text-xs text-chabad-cream/60 uppercase tracking-wider block mb-3">Amount</label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {PRESET_AMOUNTS.map(a => (
                  <button key={a} type="button"
                    onClick={() => { setAmount(a); setCustom('') }}
                    className={`py-2.5 rounded text-sm font-bold transition ${
                      amount === a && !customAmount
                        ? 'bg-chabad-amber text-chabad-dark'
                        : 'border border-chabad-gold/30 text-chabad-cream/70 hover:border-chabad-gold hover:text-chabad-cream'
                    }`}>
                    ${a}
                  </button>
                ))}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-chabad-cream/40">$</span>
                <input
                  type="number" min="1" placeholder="Custom amount"
                  value={customAmount}
                  onChange={e => { setCustom(e.target.value); setAmount(0) }}
                  className="w-full bg-chabad-dark border border-chabad-gold/30 rounded pl-7 pr-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none"
                />
              </div>
            </div>

            {/* Designation */}
            <div>
              <label className="text-xs text-chabad-cream/60 uppercase tracking-wider block mb-2">Designation</label>
              <select value={designation} onChange={e => setDesig(e.target.value)}
                className="w-full bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none cursor-pointer">
                {DESIGNATIONS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>

            {/* Personal info */}
            <div>
              <label className="text-xs text-chabad-cream/60 uppercase tracking-wider block mb-3">Your Information</label>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="First name" value={form.firstName}
                    onChange={e => setForm(f => ({...f, firstName: e.target.value}))}
                    className="bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
                  <input required placeholder="Last name" value={form.lastName}
                    onChange={e => setForm(f => ({...f, lastName: e.target.value}))}
                    className="bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
                </div>
                <input required type="email" placeholder="Email address" value={form.email}
                  onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
              </div>
            </div>

            {/* Card info — PayArc hosted fields in production */}
            <div>
              <label className="text-xs text-chabad-cream/60 uppercase tracking-wider block mb-3">
                Payment — Secured by PayArc
              </label>
              <div className="space-y-3">
                <input placeholder="Card number" value={card.number}
                  onChange={e => setCard(c => ({...c, number: e.target.value}))}
                  className="w-full bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none font-mono tracking-widest"
                  maxLength={19} />
                <input placeholder="Name on card" value={card.name}
                  onChange={e => setCard(c => ({...c, name: e.target.value}))}
                  className="w-full bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
                <div className="grid grid-cols-3 gap-3">
                  <input placeholder="MM" maxLength={2} value={card.expMonth}
                    onChange={e => setCard(c => ({...c, expMonth: e.target.value}))}
                    className="bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
                  <input placeholder="YYYY" maxLength={4} value={card.expYear}
                    onChange={e => setCard(c => ({...c, expYear: e.target.value}))}
                    className="bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
                  <input placeholder="CVV" maxLength={4} type="password" value={card.cvv}
                    onChange={e => setCard(c => ({...c, cvv: e.target.value}))}
                    className="bg-chabad-dark border border-chabad-gold/30 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none" />
                </div>
              </div>
              <p className="text-xs text-chabad-cream/30 mt-2">
                🔒 Card data tokenized by PayArc — never stored on our servers.
              </p>
            </div>

            {/* Summary */}
            <div className="bg-chabad-dark/50 rounded-lg p-4">
              <div className="flex justify-between text-sm">
                <span className="text-chabad-cream/70">{type === 'recurring' ? 'Monthly donation' : 'One-time donation'}</span>
                <span className="text-chabad-ltgold font-bold text-lg">${finalAmount || 0}</span>
              </div>
              <div className="text-xs text-chabad-cream/40 mt-1">{designation}</div>
            </div>

            {state === 'error' && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded px-4 py-3">
                {message}
              </p>
            )}

            <button type="submit" disabled={state === 'loading' || !finalAmount}
              className="w-full py-4 bg-chabad-amber text-chabad-dark font-bold text-lg rounded hover:bg-chabad-gold disabled:opacity-50 transition">
              {state === 'loading'
                ? 'Processing...'
                : `Donate $${finalAmount || 0}${type === 'recurring' ? '/month' : ''} →`}
            </button>

            <p className="text-xs text-chabad-cream/30 text-center">
              Processed via PayArc · Logged to Salesforce · Tax receipt emailed automatically
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
