-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.job_type AS ENUM ('skilled', 'unskilled');
CREATE TYPE public.employment_type AS ENUM ('full-time', 'part-time', 'freelance', 'contract');
CREATE TYPE public.urgency_level AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.item_status AS ENUM ('active', 'resolved', 'expired');
CREATE TYPE public.event_status AS ENUM ('upcoming', 'ongoing', 'completed', 'cancelled');
CREATE TYPE public.resource_type AS ENUM ('food', 'clothes', 'books', 'furniture', 'other');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  avatar_url TEXT,
  bio TEXT,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  job_type job_type NOT NULL,
  employment_type employment_type NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  salary_min INTEGER,
  salary_max INTEGER,
  skills TEXT[],
  urgency urgency_level DEFAULT 'medium',
  verified BOOLEAN DEFAULT FALSE,
  status item_status DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  price_min INTEGER,
  price_max INTEGER,
  availability TEXT,
  verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_reviews INTEGER DEFAULT 0,
  status item_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service reviews table
CREATE TABLE public.service_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES public.services(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lost and found items table
CREATE TABLE public.lost_found_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  image_url TEXT,
  status item_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Food and resources table
CREATE TABLE public.food_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  posted_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  resource_type resource_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  quantity TEXT,
  location TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  pickup_details TEXT,
  image_url TEXT,
  status item_status DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  event_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  image_url TEXT,
  rsvp_count INTEGER DEFAULT 0,
  status event_status DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event RSVPs table
CREATE TABLE public.event_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Social organizations table
CREATE TABLE public.social_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  website TEXT,
  donation_link TEXT,
  image_url TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteer opportunities table
CREATE TABLE public.volunteer_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES public.social_organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  date TIMESTAMPTZ,
  volunteers_needed INTEGER,
  volunteers_registered INTEGER DEFAULT 0,
  status item_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Volunteer registrations table
CREATE TABLE public.volunteer_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID REFERENCES public.volunteer_opportunities(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(opportunity_id, user_id)
);

-- Surveys table
CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  questions JSONB NOT NULL,
  status item_status DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Survey responses table
CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  responses JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(survey_id, user_id)
);

-- Polls table
CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  options JSONB NOT NULL,
  total_votes INTEGER DEFAULT 0,
  status item_status DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Poll votes table
CREATE TABLE public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  option_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(poll_id, user_id)
);

-- Problem reports table
CREATE TABLE public.problem_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  upvotes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'reported',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Problem upvotes table
CREATE TABLE public.problem_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID REFERENCES public.problem_reports(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(problem_id, user_id)
);

-- Impact projects table
CREATE TABLE public.impact_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  goal_amount INTEGER,
  current_amount INTEGER DEFAULT 0,
  volunteers_needed INTEGER,
  volunteers_joined INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volunteer_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_projects ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Roles viewable by everyone" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for jobs
CREATE POLICY "Jobs viewable by everyone" ON public.jobs FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Users can update own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = posted_by);
CREATE POLICY "Admins can update any job" ON public.jobs FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for services
CREATE POLICY "Services viewable by everyone" ON public.services FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create services" ON public.services FOR INSERT WITH CHECK (auth.uid() = provider_id);
CREATE POLICY "Providers can update own services" ON public.services FOR UPDATE USING (auth.uid() = provider_id);

-- RLS Policies for service reviews
CREATE POLICY "Reviews viewable by everyone" ON public.service_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create reviews" ON public.service_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for lost_found_items
CREATE POLICY "Lost/found items viewable by everyone" ON public.lost_found_items FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post items" ON public.lost_found_items FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Users can update own items" ON public.lost_found_items FOR UPDATE USING (auth.uid() = posted_by);

-- RLS Policies for food_resources
CREATE POLICY "Food resources viewable by everyone" ON public.food_resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can share resources" ON public.food_resources FOR INSERT WITH CHECK (auth.uid() = posted_by);
CREATE POLICY "Users can update own resources" ON public.food_resources FOR UPDATE USING (auth.uid() = posted_by);

-- RLS Policies for events
CREATE POLICY "Events viewable by everyone" ON public.events FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create events" ON public.events FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creators can update own events" ON public.events FOR UPDATE USING (auth.uid() = created_by);

-- RLS Policies for event_rsvps
CREATE POLICY "RSVPs viewable by everyone" ON public.event_rsvps FOR SELECT USING (true);
CREATE POLICY "Authenticated users can RSVP" ON public.event_rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own RSVP" ON public.event_rsvps FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for social_organizations
CREATE POLICY "Organizations viewable by everyone" ON public.social_organizations FOR SELECT USING (true);
CREATE POLICY "Admins can manage organizations" ON public.social_organizations FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for volunteer_opportunities
CREATE POLICY "Opportunities viewable by everyone" ON public.volunteer_opportunities FOR SELECT USING (true);
CREATE POLICY "Admins can manage opportunities" ON public.volunteer_opportunities FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for volunteer_registrations
CREATE POLICY "Registrations viewable by everyone" ON public.volunteer_registrations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can register" ON public.volunteer_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for surveys
CREATE POLICY "Surveys viewable by everyone" ON public.surveys FOR SELECT USING (true);
CREATE POLICY "Admins can create surveys" ON public.surveys FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for survey_responses
CREATE POLICY "Users can view own responses" ON public.survey_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all responses" ON public.survey_responses FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated users can submit responses" ON public.survey_responses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for polls
CREATE POLICY "Polls viewable by everyone" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create polls" ON public.polls FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS Policies for poll_votes
CREATE POLICY "Votes viewable by everyone" ON public.poll_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON public.poll_votes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for problem_reports
CREATE POLICY "Problems viewable by everyone" ON public.problem_reports FOR SELECT USING (true);
CREATE POLICY "Authenticated users can report problems" ON public.problem_reports FOR INSERT WITH CHECK (auth.uid() = reported_by);

-- RLS Policies for problem_upvotes
CREATE POLICY "Upvotes viewable by everyone" ON public.problem_upvotes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can upvote" ON public.problem_upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for impact_projects
CREATE POLICY "Projects viewable by everyone" ON public.impact_projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON public.impact_projects FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, created_at)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', NOW());
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lost_found_updated_at BEFORE UPDATE ON public.lost_found_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();