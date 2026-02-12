-- Voice quality settings for improved conversation quality
-- Adds fields to control speaking rate, conversation style, and custom greeting

ALTER TABLE b2b_businesses
  ADD COLUMN IF NOT EXISTS speaking_rate NUMERIC(3,2) DEFAULT 1.0
    CHECK (speaking_rate >= 0.7 AND speaking_rate <= 1.4),
  ADD COLUMN IF NOT EXISTS voice_style TEXT DEFAULT 'professional'
    CHECK (voice_style IN ('professional', 'friendly', 'warm', 'casual')),
  ADD COLUMN IF NOT EXISTS custom_greeting TEXT,
  ADD COLUMN IF NOT EXISTS end_of_call_message TEXT,
  ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en-US';
