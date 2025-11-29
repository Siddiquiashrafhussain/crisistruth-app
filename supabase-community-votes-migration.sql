-- Community Votes Table Migration
-- Run this in your Supabase SQL Editor to add community verification features

-- Create community_votes table
CREATE TABLE IF NOT EXISTS public.community_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  claim_id UUID REFERENCES public.claims(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  vote VARCHAR(20) NOT NULL CHECK (vote IN ('agree', 'disagree', 'unsure')),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(claim_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_community_votes_claim_id ON public.community_votes(claim_id);
CREATE INDEX IF NOT EXISTS idx_community_votes_user_id ON public.community_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_community_votes_created_at ON public.community_votes(created_at DESC);

-- Add updated_at trigger
CREATE TRIGGER update_community_votes_updated_at BEFORE UPDATE ON public.community_votes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Anyone can read community votes
CREATE POLICY "Anyone can view community votes" ON public.community_votes
    FOR SELECT USING (true);

-- Authenticated users can create votes
CREATE POLICY "Authenticated users can create votes" ON public.community_votes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own votes
CREATE POLICY "Users can update own votes" ON public.community_votes
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own votes
CREATE POLICY "Users can delete own votes" ON public.community_votes
    FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.community_votes TO anon, authenticated;
