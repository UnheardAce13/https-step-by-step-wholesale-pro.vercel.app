-- Create System Configuration Table (for API keys, feature flags, etc.)
CREATE TABLE IF NOT EXISTS public.system_config (
    key text PRIMARY KEY,
    value jsonb,
    description text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for system_config table
CREATE POLICY "Admins can manage system config." ON public.system_config FOR ALL USING (auth.role() = 'admin');
CREATE POLICY "Public can read system config." ON public.system_config FOR SELECT USING (true);

-- Create a function to update updated_at column automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for system_config table
CREATE TRIGGER update_system_config_updated_at
BEFORE UPDATE ON public.system_config
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert initial configuration values
INSERT INTO public.system_config (key, value, description)
VALUES
('feature_flags', '{"enable_new_dashboard": true, "enable_ai_bot": false}', 'Flags for enabling/disabling features'),
('email_settings', '{"from_address": "noreply@yourdomain.com", "smtp_host": "smtp.resend.com"}', 'Settings for email configuration')
ON CONFLICT (key) DO NOTHING; -- Prevents inserting if key already exists

-- Grant permissions to authenticated and service_role for new table
GRANT ALL ON TABLE public.system_config TO authenticated, service_role;

-- This script is now part of create-database-schema.sql
-- No need to run this separately if create-database-schema.sql is used.
