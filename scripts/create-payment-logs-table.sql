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

-- RLS for payment_logs (adjust policies based on your security requirements)
ALTER TABLE public.payment_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view payment logs." ON public.payment_logs FOR SELECT USING (auth.role() = 'admin');
CREATE POLICY "Users can view their own payment logs." ON public.payment_logs FOR SELECT USING (auth.uid() = user_id);

-- Grant permissions to authenticated and service_role for new table
GRANT ALL ON TABLE public.payment_logs TO authenticated, service_role;
