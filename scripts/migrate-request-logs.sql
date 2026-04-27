-- If you already have request_logs table, run this to rename it
ALTER TABLE IF EXISTS public.request_logs RENAME TO webhook_events;

-- Drop old indexes and recreate with new name
DROP INDEX IF EXISTS idx_request_logs_project_id;
DROP INDEX IF EXISTS idx_request_logs_user_id;
DROP INDEX IF EXISTS idx_request_logs_created_at;
DROP INDEX IF EXISTS idx_request_logs_provider;
DROP INDEX IF EXISTS idx_request_logs_event_type;

CREATE INDEX idx_webhook_events_project_id ON public.webhook_events(project_id);
CREATE INDEX idx_webhook_events_user_id ON public.webhook_events(user_id);
CREATE INDEX idx_webhook_events_created_at ON public.webhook_events(created_at DESC);
CREATE INDEX idx_webhook_events_provider ON public.webhook_events(provider);
CREATE INDEX idx_webhook_events_event_type ON public.webhook_events(event_type);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view own request logs" ON public.request_logs;
DROP POLICY IF EXISTS "Logs can be inserted by anyone (capture endpoint)" ON public.request_logs;
DROP POLICY IF EXISTS "Users can update own request logs" ON public.request_logs;
DROP POLICY IF EXISTS "Users can view own webhook events" ON public.webhook_events;
DROP POLICY IF EXISTS "Events can be inserted by anyone (capture endpoint)" ON public.webhook_events;
DROP POLICY IF EXISTS "Users can update own webhook events" ON public.webhook_events;

CREATE POLICY "Users can view own webhook events" ON public.webhook_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Events can be inserted by anyone (capture endpoint)" ON public.webhook_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own webhook events" ON public.webhook_events
    FOR UPDATE USING (auth.uid() = user_id);

-- Update triggers
DROP TRIGGER IF EXISTS set_request_log_user_id ON public.request_logs;
DROP TRIGGER IF EXISTS update_api_key_usage ON public.request_logs;

CREATE TRIGGER set_webhook_event_user_id
    BEFORE INSERT ON public.webhook_events
    FOR EACH ROW EXECUTE FUNCTION public.set_webhook_event_user_id();

CREATE TRIGGER update_api_key_usage
    AFTER INSERT ON public.webhook_events
    FOR EACH ROW EXECUTE FUNCTION public.update_api_key_last_used();