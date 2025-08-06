-- Create the 'system_logs' table for audit logging and system events
CREATE TABLE public.system_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    timestamp timestamp with time zone DEFAULT now() NOT NULL,
    level text NOT NULL, -- e.g., 'info', 'warn', 'error', 'debug'
    message text NOT NULL,
    context jsonb, -- Additional structured data (e.g., user_id, ip_address, action)
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create an index on timestamp for faster queries
CREATE INDEX idx_system_logs_timestamp ON public.system_logs (timestamp DESC);

-- Create an index on level for filtering by log level
CREATE INDEX idx_system_logs_level ON public.system_logs (level);

-- Create the 'system_alerts' table for critical system notifications
CREATE TABLE public.system_alerts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    message text NOT NULL,
    severity text NOT NULL, -- e.g., 'low', 'medium', 'high', 'critical'
    resolved boolean DEFAULT FALSE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    resolved_at timestamp with time zone
);

-- Create an index on created_at for faster queries
CREATE INDEX idx_system_alerts_created_at ON public.system_alerts (created_at DESC);

-- Create an index on resolved for filtering resolved/unresolved alerts
CREATE INDEX idx_system_alerts_resolved ON public.system_alerts (resolved);

-- Create the 'promo_codes' table for managing promotional discounts
CREATE TABLE public.promo_codes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    code text UNIQUE NOT NULL,
    discount_percentage numeric(5, 2) NOT NULL, -- e.g., 10.00 for 10%
    expires_at timestamp with time zone,
    max_uses integer,
    current_uses integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add a trigger to update 'updated_at' for promo_codes
CREATE TRIGGER update_promo_codes_updated_at
BEFORE UPDATE ON public.promo_codes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create the 'payment_logs' table for tracking payment-related events
CREATE TABLE public.payment_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    event_type text NOT NULL, -- e.g., 'checkout_session_completed', 'subscription_created', 'payment_failed'
    stripe_event_id text UNIQUE, -- Stripe event ID for webhook traceability
    payload jsonb, -- Full webhook payload or relevant payment data
    amount numeric(10, 2),
    currency text,
    status text, -- e.g., 'success', 'failed', 'pending'
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create an index on user_id for faster lookup of user-specific payment history
CREATE INDEX idx_payment_logs_user_id ON public.payment_logs (user_id);

-- Create an index on event_type for filtering payment events
CREATE INDEX idx_payment_logs_event_type ON public.payment_logs (event_type);

-- Create the 'system_config' table for storing global system settings
CREATE TABLE public.system_config (
    key text PRIMARY KEY,
    value jsonb,
    description text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Add a trigger to update 'updated_at' for system_config
CREATE TRIGGER update_system_config_updated_at
BEFORE UPDATE ON public.system_config
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS for new tables (adjust policies based on your security requirements)
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view system logs." ON public.system_logs FOR SELECT USING (auth.role() = 'admin');

ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage system alerts." ON public.system_alerts FOR ALL USING (auth.role() = 'admin');

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage promo codes." ON public.promo_codes FOR ALL USING (auth.role() = 'admin');
CREATE POLICY "Users can view active promo codes." ON public.promo_codes FOR SELECT USING (expires_at IS NULL OR expires_at > now());

ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view payment logs." ON public.payment_logs FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Users can view their own payment logs." ON public.payment_logs FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.system_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage system config." ON public.system_config FOR ALL USING (auth.role() = 'admin');
CREATE POLICY "Public can read system config." ON public.system_config FOR SELECT USING (true);

-- Grant permissions to authenticated and service_role for new tables
GRANT ALL ON TABLE public.system_logs TO authenticated, service_role;
GRANT ALL ON TABLE public.system_alerts TO authenticated, service_role;
GRANT ALL ON TABLE public.promo_codes TO authenticated, service_role;
GRANT ALL ON TABLE public.payment_logs TO authenticated, service_role;
GRANT ALL ON TABLE public.system_config TO authenticated, service_role;
