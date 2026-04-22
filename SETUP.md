# Chabad Sonoma Valley — Demo Setup Guide

## Overview
This site connects 4 live services:
| Service | Purpose | Cost |
|---------|---------|------|
| **Supabase** | Database + Realtime (WhatsApp feed) | Free tier |
| **Salesforce Dev Edition** | CRM — contacts, donations, event registrations | Free forever |
| **PayArc Sandbox** | Payment processing | Free sandbox |
| **Twilio** | WhatsApp inbound messages | Free trial ($15 credit) |

---

## Step 1 — Supabase (10 minutes)

1. Go to **https://supabase.com** → Sign up → New Project
2. Pick a name (e.g. `chabad-sonoma`), set a DB password, pick the closest region
3. Once created, go to **SQL Editor** → paste the entire contents of `supabase-schema.sql` → Run
4. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY`
5. Go to **Database → Replication** → enable `announcements` table for Realtime

---

## Step 2 — Salesforce Developer Edition (15 minutes)

1. Go to **https://developer.salesforce.com/signup** → create free Developer Edition account
   - Use a real email — you'll need to verify it
   - Salesforce Developer Edition is free forever, no credit card

2. After login, go to **Setup** (gear icon → Setup)

3. In the Quick Find box, search **App Manager** → **New Connected App**
   - Connected App Name: `Chabad Sonoma Demo`
   - Contact Email: your email
   - ✅ Enable OAuth Settings
   - Callback URL: `http://localhost:3000/callback` (placeholder)
   - Selected OAuth Scopes: add **"Full access (full)"** and **"Perform requests at any time (refresh_token)"**
   - Save → Continue

4. After saving, click **Manage Consumer Details** → copy:
   - Consumer Key → `SFDC_CLIENT_ID`
   - Consumer Secret → `SFDC_CLIENT_SECRET`

5. Get your Security Token:
   - Click your avatar (top right) → Settings → **My Personal Information → Reset Security Token**
   - It will be emailed to you
   - Your password env var = `yourPassword` + `yourSecurityToken` (no space)
   - Example: if password is `Hello123` and token is `ABC456XYZ`, set `SFDC_PASSWORD=Hello123ABC456XYZ`

6. Set:
   ```
   SFDC_LOGIN_URL=https://login.salesforce.com
   SFDC_USERNAME=your@email.com
   SFDC_PASSWORD=yourPasswordPlusSecurityToken
   ```

---

## Step 3 — PayArc Sandbox (15 minutes)

1. Go to **https://payarc.net** → click "Get Started" or "Contact Sales"
   - Request a **sandbox/test account** — mention you're building a demo integration
   - Alternatively email: **support@payarc.net** and ask for sandbox API credentials
   - PayArc may take 1-2 business days to provision your sandbox account

2. Once you have access, log into the PayArc merchant portal → **API Keys**
   - Copy your **Bearer Token** → `PAYARC_API_KEY`

3. Set:
   ```
   PAYARC_API_KEY=your_bearer_token
   PAYARC_API_URL=https://testapi.payarc.net/v1
   ```

4. **Test card numbers** (PayArc sandbox):
   - Success: `4111 1111 1111 1111` · Exp: any future date · CVV: any 3 digits
   - Decline: `4000 0000 0000 0002`

---

## Step 4 — Twilio WhatsApp (10 minutes)

1. Go to **https://console.twilio.com** → Sign up (free trial, $15 credit)

2. In the Twilio console, go to **Messaging → Try it out → Send a WhatsApp message**
   - You'll get a sandbox number (e.g. +1-415-523-8886)
   - You'll join the sandbox by texting "join [your-keyword]" from your phone

3. After deploying to Vercel (Step 6), set your webhook URL:
   - Twilio Console → **Messaging → Senders → WhatsApp Sandbox Settings**
   - "When a message comes in": `https://your-app.vercel.app/api/whatsapp`
   - Method: `POST`

4. Copy from Twilio Console:
   - Account SID → `TWILIO_ACCOUNT_SID`
   - Auth Token → `TWILIO_AUTH_TOKEN`

5. Set:
   ```
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
   ```

6. To restrict who can update the site via WhatsApp, set:
   ```
   ALLOWED_WHATSAPP_NUMBERS=+15551234567,+15557654321
   ```
   (Use the rabbi's actual WhatsApp number, international format)

---

## Step 5 — Anthropic API Key (2 minutes)

1. Go to **https://console.anthropic.com** → API Keys → Create Key
2. Set: `ANTHROPIC_API_KEY=sk-ant-...`

---

## Step 6 — Local Setup

```bash
cd chabad-nextjs
npm install

# Copy the example env file
cp .env.local.example .env.local

# Fill in all values from Steps 1–5 above
# Then:
npm run dev
```

Open http://localhost:3000

---

## Step 7 — Deploy to Vercel

```bash
# Install Vercel CLI if needed
npm install -g vercel

# From the chabad-nextjs directory:
vercel

# Add environment variables in Vercel dashboard:
# Project → Settings → Environment Variables
# Add all values from your .env.local (mark sensitive ones as "Sensitive")
```

After deploying:
- Copy your Vercel URL (e.g. `https://chabad-sonoma.vercel.app`)
- Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars
- Update the Twilio WhatsApp webhook to: `https://chabad-sonoma.vercel.app/api/whatsapp`

---

## Demoing the Integration

### Shabbat Times (instant — no setup needed)
- Open the homepage — times load automatically from Chabad.org

### Event Registration → Salesforce
1. Go to `/events`
2. Select an event, fill out the form, submit
3. Open Salesforce → Contacts → search for the email you used
4. Open Salesforce → Opportunities → see the event registration record

### Donation → PayArc + Salesforce
1. Go to `/donate`
2. Choose an amount, fill out the form with test card `4111 1111 1111 1111`
3. Submit — see the PayArc charge ID in the success screen
4. Log into PayArc sandbox portal → see the transaction
5. Open Salesforce → see the Contact and Opportunity created

### WhatsApp → Live Site Update
1. Go to `/admin` (the Live Updates page)
2. Use the "Simulate" panel to send a test message
   OR text the Twilio sandbox number from your phone
3. Watch the update appear on the page in real time (no refresh needed)
4. Check the homepage — it shows the latest 3 announcements

---

## Troubleshooting

**Salesforce: "INVALID_LOGIN" error**
→ Make sure your SFDC_PASSWORD includes the security token appended directly (no space)

**PayArc: 401 Unauthorized**
→ Check that PAYARC_API_KEY is set correctly and you're using the sandbox key with the sandbox URL

**WhatsApp webhook not receiving messages**
→ Make sure your Vercel URL is set in Twilio, and that the ALLOWED_WHATSAPP_NUMBERS env var includes your phone number (or leave it empty to allow all numbers during testing)

**Supabase Realtime not working**
→ Go to Supabase → Database → Replication → enable the `announcements` table
