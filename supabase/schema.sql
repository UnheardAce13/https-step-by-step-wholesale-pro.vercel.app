-- S.B.S.W.P 2.0 - SUPABASE DATABASE SCHEMA
-- Advanced user management with role-based access control

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM (
  'admin',
  'wholesaler', 
  'investor',
  'agent',
  'vendor',
  'guest'
);

CREATE TYPE user_status AS ENUM (
  'active',
  'inactive',
  'pending',
  'suspended',
  'banned'
);

CREATE TYPE subscription_tier AS ENUM (
  'free',
  'basic',
  'pro',
  'enterprise',
  'platinum'
);

CREATE TYPE verification_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE document_type AS ENUM (
  'identity',
  'business',
  'license',
  'insurance',
  'financial'
);

-- User profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  company TEXT,
  website TEXT,
  linkedin TEXT,
  
  -- Location
  city TEXT,
  state TEXT,
  country TEXT,
  timezone TEXT,
  
  -- Role and Status
  role user_role NOT NULL DEFAULT 'guest',
  status user_status NOT NULL DEFAULT 'pending',
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  
  -- Experience
  years_in_real_estate INTEGER DEFAULT 0,
  specializations TEXT[] DEFAULT '{}',
  total_deals INTEGER DEFAULT 0,
  total_volume BIGINT DEFAULT 0,
  
  -- Preferences
  investment_types TEXT[] DEFAULT '{}',
  price_range NUMRANGE DEFAULT '[0,1000000]',
  preferred_locations TEXT[] DEFAULT '{}',
  communication_style TEXT DEFAULT 'email',
  marketing_opt_in BOOLEAN DEFAULT false,
  
  -- Settings
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT true,
  sms_notifications BOOLEAN DEFAULT false,
  marketing_notifications BOOLEAN DEFAULT false,
  profile_visible BOOLEAN DEFAULT true,
  contact_info_visible BOOLEAN DEFAULT false,
  activity_visible BOOLEAN DEFAULT false,
  dashboard_layout TEXT DEFAULT 'default',
  dashboard_widgets TEXT[] DEFAULT '{}',
  default_view TEXT DEFAULT 'overview',
  
  -- Verification
  phone_verified BOOLEAN DEFAULT false,
  identity_verified BOOLEAN DEFAULT false,
  business_verified BOOLEAN DEFAULT false,
  license_verified BOOLEAN DEFAULT false,
  
  -- Security
  two_factor_enabled BOOLEAN DEFAULT false,
  login_attempts INTEGER DEFAULT 0,
  last_password_change TIMESTAMPTZ DEFAULT now(),
  
  -- Metadata
  source TEXT DEFAULT 'direct',
  referrer TEXT,
  referral_code TEXT,
  onboarding_completed BOOLEAN DEFAULT false,
  tour_completed BOOLEAN DEFAULT false,
  last_feature_update TEXT DEFAULT '',
  experiment_groups TEXT[] DEFAULT '{}',
  custom_fields JSONB DEFAULT '{}',
  
  -- Timestamps
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Verification documents table
CREATE TABLE verification_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type document_type NOT NULL,
  status verification_status NOT NULL DEFAULT 'pending',
  url TEXT NOT NULL,
  filename TEXT,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES profiles(id),
  rejection_reason TEXT,
  notes TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Security questions table
CREATE TABLE security_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer_hash TEXT NOT NULL, -- hashed answer
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Trusted devices table
CREATE TABLE trusted_devices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  device_type TEXT,
  browser TEXT,
  operating_system TEXT,
  device_fingerprint TEXT UNIQUE,
  ip_address INET,
  location TEXT,
  added_at TIMESTAMPTZ DEFAULT now(),
  last_used_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Active sessions table
CREATE TABLE active_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  device_info TEXT,
  browser TEXT,
  operating_system TEXT,
  ip_address INET,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_activity TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true
);

-- User activities/audit log table
CREATE TABLE user_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Subscription history table
CREATE TABLE subscription_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  tier subscription_tier NOT NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  stripe_subscription_id TEXT,
  stripe_customer_id TEXT,
  amount_paid DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_status ON profiles(status);
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);
CREATE INDEX idx_profiles_updated_at ON profiles(updated_at);

