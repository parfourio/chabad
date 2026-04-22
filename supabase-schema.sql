-- Run this entire file in Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- Announcements: stores content pushed via WhatsApp → Claude AI
CREATE TABLE IF NOT EXISTS announcements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type        TEXT NOT NULL DEFAULT 'announcement',
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  event_date  TEXT,
  event_time  TEXT,
  source      TEXT DEFAULT 'whatsapp',
  raw_message TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read"         ON announcements FOR SELECT USING (true);
CREATE POLICY "Service role write"  ON announcements FOR INSERT WITH CHECK (true);

-- Enable Supabase Realtime for live updates on the admin page
-- (Go to Database → Replication → add announcements table)

-- Test data: run this to see the admin page working before setting up Twilio
INSERT INTO announcements (type, title, content, source, raw_message) VALUES
  ('announcement', 'Welcome to Our New Website!',
   'We are excited to launch our new community website. Register for upcoming events, donate online, and stay connected with everything happening at Chabad Sonoma Valley.',
   'manual', 'Test data — site launch announcement'),
  ('event', 'Shabbat Under the Stars — July 10',
   'Join us for a magical Shabbat dinner under the stars of Sonoma wine country. Featuring a special guest rabbi from Toronto. Gourmet Israeli cuisine. $54 per person. RSVP at svjewishcenter.com/shabbat.',
   'manual', 'Test data — Shabbat Under the Stars event'),
  ('shabbat_message', 'This Week: Parashat Pinchas',
   'The Parasha of Pinchas teaches us about the courage to stand up for what we know is right, even when it is not popular. Join us this Shabbat to explore what leadership looks like in uncertain times.',
   'manual', 'Test data — Shabbat message');
