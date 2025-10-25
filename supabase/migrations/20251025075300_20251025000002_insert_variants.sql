-- ============= IPHONE VARIANTS =============

-- iPhone 15 Series
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 128, 55000 FROM public.devices WHERE model_name = 'iPhone 15'
UNION ALL SELECT id, 256, 65000 FROM public.devices WHERE model_name = 'iPhone 15'
UNION ALL SELECT id, 512, 75000 FROM public.devices WHERE model_name = 'iPhone 15'
UNION ALL SELECT id, 128, 65000 FROM public.devices WHERE model_name = 'iPhone 15 Plus'
UNION ALL SELECT id, 256, 75000 FROM public.devices WHERE model_name = 'iPhone 15 Plus'
UNION ALL SELECT id, 512, 85000 FROM public.devices WHERE model_name = 'iPhone 15 Plus'
UNION ALL SELECT id, 128, 75000 FROM public.devices WHERE model_name = 'iPhone 15 Pro'
UNION ALL SELECT id, 256, 85000 FROM public.devices WHERE model_name = 'iPhone 15 Pro'
UNION ALL SELECT id, 512, 95000 FROM public.devices WHERE model_name = 'iPhone 15 Pro'
UNION ALL SELECT id, 1024, 110000 FROM public.devices WHERE model_name = 'iPhone 15 Pro'
UNION ALL SELECT id, 256, 95000 FROM public.devices WHERE model_name = 'iPhone 15 Pro Max'
UNION ALL SELECT id, 512, 105000 FROM public.devices WHERE model_name = 'iPhone 15 Pro Max'
UNION ALL SELECT id, 1024, 120000 FROM public.devices WHERE model_name = 'iPhone 15 Pro Max'
ON CONFLICT DO NOTHING;

-- iPhone 14 Series
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 128, 48000 FROM public.devices WHERE model_name = 'iPhone 14'
UNION ALL SELECT id, 256, 58000 FROM public.devices WHERE model_name = 'iPhone 14'
UNION ALL SELECT id, 512, 68000 FROM public.devices WHERE model_name = 'iPhone 14'
UNION ALL SELECT id, 128, 58000 FROM public.devices WHERE model_name = 'iPhone 14 Plus'
UNION ALL SELECT id, 256, 68000 FROM public.devices WHERE model_name = 'iPhone 14 Plus'
UNION ALL SELECT id, 512, 78000 FROM public.devices WHERE model_name = 'iPhone 14 Plus'
UNION ALL SELECT id, 128, 65000 FROM public.devices WHERE model_name = 'iPhone 14 Pro'
UNION ALL SELECT id, 256, 75000 FROM public.devices WHERE model_name = 'iPhone 14 Pro'
UNION ALL SELECT id, 512, 85000 FROM public.devices WHERE model_name = 'iPhone 14 Pro'
UNION ALL SELECT id, 256, 85000 FROM public.devices WHERE model_name = 'iPhone 14 Pro Max'
UNION ALL SELECT id, 512, 95000 FROM public.devices WHERE model_name = 'iPhone 14 Pro Max'
UNION ALL SELECT id, 1024, 105000 FROM public.devices WHERE model_name = 'iPhone 14 Pro Max'
ON CONFLICT DO NOTHING;

-- iPhone 13 Series
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 128, 42000 FROM public.devices WHERE model_name = 'iPhone 13'
UNION ALL SELECT id, 256, 52000 FROM public.devices WHERE model_name = 'iPhone 13'
UNION ALL SELECT id, 512, 62000 FROM public.devices WHERE model_name = 'iPhone 13'
UNION ALL SELECT id, 128, 38000 FROM public.devices WHERE model_name = 'iPhone 13 Mini'
UNION ALL SELECT id, 256, 48000 FROM public.devices WHERE model_name = 'iPhone 13 Mini'
UNION ALL SELECT id, 128, 58000 FROM public.devices WHERE model_name = 'iPhone 13 Pro'
UNION ALL SELECT id, 256, 68000 FROM public.devices WHERE model_name = 'iPhone 13 Pro'
UNION ALL SELECT id, 512, 78000 FROM public.devices WHERE model_name = 'iPhone 13 Pro'
UNION ALL SELECT id, 256, 75000 FROM public.devices WHERE model_name = 'iPhone 13 Pro Max'
UNION ALL SELECT id, 512, 85000 FROM public.devices WHERE model_name = 'iPhone 13 Pro Max'
ON CONFLICT DO NOTHING;