CREATE INDEX idx_verification_documents_user_id ON verification_documents(user_id);
CREATE INDEX idx_verification_documents_type ON verification_documents(type);
CREATE INDEX idx_verification_documents_status ON verification_documents(status);

CREATE INDEX idx_trusted_devices_user_id ON trusted_devices(user_id);
CREATE INDEX idx_trusted_devices_fingerprint ON trusted_devices(device_fingerprint);

CREATE INDEX idx_active_sessions_user_id ON active_sessions(user_id);
CREATE INDEX idx_active_sessions_token ON active_sessions(session_token);
CREATE INDEX idx_active_sessions_expires_at ON active_sessions(expires_at);

CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_action ON user_activities(action);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at);

CREATE INDEX idx_subscription_history_user_id ON subscription_history(user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_documents_updated_at 
  BEFORE UPDATE ON verification_documents 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'firstName', ''),
    COALESCE(NEW.raw_user_meta_data->>'lastName', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trusted_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_history ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Verification documents policies
CREATE POLICY "Users can view own documents" ON verification_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON verification_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all documents" ON verification_documents
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Security questions policies
CREATE POLICY "Users can manage own security questions" ON security_questions
  FOR ALL USING (auth.uid() = user_id);

-- Trusted devices policies
CREATE POLICY "Users can manage own trusted devices" ON trusted_devices
  FOR ALL USING (auth.uid() = user_id);

-- Active sessions policies
CREATE POLICY "Users can view own sessions" ON active_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON active_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- User activities policies
CREATE POLICY "Users can view own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all activities" ON user_activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Subscription history policies
CREATE POLICY "Users can view own subscription history" ON subscription_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all subscription history" ON subscription_history
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to log user activities
CREATE OR REPLACE FUNCTION log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT DEFAULT NULL,
  p_entity_id TEXT DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_activities (
    user_id, action, entity_type, entity_id, 
    old_values, new_values, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action, p_entity_type, p_entity_id,
    p_old_values, p_new_values, 
    inet_client_addr(), 
    current_setting('request.headers', true)::json->>'user-agent'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
  permissions TEXT[];
BEGIN
  SELECT role INTO user_role FROM profiles WHERE id = p_user_id;
  
  CASE user_role
    WHEN 'admin' THEN
      permissions := ARRAY[
        'view_properties', 'create_properties', 'edit_properties', 'delete_properties',
        'view_deals', 'create_deals', 'edit_deals', 'delete_deals', 'close_deals',
        'view_agents', 'manage_agents', 'assign_leads',
        'view_crm', 'manage_contacts', 'view_reports',
        'view_financials', 'manage_billing',
        'manage_users', 'system_settings', 'view_analytics'
      ];
    WHEN 'wholesaler' THEN
      permissions := ARRAY[
        'view_properties', 'create_properties', 'edit_properties',
        'view_deals', 'create_deals', 'edit_deals', 'close_deals',
        'view_agents', 'assign_leads',
        'view_crm', 'manage_contacts', 'view_reports'
      ];
    WHEN 'investor' THEN
      permissions := ARRAY[
        'view_properties', 'view_deals', 'create_deals',
        'view_agents', 'view_crm', 'view_reports'
      ];
    WHEN 'agent' THEN
      permissions := ARRAY[
        'view_properties', 'create_properties', 'edit_properties',
        'view_deals', 'create_deals', 'edit_deals',
        'view_crm', 'manage_contacts'
      ];
    WHEN 'vendor' THEN
      permissions := ARRAY['view_properties', 'view_deals', 'view_crm'];
    ELSE
      permissions := ARRAY['view_properties'];
  END CASE;
  
  RETURN p_permission = ANY(permissions);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create sample admin user (for development)
-- Note: This should be removed in production
INSERT INTO profiles (
  id, email, first_name, last_name, role, status, subscription_tier,
  onboarding_completed, created_at, updated_at
) VALUES (
  uuid_generate_v4(),
  'admin@sbswp.com',
  'Admin',
  'User',
  'admin',
  'active',
  'platinum',
  true,
  now(),
  now()
) ON CONFLICT (email) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;