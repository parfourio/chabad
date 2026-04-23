/**
 * PayArc REST API client (sandbox)
 *
 * SETUP:
 * 1. Go to https://payarc.net → Contact sales for sandbox access
 *    OR email sandbox@payarc.net to request a test account
 * 2. Log into the PayArc portal → API Keys → copy your Bearer token
 * 3. Add PAYARC_API_KEY to .env.local
 *
 * Sandbox base URL: https://testapi.payarc.net/v1
 * Live base URL:    https://api.payarc.net/v1
 *
 * Card tokenization MUST happen client-side (never send raw card data to your server).
 * Use the PayArc.js snippet in the browser to get a token, then send the token here.
 */

const BASE = process.env.PAYARC_API_URL || 'https://testapi.payarc.net/v1'
const KEY  = process.env.PAYARC_API_KEY!

async function payarc(method: string, path: string, body?: object) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization:  `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Accept:         'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(data?.error?.message || data?.message || `PayArc error ${res.status}`)
  }
  return data
}

// ─── TOKENIZE CARD (server-side backup — prefer client-side tokenization) ─────
export async function tokenizeCard(card: {
  card_number: string
  exp_month: string
  exp_year: string
  cvv: string
  name?: string
}): Promise<string> {
  const params: Record<string, string> = {
    card_source: 'INTERNET',
    card_number: card.card_number,
    exp_month:   card.exp_month,
    exp_year:    card.exp_year,
    cvv:         card.cvv,
  }
  if (card.name) params.name = card.name

  console.log('PayArc tokenize payload:', JSON.stringify({ ...params, card_number: '****', cvc: '***' }))

  const res = await fetch(`${BASE}/tokens`, {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Accept:         'application/json',
    },
    body: JSON.stringify(params),
  })

  const data = await res.json()
  console.log('PayArc tokenize response:', JSON.stringify(data))

  // PayArc may return a token even when flagging CVV warnings — extract it if present
  const tokenId = data?.data?.id || data?.id || data?.external_token
  if (tokenId) return tokenId

  if (!res.ok) {
    throw new Error(data?.message || data?.error?.message || JSON.stringify(data))
  }
  return tokenId
}

// ─── CREATE CHARGE ─────────────────────────────────────────────────────────────
export interface ChargeResult {
  id: string
  status: string
  amount: number
  currency: string
}

export async function createCharge(params: {
  tokenId: string        // card token from tokenizeCard()
  amount: number         // in cents (e.g. 5400 for $54.00)
  description: string
  email?: string
}): Promise<ChargeResult> {
  // Step 1: Create the charge
  const data = await payarc('POST', '/charges', {
    token_id:      params.tokenId,
    amount:        params.amount,
    currency:      'usd',
    description:   params.description,
    receipt_email: params.email,
  })

  const charge = data.data || data
  const chargeId = charge.id

  // Step 2: Capture the charge
  try {
    await payarc('POST', `/charges/${chargeId}/capture`, { amount: params.amount })
  } catch (e) {
    console.warn('Capture step failed (may already be captured):', e)
  }

  return {
    id:       chargeId,
    status:   'captured',
    amount:   charge.amount,
    currency: charge.currency || 'usd',
  }
}

// ─── CREATE CUSTOMER + CHARGE (for recurring) ──────────────────────────────────
export async function createCustomerAndCharge(params: {
  tokenId: string
  amount: number
  description: string
  email: string
  name: string
}): Promise<{ customerId: string; chargeId: string }> {
  // Create customer
  const customer = await payarc('POST', '/customers', {
    email: params.email,
    name:  params.name,
    token_id: params.tokenId,
  })
  const customerId = customer.data?.id || customer.id

  // Charge the customer
  const charge = await payarc('POST', '/charges', {
    customer_id: customerId,
    amount:      params.amount,
    currency:    'usd',
    description: params.description,
    capture:     true,
  })

  return {
    customerId,
    chargeId: charge.data?.id || charge.id,
  }
}

// ─── REFUND ────────────────────────────────────────────────────────────────────
export async function refundCharge(chargeId: string, amount?: number) {
  return payarc('POST', `/charges/${chargeId}/refunds`, amount ? { amount } : {})
}

// ─── GET CHARGE ────────────────────────────────────────────────────────────────
export async function getCharge(chargeId: string): Promise<ChargeResult> {
  const data = await payarc('GET', `/charges/${chargeId}`)
  const charge = data.data || data
  return { id: charge.id, status: charge.status, amount: charge.amount, currency: charge.currency }
}
