-- Create api_keys table for storing user API keys
CREATE TABLE IF NOT EXISTS public.api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  CONSTRAINT one_key_per_user UNIQUE (user_id)
);

-- Enable Row Level Security
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only see and manage their own API key
CREATE POLICY "Users can view their own API key" 
  ON public.api_keys FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own API key" 
  ON public.api_keys FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API key" 
  ON public.api_keys FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for faster lookups by api_key (for middleware validation)
CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON public.api_keys(api_key);

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys(user_id);