-- iPhone 12 Series
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 64, 32000 FROM public.devices WHERE model_name = 'iPhone 12'
UNION ALL SELECT id, 128, 38000 FROM public.devices WHERE model_name = 'iPhone 12'
UNION ALL SELECT id, 256, 45000 FROM public.devices WHERE model_name = 'iPhone 12'
UNION ALL SELECT id, 64, 28000 FROM public.devices WHERE model_name = 'iPhone 12 Mini'
UNION ALL SELECT id, 128, 34000 FROM public.devices WHERE model_name = 'iPhone 12 Mini'
UNION ALL SELECT id, 128, 48000 FROM public.devices WHERE model_name = 'iPhone 12 Pro'
UNION ALL SELECT id, 256, 55000 FROM public.devices WHERE model_name = 'iPhone 12 Pro'
UNION ALL SELECT id, 512, 62000 FROM public.devices WHERE model_name = 'iPhone 12 Pro'
UNION ALL SELECT id, 128, 52000 FROM public.devices WHERE model_name = 'iPhone 12 Pro Max'
UNION ALL SELECT id, 256, 60000 FROM public.devices WHERE model_name = 'iPhone 12 Pro Max'
ON CONFLICT DO NOTHING;

-- iPhone 11 Series
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 64, 25000 FROM public.devices WHERE model_name = 'iPhone 11'
UNION ALL SELECT id, 128, 30000 FROM public.devices WHERE model_name = 'iPhone 11'
UNION ALL SELECT id, 64, 35000 FROM public.devices WHERE model_name = 'iPhone 11 Pro'
UNION ALL SELECT id, 256, 42000 FROM public.devices WHERE model_name = 'iPhone 11 Pro'
UNION ALL SELECT id, 64, 38000 FROM public.devices WHERE model_name = 'iPhone 11 Pro Max'
UNION ALL SELECT id, 256, 45000 FROM public.devices WHERE model_name = 'iPhone 11 Pro Max'
ON CONFLICT DO NOTHING;

-- ============= SAMSUNG VARIANTS =============

-- Galaxy S24 Series
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 256, 50000 FROM public.devices WHERE model_name = 'Galaxy S24'
UNION ALL SELECT id, 512, 58000 FROM public.devices WHERE model_name = 'Galaxy S24'
UNION ALL SELECT id, 256, 60000 FROM public.devices WHERE model_name = 'Galaxy S24+'
UNION ALL SELECT id, 512, 68000 FROM public.devices WHERE model_name = 'Galaxy S24+'
UNION ALL SELECT id, 256, 80000 FROM public.devices WHERE model_name = 'Galaxy S24 Ultra'
UNION ALL SELECT id, 512, 90000 FROM public.devices WHERE model_name = 'Galaxy S24 Ultra'
UNION ALL SELECT id, 1024, 105000 FROM public.devices WHERE model_name = 'Galaxy S24 Ultra'
ON CONFLICT DO NOTHING;

-- Galaxy S23 Series
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 128, 42000 FROM public.devices WHERE model_name = 'Galaxy S23'
UNION ALL SELECT id, 256, 50000 FROM public.devices WHERE model_name = 'Galaxy S23'
UNION ALL SELECT id, 256, 58000 FROM public.devices WHERE model_name = 'Galaxy S23+'
UNION ALL SELECT id, 512, 65000 FROM public.devices WHERE model_name = 'Galaxy S23+'
UNION ALL SELECT id, 256, 65000 FROM public.devices WHERE model_name = 'Galaxy S23 Ultra'
UNION ALL SELECT id, 512, 75000 FROM public.devices WHERE model_name = 'Galaxy S23 Ultra'
UNION ALL SELECT id, 1024, 85000 FROM public.devices WHERE model_name = 'Galaxy S23 Ultra'
ON CONFLICT DO NOTHING;

-- Galaxy Z Series
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 256, 95000 FROM public.devices WHERE model_name = 'Galaxy Z Fold 5'
UNION ALL SELECT id, 512, 110000 FROM public.devices WHERE model_name = 'Galaxy Z Fold 5'
UNION ALL SELECT id, 256, 65000 FROM public.devices WHERE model_name = 'Galaxy Z Flip 5'
UNION ALL SELECT id, 512, 75000 FROM public.devices WHERE model_name = 'Galaxy Z Flip 5'
UNION ALL SELECT id, 256, 85000 FROM public.devices WHERE model_name = 'Galaxy Z Fold 4'
UNION ALL SELECT id, 512, 95000 FROM public.devices WHERE model_name = 'Galaxy Z Fold 4'
UNION ALL SELECT id, 256, 58000 FROM public.devices WHERE model_name = 'Galaxy Z Flip 4'
ON CONFLICT DO NOTHING;

