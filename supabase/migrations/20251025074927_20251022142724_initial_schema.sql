-- Create categories enum
DO $$ BEGIN
  CREATE TYPE device_category AS ENUM ('phone', 'laptop', 'ipad');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create condition enum
DO $$ BEGIN
  CREATE TYPE device_condition AS ENUM ('excellent', 'good', 'fair', 'poor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create age group enum
DO $$ BEGIN
  CREATE TYPE age_group AS ENUM ('0-3', '3-6', '6-11', '12+');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category device_category NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create devices table
CREATE TABLE IF NOT EXISTS public.devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE NOT NULL,
  series TEXT,
  model_name TEXT NOT NULL,
  release_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create variants table
CREATE TABLE IF NOT EXISTS public.variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE NOT NULL,
  storage_gb INTEGER NOT NULL,
  base_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cities table
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pickup_requests table
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
  final_price DECIMAL(10, 2) NOT NULL,
  customer_name TEXT NOT NULL,
  address TEXT NOT NULL,
  pincode TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickup_requests ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view brands" ON public.brands;
DROP POLICY IF EXISTS "Public can view devices" ON public.devices;
DROP POLICY IF EXISTS "Public can view variants" ON public.variants;
DROP POLICY IF EXISTS "Public can view cities" ON public.cities;
DROP POLICY IF EXISTS "Anyone can create pickup request" ON public.pickup_requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON public.pickup_requests;

-- RLS Policies - Allow public read access for catalogs
CREATE POLICY "Public can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public can view devices" ON public.devices FOR SELECT USING (true);
CREATE POLICY "Public can view variants" ON public.variants FOR SELECT USING (true);
CREATE POLICY "Public can view cities" ON public.cities FOR SELECT USING (true);

-- RLS Policies - Allow anyone to insert pickup requests (since we use phone verification)
CREATE POLICY "Anyone can create pickup request" ON public.pickup_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own requests" ON public.pickup_requests FOR SELECT USING (true);

-- Insert brands for phones
INSERT INTO public.brands (category, name, logo_url) VALUES
('phone', 'Apple', 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop'),
('phone', 'Samsung', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&h=100&fit=crop'),
('phone', 'OnePlus', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop'),
('phone', 'Xiaomi', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop'),
('phone', 'Vivo', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop'),
('phone', 'Oppo', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop'),
('phone', 'Realme', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop'),
('phone', 'Google', 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?w=100&h=100&fit=crop'),
('phone', 'Motorola', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop'),
('phone', 'Nothing', 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=100&h=100&fit=crop')
ON CONFLICT DO NOTHING;

-- Insert brands for laptops
INSERT INTO public.brands (category, name, logo_url) VALUES
('laptop', 'Apple', 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop'),
('laptop', 'Dell', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop'),
('laptop', 'HP', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop'),
('laptop', 'Lenovo', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop'),
('laptop', 'Asus', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop'),
('laptop', 'Acer', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop'),
('laptop', 'MSI', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=100&h=100&fit=crop')
ON CONFLICT DO NOTHING;

-- Insert brands for iPads
INSERT INTO public.brands (category, name, logo_url) VALUES
('ipad', 'Apple', 'https://images.unsplash.com/photo-1621768216002-5ac171876625?w=100&h=100&fit=crop')
ON CONFLICT DO NOTHING;

-- Insert cities
INSERT INTO public.cities (name) VALUES
('Mumbai'),
('Delhi'),
('Bangalore'),
('Hyderabad'),
('Chennai'),
('Kolkata'),
('Pune'),
('Ahmedabad'),
('Jaipur'),
('Surat')
ON CONFLICT DO NOTHING;