/*
  # Add Warranty Prices Table and Update Condition Fields

  ## New Tables
  - `warranty_prices`
    - `id` (uuid, primary key)
    - `variant_id` (uuid, foreign key to variants)
    - `price_0_3_months` (decimal) - Price for devices 0-3 months old
    - `price_3_6_months` (decimal) - Price for devices 3-6 months old
    - `price_6_11_months` (decimal) - Price for devices 6-11 months old
    - `price_11_plus_months` (decimal) - Price for devices 11+ months old
    - `created_at` (timestamp)
  
  - `reviews`
    - `id` (uuid, primary key)
    - `customer_name` (text) - Name of the customer
    - `device_name` (text) - Name of device sold
    - `rating` (integer) - Rating from 1-5
    - `review_text` (text) - Review content
    - `location` (text) - Customer location
    - `is_featured` (boolean) - Whether to feature on homepage
    - `created_at` (timestamp)
  
  ## Modified Tables
  - `pickup_requests`
    - Add `can_make_calls` (boolean) - Device can make and receive calls
    - Add `is_touch_working` (boolean) - Touch screen is working properly
    - Add `is_screen_original` (boolean) - Screen is original or replaced by authorized service
    - Add `is_battery_healthy` (boolean) - Battery health is above 80%
    - Add `overall_condition` (text) - Overall device condition (good/average/below-average)
  
  ## Security
  - Enable RLS on warranty_prices table
  - Add policy for public read access to warranty_prices
  - Enable RLS on reviews table
  - Add policy for public read access to reviews
*/

-- Create warranty_prices table
CREATE TABLE IF NOT EXISTS public.warranty_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID REFERENCES public.variants(id) ON DELETE CASCADE NOT NULL UNIQUE,
  price_0_3_months DECIMAL(10, 2) NOT NULL,
  price_3_6_months DECIMAL(10, 2) NOT NULL,
  price_6_11_months DECIMAL(10, 2) NOT NULL,
  price_11_plus_months DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new condition question fields to pickup_requests
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pickup_requests' AND column_name = 'can_make_calls'
  ) THEN
    ALTER TABLE public.pickup_requests ADD COLUMN can_make_calls BOOLEAN DEFAULT TRUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pickup_requests' AND column_name = 'is_touch_working'
  ) THEN
    ALTER TABLE public.pickup_requests ADD COLUMN is_touch_working BOOLEAN DEFAULT TRUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pickup_requests' AND column_name = 'is_screen_original'
  ) THEN
    ALTER TABLE public.pickup_requests ADD COLUMN is_screen_original BOOLEAN DEFAULT TRUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pickup_requests' AND column_name = 'is_battery_healthy'
  ) THEN
    ALTER TABLE public.pickup_requests ADD COLUMN is_battery_healthy BOOLEAN DEFAULT TRUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pickup_requests' AND column_name = 'overall_condition'
  ) THEN
    ALTER TABLE public.pickup_requests ADD COLUMN overall_condition TEXT DEFAULT 'good';
  END IF;
END $$;

-- Enable RLS on warranty_prices
ALTER TABLE public.warranty_prices ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view warranty prices" ON public.warranty_prices;

-- Allow public read access to warranty_prices
CREATE POLICY "Public can view warranty prices" 
  ON public.warranty_prices 
  FOR SELECT 
  USING (true);

-- Create reviews table for customer testimonials
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  device_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  location TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reviews
DROP POLICY IF EXISTS "Public can view reviews" ON public.reviews;
CREATE POLICY "Public can view reviews" 
  ON public.reviews 
  FOR SELECT 
  USING (true);

-- Insert sample reviews
INSERT INTO public.reviews (customer_name, device_name, rating, review_text, location, is_featured) VALUES
('Rajesh Kumar', 'iPhone 14 Pro', 5, 'Excellent service! Got a great price for my phone and the pickup was smooth. Highly recommend SellkarIndia.', 'Mumbai', true),
('Priya Sharma', 'MacBook Air M2', 5, 'Very professional team. They offered the best price compared to other platforms. Transaction was quick and transparent.', 'Bangalore', true),
('Amit Patel', 'Samsung Galaxy S23', 5, 'Sold my phone within 24 hours. The entire process was hassle-free and I received payment immediately after verification.', 'Delhi', true),
('Sneha Reddy', 'iPad Pro', 4, 'Good experience overall. The valuation was fair and the pickup agent was very courteous. Will use again!', 'Hyderabad', true),
('Vikram Singh', 'OnePlus 11', 5, 'Best platform to sell old gadgets. Got instant payment and the team was very helpful throughout the process.', 'Pune', true),
('Divya Nair', 'iPhone 13', 5, 'Trustworthy service! I was skeptical at first but they exceeded my expectations. Quick, easy, and reliable.', 'Chennai', true)
ON CONFLICT DO NOTHING;