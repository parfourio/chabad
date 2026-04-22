/**
 * Salesforce REST API client
 * Uses the Username-Password OAuth 2.0 flow — ideal for server-to-server demo use.
 *
 * SETUP:
 * 1. Sign up at https://developer.salesforce.com/signup (free Developer Edition)
 * 2. Setup → App Manager → New Connected App
 *    - Enable OAuth, add "api" + "refresh_token" scopes
 *    - Copy Consumer Key + Consumer Secret
 * 3. Get your security token: Setup → My Personal Information → Reset Security Token
 *    Append it directly to your password: SFDC_PASSWORD=myPassword + myToken
 */

interface SFDCToken {
  access_token: string
  instance_url: string
}

let cachedToken: SFDCToken | null = null
let tokenExpiry = 0

export async function getSFDCToken(): Promise<SFDCToken> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken

  const params = new URLSearchParams({
    grant_type:    'password',
    client_id:     process.env.SFDC_CLIENT_ID!,
    client_secret: process.env.SFDC_CLIENT_SECRET!,
    username:      process.env.SFDC_USERNAME!,
    password:      process.env.SFDC_PASSWORD!, // password + security token
  })

  const res = await fetch(`${process.env.SFDC_LOGIN_URL}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`SFDC auth failed: ${err}`)
  }

  const data = await res.json()
  cachedToken = { access_token: data.access_token, instance_url: data.instance_url }
  tokenExpiry = Date.now() + 55 * 60 * 1000 // refresh before 60-min expiry
  return cachedToken
}

async function sfdc(method: string, path: string, body?: object) {
  const { access_token, instance_url } = await getSFDCToken()
  const res = await fetch(`${instance_url}/services/data/v59.0${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`SFDC ${method} ${path} failed: ${err}`)
  }
  return res.status === 204 ? null : res.json()
}

// ─── PUBLIC HELPERS ───────────────────────────────────────────────────────────

export interface ContactInput {
  firstName: string
  lastName: string
  email: string
  phone?: string
}

export async function upsertContact(input: ContactInput): Promise<string> {
  // Try to find existing contact by email
  const { access_token, instance_url } = await getSFDCToken()
  const q = `SELECT Id FROM Contact WHERE Email = '${input.email}' LIMIT 1`
  const searchRes = await fetch(
    `${instance_url}/services/data/v59.0/query?q=${encodeURIComponent(q)}`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  )
  const searchData = await searchRes.json()

  if (searchData.totalSize > 0) {
    return searchData.records[0].Id as string
  }

  const created = await sfdc('POST', '/sobjects/Contact', {
    FirstName: input.firstName,
    LastName:  input.lastName,
    Email:     input.email,
    Phone:     input.phone || '',
    LeadSource: 'Web',
  })
  return created.id as string
}

export async function createEventRegistration(params: {
  contactId: string
  eventName: string
  amount: number
  guests: number
}) {
  // Create an Opportunity to track the event registration + payment
  return sfdc('POST', '/sobjects/Opportunity', {
    Name:        `${params.eventName} — Registration`,
    StageName:   'Closed Won',
    CloseDate:   new Date().toISOString().split('T')[0],
    Amount:      params.amount,
    Description: `Event registration for ${params.guests} guest(s). Source: SVJewishCenter.com`,
    ContactId__c: params.contactId, // standard lookup if you have it
    Type:        'Existing Customer - Upgrade',
    LeadSource:  'Web',
  })
}

export async function createDonationOpportunity(params: {
  contactId: string
  amount: number
  type: 'one-time' | 'recurring'
  designation?: string
  payarcChargeId: string
}) {
  return sfdc('POST', '/sobjects/Opportunity', {
    Name:        `Donation — $${params.amount} — ${new Date().toLocaleDateString()}`,
    StageName:   'Closed Won',
    CloseDate:   new Date().toISOString().split('T')[0],
    Amount:      params.amount,
    Type:        params.type === 'recurring' ? 'Existing Customer - Upgrade' : 'New Customer',
    LeadSource:  'Web',
    Description: `${params.designation || 'General Fund'} donation. PayArc Charge ID: ${params.payarcChargeId}`,
  })
}
