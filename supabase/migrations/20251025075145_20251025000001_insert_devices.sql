/*
  # Insert Device Models
  
  1. Devices
    - Insert iPhone models (15, 14, 13, 12, 11 series)
    - Insert Samsung Galaxy models (S24, S23, Z series, A series)
    - Insert OnePlus models
    - Insert Xiaomi models
    - Insert Google Pixel models
    - Insert MacBook models (Air and Pro)
    - Insert Dell, HP, Lenovo laptop models
    - Insert iPad models (Pro, Air, Mini)
*/

-- ============= IPHONES =============
-- iPhone 15 Series
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'iPhone 15', '15', '2023-09-22'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 15 Plus', '15', '2023-09-22'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 15 Pro', '15', '2023-09-22'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 15 Pro Max', '15', '2023-09-22'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- iPhone 14 Series
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'iPhone 14', '14', '2022-09-16'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 14 Plus', '14', '2022-09-16'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 14 Pro', '14', '2022-09-16'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 14 Pro Max', '14', '2022-09-16'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- iPhone 13 Series
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'iPhone 13', '13', '2021-09-24'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 13 Mini', '13', '2021-09-24'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 13 Pro', '13', '2021-09-24'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 13 Pro Max', '13', '2021-09-24'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- iPhone 12 Series
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'iPhone 12', '12', '2020-10-23'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 12 Mini', '12', '2020-10-23'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 12 Pro', '12', '2020-10-23'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 12 Pro Max', '12', '2020-10-23'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- iPhone 11 Series
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'iPhone 11', '11', '2019-09-20'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 11 Pro', '11', '2019-09-20'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
UNION ALL SELECT id, 'iPhone 11 Pro Max', '11', '2019-09-20'::date FROM public.brands WHERE name = 'Apple' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- ============= SAMSUNG =============
-- Galaxy S24 Series
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'Galaxy S24', 'S24', '2024-01-17'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
UNION ALL SELECT id, 'Galaxy S24+', 'S24', '2024-01-17'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
UNION ALL SELECT id, 'Galaxy S24 Ultra', 'S24', '2024-01-17'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- Galaxy S23 Series
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'Galaxy S23', 'S23', '2023-02-01'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
UNION ALL SELECT id, 'Galaxy S23+', 'S23', '2023-02-01'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
UNION ALL SELECT id, 'Galaxy S23 Ultra', 'S23', '2023-02-01'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- Galaxy Z Series
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'Galaxy Z Fold 5', 'Z', '2023-08-11'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
UNION ALL SELECT id, 'Galaxy Z Flip 5', 'Z', '2023-08-11'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
UNION ALL SELECT id, 'Galaxy Z Fold 4', 'Z', '2022-08-26'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
UNION ALL SELECT id, 'Galaxy Z Flip 4', 'Z', '2022-08-26'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- Galaxy A Series
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'Galaxy A54 5G', 'A', '2023-03-24'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
UNION ALL SELECT id, 'Galaxy A34 5G', 'A', '2023-03-24'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
UNION ALL SELECT id, 'Galaxy A14 5G', 'A', '2023-01-04'::date FROM public.brands WHERE name = 'Samsung' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- ============= ONEPLUS =============
INSERT INTO public.devices (brand_id, model_name, release_date)
SELECT id, 'OnePlus 12', '2024-01-23'::date FROM public.brands WHERE name = 'OnePlus' AND category = 'phone'
UNION ALL SELECT id, 'OnePlus 12R', '2024-01-23'::date FROM public.brands WHERE name = 'OnePlus' AND category = 'phone'
UNION ALL SELECT id, 'OnePlus 11', '2023-02-07'::date FROM public.brands WHERE name = 'OnePlus' AND category = 'phone'
UNION ALL SELECT id, 'OnePlus 11R', '2023-02-07'::date FROM public.brands WHERE name = 'OnePlus' AND category = 'phone'
UNION ALL SELECT id, 'OnePlus 10 Pro', '2022-03-31'::date FROM public.brands WHERE name = 'OnePlus' AND category = 'phone'
UNION ALL SELECT id, 'OnePlus 10T', '2022-08-03'::date FROM public.brands WHERE name = 'OnePlus' AND category = 'phone'
UNION ALL SELECT id, 'OnePlus Nord 3', '2023-07-05'::date FROM public.brands WHERE name = 'OnePlus' AND category = 'phone'
UNION ALL SELECT id, 'OnePlus Nord CE 3', '2023-07-05'::date FROM public.brands WHERE name = 'OnePlus' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- ============= XIAOMI =============
INSERT INTO public.devices (brand_id, model_name, release_date)
SELECT id, 'Xiaomi 14 Pro', '2024-01-04'::date FROM public.brands WHERE name = 'Xiaomi' AND category = 'phone'
UNION ALL SELECT id, 'Xiaomi 14', '2024-01-04'::date FROM public.brands WHERE name = 'Xiaomi' AND category = 'phone'
UNION ALL SELECT id, 'Xiaomi 13 Pro', '2023-02-26'::date FROM public.brands WHERE name = 'Xiaomi' AND category = 'phone'
UNION ALL SELECT id, 'Xiaomi 13', '2023-02-26'::date FROM public.brands WHERE name = 'Xiaomi' AND category = 'phone'
UNION ALL SELECT id, 'Redmi Note 13 Pro+', '2023-09-21'::date FROM public.brands WHERE name = 'Xiaomi' AND category = 'phone'
UNION ALL SELECT id, 'Redmi Note 13 Pro', '2023-09-21'::date FROM public.brands WHERE name = 'Xiaomi' AND category = 'phone'
UNION ALL SELECT id, 'Redmi Note 12 Pro+', '2022-10-27'::date FROM public.brands WHERE name = 'Xiaomi' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- ============= GOOGLE PIXEL =============
INSERT INTO public.devices (brand_id, model_name, release_date)
SELECT id, 'Pixel 8 Pro', '2023-10-04'::date FROM public.brands WHERE name = 'Google' AND category = 'phone'
UNION ALL SELECT id, 'Pixel 8', '2023-10-04'::date FROM public.brands WHERE name = 'Google' AND category = 'phone'
UNION ALL SELECT id, 'Pixel 7 Pro', '2022-10-06'::date FROM public.brands WHERE name = 'Google' AND category = 'phone'
UNION ALL SELECT id, 'Pixel 7', '2022-10-06'::date FROM public.brands WHERE name = 'Google' AND category = 'phone'
UNION ALL SELECT id, 'Pixel 6 Pro', '2021-10-19'::date FROM public.brands WHERE name = 'Google' AND category = 'phone'
UNION ALL SELECT id, 'Pixel 6', '2021-10-19'::date FROM public.brands WHERE name = 'Google' AND category = 'phone'
ON CONFLICT DO NOTHING;

