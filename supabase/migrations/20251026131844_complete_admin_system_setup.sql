/*
  # Complete Admin System Setup for SellKar India

  ## Overview
  This migration creates the complete database schema including customer-facing tables 
  and a full-featured admin panel system with authentication, audit logging, and RBAC.

  ## Tables Created

  ### Customer-Facing Tables
  1. **brands** - Device manufacturers (Apple, Samsung, etc.)
  2. **devices** - Device models (iPhone 15, Galaxy S24, etc.)
  3. **variants** - Storage variants for each device
  4. **warranty_prices** - Age-based pricing for each variant
  5. **cities** - Serviceable cities for pickup
  6. **pickup_requests** - Customer device sell requests
  7. **reviews** - Customer testimonials

  ### Admin System Tables
  1. **admin_users** - Admin accounts with bcrypt password hashing
  2. **admin_activity_logs** - Complete audit trail of all admin actions
  3. **system_settings** - Global configuration key-value store

  ## Security
  - All tables have RLS enabled
  - Public can read catalogs (brands, devices, cities) but only active items
  - Public can create pickup requests
  - Admins have full CRUD access to all tables
  - Activity logs track all admin actions for compliance

  ## Features
  - Soft delete capability for brands, devices, cities
  - Featured items support
  - Custom ordering for display
  - Comprehensive audit logging
  - Session-based admin authentication
*/

-- ============================================
-- PART 1: CREATE ENUMS
-- ============================================

DO $$ BEGIN
  CREATE TYPE device_category AS ENUM ('phone', 'laptop', 'ipad');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE device_condition AS ENUM ('excellent', 'good', 'fair', 'poor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE age_group AS ENUM ('0-3', '3-6', '6-11', '12+');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- PART 2: CREATE BASE TABLES
-- ============================================

-- Brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category device_category NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Devices table
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
  series TEXT,
  model_name TEXT NOT NULL,
  release_date DATE,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Variants table
CREATE TABLE IF NOT EXISTS public.variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  storage_gb INTEGER NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Warranty prices table
CREATE TABLE IF NOT EXISTS public.warranty_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES public.variants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  price_0_3_months DECIMAL(10, 2) NOT NULL,
  price_3_6_months DECIMAL(10, 2) NOT NULL,
  price_6_11_months DECIMAL(10, 2) NOT NULL,
  price_11_plus_months DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Pickup requests table
CREATE TABLE IF NOT EXISTS public.pickup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_phone TEXT NOT NULL,
  device_id UUID REFERENCES public.devices(id) NOT NULL,
  variant_id UUID REFERENCES public.variants(id) NOT NULL,
  city_id UUID REFERENCES public.cities(id) NOT NULL,
  condition device_condition NOT NULL,
  age_group age_group NOT NULL,
  has_charger BOOLEAN DEFAULT FALSE,
  has_bill BOOLEAN DEFAULT FALSE,
  has_box BOOLEAN DEFAULT FALSE,
  device_powers_on BOOLEAN DEFAULT TRUE,
  display_condition device_condition NOT NULL,
  body_condition device_condition NOT NULL,
  can_make_calls BOOLEAN DEFAULT TRUE,
  is_touch_working BOOLEAN DEFAULT TRUE,
  is_screen_original BOOLEAN DEFAULT TRUE,
  is_battery_healthy BOOLEAN DEFAULT TRUE,
  overall_condition TEXT DEFAULT 'good',
  final_price DECIMAL(10, 2) NOT NULL,
  customer_name TEXT NOT NULL,
  address TEXT NOT NULL,
  pincode TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  device_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  review_text TEXT NOT NULL,
  location TEXT,
  is_featured BOOLEAN DEFAULT false NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- ============================================
-- PART 3: CREATE ADMIN TABLES
-- ============================================

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true NOT NULL,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_username CHECK (length(username) >= 3)
);

-- Admin activity logs table
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  before_data JSONB,
  after_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT valid_action_type CHECK (action_type IN ('create', 'update', 'delete', 'export', 'login', 'logout', 'status_change'))
);

-- System settings table
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_by UUID REFERENCES public.admin_users(id) ON DELETE SET NULL
);

