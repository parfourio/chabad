import { NextResponse } from 'next/server'
import { upsertContact, createEventRegistration } from '@/lib/salesforce'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, eventName, guests, totalAmount } = body

    if (!firstName || !lastName || !email || !eventName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // 1. Upsert Contact in Salesforce
    const contactId = await upsertContact({ firstName, lastName, email, phone })

    // 2. Create Opportunity for the registration
    const opp = await createEventRegistration({
      contactId,
      eventName,
      amount: totalAmount || 0,
      guests: guests || 1,
    })

    return NextResponse.json({
      success: true,
      contactId,
      opportunityId: opp?.id,
      message: `You're registered, ${firstName}! We'll see you at ${eventName}.`,
    })
  } catch (err: unknown) {
    console.error('Registration error:', err)
    const message = err instanceof Error ? err.message : 'An error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
