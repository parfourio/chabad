/**
 * Admin / Live Updates Demo Page
 * Shows real-time content updates pushed via WhatsApp → Claude → Supabase
 */

'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Announcement {
  id: string
  type: string
  title: string
  content: string
  event_date: string | null
  event_time: string | null
  source: string
  raw_message: string
  created_at: string
}

const TYPE_COLORS: Record<string, string> = {
  announcement:    'bg-chabad-amber text-chabad-dark',
  event:           'bg-blue-500 text-white',
  shabbat_message: 'bg-yellow-500 text-black',
  schedule_change: 'bg-orange-500 text-white',
}

export default function AdminPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading]             = useState(true)
  const [lastUpdate, setLastUpdate]       = useState<Date | null>(null)
  const [pulse, setPulse]                 = useState(false)

  // Initial fetch
  useEffect(() => {
    fetchAll()
  }, [])

  // Real-time subscription via Supabase Realtime
  useEffect(() => {
    const channel = supabase
      .channel('announcements-live')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'announcements',
      }, payload => {
        setAnnouncements(prev => [payload.new as Announcement, ...prev])
        setLastUpdate(new Date())
        setPulse(true)
        setTimeout(() => setPulse(false), 3000)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchAll() {
    setLoading(true)
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    setAnnouncements(data || [])
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-chabad-cream">Live Site Updates</h1>
          <p className="text-chabad-cream/50 mt-1">
            WhatsApp → Claude AI → Supabase → Site (in real time)
          </p>
        </div>
        <div className="text-right">
          <div className={`flex items-center gap-2 ${pulse ? 'text-green-400' : 'text-chabad-cream/40'} transition-colors`}>
            <div className={`w-2 h-2 rounded-full ${pulse ? 'bg-green-400 animate-ping' : 'bg-chabad-cream/20'}`} />
            <span className="text-xs font-mono">{pulse ? 'New update!' : 'Listening...'}</span>
          </div>
          {lastUpdate && (
            <div className="text-xs text-chabad-cream/30 mt-1">
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* How it works banner */}
      <div className="bg-chabad-brown/40 border border-chabad-gold/20 rounded-xl p-5 mb-10">
        <h2 className="text-sm font-bold text-chabad-ltgold uppercase tracking-widest mb-3">How This Works</h2>
        <div className="grid grid-cols-4 gap-4 text-center">
          {[
            { icon: '💬', step: '1', label: 'Rabbi texts WhatsApp', sub: 'Natural language, any format' },
            { icon: '🤖', step: '2', label: 'Claude AI parses it', sub: 'Identifies type, title, content' },
            { icon: '⚡', step: '3', label: 'Supabase stores it', sub: 'Real-time database update' },
            { icon: '🌐', step: '4', label: 'Site updates live', sub: 'No login required' },
          ].map(s => (
            <div key={s.step}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-xs font-bold text-chabad-ltgold mb-0.5">{s.step}. {s.label}</div>
              <div className="text-xs text-chabad-cream/40">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Demo: simulate a WhatsApp message */}
      <SimulatePanel onNew={fetchAll} />

      {/* Announcements feed */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-chabad-cream mb-5">Live Feed</h2>

        {loading ? (
          <div className="text-center text-chabad-cream/40 py-12">Loading...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-chabad-gold/20 rounded-xl">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-chabad-cream/40">No announcements yet.</p>
            <p className="text-sm text-chabad-cream/30 mt-1">Send a WhatsApp message to get started.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {announcements.map((a, i) => (
              <div key={a.id}
                className={`bg-chabad-brown/30 border rounded-xl p-5 transition ${
                  i === 0 && pulse ? 'border-chabad-gold shadow-lg shadow-chabad-gold/10' : 'border-chabad-gold/20'
                }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${TYPE_COLORS[a.type] || 'bg-chabad-gold/20 text-chabad-cream'}`}>
                        {a.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-chabad-cream/30">
                        via {a.source} · {new Date(a.created_at).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-chabad-cream mb-1">{a.title}</h3>
                    <p className="text-sm text-chabad-cream/70 leading-relaxed">{a.content}</p>
                    {(a.event_date || a.event_time) && (
                      <div className="mt-2 text-xs text-chabad-ltgold">
                        {a.event_date && <span>📅 {a.event_date}  </span>}
                        {a.event_time && <span>🕐 {a.event_time}</span>}
                      </div>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-chabad-cream/20 font-mono">
                      Raw WhatsApp:
                    </div>
                    <div className="text-xs text-chabad-cream/30 max-w-48 text-right italic">
                      "{a.raw_message}"
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── DEMO PANEL — simulate a WhatsApp message without real Twilio ──────────────
function SimulatePanel({ onNew }: { onNew: () => void }) {
  const [msg, setMsg]     = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle')

  const EXAMPLES = [
    "This Friday Shabbat dinner starts at 7pm instead of 6:30. Venue changed to the Sapper residence.",
    "Join us Sunday August 10th for a community BBQ at 4pm. Kosher food, kids welcome, bring your neighbors!",
    "We raised over $12,000 at the gala last night. Thank you to our incredible community. More details to follow.",
    "Parasha of the week is Pinchas. My drasha will focus on leadership in uncertain times. Everyone welcome.",
  ]

  async function simulate() {
    if (!msg.trim()) return
    setState('loading')
    try {
      // Directly hit the WhatsApp webhook with a simulated payload
      const body = new URLSearchParams({
        From: 'whatsapp:+15551234567',
        Body: msg,
      })
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      setState('done')
      setMsg('')
      onNew()
      setTimeout(() => setState('idle'), 2000)
    } catch {
      setState('idle')
    }
  }

  return (
    <div className="bg-chabad-dark border border-chabad-gold/30 rounded-xl p-6">
      <h3 className="text-sm font-bold text-chabad-ltgold uppercase tracking-widest mb-4">
        🎭 Demo: Simulate a WhatsApp Message
      </h3>
      <p className="text-xs text-chabad-cream/50 mb-4">
        In production, Rabbi Wenger texts from his phone. For the demo, paste a message below and hit Send.
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {EXAMPLES.map((ex, i) => (
          <button key={i} onClick={() => setMsg(ex)}
            className="text-xs px-2 py-1 border border-chabad-gold/20 text-chabad-cream/60 hover:text-chabad-cream hover:border-chabad-gold/50 rounded transition">
            Example {i + 1}
          </button>
        ))}
      </div>
      <div className="flex gap-3">
        <textarea
          value={msg}
          onChange={e => setMsg(e.target.value)}
          placeholder="Type a message as if from Rabbi Wenger..."
          className="flex-1 bg-chabad-brown/30 border border-chabad-gold/20 rounded px-3 py-2 text-chabad-cream text-sm focus:border-chabad-gold outline-none resize-none h-20"
        />
        <button onClick={simulate} disabled={state === 'loading' || !msg.trim()}
          className="px-5 py-2 bg-chabad-amber text-chabad-dark font-bold rounded hover:bg-chabad-gold disabled:opacity-50 transition self-start">
          {state === 'loading' ? '...' : state === 'done' ? '✓ Sent!' : 'Send →'}
        </button>
      </div>
    </div>
  )
}
