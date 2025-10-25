/*
  # Populate Warranty Prices with Monthly-Based Pricing

  ## Overview
  This migration populates the warranty_prices table with pricing based solely on device age (in months).
  The pricing is calculated as follows:
  - 0-3 months: Full base price (100%)
  - 3-6 months: 90% of base price
  - 6-11 months: 80% of base price
  - 11+ months: 65% of base price

  These prices are final and should be used directly without any additional multipliers or deductions.

  ## Strategy
  For each variant, we insert warranty pricing data that reflects realistic market values
  based purely on the age of the device. No condition-based deductions are applied in the database -
  all pricing is based solely on time-based depreciation.
*/

-- Insert warranty prices for all variants
-- This calculates prices based purely on age groups, with no additional multipliers
INSERT INTO public.warranty_prices (variant_id, price_0_3_months, price_3_6_months, price_6_11_months, price_11_plus_months)
SELECT 
  v.id,
  v.base_price,                      -- 0-3 months: Full price
  ROUND(v.base_price * 0.90),        -- 3-6 months: 90% of base price
  ROUND(v.base_price * 0.80),        -- 6-11 months: 80% of base price
  ROUND(v.base_price * 0.65)         -- 11+ months: 65% of base price
FROM public.variants v
ON CONFLICT (variant_id) DO NOTHING;