-- Galaxy A Series
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 128, 28000 FROM public.devices WHERE model_name = 'Galaxy A54 5G'
UNION ALL SELECT id, 256, 32000 FROM public.devices WHERE model_name = 'Galaxy A54 5G'
UNION ALL SELECT id, 128, 22000 FROM public.devices WHERE model_name = 'Galaxy A34 5G'
UNION ALL SELECT id, 128, 15000 FROM public.devices WHERE model_name = 'Galaxy A14 5G'
ON CONFLICT DO NOTHING;

-- ============= ONEPLUS VARIANTS =============

INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 128, 40000 FROM public.devices WHERE model_name = 'OnePlus 12'
UNION ALL SELECT id, 256, 48000 FROM public.devices WHERE model_name = 'OnePlus 12'
UNION ALL SELECT id, 128, 32000 FROM public.devices WHERE model_name = 'OnePlus 12R'
UNION ALL SELECT id, 256, 38000 FROM public.devices WHERE model_name = 'OnePlus 12R'
UNION ALL SELECT id, 128, 35000 FROM public.devices WHERE model_name = 'OnePlus 11'
UNION ALL SELECT id, 256, 42000 FROM public.devices WHERE model_name = 'OnePlus 11'
UNION ALL SELECT id, 128, 28000 FROM public.devices WHERE model_name = 'OnePlus 11R'
UNION ALL SELECT id, 256, 34000 FROM public.devices WHERE model_name = 'OnePlus 11R'
UNION ALL SELECT id, 128, 30000 FROM public.devices WHERE model_name = 'OnePlus 10 Pro'
UNION ALL SELECT id, 256, 36000 FROM public.devices WHERE model_name = 'OnePlus 10 Pro'
UNION ALL SELECT id, 128, 25000 FROM public.devices WHERE model_name = 'OnePlus 10T'
UNION ALL SELECT id, 128, 22000 FROM public.devices WHERE model_name = 'OnePlus Nord 3'
UNION ALL SELECT id, 256, 28000 FROM public.devices WHERE model_name = 'OnePlus Nord 3'
UNION ALL SELECT id, 128, 18000 FROM public.devices WHERE model_name = 'OnePlus Nord CE 3'
ON CONFLICT DO NOTHING;

-- ============= XIAOMI & GOOGLE VARIANTS =============

-- Xiaomi
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 256, 42000 FROM public.devices WHERE model_name = 'Xiaomi 14 Pro'
UNION ALL SELECT id, 512, 50000 FROM public.devices WHERE model_name = 'Xiaomi 14 Pro'
UNION ALL SELECT id, 128, 35000 FROM public.devices WHERE model_name = 'Xiaomi 14'
UNION ALL SELECT id, 256, 40000 FROM public.devices WHERE model_name = 'Xiaomi 14'
UNION ALL SELECT id, 128, 32000 FROM public.devices WHERE model_name = 'Xiaomi 13 Pro'
UNION ALL SELECT id, 256, 38000 FROM public.devices WHERE model_name = 'Xiaomi 13 Pro'
UNION ALL SELECT id, 128, 28000 FROM public.devices WHERE model_name = 'Xiaomi 13'
UNION ALL SELECT id, 128, 18000 FROM public.devices WHERE model_name = 'Redmi Note 13 Pro+'
UNION ALL SELECT id, 256, 22000 FROM public.devices WHERE model_name = 'Redmi Note 13 Pro+'
UNION ALL SELECT id, 128, 15000 FROM public.devices WHERE model_name = 'Redmi Note 13 Pro'
UNION ALL SELECT id, 128, 14000 FROM public.devices WHERE model_name = 'Redmi Note 12 Pro+'
ON CONFLICT DO NOTHING;

