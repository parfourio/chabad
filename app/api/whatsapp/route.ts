/**
 * Twilio WhatsApp webhook — receives inbound messages from Rabbi Wenger,
 * parses them with Claude AI, and updates the site's announcements in real time.
 *
 * SETUP:
 * 1. Create Twilio account at https://console.twilio.com
 * 2. Messaging → Try it out → Send a WhatsApp message
 *    OR purchase a WhatsApp-enabled number and connect it
 * 3. Set webhook URL in Twilio console:
 *    Messaging → Senders → WhatsApp → your number → Incoming Message:
 *    https://your-vercel-url.vercel.app/api/whatsapp
 *    Method: POST
 * 4. Test by texting from Rabbi's WhatsApp to the Twilio number
 */

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Only accept messages from the rabbi's number (whitelist)
const ALLOWED_NUMBERS = (process.env.ALLOWED_WHATSAPP_NUMBERS || '').split(',').map(n => n.trim())

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const params = new URLSearchParams(body)

    const from    = params.get('From') || ''   // whatsapp:+14155551234
    const msgBody = params.get('Body') || ''

    console.log(`WhatsApp from ${from}: ${msgBody}`)

    // Security: only process messages from whitelisted numbers
    if (ALLOWED_NUMBERS.length > 0 && !ALLOWED_NUMBERS.some(n => from.includes(n))) {
      return twimlResponse('This number is not authorized to update the site.')
    }

    if (!msgBody.trim()) {
      return twimlResponse('Message was empty.')
    }

    // Parse with Claude
    const parsed = await parseWithClaude(msgBody)

    // Store in Supabase
    const { error } = await supabaseAdmin.from('announcements').insert({
      type:        parsed.type,
      title:       parsed.title,
      content:     parsed.content,
      event_date:  parsed.date  || null,
      event_time:  parsed.time  || null,
      source:      'whatsapp',
      raw_message: msgBody,
    })

    if (error) throw error

    // Confirm back to sender
    const confirmMsg = `✅ Got it! "${parsed.title}" has been posted to the site.`
    return twimlResponse(confirmMsg)

  } catch (err) {
    console.error('WhatsApp webhook error:', err)
    return twimlResponse('Sorry, there was an error updating the site. Please try again.')
  }
}

// ─── CLAUDE PARSER ────────────────────────────────────────────────────────────
interface ParsedUpdate {
  type:    'announcement' | 'event' | 'shabbat_message' | 'schedule_change'
  title:   string
  content: string
  date?:   string
  time?:   string
}

async function parseWithClaude(message: string): Promise<ParsedUpdate> {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const response = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Today is ${today}. The rabbi of Chabad Sonoma Valley sent this WhatsApp message to update the website:

"${message}"

Parse this into a JSON object with these fields:
- type: one of "announcement" | "event" | "shabbat_message" | "schedule_change"
- title: short, punchy title for the website (max 10 words)
- content: the full content, cleaned up and ready to display on the website
- date: event or relevant date in format "Month Day, Year" (null if not applicable)
- time: time in format "H:MM PM" (null if not applicable)

Return ONLY valid JSON. No explanation, no markdown.`,
    }],
  })

  const raw = response.content[0].type === 'text' ? response.content[0].text : '{}'

  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean) as ParsedUpdate
  } catch {
    // Fallback if JSON parse fails
    return {
      type:    'announcement',
      title:   'Message from Rabbi Wenger',
      content: message,
    }
  }
}

// ─── TWIML RESPONSE ───────────────────────────────────────────────────────────
function twimlResponse(message: string) {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${message}</Message>
</Response>`
  return new Response(twiml, {
    headers: { 'Content-Type': 'text/xml' },
  })
}
