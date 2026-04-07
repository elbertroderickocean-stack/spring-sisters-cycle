-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  name TEXT DEFAULT '',
  email TEXT DEFAULT '',
  age_range TEXT DEFAULT '',
  skin_type TEXT DEFAULT '',
  skin_concerns TEXT[] DEFAULT '{}',
  last_period_date TIMESTAMPTZ,
  cycle_length INTEGER DEFAULT 28,
  life_stage TEXT DEFAULT 'cycle',
  pregnancy_mode BOOLEAN DEFAULT false,
  trimester INTEGER,
  due_date TIMESTAMPTZ,
  wise_bloom_mode BOOLEAN DEFAULT false,
  takes_hormonal_medication BOOLEAN DEFAULT false,
  hormonal_medication_name TEXT DEFAULT '',
  owned_products TEXT[] DEFAULT '{}',
  check_in_data JSONB DEFAULT '{}'::jsonb,
  custom_rituals JSONB DEFAULT '{}'::jsonb,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);