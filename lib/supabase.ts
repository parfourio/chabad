import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/*
Run this SQL in your Supabase SQL Editor:

CREATE TABLE announcements (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type        TEXT NOT NULL,         -- 'announcement' | 'event' | 'shabbat_message' | 'schedule_change'
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  event_date  TEXT,
  event_time  TEXT,
  source      TEXT DEFAULT 'whatsapp',
  raw_message TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON announcements FOR SELECT USING (true);
CREATE POLICY "Service role write" ON announcements FOR INSERT WITH CHECK (true);
*/
