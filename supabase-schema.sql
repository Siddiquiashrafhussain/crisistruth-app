-- CrisisTruth Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'fact-checker', 'admin')),
  subscription_tier VARCHAR(50) NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  specialization VARCHAR(255),
  verifications_count INTEGER DEFAULT 0,
  accuracy_rate DECIMAL(5,2) DEFAULT 0.00,
  bio TEXT
);

-- Claims table
CREATE TABLE IF NOT EXISTS public.claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'verified', 'disputed', 'unverified', 'in-review')),
  category VARCHAR(100),
  crisis_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verifications table
CREATE TABLE IF NOT EXISTS public.verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE UNIQUE,
  status VARCHAR(50) NOT NULL CHECK (status IN ('verified', 'disputed', 'unverified')),
  confidence_score INTEGER NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  summary TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sources table
CREATE TABLE IF NOT EXISTS public.sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('scientific', 'news', 'government', 'fact-check', 'academic')),
  credibility INTEGER NOT NULL CHECK (credibility >= 0 AND credibility <= 100),
  is_active BOOLEAN DEFAULT true,
  api_endpoint TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Verification sources junction table
CREATE TABLE IF NOT EXISTS public.verification_sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  verification_id UUID REFERENCES public.verifications(id) ON DELETE CASCADE,
  source_id UUID REFERENCES public.sources(id) ON DELETE CASCADE,
  excerpt TEXT,
  relevance_score DECIMAL(5,2),
  UNIQUE(verification_id, source_id)
);

-- Crises table
CREATE TABLE IF NOT EXISTS public.crises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'monitoring')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for crisis_id in claims
ALTER TABLE public.claims 
ADD CONSTRAINT fk_claims_crisis 
FOREIGN KEY (crisis_id) REFERENCES public.crises(id) ON DELETE SET NULL;

-- Crisis tags table
CREATE TABLE IF NOT EXISTS public.crisis_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crisis_id UUID REFERENCES public.crises(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL
);

-- Fact checker assignments table
CREATE TABLE IF NOT EXISTS public.fact_checker_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
  fact_checker_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT
);

-- Flagged content table
CREATE TABLE IF NOT EXISTS public.flagged_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE,
  flagged_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  tier VARCHAR(50) NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Usage tracking table
CREATE TABLE IF NOT EXISTS public.usage_tracking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON public.claims(user_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON public.claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_crisis_id ON public.claims(crisis_id);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON public.claims(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verifications_claim_id ON public.verifications(claim_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_sources_type ON public.sources(type);
CREATE INDEX IF NOT EXISTS idx_sources_is_active ON public.sources(is_active);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id_created_at ON public.usage_tracking(user_id, created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE ON public.claims
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crises_updated_at BEFORE UPDATE ON public.crises
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crises ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Anyone can read claims
CREATE POLICY "Anyone can view claims" ON public.claims
    FOR SELECT USING (true);

-- Authenticated users can create claims
CREATE POLICY "Authenticated users can create claims" ON public.claims
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own claims
CREATE POLICY "Users can update own claims" ON public.claims
    FOR UPDATE USING (auth.uid() = user_id);

-- Anyone can read verifications
CREATE POLICY "Anyone can view verifications" ON public.verifications
    FOR SELECT USING (true);

-- System can insert verifications (service role)
CREATE POLICY "Service role can insert verifications" ON public.verifications
    FOR INSERT WITH CHECK (true);

-- Anyone can read crises
CREATE POLICY "Anyone can view crises" ON public.crises
    FOR SELECT USING (true);

-- Admins can manage crises (implement admin check in application layer)
CREATE POLICY "Admins can manage crises" ON public.crises
    FOR ALL USING (true);

-- Insert demo data
INSERT INTO public.users (email, name, role, subscription_tier) VALUES
  ('admin@crisistruth.org', 'Admin User', 'admin', 'enterprise'),
  ('factchecker@crisistruth.org', 'Fact Checker', 'fact-checker', 'pro'),
  ('demo@crisistruth.org', 'Demo User', 'user', 'free')
ON CONFLICT (email) DO NOTHING;

-- Insert demo sources
INSERT INTO public.sources (title, url, type, credibility) VALUES
  ('USGS Earthquake Science Center', 'https://earthquake.usgs.gov', 'scientific', 95),
  ('WHO Official Website', 'https://who.int', 'government', 98),
  ('Snopes Fact Check', 'https://snopes.com', 'fact-check', 85),
  ('Nature Journal', 'https://nature.com', 'academic', 92),
  ('Reuters News', 'https://reuters.com', 'news', 88)
ON CONFLICT DO NOTHING;

-- Insert demo crisis
INSERT INTO public.crises (title, description, location, priority, status) VALUES
  ('Global Health Misinformation', 'Tracking and verifying health-related claims during pandemic', 'Global', 'high', 'active'),
  ('Climate Change Claims', 'Monitoring climate science misinformation', 'Global', 'high', 'active'),
  ('Election Security 2024', 'Fact-checking election-related claims', 'United States', 'high', 'active')
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
