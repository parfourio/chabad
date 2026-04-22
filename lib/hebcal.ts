/**
 * Chabad.org Hebcal API — no auth required, free forever
 * Docs: https://www.hebcal.com/home/197/shabbat-times-rest-api
 */

export interface ShabbatData {
  parasha: string          // "Parashat Balak"
  candleLighting: string   // "7:52pm"
  candleLightingDate: string
  havdalah: string         // "8:58pm"
  location: string         // "Sonoma, CA"
  hebrewDate: string
}

export async function getShabbatTimes(zip = '95476'): Promise<ShabbatData> {
  const url =
    `https://www.hebcal.com/shabbat?cfg=json&zip=${zip}&M=on&b=18&m=50&lg=s`

  const res = await fetch(url, { next: { revalidate: 3600 } }) // cache 1hr
  if (!res.ok) throw new Error('Hebcal API error')
  const data = await res.json()

  const items: { category: string; title: string; date: string; hebrew?: string }[] =
    data.items || []

  const candle   = items.find(i => i.category === 'candles')
  const havdalah = items.find(i => i.category === 'havdalah')
  const parasha  = items.find(i => i.category === 'parashat')
  const holiday  = items.find(i => i.category === 'holiday')

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles' })
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'America/Los_Angeles' })
  }

  return {
    parasha:             parasha?.title || holiday?.title || 'Shabbat',
    candleLighting:      candle   ? formatTime(candle.date)   : '—',
    candleLightingDate:  candle   ? formatDate(candle.date)   : '—',
    havdalah:            havdalah ? formatTime(havdalah.date) : '—',
    location:            data.location?.name || 'Sonoma, CA',
    hebrewDate:          candle?.hebrew || '',
  }
}
