-- Create drive registrations table for Green Hub event registration
CREATE TABLE public.drive_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drive_id UUID NOT NULL REFERENCES public.drives(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  age_group TEXT,
  gender TEXT,
  number_of_participants INTEGER DEFAULT 1,
  volunteer_role TEXT,
  availability TEXT,
  tshirt_size TEXT,
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  photo_consent BOOLEAN NOT NULL DEFAULT false,
  liability_accepted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create food donations table (separate from food_resources for donation flow)
CREATE TABLE public.food_donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID NOT NULL,
  donor_name TEXT NOT NULL,
  donor_type TEXT NOT NULL, -- 'individual', 'restaurant', 'event'
  food_type TEXT NOT NULL,
  quantity TEXT NOT NULL,
  expiry_time TIMESTAMP WITH TIME ZONE NOT NULL,
  pickup_location TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT DEFAULT 'pending', -- 'pending', 'collected', 'delivered'
  assigned_volunteer_id UUID,
  notes TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create food requests table
CREATE TABLE public.food_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID NOT NULL,
  organization_name TEXT NOT NULL,
  organization_type TEXT NOT NULL, -- 'ngo', 'shelter', 'family'
  food_type_needed TEXT NOT NULL,
  quantity_needed TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT DEFAULT 'active', -- 'active', 'fulfilled', 'cancelled'
  urgency TEXT DEFAULT 'medium', -- 'low', 'medium', 'high'
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community kitchens table
CREATE TABLE public.community_kitchens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  timings TEXT NOT NULL,
  meal_types TEXT[], -- ['breakfast', 'lunch', 'dinner']
  food_type TEXT, -- 'vegetarian', 'non-vegetarian', 'mixed'
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  capacity INTEGER,
  is_free BOOLEAN DEFAULT true,
  price_range TEXT,
  image_url TEXT,
  description TEXT,
  rating NUMERIC DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create kitchen reviews table
CREATE TABLE public.kitchen_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kitchen_id UUID NOT NULL REFERENCES public.community_kitchens(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  food_quality INTEGER CHECK (food_quality >= 1 AND food_quality <= 5),
  hygiene_rating INTEGER CHECK (hygiene_rating >= 1 AND hygiene_rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create kitchen volunteers table
CREATE TABLE public.kitchen_volunteers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kitchen_id UUID NOT NULL REFERENCES public.community_kitchens(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT, -- 'cook', 'server', 'cleaner', 'organizer'
  availability TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(kitchen_id, user_id)
);

-- Create food banks table
CREATE TABLE public.food_banks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  organization_type TEXT, -- 'food_bank', 'community_center', 'ngo'
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  contact_phone TEXT NOT NULL,
  contact_email TEXT,
  timings TEXT NOT NULL,
  services TEXT[], -- ['food_distribution', 'meal_service', 'food_storage']
  website TEXT,
  description TEXT,
  is_partner BOOLEAN DEFAULT false,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create food bank inventory table
CREATE TABLE public.food_bank_inventory (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  food_bank_id UUID NOT NULL REFERENCES public.food_banks(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  category TEXT, -- 'grains', 'vegetables', 'fruits', 'protein', 'dairy', 'packaged'
  quantity TEXT NOT NULL,
  unit TEXT, -- 'kg', 'liters', 'units'
  availability_status TEXT DEFAULT 'in_stock', -- 'in_stock', 'low_stock', 'out_of_stock'
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create food waste tips table
CREATE TABLE public.food_waste_tips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL, -- 'storage', 'cooking', 'shopping', 'composting'
  tip_type TEXT DEFAULT 'text', -- 'text', 'video', 'infographic'
  media_url TEXT,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user food impact tracking table
CREATE TABLE public.user_food_impact (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action_type TEXT NOT NULL, -- 'donated', 'volunteered', 'requested', 'saved_waste'
  impact_points INTEGER DEFAULT 0,
  action_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.drive_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchen_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kitchen_volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_banks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_bank_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_waste_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_food_impact ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drive_registrations
CREATE POLICY "Authenticated users can register for drives"
ON public.drive_registrations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own registrations"
ON public.drive_registrations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all registrations"
ON public.drive_registrations FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for food_donations
CREATE POLICY "Anyone can view active donations"
ON public.food_donations FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create donations"
ON public.food_donations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update own donations"
ON public.food_donations FOR UPDATE
TO authenticated
USING (auth.uid() = donor_id);

CREATE POLICY "Admins can update any donation"
ON public.food_donations FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for food_requests
CREATE POLICY "Anyone can view active requests"
ON public.food_requests FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create requests"
ON public.food_requests FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = requester_id);

CREATE POLICY "Requesters can update own requests"
ON public.food_requests FOR UPDATE
TO authenticated
USING (auth.uid() = requester_id);

-- RLS Policies for community_kitchens
CREATE POLICY "Community kitchens viewable by everyone"
ON public.community_kitchens FOR SELECT
USING (true);

CREATE POLICY "Admins can manage kitchens"
ON public.community_kitchens FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for kitchen_reviews
CREATE POLICY "Reviews viewable by everyone"
ON public.kitchen_reviews FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create reviews"
ON public.kitchen_reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for kitchen_volunteers
CREATE POLICY "Volunteers viewable by everyone"
ON public.kitchen_volunteers FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can volunteer"
ON public.kitchen_volunteers FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for food_banks
CREATE POLICY "Food banks viewable by everyone"
ON public.food_banks FOR SELECT
USING (true);

CREATE POLICY "Admins can manage food banks"
ON public.food_banks FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for food_bank_inventory
CREATE POLICY "Inventory viewable by everyone"
ON public.food_bank_inventory FOR SELECT
USING (true);

CREATE POLICY "Admins can manage inventory"
ON public.food_bank_inventory FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for food_waste_tips
CREATE POLICY "Tips viewable by everyone"
ON public.food_waste_tips FOR SELECT
USING (true);

CREATE POLICY "Admins can manage tips"
ON public.food_waste_tips FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_food_impact
CREATE POLICY "Users can view own impact"
ON public.user_food_impact FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "System can track impact"
ON public.user_food_impact FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updating food_donations.updated_at
CREATE TRIGGER update_food_donations_updated_at
BEFORE UPDATE ON public.food_donations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger for updating food_requests.updated_at
CREATE TRIGGER update_food_requests_updated_at
BEFORE UPDATE ON public.food_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();