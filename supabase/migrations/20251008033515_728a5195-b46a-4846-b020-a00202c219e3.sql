-- Create drives table for tree plantation and cleanup events
CREATE TABLE public.drives (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  date timestamp with time zone NOT NULL,
  location text NOT NULL,
  organizer text NOT NULL,
  registration_link text,
  category text NOT NULL,
  image_url text,
  status item_status DEFAULT 'active',
  created_by uuid NOT NULL,
  participants_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create campaigns table for eco-awareness
CREATE TABLE public.campaigns (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  media_link text,
  category text NOT NULL,
  content text NOT NULL,
  image_url text,
  status item_status DEFAULT 'active',
  created_by uuid NOT NULL,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Create pickups table for waste pickup scheduling
CREATE TABLE public.pickups (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  address text NOT NULL,
  waste_type text NOT NULL,
  preferred_date timestamp with time zone NOT NULL,
  status text DEFAULT 'pending',
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create recyclables table for recycling marketplace
CREATE TABLE public.recyclables (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name text NOT NULL,
  description text NOT NULL,
  quantity text NOT NULL,
  price integer,
  user_id uuid NOT NULL,
  contact_info text NOT NULL,
  image_url text,
  status item_status DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now()
);

-- Create dumping_reports table for illegal dumping reports
CREATE TABLE public.dumping_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  description text NOT NULL,
  image_url text,
  latitude numeric,
  longitude numeric,
  location text NOT NULL,
  status text DEFAULT 'reported',
  created_at timestamp with time zone DEFAULT now()
);

-- Create user_points table for gamification
CREATE TABLE public.user_points (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  points integer DEFAULT 0,
  action_type text NOT NULL,
  action_description text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pickups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recyclables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dumping_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;

-- RLS Policies for drives
CREATE POLICY "Drives viewable by everyone" ON public.drives FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create drives" ON public.drives FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update own drives" ON public.drives FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for campaigns
CREATE POLICY "Campaigns viewable by everyone" ON public.campaigns FOR SELECT USING (true);
CREATE POLICY "Admins can create campaigns" ON public.campaigns FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update campaigns" ON public.campaigns FOR UPDATE USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for pickups
CREATE POLICY "Users can view own pickups" ON public.pickups FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all pickups" ON public.pickups FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can schedule pickups" ON public.pickups FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pickups" ON public.pickups FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for recyclables
CREATE POLICY "Recyclables viewable by everyone" ON public.recyclables FOR SELECT USING (true);
CREATE POLICY "Authenticated users can list recyclables" ON public.recyclables FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recyclables" ON public.recyclables FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for dumping_reports
CREATE POLICY "Reports viewable by everyone" ON public.dumping_reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report dumping" ON public.dumping_reports FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_points
CREATE POLICY "Points viewable by everyone" ON public.user_points FOR SELECT USING (true);
CREATE POLICY "System can award points" ON public.user_points FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create trigger for pickups updated_at
CREATE TRIGGER update_pickups_updated_at
BEFORE UPDATE ON public.pickups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert example drives data
INSERT INTO public.drives (title, description, date, location, organizer, registration_link, category, created_by) VALUES
('Community Tree Plantation Drive', 'Join us in planting 500+ trees in our neighborhood park. All age groups welcome!', '2025-11-15 09:00:00+00', 'Central Community Park', 'Green Earth Foundation', 'https://example.com/register', 'Tree Plantation', '00000000-0000-0000-0000-000000000000'),
('Beach Cleanup Campaign', 'Help us clean our local beach and protect marine life. Gloves and bags provided.', '2025-11-08 07:00:00+00', 'Sunset Beach', 'Ocean Warriors', 'https://example.com/register', 'Clean-up Drive', '00000000-0000-0000-0000-000000000000'),
('Urban Forest Initiative', 'Transform vacant lots into green spaces. Learn sustainable gardening practices.', '2025-11-22 08:00:00+00', 'Downtown Area', 'City Green Council', 'https://example.com/register', 'Tree Plantation', '00000000-0000-0000-0000-000000000000');

-- Insert example campaigns data
INSERT INTO public.campaigns (title, description, media_link, category, content, created_by) VALUES
('Say No to Single-Use Plastics', 'Learn how to reduce plastic waste in your daily life with simple alternatives.', 'https://example.com/video1', 'Waste Reduction', 'Single-use plastics take 500+ years to decompose. Switch to reusable bags, bottles, and containers. Every small change makes a difference!', '00000000-0000-0000-0000-000000000000'),
('Composting 101', 'Turn your kitchen waste into nutrient-rich compost for your garden.', 'https://example.com/video2', 'Recycling', 'Composting reduces landfill waste by 30%. Start with fruit peels, vegetable scraps, and coffee grounds. Avoid meat and dairy products.', '00000000-0000-0000-0000-000000000000'),
('Water Conservation Tips', 'Simple ways to save water at home and reduce your environmental footprint.', 'https://example.com/video3', 'Conservation', 'Fix leaky faucets, take shorter showers, and collect rainwater. Small actions can save thousands of gallons annually!', '00000000-0000-0000-0000-000000000000');