-- ============= MACBOOKS =============
-- MacBook Air
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'MacBook Air M3 13"', 'MacBook Air', '2024-03-04'::date FROM public.brands WHERE name = 'Apple' AND category = 'laptop'
UNION ALL SELECT id, 'MacBook Air M2 13"', 'MacBook Air', '2022-07-15'::date FROM public.brands WHERE name = 'Apple' AND category = 'laptop'
UNION ALL SELECT id, 'MacBook Air M1 13"', 'MacBook Air', '2020-11-17'::date FROM public.brands WHERE name = 'Apple' AND category = 'laptop'
ON CONFLICT DO NOTHING;

-- MacBook Pro
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'MacBook Pro M3 Max 16"', 'MacBook Pro', '2023-11-07'::date FROM public.brands WHERE name = 'Apple' AND category = 'laptop'
UNION ALL SELECT id, 'MacBook Pro M3 Pro 16"', 'MacBook Pro', '2023-11-07'::date FROM public.brands WHERE name = 'Apple' AND category = 'laptop'
UNION ALL SELECT id, 'MacBook Pro M3 14"', 'MacBook Pro', '2023-11-07'::date FROM public.brands WHERE name = 'Apple' AND category = 'laptop'
UNION ALL SELECT id, 'MacBook Pro M2 Pro 16"', 'MacBook Pro', '2023-01-17'::date FROM public.brands WHERE name = 'Apple' AND category = 'laptop'
UNION ALL SELECT id, 'MacBook Pro M2 14"', 'MacBook Pro', '2022-06-23'::date FROM public.brands WHERE name = 'Apple' AND category = 'laptop'
ON CONFLICT DO NOTHING;

-- ============= DELL =============
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'Dell XPS 17', 'XPS', '2023-04-10'::date FROM public.brands WHERE name = 'Dell' AND category = 'laptop'
UNION ALL SELECT id, 'Dell XPS 15', 'XPS', '2023-04-10'::date FROM public.brands WHERE name = 'Dell' AND category = 'laptop'
UNION ALL SELECT id, 'Dell XPS 13', 'XPS', '2023-04-10'::date FROM public.brands WHERE name = 'Dell' AND category = 'laptop'
UNION ALL SELECT id, 'Dell Inspiron 15 7000', 'Inspiron', '2023-01-15'::date FROM public.brands WHERE name = 'Dell' AND category = 'laptop'
UNION ALL SELECT id, 'Dell Inspiron 15 5000', 'Inspiron', '2023-01-15'::date FROM public.brands WHERE name = 'Dell' AND category = 'laptop'
UNION ALL SELECT id, 'Dell Inspiron 14 3000', 'Inspiron', '2023-01-15'::date FROM public.brands WHERE name = 'Dell' AND category = 'laptop'
ON CONFLICT DO NOTHING;

