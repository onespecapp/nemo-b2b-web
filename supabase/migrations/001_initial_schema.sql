-- Nemo B2B Database Schema
-- Businesses can create customers and schedule appointment reminders

-- Businesses table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  timezone TEXT DEFAULT 'America/Los_Angeles',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  reminder_minutes_before INTEGER DEFAULT 30,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'reminded', 'completed', 'cancelled', 'no_answer')),
  call_attempts INTEGER DEFAULT 0,
  last_call_at TIMESTAMPTZ,
  call_transcript TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call logs for tracking all calls made
CREATE TABLE IF NOT EXISTS call_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  call_type TEXT NOT NULL CHECK (call_type IN ('reminder', 'followup', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('initiated', 'ringing', 'answered', 'no_answer', 'busy', 'failed', 'completed')),
  duration_seconds INTEGER,
  transcript TEXT,
  recording_url TEXT,
  telnyx_call_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_business_id ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_business_id ON appointments(business_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer_id ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON appointments(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_call_logs_appointment_id ON call_logs(appointment_id);
CREATE INDEX IF NOT EXISTS idx_call_logs_customer_id ON call_logs(customer_id);

-- Row Level Security (RLS)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access their own business data
CREATE POLICY "Users can view own business" ON businesses
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own business" ON businesses
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own business" ON businesses
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Customers policies
CREATE POLICY "Users can view own customers" ON customers
  FOR SELECT USING (business_id = auth.uid());

CREATE POLICY "Users can insert own customers" ON customers
  FOR INSERT WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can update own customers" ON customers
  FOR UPDATE USING (business_id = auth.uid());

CREATE POLICY "Users can delete own customers" ON customers
  FOR DELETE USING (business_id = auth.uid());

-- Appointments policies
CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (business_id = auth.uid());

CREATE POLICY "Users can insert own appointments" ON appointments
  FOR INSERT WITH CHECK (business_id = auth.uid());

CREATE POLICY "Users can update own appointments" ON appointments
  FOR UPDATE USING (business_id = auth.uid());

CREATE POLICY "Users can delete own appointments" ON appointments
  FOR DELETE USING (business_id = auth.uid());

-- Call logs policies
CREATE POLICY "Users can view own call logs" ON call_logs
  FOR SELECT USING (business_id = auth.uid());

CREATE POLICY "Users can insert own call logs" ON call_logs
  FOR INSERT WITH CHECK (business_id = auth.uid());

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
