-- This script is for creating initial investor profiles if needed,
-- or for populating test data.
-- In a real application, investor profiles would be created
-- through the onboarding flow or user registration.

-- Example: Insert a test investor profile
-- INSERT INTO public.users (id, email, role)
-- VALUES ('<UUID_OF_AUTH_USER>', 'investor@example.com', 'investor')
-- ON CONFLICT (id) DO UPDATE SET role = 'investor';

-- Note: Replace <UUID_OF_AUTH_USER> with an actual user ID from auth.users table
-- if you are manually seeding.
