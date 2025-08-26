# 🚀 Production Deployment Checklist

## Pre-Deployment Validation

### ✅ Environment Setup
- [ ] All environment variables configured in `.env.local`
- [ ] Supabase project created and configured
- [ ] Stripe account setup with products and pricing
- [ ] Telnyx account configured for SMS
- [ ] DocuSign integration keys obtained
- [ ] Zapier webhook URL configured

### ✅ Database Setup (Supabase)
```sql
-- Execute these in Supabase SQL Editor

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  role TEXT CHECK (role IN ('wholesaler', 'investor', 'admin')),
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT,
  plan_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wholesaler_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  property_address TEXT,
  lead_source TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deals table
CREATE TABLE IF NOT EXISTS completed_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wholesaler_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  investor_id UUID REFERENCES profiles(id),
  property_address TEXT NOT NULL,
  purchase_price DECIMAL(12,2),
  sale_price DECIMAL(12,2),
  profit DECIMAL(12,2),
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  closed_at TIMESTAMP WITH TIME ZONE
);

-- SMS Conversations table
CREATE TABLE IF NOT EXISTS sms_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id TEXT UNIQUE,
  user_id UUID REFERENCES profiles(id),
  from_number TEXT,
  to_number TEXT,
  message_text TEXT,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  status TEXT,
  received_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Promo Codes table
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  days_valid INTEGER NOT NULL,
  max_uses INTEGER DEFAULT 1,
  times_used INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE
);

-- Lead Scores table
CREATE TABLE IF NOT EXISTS lead_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  wholesaler_id UUID REFERENCES profiles(id),
  score INTEGER,
  factors JSONB,
  probability INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bidding table
CREATE TABLE IF NOT EXISTS bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES completed_deals(id),
  investor_id UUID REFERENCES profiles(id),
  bid_amount DECIMAL(12,2) NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE completed_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- RLS Policies (basic examples)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### ✅ Stripe Configuration
```javascript
// Products to create in Stripe Dashboard:
// 1. Wholesaler Starter Pack - $149/month
// 2. Wholesaler Pro Pack - $199/month  
// 3. Wholesaler Empire Pack - $599/month
// 4. Investor Bid Fee - $49 one-time
// 5. Investor Closing Fee - 1% of deal value
// 6. Investor Overage Fee - 10% of overage amount

// Webhooks to configure:
// - checkout.session.completed
// - customer.subscription.created
// - customer.subscription.updated
// - customer.subscription.deleted
// - payment_intent.succeeded
```

### ✅ Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - STRIPE_SECRET_KEY
# - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
# - TELNYX_API_KEY
# - TELNYX_SMS_FROM_NUMBER
# - DOCUSIGN_INTEGRATION_KEY
# - DOCUSIGN_USER_ID
# - DOCUSIGN_ACCOUNT_ID
# - DOCUSIGN_RSA_PRIVATE_KEY
# - ZAPIER_WEBHOOK_URL
# - NEXT_PUBLIC_SITE_URL
```

## Post-Deployment Testing

### ✅ Functional Tests
- [ ] Landing page loads correctly
- [ ] Wholesaler signup flow works
- [ ] Investor signup flow works
- [ ] Admin dashboard accessible
- [ ] Stripe checkout process functional
- [ ] SMS sending works (test with real phone number)
- [ ] AI bot endpoints respond correctly
- [ ] Deal analyzer provides analysis
- [ ] Predictive scoring calculates scores
- [ ] Performance metrics load data

### ✅ Integration Tests
- [ ] Supabase authentication works
- [ ] Database queries execute successfully
- [ ] Stripe webhooks process correctly
- [ ] Telnyx SMS webhooks handled
- [ ] DocuSign integration functional
- [ ] Zapier webhooks trigger AI processing

### ✅ Security Validation
- [ ] All API routes require proper authentication
- [ ] RLS policies protect user data
- [ ] Environment variables not exposed to client
- [ ] CORS properly configured
- [ ] Rate limiting implemented where needed

### ✅ Performance Optimization
- [ ] Images optimized with Next.js Image component
- [ ] API routes use proper caching headers
- [ ] Database queries optimized with indexes
- [ ] Bundle size analyzed and optimized
- [ ] Core Web Vitals pass requirements

## Monitoring & Maintenance

### ✅ Analytics Setup
- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry recommended)
- [ ] Performance monitoring active
- [ ] Business metrics dashboards created

### ✅ Backup Strategy
- [ ] Database backup schedule configured
- [ ] Environment variables backed up securely
- [ ] Code repository protected with branch rules
- [ ] Deployment rollback strategy documented

### ✅ User Support
- [ ] Help documentation created
- [ ] Support contact information provided
- [ ] Bug reporting system established
- [ ] User feedback collection implemented

## Success Metrics

### ✅ Technical KPIs
- [ ] 99.9% uptime target
- [ ] < 2 second page load times
- [ ] < 500ms API response times
- [ ] Zero critical security vulnerabilities

### ✅ Business KPIs
- [ ] User registration rate > 5% of visitors
- [ ] Subscription conversion rate > 15%
- [ ] Customer churn rate < 5% monthly
- [ ] Support ticket resolution < 24 hours

---

## Emergency Contacts
- **Vercel Support**: [Vercel Dashboard](https://vercel.com/dashboard)
- **Supabase Support**: [Supabase Dashboard](https://supabase.com/dashboard)
- **Stripe Support**: [Stripe Dashboard](https://dashboard.stripe.com)

---

## Final Checklist
- [ ] All items above completed
- [ ] Production environment tested
- [ ] Team trained on deployment process
- [ ] Documentation updated
- [ ] Launch announcement prepared

**Ready for Production! 🚀**