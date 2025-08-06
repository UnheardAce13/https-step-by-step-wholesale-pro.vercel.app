-- Create wholesaler_profiles table for additional wholesaler information
CREATE TABLE IF NOT EXISTS public.wholesaler_profiles (
    id UUID REFERENCES public.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
    company_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    website TEXT,
    bio TEXT,
    investment_areas TEXT[], -- e.g., ['Dallas, TX', 'Houston, TX']
    property_types TEXT[], -- e.g., ['Single Family', 'Multi-Family']
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_wholesaler_profiles_user_id ON public.wholesaler_profiles(id);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.wholesaler_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Wholesalers can view their own profile" ON public.wholesaler_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Wholesalers can update their own profile" ON public.wholesaler_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Wholesalers can create their own profile" ON public.wholesaler_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Optional: Allow investors to view wholesaler profiles (read-only)
CREATE POLICY "Investors can view wholesaler profiles" ON public.wholesaler_profiles FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'investor'));

-- Update the promo_codes table to include wholesaler/investor specific codes
ALTER TABLE promo_codes 
ADD COLUMN IF NOT EXISTS created_by_admin UUID REFERENCES users(id),
ADD COLUMN IF NOT EXISTS campaign_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS description TEXT;

-- Create some sample promo codes for testing
INSERT INTO promo_codes (code, type, duration, uses_remaining, expires_at, campaign_name, description) VALUES
('WS12345678', 'wholesaler', '30-day', 100, NOW() + INTERVAL '90 days', 'Launch Campaign', '30-day trial for new wholesalers'),
('WS87654321', 'wholesaler', '7-day', 50, NOW() + INTERVAL '30 days', 'Quick Trial', '7-day trial for testing'),
('INV11111111', 'investor', '30-day', 75, NOW() + INTERVAL '60 days', 'Investor Launch', '30-day trial for new investors'),
('WS99999999', 'wholesaler', '90-day', 25, NOW() + INTERVAL '120 days', 'Premium Trial', '90-day extended trial');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for wholesaler_profiles
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_wholesaler_profiles_updated_at') THEN
        CREATE TRIGGER set_wholesaler_profiles_updated_at
        BEFORE UPDATE ON public.wholesaler_profiles
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Insert sample wholesaler profiles
INSERT INTO public.wholesaler_profiles (id, company_name, contact_phone, contact_email, website, bio, investment_areas, property_types)
VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Acme Wholesalers Inc.', '555-123-4567', 'john.doe@example.com', 'http://www.acmewholesalers.com', 'We specialize in flipping properties.', ARRAY['Dallas, TX', 'Houston, TX'], ARRAY['Single Family', 'Multi-Family'])
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  contact_phone = EXCLUDED.contact_phone,
  contact_email = EXCLUDED.contact_email,
  website = EXCLUDED.website,
  bio = EXCLUDED.bio,
  investment_areas = EXCLUDED.investment_areas,
  property_types = EXCLUDED.property_types;

-- You can add more sample wholesaler profiles here
INSERT INTO public.wholesaler_profiles (id, company_name, contact_phone, contact_email, website, bio, investment_areas, property_types)
VALUES
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Global Property Deals', '555-987-6543', 'jane.smith@example.com', 'http://www.globalpropertydeals.com', 'We focus on commercial and land investments.', ARRAY['New York, NY', 'Los Angeles, CA'], ARRAY['Commercial', 'Land'])
ON CONFLICT (id) DO UPDATE SET
  company_name = EXCLUDED.company_name,
  contact_phone = EXCLUDED.contact_phone,
  contact_email = EXCLUDED.contact_email,
  website = EXCLUDED.website,
  bio = EXCLUDED.bio,
  investment_areas = EXCLUDED.investment_areas,
  property_types = EXCLUDED.property_types;

-- Insert additional wholesaler profiles
INSERT INTO public.wholesaler_profiles (id, company_name, property_types)
VALUES
  ((SELECT id FROM public.users WHERE email = 'wholesaler1@example.com'), 'Acme Wholesalers', ARRAY['Single Family', 'Multi-Family']),
  ((SELECT id FROM public.users WHERE email = 'wholesaler2@example.com'), 'Property Flippers LLC', ARRAY['Commercial', 'Land']);

-- Insert new wholesaler profiles
INSERT INTO wholesaler_profiles (id)
VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'), -- Example user ID 1
('b1cdef00-0d1c-4fe9-cc7e-7cc0ce491b22'); -- Example user ID 2

-- Additional wholesaler profiles insertion
INSERT INTO wholesaler_profiles (id)
VALUES
('<USER_ID_1>'), -- Example user ID 1
('<USER_ID_2>'); -- Example user ID 2

-- Insert a sample wholesaler user
INSERT INTO public.users (id, email, role)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'wholesaler@example.com', 'wholesaler')
ON CONFLICT (id) DO UPDATE SET role = 'wholesaler';

-- Insert a sample profile for the wholesaler
INSERT INTO public.profiles (id, username, full_name, website, avatar_url, role)
VALUES
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'wholesaler_user', 'Wholesaler Pro', 'https://wholesalerpro.com', NULL, 'wholesaler')
ON CONFLICT (id) DO UPDATE SET username = EXCLUDED.username, full_name = EXCLUDED.full_name, website = EXCLUDED.website, avatar_url = EXCLUDED.avatar_url, role = EXCLUDED.role;
