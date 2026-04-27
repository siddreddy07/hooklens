-- HookLens Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT 'blue',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, slug)
);

-- API Keys table
CREATE TABLE IF NOT EXISTS public.api_keys (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    api_key TEXT NOT NULL,
    ai_api_key_usage INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NULL DEFAULT NOW(),
    last_used_at TIMESTAMPTZ NULL,
    CONSTRAINT api_keys_pkey PRIMARY KEY (id),
    CONSTRAINT api_keys_api_key_key UNIQUE (api_key),
    CONSTRAINT one_key_per_user UNIQUE (user_id),
    CONSTRAINT api_keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_api_keys_api_key ON public.api_keys USING btree (api_key);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON public.api_keys USING btree (user_id);

-- Provider URLs table (stores webhook URLs per user per provider)
CREATE TABLE IF NOT EXISTS public.provider_urls (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT provider_urls_pkey PRIMARY KEY (id),
    CONSTRAINT unique_user_provider UNIQUE (user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_provider_urls_user_id ON public.provider_urls USING btree (user_id);
CREATE INDEX IF NOT EXISTS idx_provider_urls_provider ON public.provider_urls USING btree (provider);

-- Row Level Security for provider_urls
ALTER TABLE public.provider_urls ENABLE ROW LEVEL SECURITY;

-- Provider URLs: Users can only view their own URLs
CREATE POLICY "Users can view own provider urls" ON public.provider_urls
    FOR SELECT USING (auth.uid() = user_id);

-- Provider URLs: Users can only insert their own URLs
CREATE POLICY "Users can insert own provider urls" ON public.provider_urls
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Provider URLs: Users can only update their own URLs
CREATE POLICY "Users can update own provider urls" ON public.provider_urls
    FOR UPDATE USING (auth.uid() = user_id);

-- Provider URLs: Users can only delete their own URLs
CREATE POLICY "Users can delete own provider urls" ON public.provider_urls
    FOR DELETE USING (auth.uid() = user_id);

-- Trigger to update updated_at on provider_urls
CREATE OR REPLACE FUNCTION public.update_provider_urls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_provider_urls_updated_at
    BEFORE UPDATE ON public.provider_urls
    FOR EACH ROW EXECUTE FUNCTION public.update_provider_urls_updated_at();

-- Webhook Events table (stores all incoming webhook events)
CREATE TABLE IF NOT EXISTS public.webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    provider TEXT NOT NULL,
    event_type TEXT,
    method TEXT DEFAULT 'POST',
    url TEXT,
    headers JSONB DEFAULT '{}',
    body JSONB,
    raw_body TEXT,
    query JSONB DEFAULT '{}',
    status TEXT DEFAULT 'success',
    ip_address TEXT,
    user_agent TEXT,
    replayed_at TIMESTAMPTZ,
    replay_count INTEGER DEFAULT 0,
    ai_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_webhook_events_project_id ON public.webhook_events(project_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_user_id ON public.webhook_events(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_created_at ON public.webhook_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON public.webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON public.webhook_events(event_type);

-- Row Level Security (RLS) policies
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;

-- Projects: Users can only manage their own projects
CREATE POLICY "Users can view own projects" ON public.projects
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
    FOR DELETE USING (auth.uid() = user_id);

-- API Keys: Users can only manage their own keys
CREATE POLICY "Users can view own api keys" ON public.api_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own api keys" ON public.api_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own api keys" ON public.api_keys
    FOR DELETE USING (auth.uid() = user_id);

-- Webhook Events: Users can only see logs from their projects
CREATE POLICY "Users can view own webhook events" ON public.webhook_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Events can be inserted by anyone (capture endpoint)" ON public.webhook_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own webhook events" ON public.webhook_events
    FOR UPDATE USING (auth.uid() = user_id);

-- Trigger to update user_id on webhook_events when project is linked
CREATE OR REPLACE FUNCTION public.set_webhook_event_user_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.user_id IS NULL THEN
        SELECT user_id INTO NEW.user_id FROM public.projects WHERE id = NEW.project_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER set_webhook_event_user_id
    BEFORE INSERT ON public.webhook_events
    FOR EACH ROW EXECUTE FUNCTION public.set_webhook_event_user_id();

-- Trigger to update last_used_at on API key usage
CREATE OR REPLACE FUNCTION public.update_api_key_last_used()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.api_keys SET last_used_at = NOW() WHERE api_key = NEW.headers->>'x-api-key';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_api_key_usage
    AFTER INSERT ON public.webhook_events
    FOR EACH ROW EXECUTE FUNCTION public.update_api_key_last_used();