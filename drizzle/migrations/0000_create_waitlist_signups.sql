CREATE TABLE public.waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT waitlist_email_format CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' AND length(email) <= 255)
);
CREATE UNIQUE INDEX waitlist_signups_email_key ON public.waitlist_signups (lower(email));
GRANT INSERT ON public.waitlist_signups TO anon, authenticated;
GRANT ALL ON public.waitlist_signups TO service_role;
ALTER TABLE public.waitlist_signups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join the waitlist" ON public.waitlist_signups FOR INSERT TO anon, authenticated WITH CHECK (true);