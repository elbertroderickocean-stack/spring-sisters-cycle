
-- Create product category enum
CREATE TYPE public.product_category AS ENUM (
  'cleanser', 'toner', 'serum', 'moisturizer', 'eye_cream', 
  'sunscreen', 'mask', 'exfoliant', 'oil', 'treatment', 'other'
);

-- Create shared cosmetic products database
CREATE TABLE public.cosmetic_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category product_category NOT NULL DEFAULT 'other',
  inci_ingredients TEXT,
  key_actives JSONB DEFAULT '[]'::jsonb,
  photo_url TEXT,
  barcode TEXT,
  pregnancy_safe BOOLEAN DEFAULT true,
  ph_profile TEXT,
  scan_count INTEGER DEFAULT 1,
  conflicts JSONB DEFAULT '[]'::jsonb,
  synergies JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user product shelf
CREATE TABLE public.user_product_shelf (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  product_id UUID REFERENCES public.cosmetic_products(id) ON DELETE CASCADE NOT NULL,
  is_meanwhile BOOLEAN DEFAULT false,
  slot TEXT,
  added_via TEXT DEFAULT 'scan',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.cosmetic_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_product_shelf ENABLE ROW LEVEL SECURITY;

-- Cosmetic products: everyone can read, authenticated can create/update
CREATE POLICY "Anyone can read cosmetic products"
  ON public.cosmetic_products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can add products"
  ON public.cosmetic_products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON public.cosmetic_products FOR UPDATE
  TO authenticated
  USING (true);

-- User shelf: users manage their own shelf only
CREATE POLICY "Users can view their own shelf"
  ON public.user_product_shelf FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own shelf"
  ON public.user_product_shelf FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shelf"
  ON public.user_product_shelf FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own shelf"
  ON public.user_product_shelf FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_cosmetic_products_brand ON public.cosmetic_products(brand);
CREATE INDEX idx_cosmetic_products_barcode ON public.cosmetic_products(barcode);
CREATE INDEX idx_cosmetic_products_category ON public.cosmetic_products(category);
CREATE INDEX idx_user_shelf_user ON public.user_product_shelf(user_id);
CREATE INDEX idx_user_shelf_product ON public.user_product_shelf(product_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_cosmetic_products_updated_at
  BEFORE UPDATE ON public.cosmetic_products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
