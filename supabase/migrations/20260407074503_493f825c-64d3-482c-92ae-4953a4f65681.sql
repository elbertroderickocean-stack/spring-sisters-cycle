
-- Create skin scans table
CREATE TABLE public.skin_scans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  photo_url TEXT,
  skin_capital_score NUMERIC(5,2),
  zones JSONB DEFAULT '{}'::jsonb,
  metrics JSONB DEFAULT '{}'::jsonb,
  weak_zones TEXT[] DEFAULT '{}',
  recommendations JSONB DEFAULT '{}'::jsonb,
  environmental_context JSONB DEFAULT '{}'::jsonb,
  phase TEXT,
  day INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.skin_scans ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own scans"
  ON public.skin_scans FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own scans"
  ON public.skin_scans FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own scans"
  ON public.skin_scans FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_skin_scans_user ON public.skin_scans(user_id);
CREATE INDEX idx_skin_scans_created ON public.skin_scans(created_at DESC);

-- Storage bucket for scan photos
INSERT INTO storage.buckets (id, name, public) VALUES ('skin-scans', 'skin-scans', true);

-- Storage policies
CREATE POLICY "Scan photos are publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'skin-scans');

CREATE POLICY "Users can upload their own scan photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'skin-scans' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own scan photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'skin-scans' AND auth.uid()::text = (storage.foldername(name))[1]);