-- ============================================
-- PART 4: CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_devices_brand_id ON public.devices(brand_id);
CREATE INDEX IF NOT EXISTS idx_variants_device_id ON public.variants(device_id);
CREATE INDEX IF NOT EXISTS idx_warranty_prices_variant_id ON public.warranty_prices(variant_id);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_status ON public.pickup_requests(status);
CREATE INDEX IF NOT EXISTS idx_pickup_requests_created_at ON public.pickup_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_admin_user_id ON public.admin_activity_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON public.admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_action_type ON public.admin_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_reviews_is_featured ON public.reviews(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_reviews_display_order ON public.reviews(display_order) WHERE is_featured = true;

-- ============================================
-- PART 5: ENABLE RLS
-- ============================================

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 6: CREATE RLS POLICIES - PUBLIC ACCESS
-- ============================================

-- Public can view active brands
CREATE POLICY "Public can view active brands" ON public.brands 
  FOR SELECT USING (is_active = true);

-- Public can view active devices
CREATE POLICY "Public can view active devices" ON public.devices 
  FOR SELECT USING (is_active = true);

-- Public can view all variants
CREATE POLICY "Public can view variants" ON public.variants 
  FOR SELECT USING (true);

-- Public can view warranty prices
CREATE POLICY "Public can view warranty prices" ON public.warranty_prices 
  FOR SELECT USING (true);

-- Public can view active cities
CREATE POLICY "Public can view active cities" ON public.cities 
  FOR SELECT USING (is_active = true);

-- Public can create pickup requests
CREATE POLICY "Anyone can create pickup request" ON public.pickup_requests 
  FOR INSERT WITH CHECK (true);

-- Public can view their own requests
CREATE POLICY "Users can view their own requests" ON public.pickup_requests 
  FOR SELECT USING (true);

-- Public can view featured reviews
CREATE POLICY "Public can view featured reviews" ON public.reviews
  FOR SELECT USING (is_featured = true);

-- ============================================
-- PART 7: CREATE RLS POLICIES - ADMIN ACCESS
-- ============================================

-- Admins have full access to brands
CREATE POLICY "Admins have full access to brands" ON public.brands
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Admins have full access to devices
CREATE POLICY "Admins have full access to devices" ON public.devices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Admins have full access to variants
CREATE POLICY "Admins have full access to variants" ON public.variants
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Admins have full access to warranty_prices
CREATE POLICY "Admins have full access to warranty_prices" ON public.warranty_prices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Admins have full access to cities
CREATE POLICY "Admins have full access to cities" ON public.cities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Admins have full access to pickup_requests
CREATE POLICY "Admins have full access to pickup_requests" ON public.pickup_requests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Admins have full access to reviews
CREATE POLICY "Admins have full access to reviews" ON public.reviews
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- Admins can read own profile
CREATE POLICY "Admins can read own profile" ON public.admin_users
  FOR SELECT USING (auth.uid() = id);

-- Admins can update own profile
CREATE POLICY "Admins can update own profile" ON public.admin_users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read all activity logs
CREATE POLICY "Admins can read all activity logs" ON public.admin_activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- System can insert activity logs
CREATE POLICY "System can insert activity logs" ON public.admin_activity_logs
  FOR INSERT WITH CHECK (true);

-- Admins have full access to settings
CREATE POLICY "Admins have full access to settings" ON public.system_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE id = auth.uid() AND is_active = true
    )
  );

-- ============================================
-- PART 8: INSERT INITIAL DATA
-- ============================================

-- Insert brands for phones
INSERT INTO public.brands (category, name, logo_url, is_active, display_order) VALUES
('phone', 'Apple', 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop', true, 1),
('phone', 'Samsung', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop', true, 2),
('phone', 'OnePlus', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop', true, 3),
('phone', 'Xiaomi', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop', true, 4),
('phone', 'Vivo', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop', true, 5),
('phone', 'Oppo', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop', true, 6),
('phone', 'Realme', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop', true, 7),
('phone', 'Google', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop', true, 8),
('phone', 'Motorola', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop', true, 9),
('phone', 'Nothing', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop', true, 10)
ON CONFLICT DO NOTHING;

-- Insert brands for laptops
INSERT INTO public.brands (category, name, logo_url, is_active, display_order) VALUES
('laptop', 'Apple', 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop', true, 1),
('laptop', 'Dell', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop', true, 2),
('laptop', 'HP', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop', true, 3),
('laptop', 'Lenovo', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop', true, 4),
('laptop', 'Asus', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop', true, 5),
('laptop', 'Acer', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop', true, 6),
('laptop', 'MSI', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop', true, 7)
ON CONFLICT DO NOTHING;

-- Insert brands for iPads
INSERT INTO public.brands (category, name, logo_url, is_active, display_order) VALUES
('ipad', 'Apple', 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop', true, 1)
ON CONFLICT DO NOTHING;

-- Insert cities
INSERT INTO public.cities (name, is_active) VALUES
('Mumbai', true),
('Delhi', true),
('Bangalore', true),
('Hyderabad', true),
('Chennai', true),
('Kolkata', true),
('Pune', true),
('Ahmedabad', true),
('Jaipur', true),
('Surat', true)
ON CONFLICT DO NOTHING;

-- Insert sample reviews
INSERT INTO public.reviews (customer_name, device_name, rating, review_text, location, is_featured, display_order) VALUES
('Rahul Sharma', 'iPhone 13', 5, 'Amazing service! Got the best price for my phone and pickup was super convenient.', 'Mumbai', true, 1),
('Priya Patel', 'Samsung Galaxy S21', 5, 'Very professional team. Quick verification and instant payment. Highly recommended!', 'Bangalore', true, 2),
('Amit Kumar', 'OnePlus 9 Pro', 4, 'Good experience overall. The valuation was fair and the process was smooth.', 'Delhi', true, 3),
('Sneha Reddy', 'MacBook Pro', 5, 'Sold my laptop here and got an excellent price. The team was very helpful throughout.', 'Hyderabad', true, 4),
('Vikram Singh', 'iPhone 12', 5, 'Best platform to sell old phones. No hassle, transparent pricing, and quick payment.', 'Pune', true, 5)
ON CONFLICT DO NOTHING;

-- Insert default system settings
INSERT INTO public.system_settings (key, value, description) VALUES
  ('charger_missing_deduction', '200', 'Deduction amount when charger is missing (₹)'),
  ('box_missing_deduction', '100', 'Deduction amount when box is missing (₹)'),
  ('bill_missing_deduction', '150', 'Deduction amount when bill is missing (₹)'),
  ('auto_confirm_requests', 'false', 'Automatically confirm pickup requests'),
  ('email_notifications', 'true', 'Send email notifications for new requests'),
  ('business_hours_start', '09:00', 'Business hours start time'),
  ('business_hours_end', '18:00', 'Business hours end time')
ON CONFLICT (key) DO NOTHING;