-- ============= HP =============
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'HP Spectre x360 16"', 'Spectre', '2023-05-01'::date FROM public.brands WHERE name = 'HP' AND category = 'laptop'
UNION ALL SELECT id, 'HP Spectre x360 14"', 'Spectre', '2023-05-01'::date FROM public.brands WHERE name = 'HP' AND category = 'laptop'
UNION ALL SELECT id, 'HP Envy 17', 'Envy', '2023-03-15'::date FROM public.brands WHERE name = 'HP' AND category = 'laptop'
UNION ALL SELECT id, 'HP Envy 15', 'Envy', '2023-03-15'::date FROM public.brands WHERE name = 'HP' AND category = 'laptop'
UNION ALL SELECT id, 'HP Pavilion 15', 'Pavilion', '2023-02-01'::date FROM public.brands WHERE name = 'HP' AND category = 'laptop'
UNION ALL SELECT id, 'HP Pavilion 14', 'Pavilion', '2023-02-01'::date FROM public.brands WHERE name = 'HP' AND category = 'laptop'
ON CONFLICT DO NOTHING;

-- ============= LENOVO =============
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'Lenovo ThinkPad X1 Carbon Gen 11', 'ThinkPad', '2023-02-27'::date FROM public.brands WHERE name = 'Lenovo' AND category = 'laptop'
UNION ALL SELECT id, 'Lenovo ThinkPad X1 Yoga Gen 8', 'ThinkPad', '2023-02-27'::date FROM public.brands WHERE name = 'Lenovo' AND category = 'laptop'
UNION ALL SELECT id, 'Lenovo ThinkPad T14 Gen 4', 'ThinkPad', '2023-04-01'::date FROM public.brands WHERE name = 'Lenovo' AND category = 'laptop'
UNION ALL SELECT id, 'Lenovo IdeaPad Slim 5', 'IdeaPad', '2023-01-10'::date FROM public.brands WHERE name = 'Lenovo' AND category = 'laptop'
UNION ALL SELECT id, 'Lenovo IdeaPad Slim 3', 'IdeaPad', '2023-01-10'::date FROM public.brands WHERE name = 'Lenovo' AND category = 'laptop'
UNION ALL SELECT id, 'Lenovo Yoga 9i', 'Yoga', '2023-03-01'::date FROM public.brands WHERE name = 'Lenovo' AND category = 'laptop'
ON CONFLICT DO NOTHING;

-- ============= IPADS =============
-- iPad Pro
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'iPad Pro 12.9" M4 (2024)', 'iPad Pro', '2024-05-15'::date FROM public.brands WHERE name = 'Apple' AND category = 'ipad'
UNION ALL SELECT id, 'iPad Pro 11" M4 (2024)', 'iPad Pro', '2024-05-15'::date FROM public.brands WHERE name = 'Apple' AND category = 'ipad'
UNION ALL SELECT id, 'iPad Pro 12.9" M2 (2022)', 'iPad Pro', '2022-10-18'::date FROM public.brands WHERE name = 'Apple' AND category = 'ipad'
UNION ALL SELECT id, 'iPad Pro 11" M2 (2022)', 'iPad Pro', '2022-10-18'::date FROM public.brands WHERE name = 'Apple' AND category = 'ipad'
ON CONFLICT DO NOTHING;

-- iPad Air & iPad
INSERT INTO public.devices (brand_id, model_name, series, release_date)
SELECT id, 'iPad Air M2 (2024)', 'iPad Air', '2024-05-15'::date FROM public.brands WHERE name = 'Apple' AND category = 'ipad'
UNION ALL SELECT id, 'iPad Air M1 (2022)', 'iPad Air', '2022-03-18'::date FROM public.brands WHERE name = 'Apple' AND category = 'ipad'
UNION ALL SELECT id, 'iPad (10th Gen)', 'iPad', '2022-10-18'::date FROM public.brands WHERE name = 'Apple' AND category = 'ipad'
UNION ALL SELECT id, 'iPad (9th Gen)', 'iPad', '2021-09-24'::date FROM public.brands WHERE name = 'Apple' AND category = 'ipad'
UNION ALL SELECT id, 'iPad Mini (6th Gen)', 'iPad Mini', '2021-09-24'::date FROM public.brands WHERE name = 'Apple' AND category = 'ipad'
ON CONFLICT DO NOTHING;