-- Google Pixel
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 128, 58000 FROM public.devices WHERE model_name = 'Pixel 8 Pro'
UNION ALL SELECT id, 256, 65000 FROM public.devices WHERE model_name = 'Pixel 8 Pro'
UNION ALL SELECT id, 512, 75000 FROM public.devices WHERE model_name = 'Pixel 8 Pro'
UNION ALL SELECT id, 128, 45000 FROM public.devices WHERE model_name = 'Pixel 8'
UNION ALL SELECT id, 256, 52000 FROM public.devices WHERE model_name = 'Pixel 8'
UNION ALL SELECT id, 128, 48000 FROM public.devices WHERE model_name = 'Pixel 7 Pro'
UNION ALL SELECT id, 256, 55000 FROM public.devices WHERE model_name = 'Pixel 7 Pro'
UNION ALL SELECT id, 128, 38000 FROM public.devices WHERE model_name = 'Pixel 7'
UNION ALL SELECT id, 128, 40000 FROM public.devices WHERE model_name = 'Pixel 6 Pro'
UNION ALL SELECT id, 128, 32000 FROM public.devices WHERE model_name = 'Pixel 6'
ON CONFLICT DO NOTHING;

-- ============= MACBOOK VARIANTS =============

-- MacBook Air
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 256, 75000 FROM public.devices WHERE model_name = 'MacBook Air M3 13"'
UNION ALL SELECT id, 512, 90000 FROM public.devices WHERE model_name = 'MacBook Air M3 13"'
UNION ALL SELECT id, 256, 65000 FROM public.devices WHERE model_name = 'MacBook Air M2 13"'
UNION ALL SELECT id, 512, 80000 FROM public.devices WHERE model_name = 'MacBook Air M2 13"'
UNION ALL SELECT id, 256, 52000 FROM public.devices WHERE model_name = 'MacBook Air M1 13"'
UNION ALL SELECT id, 512, 65000 FROM public.devices WHERE model_name = 'MacBook Air M1 13"'
ON CONFLICT DO NOTHING;

-- MacBook Pro
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 512, 160000 FROM public.devices WHERE model_name = 'MacBook Pro M3 Max 16"'
UNION ALL SELECT id, 1024, 190000 FROM public.devices WHERE model_name = 'MacBook Pro M3 Max 16"'
UNION ALL SELECT id, 512, 140000 FROM public.devices WHERE model_name = 'MacBook Pro M3 Pro 16"'
UNION ALL SELECT id, 1024, 170000 FROM public.devices WHERE model_name = 'MacBook Pro M3 Pro 16"'
UNION ALL SELECT id, 512, 120000 FROM public.devices WHERE model_name = 'MacBook Pro M3 14"'
UNION ALL SELECT id, 1024, 140000 FROM public.devices WHERE model_name = 'MacBook Pro M3 14"'
UNION ALL SELECT id, 512, 110000 FROM public.devices WHERE model_name = 'MacBook Pro M2 Pro 16"'
UNION ALL SELECT id, 1024, 140000 FROM public.devices WHERE model_name = 'MacBook Pro M2 Pro 16"'
UNION ALL SELECT id, 256, 95000 FROM public.devices WHERE model_name = 'MacBook Pro M2 14"'
UNION ALL SELECT id, 512, 110000 FROM public.devices WHERE model_name = 'MacBook Pro M2 14"'
ON CONFLICT DO NOTHING;

-- ============= DELL, HP, LENOVO VARIANTS =============

-- Dell
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 512, 75000 FROM public.devices WHERE model_name = 'Dell XPS 17'
UNION ALL SELECT id, 1024, 95000 FROM public.devices WHERE model_name = 'Dell XPS 17'
UNION ALL SELECT id, 256, 52000 FROM public.devices WHERE model_name = 'Dell XPS 15'
UNION ALL SELECT id, 512, 65000 FROM public.devices WHERE model_name = 'Dell XPS 15'
UNION ALL SELECT id, 256, 45000 FROM public.devices WHERE model_name = 'Dell XPS 13'
UNION ALL SELECT id, 512, 55000 FROM public.devices WHERE model_name = 'Dell XPS 13'
UNION ALL SELECT id, 512, 42000 FROM public.devices WHERE model_name = 'Dell Inspiron 15 7000'
UNION ALL SELECT id, 512, 35000 FROM public.devices WHERE model_name = 'Dell Inspiron 15 5000'
UNION ALL SELECT id, 256, 25000 FROM public.devices WHERE model_name = 'Dell Inspiron 14 3000'
ON CONFLICT DO NOTHING;

