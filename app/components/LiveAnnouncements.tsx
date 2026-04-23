'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Announcement {
  id: string
  type: string
  title: string
  content: string
  created_at: string
}

export default function LiveAnnouncements({ initial }: { initial: Announcement[] }) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initial)

  useEffect(() => {
    const channel = supabase
      .channel('homepage-announcements')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'announcements',
      }, payload => {
        setAnnouncements(prev => [payload.new as Announcement, ...prev].slice(0, 3))
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  if (announcements.length === 0) return null

  return (
    <section className="bg-white border-t border-chabad-brown/10">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-chabad-amber text-xs tracking-widest uppercase font-bold mb-2">From the Rabbi</p>
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-3xl font-bold text-chabad-brown font-serif">Community Updates</h2>
          <span className="text-xs bg-chabad-amber text-white px-2 py-1 rounded font-bold animate-pulse">Live</span>
        </div>
        <div className="w-12 h-0.5 bg-chabad-amber mb-10" />
        <div className="grid md:grid-cols-3 gap-5">
          {announcements.map(a => (
            <div key={a.id}
              className="bg-chabad-cream border border-chabad-brown/10 rounded-xl p-5">
              <div className="text-xs text-chabad-amber uppercase tracking-widest font-bold mb-2">
                {a.type.replace('_', ' ')}
              </div>
              <h3 className="font-bold text-chabad-brown mb-2 font-serif">{a.title}</h3>
              <p className="text-sm text-chabad-text-mid leading-relaxed">{a.content}</p>
              <div className="mt-3 text-xs text-chabad-text-muted">
                {new Date(a.created_at).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
