-- Create kitchen_volunteers table if not exists
CREATE TABLE IF NOT EXISTS public.kitchen_volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kitchen_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT,
  availability TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create kitchen_reviews table if not exists
CREATE TABLE IF NOT EXISTS public.kitchen_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kitchen_id UUID NOT NULL,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  food_quality INTEGER CHECK (food_quality >= 1 AND food_quality <= 5),
  hygiene_rating INTEGER CHECK (hygiene_rating >= 1 AND hygiene_rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on kitchen_reviews
ALTER TABLE public.kitchen_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for kitchen_reviews
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.kitchen_reviews;
CREATE POLICY "Reviews viewable by everyone" 
ON public.kitchen_reviews 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can create reviews" ON public.kitchen_reviews;
CREATE POLICY "Authenticated users can create reviews" 
ON public.kitchen_reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on kitchen_volunteers
ALTER TABLE public.kitchen_volunteers ENABLE ROW LEVEL SECURITY;

-- Create policies for kitchen_volunteers
DROP POLICY IF EXISTS "Volunteers viewable by everyone" ON public.kitchen_volunteers;
CREATE POLICY "Volunteers viewable by everyone" 
ON public.kitchen_volunteers 
FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Authenticated users can volunteer" ON public.kitchen_volunteers;
CREATE POLICY "Authenticated users can volunteer" 
ON public.kitchen_volunteers 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);