-- HP
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 512, 70000 FROM public.devices WHERE model_name = 'HP Spectre x360 16"'
UNION ALL SELECT id, 1024, 85000 FROM public.devices WHERE model_name = 'HP Spectre x360 16"'
UNION ALL SELECT id, 512, 62000 FROM public.devices WHERE model_name = 'HP Spectre x360 14"'
UNION ALL SELECT id, 512, 52000 FROM public.devices WHERE model_name = 'HP Envy 17'
UNION ALL SELECT id, 512, 48000 FROM public.devices WHERE model_name = 'HP Envy 15'
UNION ALL SELECT id, 256, 30000 FROM public.devices WHERE model_name = 'HP Pavilion 15'
UNION ALL SELECT id, 512, 38000 FROM public.devices WHERE model_name = 'HP Pavilion 15'
UNION ALL SELECT id, 256, 28000 FROM public.devices WHERE model_name = 'HP Pavilion 14'
ON CONFLICT DO NOTHING;

-- Lenovo
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 256, 58000 FROM public.devices WHERE model_name = 'Lenovo ThinkPad X1 Carbon Gen 11'
UNION ALL SELECT id, 512, 70000 FROM public.devices WHERE model_name = 'Lenovo ThinkPad X1 Carbon Gen 11'
UNION ALL SELECT id, 512, 68000 FROM public.devices WHERE model_name = 'Lenovo ThinkPad X1 Yoga Gen 8'
UNION ALL SELECT id, 256, 48000 FROM public.devices WHERE model_name = 'Lenovo ThinkPad T14 Gen 4'
UNION ALL SELECT id, 512, 58000 FROM public.devices WHERE model_name = 'Lenovo ThinkPad T14 Gen 4'
UNION ALL SELECT id, 512, 42000 FROM public.devices WHERE model_name = 'Lenovo IdeaPad Slim 5'
UNION ALL SELECT id, 256, 28000 FROM public.devices WHERE model_name = 'Lenovo IdeaPad Slim 3'
UNION ALL SELECT id, 512, 65000 FROM public.devices WHERE model_name = 'Lenovo Yoga 9i'
ON CONFLICT DO NOTHING;

-- ============= IPAD VARIANTS =============

-- iPad Pro
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 256, 75000 FROM public.devices WHERE model_name = 'iPad Pro 12.9" M4 (2024)'
UNION ALL SELECT id, 512, 90000 FROM public.devices WHERE model_name = 'iPad Pro 12.9" M4 (2024)'
UNION ALL SELECT id, 1024, 110000 FROM public.devices WHERE model_name = 'iPad Pro 12.9" M4 (2024)'
UNION ALL SELECT id, 128, 60000 FROM public.devices WHERE model_name = 'iPad Pro 11" M4 (2024)'
UNION ALL SELECT id, 256, 70000 FROM public.devices WHERE model_name = 'iPad Pro 11" M4 (2024)'
UNION ALL SELECT id, 512, 85000 FROM public.devices WHERE model_name = 'iPad Pro 11" M4 (2024)'
UNION ALL SELECT id, 128, 58000 FROM public.devices WHERE model_name = 'iPad Pro 12.9" M2 (2022)'
UNION ALL SELECT id, 256, 68000 FROM public.devices WHERE model_name = 'iPad Pro 12.9" M2 (2022)'
UNION ALL SELECT id, 128, 52000 FROM public.devices WHERE model_name = 'iPad Pro 11" M2 (2022)'
UNION ALL SELECT id, 256, 62000 FROM public.devices WHERE model_name = 'iPad Pro 11" M2 (2022)'
ON CONFLICT DO NOTHING;

-- iPad Air & iPad
INSERT INTO public.variants (device_id, storage_gb, base_price)
SELECT id, 128, 45000 FROM public.devices WHERE model_name = 'iPad Air M2 (2024)'
UNION ALL SELECT id, 256, 55000 FROM public.devices WHERE model_name = 'iPad Air M2 (2024)'
UNION ALL SELECT id, 64, 38000 FROM public.devices WHERE model_name = 'iPad Air M1 (2022)'
UNION ALL SELECT id, 256, 48000 FROM public.devices WHERE model_name = 'iPad Air M1 (2022)'
UNION ALL SELECT id, 64, 30000 FROM public.devices WHERE model_name = 'iPad (10th Gen)'
UNION ALL SELECT id, 256, 40000 FROM public.devices WHERE model_name = 'iPad (10th Gen)'
UNION ALL SELECT id, 64, 25000 FROM public.devices WHERE model_name = 'iPad (9th Gen)'
UNION ALL SELECT id, 64, 32000 FROM public.devices WHERE model_name = 'iPad Mini (6th Gen)'
UNION ALL SELECT id, 256, 42000 FROM public.devices WHERE model_name = 'iPad Mini (6th Gen)'
ON CONFLICT DO NOTHING;