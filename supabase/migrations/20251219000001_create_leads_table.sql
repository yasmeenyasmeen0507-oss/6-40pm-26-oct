-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  brand_name TEXT,
  phone_number TEXT NOT NULL,
  verified_phone TEXT,
  is_phone_verified BOOLEAN DEFAULT false NOT NULL,
  final_price DECIMAL(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  lead_status TEXT DEFAULT 'rnr' NOT NULL,
  lead_notes TEXT,
  converted_to_pickup BOOLEAN DEFAULT false NOT NULL,
  condition TEXT,
  age_group TEXT,
  device_powers_on BOOLEAN,
  display_condition TEXT,
  body_condition TEXT,
  can_make_calls BOOLEAN,
  is_touch_working BOOLEAN,
  is_screen_original BOOLEAN,
  is_battery_healthy BOOLEAN,
  has_charger BOOLEAN,
  has_box BOOLEAN,
  has_bill BOOLEAN,
  overall_condition TEXT,
  device_id UUID REFERENCES public.devices(id) ON DELETE SET NULL,
  variant_id UUID REFERENCES public.variants(id) ON DELETE SET NULL,
  city_id UUID REFERENCES public.cities(id) ON DELETE SET NULL,
  CONSTRAINT valid_lead_status CHECK (lead_status IN ('rnr', 'not-interested', 'scheduled', 'reschedule'))
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Public can create leads
CREATE POLICY "Anyone can create leads" ON public.leads 
  FOR INSERT WITH CHECK (true);

-- Admins have full access to leads
CREATE POLICY "Admins have full access to leads" ON public.leads
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Public can view their own leads
CREATE POLICY "Users can view their own leads" ON public.leads
  FOR SELECT USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(lead_status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_phone_number ON public.leads(phone_number);
CREATE INDEX IF NOT EXISTS idx_leads_converted_to_pickup ON public.leads(converted_to_pickup);
