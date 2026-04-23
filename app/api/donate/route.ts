import { NextResponse } from 'next/server'
import { tokenizeCard, createCharge, createCustomerAndCharge } from '@/lib/payarc'
import { upsertContact, createDonationOpportunity } from '@/lib/salesforce'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, amount, designation, type,
            cardNumber, expMonth, expYear, cvv } = body

    // Validate
    if (!firstName || !lastName || !email || !amount || !cardNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Tokenize card via PayArc (keeps raw card data off our servers in logs)
    const tokenId = await tokenizeCard({
      card_number: cardNumber.replace(/\s/g, ''),
      exp_month:   expMonth,
      exp_year:    expYear,
      cvv,
      card_holder_name: `${firstName} ${lastName}`,
    })
    if (amount < 5 || amount > 100000) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const amountCents = Math.round(amount * 100)

    // 1. Process payment via PayArc
    let chargeId: string
    if (type === 'recurring') {
      const result = await createCustomerAndCharge({
        tokenId,
        amount: amountCents,
        description: `Chabad Sonoma Valley — ${designation || 'General Fund'} Donation (recurring)`,
        email,
        name: `${firstName} ${lastName}`,
      })
      chargeId = result.chargeId
    } else {
      const charge = await createCharge({
        tokenId,
        amount: amountCents,
        description: `Chabad Sonoma Valley — ${designation || 'General Fund'} Donation`,
        email,
      })
      chargeId = charge.id
    }

    // 2. Upsert contact in Salesforce
    const contactId = await upsertContact({ firstName, lastName, email, phone })

    // 3. Create Opportunity in Salesforce
    await createDonationOpportunity({
      contactId,
      amount,
      type: type === 'recurring' ? 'recurring' : 'one-time',
      designation,
      payarcChargeId: chargeId,
    })

    return NextResponse.json({
      success: true,
      chargeId,
      contactId,
      message: `Thank you, ${firstName}! Your donation of $${amount} has been received.`,
    })
  } catch (err: unknown) {
    console.error('Donation error:', err)
    const message = err instanceof Error ? err.message : 'An error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
